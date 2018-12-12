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
  Alert,
  Button,
  Col,
  Container,
  Row,
  Image,
  Tabs,
  Tab
} from "react-bootstrap";

import Footer from "./Footer";
import NavBar from "./Nav";

import esquema5R1C from "./5R1C.svg";
import orientaciones from "./orientaciones.svg";

export default class HelpPage extends Component {
  render() {
    return (
      <Container>
        <NavBar route={this.props.route} />
        <Row>
          <Col>
            <h1>
              Indicadores y parámetros de la envolvente térmica para la
              aplicación del CTE DB-HE
            </h1>
            <p>
              <i>EnvolventeCTE</i> es una aplicación web de ayuda al cálculo de
              indicadores y parámetros de eficiencia energética de la envolvente
              térmica, facilitando la aplicación del CTE DB-HE (2018).
            </p>
            <p>Los indicadores y parámetros implementados son:</p>
            <ul>
              <li>
                <b>Transmitancia térmica global</b> (<b>K</b>)
              </li>
              <li>
                <b>Control solar</b> (
                <b>
                  q<sub>sol;jul</sub>
                </b>
                )
              </li>
              <li>
                <b>
                  Parámetros descriptivos de los elementos de la envolvente
                  térmica
                </b>{" "}
                (<b>U</b>, <b>g</b>, <b>&psi;</b>...)
              </li>
            </ul>
            <Alert variant="warning">
              <b>NOTA:</b> Esta aplicación y la información contenida en ella no
              tiene valor reglamentario.
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs>
              <Tab eventKey={1} title="Envolvente térmica">
                <Row>
                  <Col>
                    <h4>
                      Definición e indicadores de calidad de la envolvente
                      térmica
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <p>
                      El apartado de <i>Envolente</i> permite la definición por
                      parte del usuario de la envolvente térmica y calcula los
                      indicadores de calidad (transmitancia térmica global y
                      control solar).
                    </p>
                    <p>
                      Los indicadores de calidad en la envolvente térmica se
                      basan en los descritos en la UNE EN ISO 13790:2008 (e
                      ISO/FDIS 52016‐1).
                    </p>
                    <ul>
                      <li>
                        <p>
                          El indicador de{" "}
                          <b>
                            transmitancia térmica global (<i>K</i>)
                          </b>{" "}
                          se basa en el coeficiente global de transmisión de
                          calor (
                          <i>
                            H<sub>tr,adj</sub>
                          </i>
                          , apartado 8.3.1, ec. 17 de la{" "}
                          <i>UNE EN ISO 13790:2008</i> y apartado 6.6.5.2, ec.
                          108 de la <i>ISO/FDIS 52016-1</i>) repercutido por la
                          superficie de intercambio con el exterior.
                        </p>
                        <p>
                          <b>
                            Mide la capacidad global de evitar el intercambio de
                            calor por conducción.
                          </b>
                        </p>
                      </li>
                      <li>
                        <p>
                          El indicador de{" "}
                          <b>
                            control solar (q<sub>sol;jul</sub>)
                          </b>{" "}
                          se basa en el{" "}
                          <i>
                            flujo de calor por ganancias solares, &Phi;
                            <sub>sol;k</sub>
                          </i>
                          , (apartado 11.3.2, ec. 43 de la{" "}
                          <i>UNE EN ISO 13790:2008</i> y apartado 6.5.13.2, ec.
                          69 de la <i>ISO/FDIS 52016-1</i>), despreciando la
                          reirradiación al cielo, repercutido por la superficie
                          útil considerada y considerando activadas las
                          protecciones solares móviles.
                        </p>
                        <p>
                          <b>
                            Mide la posibilidad de controlar las ganancias
                            solares
                          </b>{" "}
                          (incluyendo el uso de dispositivos solares móviles y
                          el efecto de otros obstáculos fijos o remotos).
                        </p>
                      </li>
                    </ul>

                    <p>
                      <small>
                        NOTA: En el indicador de ganancias solares no se han
                        considerado de forma separada las componentes difusa y
                        directa al tener en cuenta el efecto de las
                        obstrucciones solares, siguiendo el criterio de la{" "}
                        <i>UNE EN ISO 13790:2008</i> y no la formulación de la{" "}
                        <i>ISO/FDIS 52016-1</i> (ver ec. 69, apartado 6.5.13.2).
                      </small>
                    </p>
                  </Col>
                  <Col md={4}>
                    <Image
                      fluid
                      alt="Esquema 5R1C EN 13790"
                      src={esquema5R1C}
                    />
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey={2} title="Clima">
                <Row>
                  <Col>
                    <h4>Parámetros climáticos</h4>
                    <p>
                      En la sección de <i>Parámetros</i> se recogen aquellos
                      parámetros de la envolvente térmica relacionados con el
                      clima exterior.
                    </p>
                    <p>
                      La aplicación calcula, para superficies inclinadas y
                      orientadas, los valores de:
                    </p>
                    <ul>
                      <li>
                        <b>
                          Irradiación acumulada mensual (
                          <i>
                            H<sub>sol;m</sub>
                          </i>
                          )
                        </b>
                      </li>
                      <li>
                        <b>
                          Irradiación acumulada en el mes de julio (
                          <i>
                            H<sub>sol;jul</sub>
                          </i>
                          )
                        </b>
                      </li>
                      <li>
                        <b>
                          factor de reducción para sombreamientos solares
                          móviles (
                          <i>
                            f<sub>sh;with</sub>
                          </i>
                          )
                        </b>{" "}
                        de superficies inclinadas y orientadas.
                      </li>
                    </ul>
                    <p>
                      Los cálculos para las distintas orientaciones y climas
                      usan valores obtenidos a partir de los archivos climáticos
                      de referencia del <i>CTE DB-HE</i> y el procedimiento de
                      la norma <i>ISO/FDIS 52010‐1:2016</i>.
                    </p>
                    <p>
                      <Button
                        variant="info"
                        size="xsmall"
                        href="http://www.codigotecnico.org/images/stories/pdf/ahorroEnergia/CTEdatosMET_20140418.zip"
                        target="_blank"
                      >
                        Descargar climas de referencia de codigotecnico.org{" "}
                      </Button>
                      .
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4>Orientaciones de los elementos de la envolvente</h4>
                    <Col md={{ span: 8, offset: 2 }}>
                      <Image
                        fluid
                        alt="Roseta de orientaciones de superficies"
                        src={orientaciones}
                      />
                    </Col>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey={3} title="Elementos">
                <Row>
                  <Col>
                    <h4>Elementos de la envolvente térmica</h4>
                    <p>
                      La aplicación permite obtener algunos parámetros
                      descriptivos del comportamiento térmico de elementos de la
                      envolvente térmica a partir de sus características
                      generales o parámetros de diseño.
                    </p>
                    <p>
                      Por ejemplo, para los huecos se puede obtener: la
                      <i>transmitancia térmica</i> (U<sub>H</sub>), el{" "}
                      <i>factor solar del vidrio a incidencia normal</i> (g
                      <sub>gl;n</sub>), el <i>factor solar del hueco</i> (g
                      <sub>gl;wi</sub>), el{" "}
                      <i>
                        factor solar del hueco teniendo en cuenta los
                        sombreamientos solares móviles
                      </i>
                      (g<sub>gl;sh;wi</sub>).
                    </p>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <Footer />
      </Container>
    );
  }
}
