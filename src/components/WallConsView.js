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
import { Col, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import AppState from "../stores/AppState";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import WallConsTable from "./WallConsTable";

// Vista de construcciones de opacos del edificio
const WallConsView = observer(() => {
  const appstate = useContext(AppState);
  const [selected, setSelected] = useState([]);

  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Construcciones de Opacos{" "}
            <small className="text-muted">({appstate.wallcons.length})</small>
          </h4>
        </Col>
        <Col md="auto">
          <AddRemoveButtonGroup
            elements="wallcons"
            newobj="newWallCons"
            selected={selected}
            setSelected={setSelected}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <WallConsTable selected={selected} setSelected={setSelected} />
        </Col>
      </Row>
      <Row className="text-info small mt-3">
        <Col>
          <p>Donde:</p>
          <ul>
            <li>
              <b>Grupo</b>: grupo de clasificación de las construcciones de
              opacos
            </li>
            <li>
              <b>e</b>: grosor total del conjunto de capas de la construcción
            </li>
            <li>
              <b>
                R<sub>e</sub>
              </b>
              : resistencia intrínseca (sin resistencias superficiales, solo de
              las capas) del elemento (m²K/W)
            </li>
            <li>
              <b>&alpha;</b>: absortividad térmica de la construcción [-]
            </li>
            <li>
              <b>
                C<sub>o;100</sub>
              </b>
              : coeficiente de permeabilidad de opacos a 100Pa. Depende del tipo
              de edificio (nuevo / existente) y de si existe ensayo de
              permeabildad, n<sub>50</sub> (Blower-door) [m³/h·m²]
            </li>
          </ul>
        </Col>
      </Row>
    </Col>
  );
});

export default WallConsView;
