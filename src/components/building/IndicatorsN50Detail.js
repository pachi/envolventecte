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

import { N50ChartPie as N50Chart } from "./IndicatorsN50Chart";
// import {N50ChartBar as N50Chart} from "./IndicatorsN50Chart";
import AppState from "../../stores/AppState";
import { round_or_dash } from "../../utils";

const IndicatorsN50Detail = () => {
  const appstate = useContext(AppState);
  const {
    n50_ref,
    n50,
    walls_a,
    walls_c,
    walls_c_ref,
    walls_c_a,
    walls_c_a_ref,
    windows_a,
    windows_c,
    windows_c_a,
    vol,
  } = appstate.he1_indicators.n50_data;
  // Paso de n50 (1/h) a CA (m³/h a 100Pa)
  const factor_n50_to_ca = vol / 0.629;
  const factor_ca_to_n50 = 1 / factor_n50_to_ca;
  // Renovación total / h a 10 Pa
  const ca_tot = n50 * factor_n50_to_ca;

  const n50_info = [
    [
      "Opacos",
      "#a0401a",
      walls_c_a,
      walls_c,
      walls_a,
      (100 * walls_c_a) / ca_tot,
    ],
    [
      "Huecos",
      "#0096e1",
      windows_c_a,
      windows_c,
      windows_a,
      (100 * windows_c_a) / ca_tot,
    ],
  ];

  const elem_tr = ([name, color, ca, c, a, pct], key = null) => (
    <tr key={key}>
      <td style={{ width: "2em", background: `${color}` }} />
      <td>{name}</td>
      <td className="text-center">{round_or_dash(c)}</td>
      <td className="text-center">{round_or_dash(a)}</td>
      <td className="text-center">{round_or_dash(ca)}</td>
      <td className="text-center">{round_or_dash(ca * factor_ca_to_n50)}</td>
      <td className="text-center">{round_or_dash(pct, 1)}</td>
    </tr>
  );

  return (
    <>
      <Row>
        <Col>
          <h3>
            Tasa de renovación de aire a 50 Pa (n<sub>50</sub>)
          </h3>
          <p>
            <b>Tasa de renovación de aire a 50 Pa (teórica)</b>
          </p>
          <p>
            Permeabilidad al aire de referencia de los opacos, obtenida según
            criterio de DB-HE:
          </p>
          <p>
            C<sub>o, ref</sub> = {walls_c_ref.toFixed(2)} m³/h·m²
          </p>
          <p>
            Permeabilidad al aire de referencia del conjunto de la envolvente
            térmica a partir de valores de referencia:
          </p>
          <p>
            <b>
              n<sub>50, ref</sub>
            </b>{" "}
            = 0.629 · (&sum;C<sub>o</sub> · A<sub>o</sub>+ &sum;C
            <sub>h</sub>· A<sub>h</sub>) / V<sub>int</sub> = 0.629 · (
            {walls_c_a_ref.toFixed(2)} + {windows_c_a.toFixed(2)}) /{" "}
            {vol.toFixed(2)} ={" "}
            <b>
              {n50_ref.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </b>
          </p>
          <p>
            <b>Tasa de renovación de aire a 50 Pa</b>
          </p>
          <p>
            Permeabilidad al aire de los opacos obtenida mediante ensayo, si
            está disponible, o según criterio del DB-HE:
          </p>
          <p>
            C<sub>o</sub> = {walls_c.toFixed(2)} m³/h·m²
          </p>
          <p>
            Permeabilidad al aire del conjunto de la envolvente térmica obtenida
            mediante ensayo, si está disponible, o según criterio del DB-HE:
          </p>
          <p>
            <b>
              n<sub>50</sub>
            </b>{" "}
            = 0.629 · (&sum;C<sub>o</sub> · A<sub>o</sub>+ &sum;C
            <sub>h</sub>· A<sub>h</sub>) / V<sub>int</sub> = 0.629 · (
            {walls_c_a.toFixed(2)} + {windows_c_a.toFixed(2)}) /{" "}
            {vol.toFixed(2)} ={" "}
            <b>
              {n50.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </b>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          {n50 > 0 ? (
            <Table striped bordered hover size="sm" className="small">
              <thead style={{ background: "lightGray" }}>
                <tr>
                  <th colSpan="2">Elemento</th>
                  <th className="text-center" title="C_i">
                    C<sub>i</sub>
                    <br />
                    [m³/h·m²]
                  </th>
                  <th className="text-center" title="A_i">
                    A<sub>i</sub>
                    <br />
                    [m²]
                  </th>
                  <th className="text-center" title="C_i·A_i">
                    C<sub>i</sub>·A<sub>i</sub>
                    <br />
                    [m³/h]
                  </th>
                  <th className="text-center" title="n50 imputable al elemento">
                    &Delta;n<sub>50</sub>
                    <br />
                    [%]
                  </th>
                  <th
                    className="text-center"
                    title="Porcentaje de n50 imputable al elemento"
                  >
                    n<sub>50</sub>
                    <br />
                    [%]
                  </th>
                </tr>
              </thead>
              <tbody>
                {n50_info.map((e, idx) => elem_tr(e, idx))}
                <tr>
                  <td colSpan="4">
                    <b>TOTAL / Promedio</b>
                  </td>
                  <td
                    className="text-center"
                    title="Volumen horario de intercambio de aire a 100 Pa (C_i · A_i)"
                  >
                    <b>{round_or_dash(windows_c_a + walls_c_a)}</b>
                  </td>
                  <td
                    className="text-center"
                    title="Tasa de renovación de aire a 50 Pa"
                  >
                    <b>{round_or_dash(n50)}</b>
                  </td>
                  <td className="text-center">
                    <b>100.0</b>
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {n50 > 0 ? (
            <N50Chart
              data={n50_info.map(([name, color, _ca, _c, _a, pct]) => ({
                name,
                color,
                pct,
              }))}
              width={550}
            />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default observer(IndicatorsN50Detail);
