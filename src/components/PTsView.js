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
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import AppState from "../stores/AppState";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import PTsTable from "./PTsTable";
import icongroup from "./img/outline-add_comment-24px.svg";

// Vista de puentes térmicos del edificio
const PTsView = observer(() => {
  const appstate = useContext(AppState);
  const [selected, setSelected] = useState([]);

  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Puentes térmicos{" "}
            <small className="text-muted">
              ({appstate.thermal_bridges.length})
            </small>
          </h4>
        </Col>
        <Col md="auto">
          <ButtonGroup>
            <Button
              variant="default"
              size="sm"
              title="Agrupa puentes térmicos, sumando longitudes de igual transmitancia térmica lineal."
              onClick={() => appstate.agrupaPts()}
            >
              <img src={icongroup} alt="Agrupar PTs" /> Agrupar PTs
            </Button>
          </ButtonGroup>
        </Col>
        <Col md="auto">
          <AddRemoveButtonGroup
            elements="thermal_bridges"
            newobj="newPT"
            selected={selected}
            setSelected={setSelected}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <PTsTable selected={selected} setSelected={setSelected} />
        </Col>
      </Row>
      <Row>
        <Col>&sum;L = {appstate.ptsL.toFixed(2)} m</Col>
      </Row>
      <Row>
        <Col md="auto">&sum;L·&psi; = {appstate.ptsPsiL.toFixed(2)} W/K</Col>
      </Row>
      <Row className="text-info small mt-3">
        <Col>
          <p>Donde:</p>
          <ul>
            <li>
              <b>Longitud</b>: longitud del puente térmico (m)
            </li>
            <li>
              <b>&psi;</b>: transmitancia térmica lineal del puente térmico
              (W/mK)
            </li>
          </ul>
          <p>
            <b>NOTA</b>: Para los puentes térmicos definidos en la tabla se
            considera, a efectos del cálculo de K, un factor de ajuste{" "}
            <i>
              b<sub>tr,x</sub> = 1.0
            </i>
            , de modo que solo deben incluirse aquellos pertenecientes a
            elementos con un factor de ajuste no nulo.
          </p>
        </Col>
      </Row>
    </Col>
  );
});

export default PTsView;
