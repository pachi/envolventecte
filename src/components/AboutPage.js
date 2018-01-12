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
import { Alert, Grid, Row } from 'react-bootstrap';

import NavBar from './Nav';

export default class AboutPage extends Component {
  render() {
    return (
      <Grid>
        <NavBar route={ this.props.route } />
        <Row>
          <h1>Radiación solar en superficies orientadas e indicadores de envolvente térmica</h1>
          <p className="lead">Cálculos de radiación solar para la aplicación del CTE DB-HE</p>
          <Alert bsStyle="warning"><b>NOTA:</b> Esta aplicación y la información contenida en ella no tiene valor reglamentario.</Alert>
        </Row>
        <Row>
          <h3>Equipo de desarrollo:</h3>
          <ul>
            <li>Rafael Villar Burke, <i>pachi@ietcc.csic.es</i></li>
            <li>Daniel Jiménez González, <i>danielj@ietcc.csic.es</i></li>
            <li>Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i></li>
          </ul>
        </Row>
      </Grid>
    );
  }
}
