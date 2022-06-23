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

// Propiedades de los huecos a partir de la definición del tipo de vidrio y protecciones solares móviles
// Cálculo de los factores multiplicadores del factor solar para HULC y otros procedimientos

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

  const g_gl_wi = F_w * vidrio.g_gl_n || 0.0;
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
    <>
      <Row>
        <Col>
          <p className="lead">
            Propiedades térmicas de los huecos según UNE-EN ISO 52022-1:2017
          </p>
        </Col>
      </Row>
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
                  size="sm"
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
                  size="sm"
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
      <Row className="mt-2">
        <Col>
          <GlazingPropertiesCard
            {...{
              vidrio,
              F_w,
              tiposombra,
              tau_e_B,
              rho_e_B,
              g_gl_wi,
              g_gl_sh_wi,
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <FactorsCard
            {...{
              vidrio,
              tiposombra,
              g_gl_wi,
              g_gl_sh_wi,
            }}
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
            size="sm"
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
            size="sm"
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
            size="sm"
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
            size="sm"
            value={rho_e_B.toFixed(2)}
            md={1}
          />
        </Col>
      </Form.Group>
    </>
  );
};

const GlazingPropertiesCard = ({
  vidrio,
  F_w,
  tiposombra,
  tau_e_B,
  rho_e_B,
  g_gl_wi,
  g_gl_sh_wi,
}) => {
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

const FactorsCard = ({ vidrio, tiposombra, g_gl_wi, g_gl_sh_wi }) => {
  let [fshwithsummer, setFshwithSummer] = useState("1");
  let [fshwithwinter, setFshwithWinter] = useState("1");
  let [buildingUseCoef, setBuildingUseCoef] = useState(0.7);

  let f_sh_with_summer = Number(fshwithsummer.replace(",", ".")).toFixed(2);
  let f_sh_with_winter = Number(fshwithwinter.replace(",", ".")).toFixed(2);

  let g_gl_sh_wi_on =
    (1.0 - f_sh_with_summer) * g_gl_wi + f_sh_with_summer * g_gl_sh_wi;

  let g_gl_sh_wi_off =
    (1.0 - f_sh_with_winter) * g_gl_wi + f_sh_with_winter * g_gl_sh_wi;

  let g_gl_wi_ref_on = g_gl_wi * buildingUseCoef;
  let g_gl_wi_ref_off = g_gl_wi;

  return (
    <Card>
      <Card.Header>
        Coeficiente de corrección por dispositivo de sombra estacional (
        {vidrio.name.toLowerCase()},{" "}
        {tiposombra === "Ninguno"
          ? "sin sombreamiento"
          : `sombreamiento ${tiposombra.toLowerCase()}`}
        ),{" "}
        <b>
          F<sub>g;estacional</sub>
        </b>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group as={Row} controlId="formControlsBuildingUse">
            <Form.Label column md={6}>
              Uso del edificio:
            </Form.Label>{" "}
            <Col md={2}>
              <Form.Control
                as="select"
                size="sm"
                defaultValue={buildingUseCoef}
                onChange={(e) => {
                  setBuildingUseCoef(e.target.value);
                }}
              >
                <option value={0.7}>Residencial privado</option>
                <option value={1.0}>Otros usos</option>
              </Form.Control>
            </Col>
            <Col>
              <i>Residencial privado, k=0.7, resto k=1.0</i>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formControlsFshwithSummer">
            <Form.Label column md={6}>
              Factor de reducción por sombras móviles medio <b>durante</b> el
              periodo / meses de activación, f<sub>sh;with;on</sub>:
            </Form.Label>{" "}
            <Col md={2}>
              <Form.Control
                type="input"
                size="sm"
                value={fshwithsummer}
                onChange={(e) => {
                  setFshwithSummer(e.target.value);
                }}
                placeholder="1.0"
                step="0.01"
              />
            </Col>
            <Col>
              <i>Tiempo de activación respecto al tiempo total con radiación</i>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formControlsFshwithSummer">
            <Form.Label column md={6}>
              Factor de reducción por sombras móviles medio <b>fuera</b> del
              periodo / meses de activación, f<sub>sh;with;off</sub>:
            </Form.Label>{" "}
            <Col md={2}>
              <Form.Control
                type="input"
                size="sm"
                value={fshwithwinter}
                onChange={(e) => {
                  setFshwithWinter(e.target.value);
                }}
                placeholder="1.0"
                step="0.01"
              />
            </Col>
            <Col>
              <i>Tiempo de activación respecto al tiempo total con radiación</i>
            </Col>
          </Form.Group>
        </Form>

        <hr />

        <h5>
          Periodo / meses <b>CON</b> activación de las protecciones solares
          móviles
        </h5>

        <p>
          Factor de transmitancia de energía solar del vidrio, g
          <sub>gl;sh;wi;on</sub> = {g_gl_sh_wi_on.toFixed(2)}
        </p>
        <p>
          Valor de referencia<sup>*</sup>, g<sub>sh;wi;ref;on</sub> = g
          <sub>gl;wi</sub> · {Number(buildingUseCoef).toFixed(2)} ={" "}
          {g_gl_wi_ref_on.toFixed(2)}
        </p>
        <p>
          <b>Coeficiente de corrección</b> del factor solar,{" "}
          <b>
            F<sub>g;on</sub>
          </b>{" "}
          = g<sub>gl;sh;wi;on</sub> / g<sub>sh;wi;ref;on</sub> ={" "}
          <b>{(g_gl_sh_wi_on / g_gl_wi_ref_on).toFixed(2)}</b>
        </p>

        <hr />

        <h5>
          Periodo / meses <b>SIN</b> activación de las protecciones solares
          móviles
        </h5>
        <p>
          Factor de transmitancia de energía solar del vidrio, g
          <sub>gl;sh;wi;off</sub> = {g_gl_sh_wi_off.toFixed(2)}
        </p>
        <p>
          Valor de referencia, g<sub>sh;wi;ref;off</sub> = g<sub>gl;wi</sub> ={" "}
          {g_gl_wi_ref_off.toFixed(2)}
        </p>
        <p>
          <b>Coeficiente de corrección</b> del factor solar,{" "}
          <b>
            F<sub>g;off</sub>
          </b>{" "}
          = g<sub>gl;sh;wi;off</sub> / g<sub>sh;wi;ref;off</sub> ={" "}
          <b>{(g_gl_sh_wi_off / g_gl_wi_ref_off).toFixed(2)}</b>
        </p>

        <hr />

        <div className="text-muted my-3">
          <b>NOTAS</b>:
          <ul>
            <li>
              Para el periodo de no activación puede ser más adecuado usar un
              factor F<sub>g;off</sub>=1.0
            </li>
            <li>
              Los valores de los factores de reducción medios para los periodos
              de activación y no activación pueden obtenerse en el apartado de
              &quot;Ayudas &gt; Factores de reducción por sombras&quot; en las
              columnas correspondientes a los meses correspondientes
              (inicialmente JUN-SET para el periodo de activación y el resto de
              meses para el de no activación).
            </li>
            <li>
              Debe tenerse en cuenta que el periodo / meses de activación o no
              activación de las sombras estacionales podría tener umbrales de
              radiación diferenciados entre periodos.
            </li>
            <li>
              Estos factores correctores del factor solar se usarían en los
              distintos procedimientos de evaluación de la eficiencia energética
              para afectar al factor solar estacional de referencia (g
              <sub>gl;sh;wi;ref</sub>), calculado automáticamente por el
              procedimiento, para obtener el factor solar estacional deseado (g
              <sub>gl;sh;wi</sub>).
            </li>
            <li>
              <sup>*</sup> El valor de referencia (g<sub>sh;wi;ref;on</sub>) se
              corresponde aproximadamente a la que resultaría de un dispositivo
              de sombra móvil en el interior del acristalamiento, muy traslúcido
              y de color blanco (&tau;<sub>e,B</sub>=0.40, &rho;<sub>e,B</sub>
              =0.40).
            </li>
            <li>
              Esta ayuda utiliza las condiciones de referencia del apartado 6.5
              del Documento Reconocido de{" "}
              <a href="https://energia.gob.es/es-es/Participacion/Documents/propuesta-doc-reconocido-condiciones-tecnicas/Condiciones-tecnicas-evaluacion-eficiencia-energetica.pdf">
                Condiciones técnicas para la evaluación de la eficiencia
                energética de edificios
              </a>
              .
            </li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};
