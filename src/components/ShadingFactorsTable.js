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
  FormLabel,
  Form,
  FormControl,
  FormGroup,
  Row
} from "react-bootstrap";

import { OrientaIcon } from "./IconsOrientaciones";
import { FshwithIcon } from "./IconsFshwith";

// Tabla de factores de reducción para dispositivos solares móviles
//
// Para usar los iconos, OrientacionesSprite y FshwithSprite deben estar instanciados en la página
// en la que se incruste la tabla.
// import { OrientacionesSprite } from "./IconsOrientaciones"; -> <OrientacionesSprite/>
// import { FshwithSprite } from "./IconsFshwith"; -> <FshwithSprite/>
export default class ShadingFactorsTable extends Component {
  constructor(...args) {
    super(...args);
    this.levels = ["200", "300", "500"];
    this.MESES = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SET,OCT,NOV,DIC".split(",");
    this.state = { showlevel: "300" };
  }

  render() {
    const { data } = this.props;
    return (
      <Col>
        <Row>
          <Col>
            <h4>
              Factores mensuales de reducción para sombreamientos solares
              móviles
            </h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form inline>
              <FormGroup controlId="formControlsIrradiationLevel">
                <FormLabel>
                  Nivel de irradiación de activación / desactivación del
                  sombreamiento solar móvil (W/m²):
                </FormLabel>{" "}
                <FormControl
                  value={this.state.showlevel}
                  onChange={e => this.setState({ showlevel: e.target.value })}
                  as="select"
                  placeholder="select"
                >
                  {this.levels.map(z => (
                    <option value={z} key={"f_shwith" + z}>
                      {z}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <Col>
            <table
              id="shadingfactorstable"
              className="table table-striped table-bordered table-condensed"
            >
              <thead>
                <tr style={{ borderBottom: "3px solid darkgray" }}>
                  <th className="col-md-1">Superficie</th>
                  <th className="col-md-1">
                    f<sub>sh;with</sub>
                  </th>
                  {this.MESES.map(m => (
                    <th key={m}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(d => {
                  const level = this.state.showlevel;
                  return (
                    <tr key={"f_shwith200_" + d.surfname}>
                      <td>
                        <b className="pull-left">{d.surfname}</b>
                        <OrientaIcon dir={d.surfname} />
                      </td>
                      <td style={{ textAlign: "center" }}>I > {level}</td>
                      {d[`f_shwith${level}`].map((v, i) => (
                        <td key={`fshwith${level}_${i}`}>
                          {v.toFixed(2)} <FshwithIcon fsh={v} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-info">
              <p>
                La tabla anterior recoge la fracción del tiempo (mensual) que el
                dispositivo de sombra móvil está conectado.
              </p>
              <p>
                Estos valores pueden resultar útiles para obtener el factor
                solar del hueco considerando los dispositivos de sombra móviles
                (
                <i>
                  g<sub>gl;sh;wi</sub>
                </i>
                ). Para obtener valores estacionales se pueden promediar los
                valores mensuales correspondientes a la estación (p.e. verano e
                invierno).
              </p>
              <p>
                Se puede considerar que el dispositivo está conectado cuando la
                radiación (total) incidente supera el valor indicado (
                <i>
                  I > 200 W/m<sup>2</sup>
                </i>
                ,{" "}
                <i>
                  I > 300 W/m<sup>2</sup>
                </i>
                ,{" "}
                <i>
                  I > 500 W/m<sup>2</sup>
                </i>
                ) y desconectado cuando se encuentra por debajo de ese valor. Es
                decir, un valor de{" "}
                <i>
                  f<sub>sh;with</sub> = 1
                </i>{" "}
                significa que el dispositivo de sombra móvil está completamente
                conectado o activado (p.e. un toldo extendido o una persiana
                bajada) y un valor de{" "}
                <i>
                  f<sub>sh;with</sub> = 0
                </i>{" "}
                significa que el dispositivo de sombra móvil está completamente
                desconectado o desactivado (p.e. un toldo recogido o una
                persiana subida).
              </p>
              <p>
                Se han calculados los factores de reducción para los siguientes
                valores de la irradiación sobre el hueco, para los que se
                indican sus usos recomendados:
              </p>
              <ul>
                <li>
                  <i>
                    I > 300 W/m<sup>2</sup>
                  </i>
                  : dispositivos de sombra con accionamiento y control manual;
                </li>
                <li>
                  <i>
                    I > 200 W/m<sup>2</sup>
                  </i>
                  : dispositivos de sombra con control y accionamiento
                  automático;
                </li>
                <li>
                  <i>
                    I > 500 W/m<sup>2</sup>
                  </i>
                  : dispositivos de sombra en modo de calefacción (evita cargas
                  extremas).
                </li>
              </ul>
              <p>
                NOTA: Debe tenerse en cuenta que los valores de la tabla se han
                obtenido sin considerar el efecto de los obstáculos remotos
                sobre el hueco.
              </p>
            </div>
          </Col>
        </Row>
      </Col>
    );
  }
}
