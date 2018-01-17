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

import React, { Component } from 'react';
import { Alert, Button, Col, Grid, Row, Image, Tabs, Tab } from 'react-bootstrap';

import Footer from './Footer';
import NavBar from './Nav';

import esquema5R1C from './5R1C.svg';
import orientaciones from './orientaciones.svg';

export default class HelpPage extends Component {
  render() {
    return (
      <Grid>
        <NavBar route={ this.props.route } />
        <Row>
        <h1>Indicadores de envolvente térmica y valores de radiación solar para la aplicación del CTE DB-HE</h1>
          <Alert bsStyle="warning"><b>NOTA:</b> Esta aplicación y la información contenida en ella no tiene valor reglamentario.</Alert>
        </Row>
        <Row>
          <Tabs>
            <Tab eventKey={1} title="Indicadores">
              <Row>
                <h3>Indicadores de calidad de la envolvente térmica</h3>
              </Row>
              <Row>
                <Col md={8}>
                <p>Los indicadores de calidad en la envolvente térmica se basan en los descritos en la UNE EN ISO 13790:2008 (e ISO/FDIS 52016‐1).</p>
                <ul>
                  <li>
                    <p>El indicador de <b>transmitancia térmica global (<i>K</i>)</b> se basa en el coeficiente global de transmisión de calor (<i>H<sub>tr,adj</sub></i>, apartado 8.3.1, ec. 17 de UNE EN ISO 13790:2008 y apartado 6.6.5.2, ec. 108 de la ISO/FDIS 52016-1) repercutido por la superficie de intercambio con el exterior.</p>
                    <p><b>Mide la capacidad global de evitar el intercambio de calor por conducción.</b></p>
                  </li>
                  <li>
                    <p>El indicador de <b>control solar (q<sub>sol;jul</sub>)</b> se basa en el <i>flujo de calor por ganancias solares, &Phi;<sub>sol;k</sub></i>, (apartado 11.3.2, ec. 43 de la UNE EN ISO 13790:2008 y apartado 6.5.13.2, ec. 69 de la ISO/FDIS 52016-1), despreciando la reirradiación al cielo, repercutido por la superficie útil considerada y considerando activadas las protecciones solares móviles.</p>
                    <p><b>Mide la posibilidad de controlar las ganancias solares</b> (incluyendo el uso de dispositivos solares móviles y el efecto de otros obstáculos fijos o remotos).</p>
                  </li>
                </ul>

                <p><small>NOTA: En el indicador de ganancias solares no se han considerado de forma separada las componentes difusa y directa al tener en cuenta el efecto de las obstrucciones solares, siguiendo el criterio de la UNE EN ISO 13790:2008 y no la formulación de la ISO/FDIS 52016-1 (ver ec. 69, apartado 6.5.13.2).</small></p>
                </Col>
                <Col md={4}>
                  <Image responsive alt="Esquema 5R1C EN 13790" src={esquema5R1C} />
                </Col>
              </Row>
            </Tab>
            <Tab eventKey={2} title="Radiación">
              <Row>
                <h3>Datos de radiación por superficies</h3>

                <p>La aplicación calcula, para superficies inclinadas y orientadas, los valores de:</p>
                <ul>
                  <li><b>Irradiación acumulada mensual (<i>H<sub>sol;m</sub></i>)</b>, incluyendo la <b>irradiación acumulada en el mes de julio (<i>H<sub>sol;jul</sub></i>)</b></li>
                  <li><b>factor de reducción para sombreamientos solares móviles (<i>f<sub>sh;with</sub></i>)</b> de superficies inclinadas y orientadas.</li>
                </ul>
                <p>Los cálculos para las distintas orientaciones y climas usan valores obtenidos
                  a partir de los archivos climáticos de referencia de CTE DB-HE y el procedimiento
                  de la norma ISO/FDIS 52010‐1:2016. <Button bsStyle="info" bsSize="xsmall"
                    href="http://www.codigotecnico.org/images/stories/pdf/ahorroEnergia/CTEdatosMET_20140418.zip"
                    target="_blank">
                    Descargar climas de referencia de codigotecnico.org </Button>.
                </p>
              </Row>
              <Row>
                <Col md={8} mdOffset={2}>
                  <Image responsive alt="Roseta de orientaciones de superficies" src={orientaciones} />
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Row>
        <Footer/>
      </Grid>
    );
  }
}
