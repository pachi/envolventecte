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

const IndicatorsN50Detail = ({ isShown }) => {
  const appstate = useContext(AppState);
  const { n50_he2019, n50, C_o, C_o_he2019 } = appstate.he1_indicators;

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
          <p>Permeabilidad de opacos calculada según criterio de DB-HE:</p>
          <p>
            C<sub>o, ref</sub> = {C_o_he2019.toFixed(2)} m³/h·m²
          </p>
          <p>
            <b>
              n<sub>50, ref</sub>
            </b>{" "}
            = 0.629 · (&sum;C<sub>o</sub> · A<sub>o</sub>+ &sum;C
            <sub>h</sub>· A<sub>h</sub>) / V<sub>int</sub> = 0.629 · (
            {n50_he2019.walls_c_a.toFixed(2)} +{" "}
            {n50_he2019.windows_c_a.toFixed(2)}) / {n50_he2019.vol.toFixed(2)} ={" "}
            <b>
              {n50_he2019.n50.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </b>
          </p>
          <p>
            <b>Tasa de renovación de aire a 50 Pa</b>
          </p>
          <p>
            Permeabilidad de opacos obtenida mediante ensayo, si está
            disponible, o según criterio del DB-HE:
          </p>
          <p>
            C<sub>o</sub> = {C_o.toFixed(2)} m³/h·m²
          </p>
          <p>
            <b>
              n<sub>50</sub>
            </b>{" "}
            = 0.629 · (&sum;C<sub>o</sub> · A<sub>o</sub>+ &sum;C
            <sub>h</sub>· A<sub>h</sub>) / V<sub>int</sub> = 0.629 · (
            {((n50_he2019.walls_c_a * C_o) / C_o_he2019).toFixed(2)} +{" "}
            {n50_he2019.windows_c_a.toFixed(2)}) / {n50_he2019.vol.toFixed(2)} ={" "}
            <b>
              {n50.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </b>
          </p>
        </Col>
      </Row>
    </>
  );
};

export default observer(IndicatorsN50Detail);
