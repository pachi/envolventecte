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

import AppState from "../../stores/AppState";
import KDetail from "./IndicatorsKDetail";

const IndicatorsPanel = () => {
  const appstate = useContext(AppState);
  const [details, setDetails] = useState(false);
  const [warnings, setWarnings] = useState(false);
  const {
    area_ref,
    qsoljul,
    vol_env_net,
    vol_env_gross,
    compacity,
    n50_he2019,
    n50,
  } = appstate.he1_indicators;

  const { K } = appstate.he1_indicators.K;

  const errors = appstate.warnings;
  const numavisos = errors.length;

  return (
    <>
      <Card body bg="light" id="indicatorscard">
        <Row>
          <Col md={3} title="Transmitancia térmica global del edificio">
            <b>
              <i>K</i> = {K.toFixed(2)} <i>W/m²K</i>
            </b>
          </Col>
          <Col md={3} title="Indicador de control solar">
            <b>
              <i>
                q<sub>sol;jul</sub>
              </i>{" "}
              = {area_ref !== 0 ? qsoljul.toFixed(2) : "-"} <i>kWh/m²/mes</i>
            </b>
          </Col>
          <Col md={3} title="Tasa de renovación de aire a 50 Pa">
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
          <Col md={3} title="Tasa de renovación de aire teórica a 50 Pa">
            <i>
              n<sub>50,ref</sub>
            </i>{" "}
            = {n50_he2019.n50.toFixed(2)}{" "}
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
            A<sub>util</sub> = {area_ref.toFixed(2)} m²
          </Col>
          <Col
            md={3}
            title="Compacidad de la envolvente térmica (V_tot / A) [m³/m²]"
          >
            V/A = {compacity.toFixed(2)} m³/m²
          </Col>
          <Col
            md={3}
            title="Volumen bruto de la envolvente térmica (volumen bruto s-s) [m³]"
          >
            V = {vol_env_gross.toFixed(2)} m³
          </Col>
          <Col
            md={3}
            title="Volumen habitable interior de la envolvente térmica (volumen neto s-t) [m³]"
          >
            V<sub>int</sub> = {vol_env_net.toFixed(2)} m³
          </Col>
        </Row>
      </Card>
      <ButtonGroup className="mb-3">
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
        <Card body bg="light" border="info" className="mb-3">
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
        <Card body bg="light" border="info" className="mb-3">
          <KDetail />
        </Card>
      </Collapse>
    </>
  );
};

export default observer(IndicatorsPanel);
