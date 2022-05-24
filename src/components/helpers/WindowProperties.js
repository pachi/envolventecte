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

import React, { useState, useCallback, useEffect } from "react";
import { Col, Form, Card, Row } from "react-bootstrap";

import { ELEMENTOS, g_t_e, g_t_i, g_t_m } from "./elements";

const ACRISTALAMIENTOS = ELEMENTOS.huecos.acristalamientos;
const SOMBREAMIENTOS = ELEMENTOS.huecos.sombreamientos;
const TIPOSVIDRIO = ACRISTALAMIENTOS.tipos.map((v) => v.name);
const TIPOSSOMBRA = SOMBREAMIENTOS.tipos.map((v) => v.name);

export const HuecosParams = (_props) => {
  const [tipovidrio, setTipovidrio] = useState(TIPOSVIDRIO[0]);
  const [tiposombra, setTiposombra] = useState(TIPOSSOMBRA[0]);
  const [tau_e_B, setTau_e_B] = useState(1);
  const [rho_e_B, setRho_e_B] = useState(0);

  // funciones para dar a los componentes hijos, con declaración de dependencias
  const wrapperSetTau_e_B = useCallback(
    (val) => {
      setTau_e_B(val);
    },
    [setTau_e_B]
  );
  const wrapperSetRho_e_B = useCallback(
    (val) => {
      setRho_e_B(val);
    },
    [setRho_e_B]
  );

  const vidrio = ACRISTALAMIENTOS.tipos.find((v) => v.name === tipovidrio);
  const F_w = ACRISTALAMIENTOS.propiedades.F_w;
  return (
    <>
      <Row className="well">
        <Col>
          <Form>
            <Form.Group as={Row} controlId="formControlsGlassType">
              <Col as={Form.Label} md={4}>
                Tipo de vidrio:
              </Col>{" "}
              <Col md={8}>
                <Form.Control
                  value={tipovidrio}
                  onChange={(e) => setTipovidrio(e.target.value)}
                  as="select"
                  placeholder="select"
                >
                  {TIPOSVIDRIO.map((v) => (
                    <option value={v} key={"tipovidrio_" + v.replace(" ", "_")}>
                      {v}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formControlsHasShading">
              <Col as={Form.Label} md={4}>
                Dispositivo de protección solar móvil:
              </Col>{" "}
              <Col md={8}>
                <Form.Control
                  value={tiposombra}
                  onChange={(e) => setTiposombra(e.target.value)}
                  as="select"
                  placeholder="select"
                >
                  {TIPOSSOMBRA.map((v) => (
                    <option value={v} key={"tiposombra_" + v}>
                      {v}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
            {tiposombra === "Ninguno" ? null : (
              <SombrasForm
                tau_e_B={tau_e_B}
                rho_e_B={rho_e_B}
                setTau_e_B={wrapperSetTau_e_B}
                setRho_e_B={wrapperSetRho_e_B}
              />
            )}
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <GlazingPropertiesCard
            {...{ vidrio, F_w, tiposombra, tau_e_B, rho_e_B }}
          />
        </Col>
      </Row>
    </>
  );
};

const OPACIDAD = ELEMENTOS.huecos.sombreamientos.propiedades.transmitancia;
const REFLEXION = ELEMENTOS.huecos.sombreamientos.propiedades.reflexion;

// Obtén tau y rho a partir de opacidad y color
const findTauRho = (opacidad, color) => {
  const tau_e_B = OPACIDAD.find((v) => v.opacidad === opacidad).tau_e_B;
  const rho_e_B = REFLEXION.find(
    (v) => v.color === color && v.opacidad === opacidad
  ).rho_e_B;
  return [tau_e_B, rho_e_B];
};

const SombrasForm = ({ tau_e_B, setTau_e_B, rho_e_B, setRho_e_B }) => {
  const [opacidad, setOpacidad] = useState(OPACIDAD[0].opacidad);
  const [color, setColor] = useState(REFLEXION[0].color);

  // Actualiza el componente madre como efecto de cambiar color y opacidad
  useEffect(() => {
    const [tau_e_B, rho_e_B] = findTauRho(opacidad, color);
    setTau_e_B(tau_e_B);
    setRho_e_B(rho_e_B);
  }, [setTau_e_B, setRho_e_B, opacidad, color]);

  return (
    <>
      <Form.Group as={Row} controlId="formControlsShadingTransparency">
        <Form.Label column md={4}>
          Opacidad del dispositivo de sombra móvil:
        </Form.Label>{" "}
        <Col md={6}>
          <Form.Control
            value={opacidad}
            onChange={(e) => {
              setOpacidad(e.target.value);
            }}
            as="select"
            placeholder="select"
          >
            {OPACIDAD.map((v) => (
              <option
                value={v.opacidad}
                key={"opacidad_" + v.opacidad.replace(" ", "_")}
              >
                {v.opacidad}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Form.Label column md={1}>
          &tau;<sub>e,B</sub>:
        </Form.Label>
        <Col md={1}>
          <Form.Control
            readOnly
            type="text"
            value={tau_e_B.toFixed(2)}
            md={1}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formControlsShadingColor">
        <Form.Label column md={4}>
          Color del dispositivo de sombra móvil:
        </Form.Label>{" "}
        <Col md={6}>
          <Form.Control
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
            }}
            as="select"
            placeholder="select"
          >
            {REFLEXION.filter((v) => v.opacidad === opacidad).map((v) => (
              <option value={v.color} key={"color_" + v.color}>
                {v.color}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Form.Label column md={1}>
          &rho;<sub>e,B</sub>:
        </Form.Label>
        <Col md={1}>
          <Form.Control
            readOnly
            type="text"
            value={rho_e_B.toFixed(2)}
            md={1}
          />
        </Col>
      </Form.Group>
    </>
  );
};

const GlazingPropertiesCard = (props) => {
  const { vidrio, F_w, tiposombra, tau_e_B, rho_e_B } = props;
  const g_gl_wi = F_w * vidrio.g_gl_n;
  let g_gl_sh_wi;
  if (tiposombra === "Exterior") {
    g_gl_sh_wi = g_t_e(vidrio.U_gl, vidrio.g_gl_n, tau_e_B, rho_e_B);
  } else if (tiposombra === "Interior") {
    g_gl_sh_wi = g_t_i(vidrio.U_gl, vidrio.g_gl_n, tau_e_B, rho_e_B);
  } else if (tiposombra === "Integrado") {
    g_gl_sh_wi = g_t_m(vidrio.U_gl, vidrio.g_gl_n, tau_e_B, rho_e_B);
  } else {
    g_gl_sh_wi = g_gl_wi;
  }
  return (
    <Card>
      <Card.Header>
        Propiedades del acristalamiento ({vidrio.name.toLowerCase()},{" "}
        {tiposombra === "Ninguno"
          ? "sin sombreamiento"
          : `sombreamiento ${tiposombra.toLowerCase()}`}
        )
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Transmitancia térmica del vidrio,{" "}
          <b>
            U<sub>gl</sub>
          </b>{" "}
          = {vidrio.U_gl.toFixed(2)}
        </Card.Text>
        <Card.Text>
          Factor de transmitancia de energía solar del vidrio a incidencia
          normal,{" "}
          <b>
            g<sub>gl;n</sub>
          </b>{" "}
          = {vidrio.g_gl_n.toFixed(2)}
        </Card.Text>
        <Card.Text>
          Factor de dispersión del vidrio,{" "}
          <b>
            F<sub>w</sub>
          </b>{" "}
          = {F_w.toFixed(2)}
        </Card.Text>
        <Card.Text>
          Factor de transmitancia de energía solar del vidrio, <b>sin</b> las
          sombras solares móviles en uso normal,{" "}
          <b>
            g<sub>gl;wi</sub>
          </b>{" "}
          = F<sub>w</sub> · g<sub>gl;n</sub> = {g_gl_wi.toFixed(2)}
        </Card.Text>
        <Card.Text>
          Factor de transmitancia de energía solar del vidrio, <b>con</b> las
          sombras solares móviles en uso normal,{" "}
          <b>
            g<sub>gl;sh;wi</sub>
          </b>{" "}
          = {g_gl_sh_wi.toFixed(2)}
        </Card.Text>
        {tiposombra === "Ninguno" ? null : (
          <Card.Text>
            Factor de transmitancia solar del dispositivo de sombra móvil, &tau;
            <sub>e,B</sub>: {tau_e_B.toFixed(2)}
          </Card.Text>
        )}
        {tiposombra === "Ninguno" ? null : (
          <Card.Text>
            Factor de reflexión solar del dispositivo de sombra móvil, &rho;
            <sub>e,B</sub>: {rho_e_B.toFixed(2)}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};
