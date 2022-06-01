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

// TODO: incluir opciones de espacios bajo cubierta
// Cubiertas con valores por defecto y considerando angulo 45º, n=3:
// U_cub = 10.0 -> R_u = 0,06
// U_cub = 5.0  -> R_u = 0,10
// U_cub = 1.7 - 2  -> R_u = 0,20
// U_cub = 0.6  -> R_u = 0,30
// U_cub = 0.0  -> R_u = 0,40

import React, { useState, useCallback, useEffect } from "react";
import { Col, Form, Card, Row } from "react-bootstrap";

export const BoundaryWallResistance = (_props) => {
  const [supInt, setSupInt] = useState(10.0);
  const [supExt, setSupExt] = useState(20.0);
  const [uExt, setUExt] = useState(2.0);
  const [n, setN] = useState(3.0);
  const [volume, setVolume] = useState(30.0);

  return (
    <>
      <Row>
        <Col>
          <p className="lead">
            Resistencia térmica equivalente de espacios no calefactados
            (acondicionados) según UNE-EN ISO 6946:2021
          </p>
          <p className="small">
            Cálculo de la resistencia térmica adicional para modelizar el efecto
            de espacios no acondicionados que comunican con el ambiente
            exterior. Facilita la modelización de medianeras a espacios no
            habitables o no acondicionados o a espacios bajocubierta no
            habitables, evitando la introducción de la geometría completa de
            estos espacios.
          </p>
        </Col>
      </Row>
      <Row className="well">
        <Col>
          <Form>
            <Form.Group as={Row} controlId="formControlsInternalArea">
              <Col as={Form.Label} md={2} className="text-end">
                A<sub>i</sub>:
              </Col>
              <Col md={1}>
                <Form.Control
                  type="number"
                  size="sm"
                  value={supInt}
                  onChange={(e) =>
                    setSupInt(Number(e.target.value.replace(",", ".")))
                  }
                  placeholder="10.0"
                />
              </Col>
              <Col md={1}>m²</Col>
              <Col className="text-muted small">
                Superficie de separación con el espacio no acondicionado.
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formControlsExternalArea">
              <Col as={Form.Label} md={2} className="text-end">
                V:
              </Col>{" "}
              <Col md={1}>
                <Form.Control
                  type="number"
                  size="sm"
                  value={volume}
                  onChange={(e) =>
                    setVolume(Number(e.target.value.replace(",", ".")))
                  }
                  placeholder="30.0"
                />
              </Col>
              <Col md={1}>m³</Col>
              <Col className="text-muted small">
                Volumen del espacio no calefactado.
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formControlsExternalArea">
              <Col as={Form.Label} md={2} className="text-end">
                A<sub>e</sub> = &sum;A<sub>e,k</sub>:
              </Col>{" "}
              <Col md={1}>
                <Form.Control
                  type="number"
                  size="sm"
                  value={supExt}
                  onChange={(e) =>
                    setSupExt(Number(e.target.value.replace(",", ".")))
                  }
                  placeholder="20.0"
                />
              </Col>
              <Col md={1}>m²</Col>
              <Col className="text-muted small">
                Superficies de separación entre el espacio no acondicionado y el
                exterior.
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formControlsExternalArea">
              <Col as={Form.Label} md={2} className="text-end">
                U<sub>e,m</sub> = &sum;(A<sub>e,k</sub>·U<sub>e,k</sub>)/A
                <sub>e</sub>:
              </Col>{" "}
              <Col md={1}>
                <Form.Control
                  type="number"
                  size="sm"
                  value={uExt}
                  onChange={(e) =>
                    setUExt(Number(e.target.value.replace(",", ".")))
                  }
                  placeholder="2.0"
                />
              </Col>
              <Col md={1}>W/(m²·K)</Col>
              <Col className="text-muted small">
                Transmitancia térmica media de las superficies de separación
                entre el espacio no acondicionado y el exterior.
                <br />A falta de datos o de forma simplificada puede suponerse U
                <sub>e,k</sub>=2 W/(m²·K)
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formControlsVentilation">
              <Col as={Form.Label} md={2} className="text-end">
                n:
              </Col>{" "}
              <Col md={1}>
                <Form.Control
                  type="number"
                  size="sm"
                  value={n}
                  onChange={(e) =>
                    setN(Number(e.target.value.replace(",", ".")))
                  }
                  placeholder="3.0"
                />
              </Col>
              <Col md={1}>ren/h</Col>
              <Col className="text-muted small">
                Tasa de ventilación del espacio no calefactado en ren/h.
                <br />A falta de datos o de forma simplificada puede suponerse
                n=3 ren/h
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <Card>
            <Card.Body>
              R<sub>u</sub> ={" "}
              {(supInt / (supExt * uExt + 0.33 * n * volume)).toFixed(2)} m²·K/W
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
