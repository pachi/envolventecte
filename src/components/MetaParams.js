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

import React, { useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import ClimateSelector from "./ClimateSelector";

const MetaParams = observer(({ appstate }) => {
  const hasblowerdoorref = useRef(null);
  return (
    <Row className="well">
      <Col>
        <h4>Datos generales</h4>
        <Form>
          <Form.Group as={Row} controlId="formControlsName">
            <Form.Label column md={4}>
              <b>Nombre del proyecto</b>
            </Form.Label>{" "}
            <Col md={8}>
              <Form.Control
                value={appstate.meta.name}
                onChange={(e) => (appstate.meta.name = e.target.value)}
                placeholder="Nombre del proyecto"
              />
            </Col>
          </Form.Group>
        </Form>
        <h5>Clima</h5>
        <ClimateSelector
          appstate={appstate}
          labelStyle={{ color: "inherit" }}
          className="mr-auto"
        />
        <h5>Uso</h5>
        <Form>
          <Form.Check
            checked={appstate.meta.is_new_building}
            onChange={() =>
              (appstate.meta.is_new_building = !appstate.meta.is_new_building)
            }
            type="checkbox"
            label="Nueva construcción"
          />
          <Form.Check
            checked={appstate.meta.is_dwelling}
            onChange={() =>
              (appstate.meta.is_dwelling = !appstate.meta.is_dwelling)
            }
            type="checkbox"
            label="Uso residencial privado (vivienda)"
          />
          {appstate.meta.is_dwelling ? (
            <Form.Group as={Row} controlId="formControlsNumberOfDwellings">
              <Form.Label column md={4}>
                Número de viviendas
              </Form.Label>{" "}
              <Col md={8}>
                <Form.Control
                  type="number"
                  value={appstate.meta.num_dwellings}
                  onChange={(e) =>
                    (appstate.meta.num_dwellings = e.target.value)
                  }
                  placeholder="1"
                />
              </Col>
            </Form.Group>
          ) : null}
        </Form>
        <h5>Ventilación e infiltraciones</h5>
        <Form>
          <Form.Check
            defaultValue={appstate.meta.n50_test_ach}
            onChange={(e) => {
              if (e.target.checked === false) {
                appstate.meta.n50_test_ach = null;
              } else {
                appstate.meta.n50_test_ach = 0.0;
              }
            }}
            type="checkbox"
            label="Ensayo de puerta soplante disponible"
            ref={hasblowerdoorref}
          />
          {hasblowerdoorref.current && hasblowerdoorref.current.checked ? (
            <Form.Group as={Row} controlId="formControlsn50">
              <Form.Label column md={4}>
                Tasa de intercambio de aire a 50 Pa (n<sub>50</sub>) obtenida de
                ensayo (renh)
              </Form.Label>{" "}
              <Col md={8}>
                <Form.Control
                  type="number"
                  defaultValue={appstate.meta.n50_test_ach}
                  onChange={(e) => {
                    if (hasblowerdoorref.current.checked === true) {
                      appstate.meta.n50_test_ach = e.target.value;
                    } else {
                      appstate.meta.n50_test_ach = null;
                    }
                  }}
                  placeholder="0.0"
                  step="0.01"
                />
              </Col>
            </Form.Group>
          ) : null}
          {appstate.meta.is_dwelling ? (
            <Form.Group as={Row} controlId="formControlsGlobalVentilation">
              <Form.Label column md={4}>
                Ventilación global de diseño del edificio (l/s)
              </Form.Label>{" "}
              <Col md={8}>
                <Form.Control
                  type="number"
                  value={appstate.meta.global_ventilation_l_s}
                  onChange={(e) =>
                    (appstate.meta.global_ventilation_l_s = e.target.value)
                  }
                  placeholder="0.0"
                  step="0.1"
                />
              </Col>
            </Form.Group>
          ) : null}
        </Form>

        <h5>Aislamiento perimetral en soleras</h5>

        <Form>
          <Form.Group as={Row} controlId="formControlsd_perim_insulation">
            <Form.Label column md={4}>
              Ancho del aislamiento perimetral (m)
            </Form.Label>{" "}
            <Col md={8}>
              <Form.Control
                type="number"
                value={appstate.meta.d_perim_insulation}
                onChange={(e) => {
                  appstate.meta.d_perim_insulation = e.target.value;
                }}
                placeholder="0.0"
                step="0.01"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formControlsd_perim_insulation">
            <Form.Label column md={4}>
              Resistencia térmica del aislamiento perimetral (m²K/W)
            </Form.Label>{" "}
            <Col md={8}>
              <Form.Control
                type="number"
                value={appstate.meta.rn_perim_insulation}
                onChange={(e) => {
                  appstate.meta.rn_perim_insulation = e.target.value;
                }}
                placeholder="0.0"
                step="0.01"
              />
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
});

export default MetaParams;
