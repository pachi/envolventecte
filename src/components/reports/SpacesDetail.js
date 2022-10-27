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

import React, { useContext } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { round_or_dash } from "../../utils";
import {
  BOUNDARY_TYPES_MAP,
  BOUNDARY_TYPES,
  ORIENTATION_TYPES,
} from "../../stores/types";

const formatted = (elem, bold = false) => (bold ? <b>{elem}</b> : <>{elem}</>);

const SpacesDetail = () => {
  const appstate = useContext(AppState);

  const { props } = appstate.energy_indicators;

  // TODO: spaces, shades
  // TODO: ordenar tablas, ordenar elementos dentro de las tablas, etc

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

  return (
    <>
      <Row className="mb-4 print-section">
        <Col>
          <h3 className="mb-4">Opacos</h3>
          <p>
            Elementos opacos (muros, cubiertas, suelos, particiones interiores)
            pertenecientes o no a la envolvente térmica, exceptuando elementos
            de sombra. <br />
            <br />
            Se indican superficies netas.
          </p>
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <ByConceptTable data={wallData} />
        </Col>
      </Row>
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
    </>
  );
};

// Tabla de desglose de muros
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
          <th className="text-center" style={{ width: "20%" }}>
            A<br />
            [m²]
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <React.Fragment key={`${idx}-${row.name}`}>
            <tr style={{ borderTop: "2 solid black" }}>
              <td>
                <i>
                  <b>{row.name}</b>
                </i>
              </td>
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
                    <i>{formatted(round_or_dash(row2.area), false)}</i>
                  </td>
                </tr>
                {row2.children.map((row3, idx3) => (
                  <tr key={`${idx}-${idx2}-${idx3}`}>
                    <td></td>
                    <td></td>
                    <td>{formatted(row3.orientation, false)}</td>
                    <td className="text-center">
                      {formatted(round_or_dash(row3.area), false)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
        <tr>
          <td>
            <b>TOTAL</b>
          </td>
          <td></td>
          <td></td>
          <td className="text-center">
            {formatted(round_or_dash(total), true)}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default observer(SpacesDetail);

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
