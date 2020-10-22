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

import React, { useState, useContext } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Collapse,
  Row,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";

import AppState from "../stores/AppState";

const IndicatorsPanel = () => {
  const appstate = useContext(AppState);
  const [details, setDetails] = useState(false);
  const [warnings, setWarnings] = useState(false);

  const Qsoljul =
    appstate.he1_indicators.qsoljul * appstate.he1_indicators.A_ref;

  const errors = appstate.errors
    .slice()
    .concat(appstate.he1_indicators.warnings);
  const numavisos = errors.length;

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <Row>
            <Col md={3} title="Transmitancia térmica global del edificio">
              <b>
                <i>K</i> = {appstate.he1_indicators.K.toFixed(2)} <i>W/m²K</i>
              </b>
            </Col>
            <Col md={3} title="Indicador de control solar">
              <b>
                <i>
                  q<sub>sol;jul</sub>
                </i>{" "}
                ={" "}
                {appstate.he1_indicators.A_ref !== 0
                  ? appstate.he1_indicators.qsoljul.toFixed(2)
                  : "-"}{" "}
                <i>kWh/m²/mes</i>
              </b>
            </Col>
            <Col md={3} title="Tasa de renovación de aire a 50 Pa">
              <b>
                <i>
                  n<sub>50</sub>
                </i>{" "}
                = {appstate.he1_indicators.n50.toFixed(2)}{" "}
                <i>
                  h<sup>-1</sup>
                </i>
              </b>
            </Col>
            <Col md={3} title="Tasa de renovación de aire teórica a 50 Pa">
              <i>
                n<sub>50,ref</sub>
              </i>{" "}
              = {appstate.he1_indicators.n50_he2019.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </Col>
          </Row>
          <Row>
            <Col
              md={3}
              title="Superficie útil de los espacios habitables del edificio o parte del edificio [m²]"
            >
              <b>
                A<sub>util</sub>
              </b>{" "}
              = {appstate.he1_indicators.A_ref.toFixed(2)} m²
            </Col>
            <Col
              md={3}
              title="Volumen bruto de la envolvente térmica (volumen bruto s-s) [m³]"
            >
              <b>
                V<sub>tot</sub>
              </b>{" "}
              = {appstate.he1_indicators.vol_env_gross.toFixed(2)} m³
            </Col>
            <Col
              md={3}
              title="Compacidad de la envolvente térmica (V_tot / A) [m³/m²]"
            >
              <b>V/A</b> = {appstate.he1_indicators.compacity.toFixed(2)} m³
            </Col>
            <Col
              md={3}
              title="Volumen habitable interior de la envolvente térmica (volumen neto s-t) [m³]"
            >
              <b>
                V<sub>int</sub>
              </b>{" "}
              = {appstate.he1_indicators.vol_env_net.toFixed(2)} m³
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <ButtonGroup>
        <Button size="sm" variant="light" onClick={() => setDetails(!details)}>
          Detalles
        </Button>
        <Button
          size="sm"
          variant="light"
          onClick={() => setWarnings(!warnings)}
        >
          Avisos{" "}
          {numavisos !== 0 ? (
            <Badge variant="primary">
              <span>({numavisos})</span>{" "}
            </Badge>
          ) : null}
        </Button>
        {numavisos > 0 ? (
          <Button onClick={() => appstate.errors.clear()} variant="light">
            Limpiar avisos
          </Button>
        ) : null}
      </ButtonGroup>
      <Collapse in={warnings}>
        <Card body bg="light" border="info" className="mt-3">
          <Row>
            <Col>
              {errors.map((e, idx) => (
                <Alert variant={e.level.toLowerCase()} key={`AlertId${idx}`}>
                  {e.msg}
                </Alert>
              ))}
            </Col>
          </Row>
        </Card>
      </Collapse>
      <Collapse in={details}>
        <Card body bg="light" border="info" className="mt-3">
          <Row>
            <Col>
              <h3>Transmitancia térmica global</h3>
              <p>
                Transmisión de calor a través de la envolvente térmica (huecos,
                opacos y puentes térmicos)
              </p>
              <p>
                H<sub>tr,adj</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> ·
                [&sum;<sub>i</sub> A<sub>x,i</sub> · U<sub>x,i</sub> (huecos +
                opacos) + &sum;<sub>k</sub> l<sub>x,k</sub> · ψ<sub>x,k</sub>{" "}
                (PTs)] = {appstate.huecosAU.toFixed(2)} W/K (huecos) +{" "}
                {appstate.opacosAU.toFixed(2)} W/K (opacos) +{" "}
                {appstate.ptsPsiL.toFixed(2)} W/K (PTs) ={" "}
                {(appstate.totalAU + appstate.ptsPsiL).toFixed(2)} W/K{" "}
              </p>
              <p>Superficie de intercambio de la envolvente térmica</p>
              <p>
                &sum;A = &sum; b<sub>tr,x</sub> · A<sub>x</sub> ={" "}
                {Number(appstate.huecosA).toFixed(2)} m² (huecos) +{" "}
                {Number(appstate.opacosA).toFixed(2)} m² (opacos) ={" "}
                {Number(appstate.totalA).toFixed(2)} m²
              </p>
              <p>Valor del indicador:</p>
              <p>
                <b>K</b> = H<sub>tr,adj</sub> / &sum;A &asymp;{" "}
                {(appstate.totalAU + appstate.ptsPsiL).toFixed(2)} /{" "}
                {appstate.totalA.toFixed(2)} ={" "}
                <b>
                  {Number(appstate.he1_indicators.K).toFixed(2)} <i>W/m²K</i>
                </b>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Control solar de los huecos</h3>
              <p>
                Ganancias solares en el mes de julio con los dispositivos de
                sombra de los huecos activados
              </p>
              <p>
                Q<sub>sol;jul</sub> = &sum;<sub>k</sub>(F
                <sub>sh,obst</sub> · g<sub>gl;sh;wi</sub> · (1 − F<sub>F</sub>)
                · A<sub>w,p</sub> · H<sub>sol;jul</sub>) = {Qsoljul.toFixed(2)}{" "}
                kWh/mes
              </p>
              <p>Superficie útil</p>
              <p>
                A<sub>util</sub> = {appstate.he1_indicators.A_ref.toFixed(2)} m²
              </p>
              <p>Valor del indicador:</p>
              <p>
                <b>
                  q<sub>sol;jul</sub>
                </b>{" "}
                = Q<sub>sol;jul</sub> / A<sub>util</sub> ={Qsoljul.toFixed(2)} /{" "}
                {appstate.he1_indicators.A_ref.toFixed(2)} ={" "}
                <b>
                  <i>
                    {appstate.he1_indicators.A_ref !== 0
                      ? appstate.he1_indicators.qsoljul.toFixed(2)
                      : "-"}{" "}
                    kWh/m²/mes
                  </i>
                </b>
              </p>
            </Col>
          </Row>
        </Card>
      </Collapse>
    </>
  );
};

export default observer(IndicatorsPanel);
