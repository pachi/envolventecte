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
import { Button, Grid, Alert } from 'react-bootstrap';

import NavBar from './Nav';

export default class AboutPage extends Component {
  render() {
    return (
      <div>
        <NavBar route={ this.props.route } />
        <Grid>
          <h1>Radiación solar en superficies orientadas e indicadores de envolvente térmica</h1>
          <p className="lead">Cálculos de radiación solar para la aplicación del CTE DB-HE</p>
          <Alert bsStyle="warning"><b>NOTA:</b> Esta aplicación y la información contenida en ella no tiene valor reglamentario.</Alert>
          <h3>Datos de radiación por superficies</h3>
          <p>
            Esta aplicación usa datos de radiación precalculados para las distintas orientaciones y climas, a partir de los archivos climáticos de referencia de CTE DB-HE y el procedimiento de la norma ISO/FDIS 52010‐1:2016.</p>
          <p>
            <Button
                bsStyle="success"
                bsSize="small"
                href="http://www.codigotecnico.org/images/stories/pdf/ahorroEnergia/CTEdatosMET_20140418.zip"
                target="_blank">
              Descargar climas de referencia de codigotecnico.org
            </Button>
          </p>
          <h3>Indicadores de la envolvente térmica</h3>
          <p>Los indicadores de calidad en la envolvente térmica se basan en los descritos en la UNE EN ISO 13790:2008 (e ISO/FDIS 52016‐1).</p>

          <p>El indicador de <b>transmitancia térmica global (<i>K</i>)</b> se basa en el coeficiente global de transmisión de calor (<i>H<sub>tr,adj</sub></i>, apartado 8.3.1, ec. 17 de UNE EN ISO 13790:2008 y apartado 6.6.5.2, ec. 108 de la ISO/FDIS 52016-1) repercutido por la superficie de intercambio con el exterior.</p>
          <p>El indicador de <b>ganancias solares (q<sub>sol;jul</sub>)</b> se basa en el flujo de calor por ganancias solares (&Phi;<sub>sol;k</sub>, apartado 11.3.2, ec. 43 de la UNE EN ISO 13790:2008 y apartado 6.5.13.2, ec. 69 de la ISO/FDIS 52016-1), despreciando la reirradiación al cielo, y repercutido por la superficie útil considerada.</p>

          <p><small>En este último indicador no se han considerado de forma separada las componentes difusa y directa al tener en cuenta el efecto de las obstrucciones solares, siguiendo el criterio de la UNE EN ISO 13790:2008 y no la formulación de la ISO/FDIS 52016-1 (ver ec. 69, apartado 6.5.13.2).</small></p>
        </Grid>
        <Grid>
          <h3>Equipo de desarrollo:</h3>
          <ul>
            <li>Rafael Villar Burke, <i>pachi@ietcc.csic.es</i></li>
            <li>Daniel Jiménez González, <i>danielj@ietcc.csic.es</i></li>
            <li>Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i></li>
          </ul>
        </Grid>
      </div>
    );
  }
};
