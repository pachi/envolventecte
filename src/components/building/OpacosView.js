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

import React, { useState, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import AddRemoveButtonGroup from "../ui/AddRemoveButtonGroup";
import OpacosTable from "./OpacosTable";

// Vista de elementos opacos
const OpacosView = observer(() => {
  const appstate = useContext(AppState);
  const [selected, setSelected] = useState([]);

  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Elementos opacos del edificio{" "}
            <small className="text-muted">({appstate.walls.length})</small>
          </h4>
        </Col>
        <Col md="auto">
          <AddRemoveButtonGroup
            elements="walls"
            newobj="newOpaco"
            selected={selected}
            setSelected={setSelected}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <OpacosTable selected={selected} setSelected={setSelected} />
        </Col>
      </Row>
      <Row className="text-info small mt-3">
        <Col>
          <p>
            <b>NOTA:</b>Se marcan en color más claro aquellos elementos que no
            pertenecen a la ET.
          </p>
          <p>Donde:</p>
          <ul>
            <li>
              <b>A</b>: área del elemento opaco (m²)
            </li>
            <li>
              <b>Tipo</b>: Condición de contorno del elemento opaco (EXTERIOR,
              INTERIOR, ADIABÁTICO, TERRENO). Determina el factor de ajuste del
              elemento opaco (b<sub>tr,x</sub>), que vale 1 para elementos en
              contacto con el aire exterior o el terreno y 0 para el resto
              (adiabáticos y en contacto con otros espacios).
              <p>
                Esta simplificación introduce cierto error al considerar que el
                intercambio de calor a través de los elementos en contacto con
                otros edificios o espacios adyacentes es despreciable, pero
                simplifica considerablemente los cálculos y el objetivo del
                parámetro K no es, en el caso del DB-HE, el cálculo de la
                demanda energética si no como indicador de la calidad de la
                envolvente térmica.
              </p>
            </li>
            <li>
              <b>Construcción</b>: solución constructiva del elemento opaco
            </li>
            <li>
              <b>Espacio</b>: Espacio al que pertenece el elemento opaco
            </li>
            <li>
              <b>Espacio ady.</b>: Espacio adyacente con el que comunica el
              elemento opaco, cuando este es un elemento interior
            </li>
            <li>
              <b>Orientación</b>: Orientación (gamma) [-180,+180] (S=0, E=+90,
              W=-90). Medido como azimuth geográfico de la proyección horizontal
              de la normal a la superficie.
            </li>
            <li>
              <b>Inclinación</b>: Inclinación (beta) [0, 180]. Medido respecto a
              la horizontal y normal hacia arriba (0 -&gt; suelo, 180 -&gt;
              techo)
            </li>
          </ul>
        </Col>
      </Row>
    </Col>
  );
});

export default OpacosView;
