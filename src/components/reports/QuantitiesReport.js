/* -*- coding: utf-8 -*-

Copyright (c) 2016-2022 Rafael Villar Burke <pachi@rvburke.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React, { useContext, useRef } from "react";
import { Table, Col, Row, Button } from "react-bootstrap";
import { observer } from "mobx-react";

import { APP_VERSION } from "../../version.js";

import AppState from "../../stores/AppState";
import { round_or_dash } from "../../utils";
import {
  BOUNDARY_TYPES_MAP,
  BOUNDARY_TYPES,
  ORIENTATION_TYPES,
  SPACE_TYPES,
  SPACE_TYPES_MAP,
  LOAD,
} from "../../stores/types";

import printer from "../img/print-solid.svg";

const QuantitiesReport = () => {
  const spaces_detail = useRef(null);
  const opaques_detail = useRef(null);
  const windows_detail = useRef(null);

  const date = new Date(Date.now());

  const appstate = useContext(AppState);

  const { name } = appstate.meta;
  const { area_ref, vol_env_net, vol_env_gross, compacity, props } =
    appstate.energy_indicators;

  let spacesData = computeSpacesRows(props.spaces);
  let loadsIdMap = appstate.getIdNameMap(LOAD);

  console.log(JSON.stringify(spacesData));

  let wallData = computeRows(
    appstate.cons.wallcons,
    props.walls,
    (e) => e.area_net * e.multiplier
  );
  let windowData = computeRows(
    appstate.cons.wincons,
    props.windows,
    (e) => e.area * e.multiplier
  );
  let shadesData = computeShadesRows(props.shades);

  return (
    <>
      <Row>
        <Col>
          <h2>Mediciones</h2>
        </Col>
        <Col md={2} className="d-print-none text-end">
          <Button
            variant="outline-secondary"
            onClick={() => window.print()}
            title="Imprimir"
          >
            <img
              src={printer}
              alt="Imprimir"
              height={25}
              style={{ fill: "white" }}
            />{" "}
            Imprimir
          </Button>
        </Col>
      </Row>
      <Row style={{ background: "whitesmoke" }} className="py-4 my-3">
        <Col>
          <Row>
            <Col>
              <h4>Resumen</h4>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <big>
                Proyecto: <i>{name}</i>
              </big>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col
              sm={3}
              title="Superficie útil de los espacios habitables del edificio o parte del edificio [m²]"
            >
              A<sub>util</sub> = {area_ref.toFixed(2)} m²
            </Col>
            <Col
              sm={3}
              title="Volumen bruto de la envolvente térmica (volumen bruto s-s) [m³]"
            >
              V = {vol_env_gross.toFixed(2)} m³
            </Col>
            <Col
              sm={3}
              title="Volumen interior de la envolvente térmica (volumen neto s-t) [m³]"
            >
              V<sub>int</sub> = {vol_env_net.toFixed(2)} m³
            </Col>
            <Col
              sm={3}
              title="Compacidad de la envolvente térmica (V_tot / A) [m³/m²]"
            >
              V/A = {compacity.toFixed(2)} m³/m²
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h4>Índice</h4>
          <ol className="indice">
            <li onClick={() => spaces_detail.current.scrollIntoView()}>
              Espacios
            </li>
            <li onClick={() => opaques_detail.current.scrollIntoView()}>
              Opacos
            </li>
            <li onClick={() => windows_detail.current.scrollIntoView()}>
              Huecos
            </li>
          </ol>
        </Col>
      </Row>

      <hr ref={spaces_detail} />
      <Row className="mb-4 print-section">
        <Col>
          <h3 className="mb-4">Espacios</h3>
          <p>
            Espacios pertenecientes o no a la envolvente térmica (superficies
            interiores).
          </p>
          <SpacesByConceptTable data={spacesData} loadsIdMap={loadsIdMap} />
        </Col>
      </Row>

      <hr ref={opaques_detail} />
      <Row className="mb-4 print-section">
        <Col>
          <h3 className="mb-4">Opacos</h3>
          <p>
            Elementos opacos pertenecientes o no a la envolvente térmica
            (superficies netas).
          </p>
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <h4>Muros, cubiertas, suelos y particiones interiores</h4>
          <ByConceptTable data={wallData} />
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <h4>Elementos de sombra</h4>
          <ShadesByConceptTable data={shadesData} />
        </Col>
      </Row>

      <hr ref={windows_detail} />
      <Row className="mb-4 print-section">
        <Col>
          <h3 className="mb-4">Huecos</h3>
          <p>Huecos pertenecientes o no a la envolvente térmica.</p>
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <ByConceptTable data={windowData} />
        </Col>
      </Row>
      <div id="print-head">
        <h5>
          EnvolventeCTE ({APP_VERSION}) - {date.toLocaleString("es-ES")}
        </h5>
      </div>
      {/* <div id="print-foot"></div> */}
    </>
  );
};

