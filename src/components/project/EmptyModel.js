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

import React, { useContext } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import iconclearmodel from "../img/outline-new_document-24px.svg";

// Limpiar datos del modelo
export const EmptyModel = observer(() => {
  const appstate = useContext(AppState);

  return (
    <>
      <Row>
        <Col>
          <p className="lead">Vaciar modelo actual</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Pulse este botón para partir de un modelo vacío en el que introducir
            de cero los elementos de la envolvente térmica:
          </p>
          <div className="d-grid">
            <Button
              variant="secondary"
              onClick={(_e) => appstate.clearModel()}
              title="Pulse para dejar el modelo actual vacío, sin elementos definidos"
              style={{
                fontSize: 20,
                height: 50,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <img src={iconclearmodel} alt="Limpiar modelo" /> Modelo vacío
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-grid">
            <Button
              variant="secondary"
              onClick={(_e) => appstate.purgeModel()}
              title="Pulse para limpiar los elementos no usados del modelo"
              style={{
                fontSize: 20,
                height: 50,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              Purga elementos no utilizados del modelo
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
});
