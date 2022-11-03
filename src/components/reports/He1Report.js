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
import { Col, Row, Button } from "react-bootstrap";
import { observer } from "mobx-react";

import { APP_VERSION } from "../../version.js";

import AppState from "../../stores/AppState";

import KDetail from "./KDetail";
import UDetail from "./UDetail";
import QSolJulDetail from "./QSolJulDetail";
import N50Detail from "./N50Detail";
import printer from "../img/print-solid.svg";

const He1Report = () => {
  const kdetail = useRef(null);
  const udetail = useRef(null);
  const qsoljuldetail = useRef(null);
  const n50detail = useRef(null);

  const appstate = useContext(AppState);
  const {
    area_ref,
    vol_env_net,
    vol_env_gross,
    compactness,
    q_soljul_data,
    n50_data,
    K_data,
  } = appstate.energy_indicators;

  const { climate, name } = appstate.meta;

  const { K } = K_data;
  const { q_soljul } = q_soljul_data;
  const { n50 } = n50_data;

  const date = new Date(Date.now());

  return (
    <>
      <Row>
        <Col>
          <h2>Comportamiento de la envolvente térmica</h2>
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
              V/A = {compactness.toFixed(2)} m³/m²
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h4>Índice</h4>
          <ol className="indice">
            <li onClick={() => kdetail.current.scrollIntoView()}>
              Transmitancia térmica global (K)
            </li>
            <li onClick={() => udetail.current.scrollIntoView()}>
              Transmitancia térmica de huecos y opacos (U)
            </li>
            <li onClick={() => qsoljuldetail.current.scrollIntoView()}>
              Control solar de los huecos (q<sub>sol;jul</sub>)
            </li>
            <li onClick={() => n50detail.current.scrollIntoView()}>
              Tasa de renovación de aire a 50 Pa (n<sub>50</sub>)
            </li>
          </ol>
        </Col>
      </Row>

      <hr ref={kdetail} />
      <KDetail />
      <hr ref={udetail} />
      <UDetail />
      <hr ref={qsoljuldetail} />
      <QSolJulDetail />
      <hr ref={n50detail} />
      <N50Detail />
      <div id="print-head">
        <h5>
          EnvolventeCTE ({APP_VERSION}) - {date.toLocaleString("es-ES")}
        </h5>
      </div>
      {/* <div id="print-foot"></div> */}
    </>
  );
};

export default observer(He1Report);
