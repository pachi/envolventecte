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
import {
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Grid,
  Panel,
  Row,
  Tabs,
  Tab
} from "react-bootstrap";

import Footer from "./Footer";
import NavBar from "./Nav";

import { ELEMENTOS, g_t_e, g_t_i, g_t_m } from "../elements";

class HuecosParams extends Component {
  constructor(...args) {
    super(...args);
    this.ACRISTALAMIENTOS = ELEMENTOS.huecos.acristalamientos;
    this.SOMBREAMIENTOS = ELEMENTOS.huecos.sombreamientos;
    this.TIPOSVIDRIO = this.ACRISTALAMIENTOS.tipos.map(v => v.name);
    this.TIPOSSOMBRA = this.SOMBREAMIENTOS.tipos.map(v => v.name);
    this.state = {
      tipovidrio: this.TIPOSVIDRIO[0],
      tiposombra: this.TIPOSSOMBRA[0],
      tau_e_B: 1,
      rho_e_B: 0
    };
  }

  render() {
    const { tipovidrio, tiposombra, tau_e_B, rho_e_B } = this.state;
    const vidrio = this.ACRISTALAMIENTOS.tipos.find(v => v.name === tipovidrio);
    const F_w = this.ACRISTALAMIENTOS.propiedades.F_w;
    return (
      <Grid className="top20">
        <Row className="well">
          <Form horizontal>
            <FormGroup controlId="formControlsGlassType">
              <Col componentClass={ControlLabel} md={4}>
                Tipo de vidrio:
              </Col>{" "}
              <Col md={8}>
                <FormControl
                  value={tipovidrio}
                  onChange={e => this.setState({ tipovidrio: e.target.value })}
                  componentClass="select"
                  placeholder="select"
                >
                  {this.TIPOSVIDRIO.map(v => (
                    <option value={v} key={"tipovidrio_" + v.replace(" ", "_")}>
                      {v}
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="formControlsHasShading">
              <Col componentClass={ControlLabel} md={4}>
                Dispositivo de protección solar móvil:
              </Col>{" "}
              <Col md={8}>
                <FormControl
                  value={tiposombra}
                  onChange={e => this.setState({ tiposombra: e.target.value })}
                  componentClass="select"
                  placeholder="select"
                >
                  {this.TIPOSSOMBRA.map(v => (
                    <option value={v} key={"tiposombra_" + v}>
                      {v}
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            {tiposombra === "Ninguno" ? null : (
              <SombrasForm
                onUpdate={obj => {
                  this.setState(obj);
                }}
              />
            )}
          </Form>{" "}
        </Row>
        <GlazingPropertiesPanel
          {...{ vidrio, F_w, tiposombra, tau_e_B, rho_e_B }}
        />
      </Grid>
    );
  }
}

class SombrasForm extends Component {
  constructor(...args) {
    super(...args);
    this.OPACIDAD = ELEMENTOS.huecos.sombreamientos.propiedades.transmitancia;
    this.REFLEXION = ELEMENTOS.huecos.sombreamientos.propiedades.reflexion;
    this.state = {
      opacidad: this.OPACIDAD[0].opacidad,
      color: this.REFLEXION[0].color
    };
    this.onUpdate();
  }

  onUpdate() {
    const { opacidad, color } = this.state;
    const tau_e_B = this.OPACIDAD.find(v => v.opacidad === opacidad).tau_e_B;
    const rho_e_B = this.REFLEXION.find(
      v => v.color === color && v.opacidad === opacidad
    ).rho_e_B;
    this.props.onUpdate({ tau_e_B, rho_e_B });
  }

  render() {
    const { opacidad, color } = this.state;
    const tau_e_B = this.OPACIDAD.find(v => v.opacidad === opacidad).tau_e_B;
    const rho_e_B = this.REFLEXION.find(
      v => v.color === color && v.opacidad === opacidad
    ).rho_e_B;
    return (
      <React.Fragment>
        <FormGroup controlId="formControlsShadingTransparency">
          <Col componentClass={ControlLabel} md={6}>
            Opacidad del dispositivo de sombra móvil:
          </Col>{" "}
          <Col md={4}>
            <FormControl
              value={opacidad}
              onChange={e =>
                this.setState({ opacidad: e.target.value }, this.onUpdate)
              }
              componentClass="select"
              placeholder="select"
            >
              {this.OPACIDAD.map(v => (
                <option
                  value={v.opacidad}
                  key={"opacidad_" + v.opacidad.replace(" ", "_")}
                >
                  {v.opacidad}
                </option>
              ))}
            </FormControl>
          </Col>
          <Col componentClass={ControlLabel} md={1}>
            &tau;<sub>e,B</sub>:
          </Col>
          <Col md={1}>
            <FormControl
              readOnly
              type="text"
              value={tau_e_B.toFixed(2)}
              md={1}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="formControlsShadingColor">
          <Col componentClass={ControlLabel} md={6}>
            Color del dispositivo de sombra móvil:
          </Col>{" "}
          <Col md={4}>
            <FormControl
              value={color}
              onChange={e =>
                this.setState({ color: e.target.value }, this.onUpdate)
              }
              componentClass="select"
              placeholder="select"
            >
              {this.REFLEXION.filter(v => v.opacidad === opacidad).map(v => (
                <option value={v.color} key={"color_" + v.color}>
                  {v.color}
                </option>
              ))}
            </FormControl>
          </Col>
          <Col componentClass={ControlLabel} md={1}>
            &rho;<sub>e,B</sub>:
          </Col>
          <Col md={1}>
            <FormControl
              readOnly
              type="text"
              value={rho_e_B.toFixed(2)}
              md={1}
            />
          </Col>
        </FormGroup>
      </React.Fragment>
    );
  }
}

class GlazingPropertiesPanel extends Component {
  render() {
    const { vidrio, F_w, tiposombra, tau_e_B, rho_e_B } = this.props;
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
      <Panel>
        <Panel.Heading>
          Propiedades del acristalamiento ({vidrio.name.toLowerCase()},{" "}
          {tiposombra === "Ninguno"
            ? "sin sombreamiento"
            : `sombreamiento ${tiposombra.toLowerCase()}`})
        </Panel.Heading>
        <Panel.Body>
          <p>
            Transmitancia térmica del vidrio,{" "}
            <b>
              U<sub>gl</sub>
            </b>{" "}
            = {vidrio.U_gl.toFixed(2)}
          </p>
          <p>
            Factor de transmitancia de energía solar del vidrio a incidencia
            normal,{" "}
            <b>
              g<sub>gl;n</sub>
            </b>{" "}
            = {vidrio.g_gl_n.toFixed(2)}
          </p>
          <p>
            Factor de dispersión del vidrio,{" "}
            <b>
              F<sub>w</sub>
            </b>{" "}
            = {F_w.toFixed(2)}
          </p>
          <p>
            Factor de transmitancia de energía solar del vidrio, <b>sin</b> las
            sombras solares móviles en uso normal,{" "}
            <b>
              g<sub>gl;wi</sub>
            </b>{" "}
            = F<sub>w</sub> · g<sub>gl;n</sub> = {g_gl_wi.toFixed(2)}
          </p>
          <p>
            Factor de transmitancia de energía solar del vidrio, <b>con</b> las
            sombras solares móviles en uso normal,{" "}
            <b>
              g<sub>gl;sh;wi</sub>
            </b>{" "}
            = {g_gl_sh_wi.toFixed(2)}
          </p>
          {tiposombra === "Ninguno" ? null : (
            <p>
              Factor de transmitancia solar del dispositivo de sombra móvil,
              &tau;<sub>e,B</sub>: {tau_e_B.toFixed(2)}
            </p>
          )}
          {tiposombra === "Ninguno" ? null : (
            <p>
              Factor de reflexión solar del dispositivo de sombra móvil, &rho;<sub
              >
                e,B
              </sub>: {rho_e_B.toFixed(2)}
            </p>
          )}
        </Panel.Body>
      </Panel>
    );
  }
}

export default class ElementsPage extends Component {
  render() {
    return (
      <Grid>
        <NavBar route={this.props.route} />
        <Row>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Huecos">
              <HuecosParams />
            </Tab>
          </Tabs>
        </Row>
        {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
        <Footer />
      </Grid>
    );
  }
}
