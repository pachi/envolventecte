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

import React from "react";
import { Col, Row } from "react-bootstrap";

import { OrientaIcon } from "./IconsOrientaciones";

// Tabla de irradiación acumulada mensual en el mes de julio
const JulyRadiationTable = ({ data }) => (
  <Col>
    <Row>
      <Col>
        <h4>
          Irradiación solar (acumulada) en el mes de julio{" "}
          <i>
            H<sub>sol;jul</sub>
          </i>{" "}
          (kWh/m²/mes)
        </h4>
      </Col>
    </Row>
    <Row>
      <Col>
        <table
          id="julyradiationtable"
          className="table table-striped table-bordered table-condensed"
        >
          <thead>
            <tr>
              <th className="col-md-1">kWh/m²/mes</th>
              {data.map((d, i) => (
                <th key={"hr" + i}>
                  {d.orientation} <OrientaIcon dir={d.orientation} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b className="pull-left">{data[0].zone}</b>
              </td>
              {data.map((d, i) => (
                <td key={"tot_" + i}>{(d.dir[6] + d.dif[6]).toFixed(2)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
    <Row>
      <Col>
        <p className="text-info">
          Los valores de por la tabla anterior se utilizan en el cálculo del
          parámetro de control solar (
          <b>
            q<sub>sol;jul</sub>
          </b>
          ).
        </p>
      </Col>
    </Row>
  </Col>
);

export default JulyRadiationTable;
