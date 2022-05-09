/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

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
import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import UElementsChart from "./UChart";
import { round_or_dash } from "../../utils";

const formatted = (elem, bold = false) => (bold ? <b>{elem}</b> : <>{elem}</>);

const IndicatorsUDetail = () => {
  const appstate = useContext(AppState);
  const { K, roofs, floors, walls, windows, ground } =
    appstate.energy_indicators.K_data;

  // Elementos detallados: título, a, au, tipo, ¿con formato especial?
  const all_elements = [
    ["Huecos", windows, "#0096e1"],
    ["Fachadas (O-W)", walls, "#eedaa3"],
    ["Cubiertas (O-R)", roofs, "#c28586"],
    ["Suelos (aire) (O-F)", floors, "#c99fde"],
    ["Elem. contacto con terreno (O-G)", ground, "#d3aa86"],
  ];

  const k_data = all_elements.map(
    ([element, { a, au, u_mean, u_min, u_max }, color]) => ({
      element,
      color,
      a,
      au,
      u_mean,
      u_min,
      u_max,
    })
  );

  return (
    <>
      <Row>
        <Col>
          <h3>Transmitancia térmica de huecos y opacos (U)</h3>
          <p>
            Indicadores relativos a la transmisión de calor por conducción a
            través de los elementos opacos y huecos pertenecientes a la
            envolvente térmica, desagregados por tipo de elemento.
          </p>
        </Col>
      </Row>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <defs>
          <pattern
            id="pattern-diagonal"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect x="0" y="0" width="8" height="15" fill="white" />
          </pattern>
          <mask id="mask-diagonal">
            <rect width="2000" height="500" fill="url(#pattern-diagonal)" />
          </mask>
        </defs>
      </svg>
      <Row>
        <Col>{k_data.length > 0 ? <UElementsTable data={k_data} /> : null}</Col>
      </Row>
      <Row>
        <Col className="text-center">
          {k_data.length > 0 ? (
            <UElementsChart data={k_data} K={K} width={1200} />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

// Tabla de desglose de U de huecos y opacos
const UElementsTable = ({ data }) => (
  <Table striped bordered hover size="sm" className="small">
    <thead style={{ background: "lightGray" }}>
      <tr>
        <th colSpan="2">Elemento</th>
        <th className="text-center">
          A<br />
          [m²]
        </th>
        <th className="text-center">
          A·U
          <br />
          [W/K]
        </th>
        <th className="text-center">
          U<sub>media</sub>
          <br />
          [W/m²K]
        </th>
        <th className="text-center">
          U<sub>min</sub>
          <br />
          [W/m²K]
        </th>
        <th className="text-center">
          U<sub>max</sub>
          <br />
          [W/m²K]
        </th>
      </tr>
    </thead>
    <tbody>
      {data.map(
        (
          { element, a, au, u_mean, u_min, u_max, color, format = false },
          key
        ) => (
          <tr key={key}>
            <td style={{ width: "2em", background: `${color}` }} />
            <td>{formatted(element, format)}</td>
            <td className="text-center">
              {formatted(round_or_dash(a), format)}
            </td>
            <td className="text-center">
              {formatted(round_or_dash(au), format)}
            </td>
            <td className="text-center">
              {formatted(round_or_dash(u_mean), format)}
            </td>
            <td className="text-center">
              {formatted(round_or_dash(u_min), format)}
            </td>
            <td className="text-center">
              {formatted(round_or_dash(u_max), format)}
            </td>
          </tr>
        )
      )}
    </tbody>
  </Table>
);

export default observer(IndicatorsUDetail);
