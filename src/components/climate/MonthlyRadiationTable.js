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

import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { OrientaIcon } from "./IconsOrientaciones";

const MESES = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SET,OCT,NOV,DIC".split(",");

// Tabla de irradiación mensual acumulada para distintas superficies orientadas e inclinadas
const MonthlyRadiationTable = ({ data, climatezone }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Irradiación solar ({climatezone}),{" "}
            <i>
              H<sub>sol;m</sub>
            </i>{" "}
            (kWh/m²/mes)
          </h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form inline>
            <Form.Check
              checked={showDetail}
              onChange={(_e) => setShowDetail(!showDetail)}
              label="¿Mostrar detalle de irradiación directa y difusa?"
            />
          </Form>
        </Col>
      </Row>
      <Row style={{ marginTop: "2em" }}>
        <Col>
          <table
            id="radiationtable"
            className="table table-striped table-bordered table-condensed table-hover"
          >
            <thead className="text-light bg-secondary">
              <tr style={{ borderBottom: "3px solid darkgray" }}>
                <th className="col-md-1">Superficie</th>
                <th className="col-md-1">Irradiación</th>
                {MESES.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <tr
                      key={"tot_" + d.orientation}
                      style={
                        showDetail
                          ? {
                              fontWeight: "bold",
                              borderTop: "3px solid darkgray",
                            }
                          : null
                      }
                    >
                      <td rowSpan={showDetail ? "3" : null}>
                        <b className="pull-left">{d.orientation}</b>{" "}
                        <OrientaIcon dir={d.orientation} />
                      </td>
                      <td>Dir. + Dif.</td>
                      {d.dir.map((v, i) => (
                        <td
                          key={"tot_" + i}
                          style={{
                            borderRight:
                              i == 6 || i == 5 ? "2px solid darkgray" : null,
                            backgroundColor:
                              i == 6 ? "rgba(100, 0, 0, 0.05)" : null,
                          }}
                        >
                          {(v + d.dif[i]).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    {showDetail ? (
                      <tr key={"dir_" + d.orientation}>
                        <td>Dir.</td>
                        {d.dir.map((v, i) => (
                          <td key={"dir_" + i}>{v.toFixed(2)}</td>
                        ))}
                      </tr>
                    ) : null}
                    {showDetail ? (
                      <tr key={"dif_" + d.orientation}>
                        <td>Dif.</td>
                        {d.dif.map((v, i) => (
                          <td key={"dif_" + i}>{v.toFixed(2)}</td>
                        ))}
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-info">
            La tabla anterior recoge la radiación mensual acumulada para una
            superficie horizontal y superficies verticales con la orientación
            indicada.
          </p>
          <p className="text-info">
            El parámetro de control solar (
            <b>
              q<sub>sol;jul</sub>
            </b>
            ) utiliza los valores de irradiación solar acumulada corespondientes
            al mes de julio.
          </p>
        </Col>
      </Row>
    </Col>
  );
};

export default MonthlyRadiationTable;
