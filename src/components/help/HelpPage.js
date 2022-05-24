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

import React from "react";
import {
  Alert,
  Button,
  Col,
  Row,
  Image,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { Page } from "../ui/Page";

import esquema5R1C from "../img/5R1C.svg";
import orientaciones from "../img/orientaciones.svg";

const HelpPage = () => (
  <Page>
    <Row>
      <Col>
        <h1>EnvolventeCTE</h1>
        <p>
          <i>EnvolventeCTE</i> es una aplicación web de ayuda al cálculo de
          indicadores de calidad y parámetros descriptivos de la envolvente
          térmica de los edificios para la evaluación energética y facilitar la
          aplicación del CTE DB-HE (2019).
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
            <b>Relación de cambio de aire a 50Pa</b> (
            <b>
              n<sub>50</sub>
            </b>
            )
          </li>
          <li>
            <b>área útil</b> a efectos del cálculo de indicadores energéticos (A
            <sub>útil</sub>), <b>compacidad</b> (V/A) , <b>volumen</b> bruto (V)
            , volumen neto (V<sub>int</sub>), ...
          </li>
          <li>
            <b>
              Parámetros descriptivos de los elementos de la envolvente térmica
            </b>{" "}
            (<b>U</b>, <b>g</b>, <b>&psi;</b>...)
          </li>
        </ul>
        <p>
          Los distintos apartados del programa permiten introducir y editar los
          componentes de la envolvente térmica del edificio, sus construcciones
          y materiales y los datos generales del proyecto (zona climática y
          otros), pudiendo visualizar una imagen 3D del modelo y obtener
          informes sobre el comportamiento energético y de las mediciones del
          modelo.
        </p>
        <p>
          Esta información puede también importarse desde otros programas,
          permitiendo en la actualidad archivos <b>.ctehexml</b> de la
          Herramienta Unificada LIDER-CALENER (HULC) o archivos <b>.json</b>{" "}
          propios.
        </p>
        <p>
          Además, el apartado de <Link to="/helpers">Ayudas</Link> proporciona
          utilidades para el cálculo de parámetros descriptivos de algunos
          elementos de la envolvente térmica a partir de sus características.
        </p>
        <p>Los campos pueden ser editados haciendo doble click sobre ellos.</p>

        <Alert variant="warning">
          <b>NOTA:</b> Esta aplicación y la información contenida en ella no
          tienen valor reglamentario.
        </Alert>
      </Col>
    </Row>
    <Row>
      <Col>
        <Tabs>
          <Tab eventKey={1} title="Proyecto" className="pt-3">
            <Row>
              <Col>
                <h4>Datos generales de proyecto</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Este apartado recoge datos y metadatos generales del proyecto.
                </p>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey={2} title="Elementos" className="pt-3">
            <Row>
              <Col>
                <h4>Espacios y superficies</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Este apartado recoge la definición geométrica y constructiva
                  de los espacios y elementos (opacos, huecos, puentes térmicos
                  y elementos de sombra) que configuran el modelo.
                </p>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey={3} title="Construcción" className="pt-3">
            <Row>
              <Col>
                <h4>Construcciones y materiales</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Este apartado recoge los tipos de construcciones de huecos y
                  opacos, así como materiales, vidrios y tipos de marco usados
                  en el modelo.
                </p>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey={4} title="Vista3D" className="pt-3">
            <Row>
              <Col>
                <h4>Visualización 3D</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Este apartado muestra una imagen tridimensional e interactiva
                  del modelo.
                </p>
                <p>
                  Permite explorar, activar, desactivar y cambiar el modo de
                  visualización de las distintas superficies.
                </p>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey={5} title="Informes" className="pt-3">
            <Row>
              <Col>
                <h4>HE1 - Indicadores de calidad de la envolvente térmica</h4>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <p>
                  Este apartado muestra un informe de indicadores y parámetros
                  de caracterizacion de la envolvente térmica (transmitancia
                  térmica global, control solar, permeabilidad al aire).
                </p>
                <p>
                  Los indicadores de calidad en la envolvente térmica se basan
                  en los definidos en el CTE HE 2019 y basados en otros
                  descritos en la UNE EN ISO 52016‐1.
                </p>
              </Col>
              <Col md={4}>
                <Image fluid alt="Esquema 5R1C EN 13790" src={esquema5R1C} />
              </Col>
            </Row>
          </Tab>
          <Tab eventKey={6} title="Clima" className="pt-3">
            <Row>
              <Col>
                <h4>Parámetros climáticos</h4>
                <p>
                  En la sección de <i>Parámetros</i> se recogen aquellos
                  parámetros de la envolvente térmica relacionados con el clima
                  exterior.
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
                      factor de reducción para sombreamientos solares móviles (
                      <i>
                        f<sub>sh;with</sub>
                      </i>
                      )
                    </b>{" "}
                    de superficies inclinadas y orientadas.
                  </li>
                </ul>
                <p>
                  Los cálculos para las distintas orientaciones y climas usan
                  valores obtenidos a partir de los archivos climáticos de
                  referencia del <i>CTE DB-HE</i> y el procedimiento de la norma{" "}
                  <i>UNE-EN ISO 52010‐1:2017</i>.
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
          <Tab eventKey={7} title="Ayudas" className="pt-3">
            <Row>
              <Col>
                <h4>Elementos de la envolvente térmica</h4>
                <p>
                  La aplicación permite obtener algunos parámetros descriptivos
                  del comportamiento térmico de elementos de la envolvente
                  térmica a partir de sus características generales o parámetros
                  de diseño.
                </p>
                <p>
                  Por ejemplo, para los huecos se puede obtener: la
                  <i>transmitancia térmica</i> (U<sub>H</sub>), el{" "}
                  <i>factor solar del vidrio a incidencia normal</i> (g
                  <sub>gl;n</sub>), el <i>factor solar del hueco</i> (g
                  <sub>gl;wi</sub>), el{" "}
                  <i>
                    factor solar del hueco teniendo en cuenta los sombreamientos
                    solares móviles
                  </i>
                  (g<sub>gl;sh;wi</sub>).
                </p>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Col>
    </Row>
  </Page>
);

export default HelpPage;
