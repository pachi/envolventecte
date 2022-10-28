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

  // TODO: spaces

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
          {/* <Row>
            <Col sm={3} title="Zona climática">
              <b>Zona climática: {climate}</b>
            </Col>
            <Col
              sm={3}
              title="Transmitancia térmica global del edificio [W/m²K]"
            >
              <b>
                <i>K</i> = {K.toFixed(2)} <i>W/m²K</i>
              </b>
            </Col>
            <Col sm={3} title="Indicador de control solar [kWh/m²·mes]">
              <b>
                <i>
                  q<sub>sol;jul</sub>
                </i>{" "}
                = {area_ref !== 0 ? q_soljul.toFixed(2) : "-"} <i>kWh/m²/mes</i>
              </b>
            </Col>
            <Col sm={3} title="Tasa de renovación de aire a 50 Pa [1/h]">
              <b>
                <i>
                  n<sub>50</sub>
                </i>{" "}
                = {n50.toFixed(2)}{" "}
                <i>
                  h<sup>-1</sup>
                </i>
              </b>
            </Col>
          </Row> */}
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
      <thead style={{ background: "lightGray" }}>
        <tr>
          <th>
            Solución constructiva
            <br />
          </th>
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
      <thead style={{ background: "lightGray" }}>
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
            w.orientation === orientation && w.bounds === bounds && w.cons == id
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