export default observer(QuantitiesReport);

// Tabla de desglose de espacios por conceptos: tenv -> nivel_acondic -> cargas
const SpacesByConceptTable = ({ data, loadsIdMap }) => {
  const total_area = data.reduce((acc, e) => (acc += e.area), 0);
  const total_volume = data.reduce((acc, e) => (acc += e.volume), 0);
  return (
    <Table
      striped
      bordered
      hover
      size="sm"
      className="small"
      style={{ margin: "0 auto", marginBottom: "2em", width: "70%" }}
    >
      <thead style={{ background: "lightGray", verticalAlign: "top" }}>
        <tr>
          <th>Tipo</th>
          <th>Nivel de acondicionamiento</th>
          <th>Perfil de cargas</th>
          <th className="text-center" colSpan={2} style={{ width: "20%" }}>
            A<br />
            [m²]
          </th>
          <th className="text-center" colSpan={2} style={{ width: "20%" }}>
            V<sub>int</sub>
            <br />
            [m³]
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <React.Fragment key={`${idx}-${row.name}`}>
            <tr style={{ height: "1em" }}></tr>
            <tr style={{ borderTop: "2 solid black" }}>
              <td>
                <i>
                  <b>
                    {row.inside_tenv ? "Interior a la ET" : "Exterior a la ET"}
                  </b>
                </i>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td className="text-center">
                <b>{round_or_dash(row.area)}</b>
              </td>
              <td></td>
              <td className="text-center">
                <b>{round_or_dash(row.volume)}</b>
              </td>
            </tr>
            {row.children.map((row2, idx2) => (
              <React.Fragment key={`${idx}-${idx2}`}>
                <tr>
                  <td></td>
                  <td>
                    <i>{SPACE_TYPES_MAP[row2.kind]}</i>
                  </td>
                  <td></td>
                  <td className="text-center">
                    <u>
                      <i>{round_or_dash(row2.area)}</i>
                    </u>
                  </td>
                  <td></td>
                  <td className="text-center">
                    <u>
                      <i>{round_or_dash(row2.volume)}</i>
                    </u>
                  </td>
                  <td></td>
                </tr>
                {row2.children.map((row3, idx3) => (
                  <tr key={`${idx}-${idx2}-${idx3}`}>
                    <td></td>
                    <td></td>
                    <td>{loadsIdMap[row3.loads]}</td>
                    <td className="text-center">{round_or_dash(row3.area)}</td>
                    <td></td>
                    <td className="text-center">
                      {round_or_dash(row3.volume)}
                    </td>
                    <td></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
        <tr style={{ height: "1em" }}></tr>
        <tr style={{ background: "lightGray" }}>
          <td>
            <b>TOTAL</b>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className="text-center">
            <b>{round_or_dash(total_area)}</b>
          </td>
          <td></td>
          <td className="text-center">
            <b>{round_or_dash(total_volume)}</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

// Tabla de desglose por conceptos
const ByConceptTable = ({ data }) => {
  const total = data.reduce((acc, e) => (acc += e.area), 0);
  return (
    <Table
      striped
      bordered
      hover
      size="sm"
      className="small"
      style={{ margin: "0 auto", marginBottom: "2em", width: "70%" }}
    >
      <thead style={{ background: "lightGray", verticalAlign: "top" }}>
        <tr>
          <th>Solución constructiva</th>
          <th>Condición de contorno</th>
          <th>Orientación</th>
          <th className="text-center" colSpan={2} style={{ width: "20%" }}>
            A<br />
            [m²]
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <React.Fragment key={`${idx}-${row.name}`}>
            <tr style={{ height: "1em" }}></tr>
            <tr style={{ borderTop: "2 solid black" }}>
              <td>
                <i>
                  <b>{row.name}</b>
                </i>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td className="text-center">
                <b>{round_or_dash(row.area)}</b>
              </td>
            </tr>
            {row.children.map((row2, idx2) => (
              <React.Fragment key={`${idx}-${idx2}`}>
                <tr>
                  <td></td>
                  <td>
                    <i>{BOUNDARY_TYPES_MAP[row2.bounds]}</i>
                  </td>
                  <td></td>
                  <td className="text-center">
                    <u>
                      <i>{round_or_dash(row2.area)}</i>
                    </u>
                  </td>
                  <td></td>
                </tr>
                {row2.children.map((row3, idx3) => (
                  <tr key={`${idx}-${idx2}-${idx3}`}>
                    <td></td>
                    <td></td>
                    <td>{row3.orientation}</td>
                    <td className="text-center">{round_or_dash(row3.area)}</td>
                    <td></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
        <tr style={{ height: "1em" }}></tr>
        <tr style={{ background: "lightGray" }}>
          <td>
            <b>TOTAL</b>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className="text-center">
            <b>{round_or_dash(total)}</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

// Tabla de desglose por conceptos
const ShadesByConceptTable = ({ data }) => {
  const total = data.reduce((acc, e) => (acc += e.area), 0);
  return (
    <Table
      striped
      bordered
      hover
      size="sm"
      className="small"
      style={{ margin: "0 auto", marginBottom: "2em", width: "70%" }}
    >
      <thead style={{ background: "lightGray", verticalAlign: "top" }}>
        <tr>
          <th>Condición de contorno</th>
          <th>Orientación</th>
          <th className="text-center" style={{ width: "20%" }}>
            A<br />
            [m²]
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <b>Elementos de sombra</b>
          </td>
          <td></td>
          <td className="text-center">
            <b>{round_or_dash(total)}</b>
          </td>
        </tr>
        {data.map((row, idx) => (
          <tr key={idx}>
            <td></td>
            <td>{row.orientation}</td>
            <td className="text-center">{round_or_dash(row.area)}</td>
          </tr>
        ))}
        <tr style={{ height: "1em" }}></tr>
        <tr style={{ background: "lightGray" }}>
          <td>
            <b>TOTAL</b>
          </td>
          <td></td>
          <td className="text-center">
            <b>{round_or_dash(total)}</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

function computeSpacesRows(props) {
  const spaceLoads = [...new Set(Object.values(props).map((e) => e.loads))];
  let data = [];
  for (const inside_tenv of [true, false]) {
    const tenvTotal = { inside_tenv, area: 0, volume: 0, children: [] };
    for (const kind of SPACE_TYPES) {
      const spaceTypeTotal = { kind, area: 0, volume: 0, children: [] };
      for (const loads of spaceLoads) {
        const spaceLoadsTotal = { loads, area: 0, volume: 0 };
        const selected = Object.values(props).filter(
          (w) =>
            w.kind === kind &&
            w.inside_tenv === inside_tenv &&
            w.loads === loads
        );
        for (const elem of selected) {
          const area = elem.area * elem.multiplier;
          const volume = elem.volume_net * elem.multiplier;
          tenvTotal.area += area;
          spaceTypeTotal.area += area;
          spaceLoadsTotal.area += area;
          tenvTotal.volume += volume;
          spaceTypeTotal.volume += volume;
          spaceLoadsTotal.volume += volume;
        }
        if (spaceLoadsTotal.area > 0.01) {
          spaceTypeTotal.children.push(spaceLoadsTotal);
        }
      }
      if (spaceTypeTotal.area > 0.01) {
        tenvTotal.children.push(spaceTypeTotal);
      }
    }
    if (tenvTotal.area > 0.01) {
      data.push(tenvTotal);
    }
  }
  return data;
}

function computeRows(cons, props, adder = () => 1) {
  let data = [];
  for (const wc of cons) {
    const id = wc.id;
    const name = wc.name;
    const consTotal = { name, area: 0, children: [] };
    for (const bounds of BOUNDARY_TYPES) {
      const boundTotal = { bounds, area: 0, children: [] };
      for (const orientation of ORIENTATION_TYPES) {
        const orientTotal = { orientation, area: 0 };
        const selected = Object.values(props).filter(
          (w) =>
            w.orientation === orientation &&
            w.bounds === bounds &&
            w.cons === id
        );
        for (const elem of selected) {
          const area = adder(elem);
          consTotal.area += area;
          boundTotal.area += area;
          orientTotal.area += area;
        }
        if (orientTotal.area > 0.01) {
          boundTotal.children.push(orientTotal);
        }
      }
      if (boundTotal.area > 0.01) {
        consTotal.children.push(boundTotal);
      }
    }
    if (consTotal.area > 0.01) {
      data.push(consTotal);
    }
  }
  return data;
}

function computeShadesRows(props) {
  let data = [];
  for (const orientation of ORIENTATION_TYPES) {
    const orientTotal = { orientation, area: 0 };
    const selected = Object.values(props).filter(
      (w) => w.orientation === orientation
    );
    for (const elem of selected) {
      const area = elem.area;
      orientTotal.area += area;
    }
    if (orientTotal.area > 0.01) {
      data.push(orientTotal);
    }
  }
  return data;
}
