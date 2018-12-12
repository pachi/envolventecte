/* -*- coding: utf-8 -*-

Copyright (c) 2016-2017 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { Component } from "react";
import { Col, Form, Container, Row } from "react-bootstrap";

import { OrientaIcon } from "./IconsOrientaciones";

// Tabla de irradiación mensual acumulada para distintas superficies orientadas e inclinadas
export default class MonthlyRadiationTable extends Component {
  constructor(...args) {
    super(...args);
    this.MESES = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SET,OCT,NOV,DIC".split(",");
    this.state = { showDetail: false };
  }

  render() {
    const { data } = this.props;
    const showDetail = this.state.showDetail;
    return (
      <Container>
        <Row>
          <Col>
            <h4>Irradiación solar (acumulada) mensual (kWh/m²/mes)</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form inline>
              <Form.Check
                checked={showDetail}
                onChange={e => this.setState({ showDetail: !showDetail })}
                label="¿Mostrar detalle de irradiación directa y difusa?"
              />
            </Form>
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <Col>
            <table
              id="radiationtable"
              className="table table-striped table-bordered table-condensed"
            >
              <thead>
                <tr style={{ borderBottom: "3px solid darkgray" }}>
                  <th className="col-md-1">Superficie</th>
                  <th className="col-md-1">Irradiación</th>
                  {this.MESES.map(m => (
                    <th key={m}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((d, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <tr
                        key={"tot_" + d.surfname}
                        style={
                          showDetail
                            ? {
                                fontWeight: "bold",
                                borderTop: "3px solid darkgray"
                              }
                            : null
                        }
                      >
                        <td rowSpan={showDetail ? "3" : null}>
                          <b className="pull-left">{d.surfname}</b>
                          <OrientaIcon dir={d.surfname} />
                        </td>
                        <td>Dir. + Dif.</td>
                        {d.tot.map((v, i) => (
                          <td key={"tot_" + i}>{v.toFixed(2)}</td>
                        ))}
                      </tr>
                      {showDetail ? (
                        <tr key={"dir_" + d.surfname}>
                          <td>Dir.</td>
                          {d.dir.map((v, i) => (
                            <td key={"dir_" + i}>{v.toFixed(2)}</td>
                          ))}
                        </tr>
                      ) : null}
                      {showDetail ? (
                        <tr key={"dif_" + d.surfname}>
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
          </Col>
        </Row>
      </Container>
    );
  }
}
