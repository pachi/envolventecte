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
import { Alert, Grid, Row, Well } from 'react-bootstrap';

import Footer from './Footer';
import NavBar from './Nav';

export default class AboutPage extends Component {
  render() {
    return <Grid>
        <NavBar route={this.props.route} />
        <Row>
          <h1>Equipo de desarrollo:</h1>
          <ul>
            <li>
              Rafael Villar Burke, <i>pachi@ietcc.csic.es</i>
            </li>
            <li>
              Daniel Jiménez González, <i>danielj@ietcc.csic.es</i>
            </li>
            <li>
              Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i>
            </li>
          </ul>
        </Row>
        <Row>
          <Alert bsStyle="warning">
            <b>NOTA:</b> Esta aplicación y la información contenida en ella no tiene valor reglamentario.
          </Alert>
        </Row>
        <Row>
          <p>
            Esta aplicación es software libre y se distribuye con licencia
            MIT, que permite su uso, modificación y redistribución mientras
            se mantenga el copyright.
          </p>
          <p>
            El código está disponible en <a href="https://github.com/pachi/solarcte">
              https://github.com/pachi/solarcte
            </a>
          </p>
        </Row>
        <Row>
          <Well>
            <p className="lead">The MIT License (MIT)</p>
            <p>
              Copyright (c) 2018 Rafael Villar Burke, Daniel Jiménez
              González, Marta Sorribes Gil
            </p>

            <p>
              Permission is hereby granted, free of charge, to any person
              obtaining a copy of this software and associated documentation
              files (the "Software"), to deal in the Software without
              restriction, including without limitation the rights to use,
              copy, modify, merge, publish, distribute, sublicense, and/or
              sell copies of the Software, and to permit persons to whom the
              Software is furnished to do so, subject to the following
              conditions:
            </p>

            <p>
              The above copyright notice and this permission notice shall be
              included in all copies or substantial portions of the
              Software.
            </p>

            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
              KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
              COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
              OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
              SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </Well>
        </Row>
        <Footer />
      </Grid>;
  }
}
