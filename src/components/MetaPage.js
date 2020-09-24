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

import React, { Component } from "react";
import { Col, Form, Container, Row } from "react-bootstrap";
import { observer, inject } from "mobx-react";

import Footer from "./Footer";
import NavBar from "./Nav";
import ClimateSelector from "./ClimateSelector";

const MetaParams = inject("appstate")(
  observer(
    class MetaParams extends Component {
      constructor(...args) {
        super(...args);
        this.hasblowerdoorref = React.createRef();
      }

      render() {
        const { meta } = this.props.appstate;
        return (
          <>
            <Row className="well">
              <Col>
                <h4>Datos generales</h4>
                <Form>
                  <Form.Group controlId="formControlsName">
                    <Col as={Form.Label} md={4}>
                      <b>Nombre del proyecto</b>
                    </Col>{" "}
                    <Col
                      as={Form.Control}
                      md={8}
                      value={meta.name}
                      onChange={(e) => (meta.name = e.target.value)}
                      placeholder="Nombre del proyecto"
                    />
                  </Form.Group>
                </Form>
                <h5>Clima</h5>
                <ClimateSelector labelColor="inherit" className="mr-auto" />
                <h5>Uso</h5>
                <Form>
                  <Form.Check
                    checked={meta.is_new_building}
                    onChange={() =>
                      (meta.is_new_building = !meta.is_new_building)
                    }
                    type="checkbox"
                    label="Es un edificio de nueva construcción"
                  />
                  <Form.Check
                    checked={meta.is_dwelling}
                    onChange={() => (meta.is_dwelling = !meta.is_dwelling)}
                    type="checkbox"
                    label="Es un edificio de uso residencial privado (vivienda)"
                  />
                  {meta.is_dwelling ? (
                    <Form.Group
                      as={Row}
                      controlId="formControlsNumberOfDwellings"
                    >
                      <Col as={Form.Label} md={4}>
                        Número de viviendas
                      </Col>{" "}
                      <Col
                        as={Form.Control}
                        md={4}
                        type="number"
                        value={meta.num_dwellings}
                        onChange={(e) => (meta.num_dwellings = e.target.value)}
                        placeholder="1"
                      />
                    </Form.Group>
                  ) : null}
                </Form>
                <h5>Ventilación e infiltraciones</h5>
                <Form>
                  <Form.Check
                    defaultValue={meta.n50_test_ach}
                    onChange={(e) => {
                      if (e.target.checked === false) {
                        meta.n50_test_ach = null;
                      } else {
                        meta.n50_test_ach = 0.0;
                      }
                    }}
                    type="checkbox"
                    label="¿Tiene ensayo de puerta soplante?"
                    ref={this.hasblowerdoorref}
                  />
                  {this.hasblowerdoorref.current &&
                  this.hasblowerdoorref.current.checked ? (
                    <Form.Group as={Row} controlId="formControlsn50">
                      <Col as={Form.Label} md={4}>
                        Tasa de intercambio de aire a 50 Pa (n<sub>50</sub>)
                        obtenida de ensayo (renh)
                      </Col>{" "}
                      <Col
                        as={Form.Control}
                        md={4}
                        type="number"
                        defaultValue={meta.n50_test_ach}
                        onChange={(e) => {
                          if (this.hasblowerdoorref.current.checked === true) {
                            meta.n50_test_ach = e.target.value;
                          } else {
                            meta.n50_test_ach = null;
                          }
                        }}
                        placeholder="0.0"
                        step="0.01"
                      />
                    </Form.Group>
                  ) : null}
                  {meta.is_dwelling ? (
                    <Form.Group
                      as={Row}
                      controlId="formControlsGlobalVentilation"
                    >
                      <Col as={Form.Label} md={4}>
                        Ventilación global de diseño del edificio (l/s)
                      </Col>{" "}
                      <Col
                        as={Form.Control}
                        md={4}
                        type="number"
                        value={meta.global_ventilation_l_s}
                        onChange={(e) =>
                          (meta.global_ventilation_l_s = e.target.value)
                        }
                        placeholder="0.0"
                        step="0.1"
                      />
                    </Form.Group>
                  ) : null}
                </Form>

                <h5>Aislamiento perimetral en soleras</h5>

                <Form>
                  <Form.Group
                    as={Row}
                    controlId="formControlsd_perim_insulation"
                  >
                    <Col as={Form.Label} md={4}>
                      Ancho del aislamiento perimetral (m)
                    </Col>{" "}
                    <Col
                      as={Form.Control}
                      md={4}
                      type="number"
                      value={meta.d_perim_insulation}
                      onChange={(e) => {
                        meta.d_perim_insulation = e.target.value;
                      }}
                      placeholder="0.0"
                      step="0.01"
                    />
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="formControlsd_perim_insulation"
                  >
                    <Col as={Form.Label} md={4}>
                      Resistencia térmica del aislamiento perimetral (m²K/W)
                    </Col>{" "}
                    <Col
                      as={Form.Control}
                      md={4}
                      type="number"
                      value={meta.rn_perim_insulation}
                      onChange={(e) => {
                        meta.rn_perim_insulation = e.target.value;
                      }}
                      placeholder="0.0"
                      step="0.01"
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </>
        );
      }
    }
  )
);

export default class MetaPage extends Component {
  render() {
    return (
      <Container fluid>
        <NavBar route={this.props.route} />
        <MetaParams />
        {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
        <Footer />
      </Container>
    );
  }
}