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
import { Alert, Col, Container, Image, Row } from "react-bootstrap";

import Footer from "./Footer";
import NavBar from "./Nav";
import FotoPachi from "./img/FotoPachi.jpg";
import FotoDani from "./img/FotoDani.jpg";
import FotoMarta from "./img/FotoMarta.jpg";

export default class AboutPage extends Component {
  render() {
    return (
      <Container fluid>
        <NavBar route={this.props.route} />
        <Row>
          <Col>
            <Alert variant="warning">
              <b>NOTA:</b> Esta aplicación y la información contenida en ella no
              tienen valor reglamentario.
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Equipo de desarrollo:</h2>
            <p>
              Grupo de <i>Ahorro de Energía y Sostenibilidad</i> de la{" "}
              <i>Unidad de Calidad en la Construcción</i> del{" "}
              <a href="https://ietcc.csic.es">
                Instituto Eduardo Torroja de Ciencias de la Construcción
                (IETcc-CSIC)
              </a>{" "}
              del <i>Consejo Superior de Investigaciones Científicas (CSIC)</i>.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 2, offset: 3 }}>
            <Image responsive alt="Rafael Villar Burke" src={FotoPachi} />
            <p>
              Rafael Villar Burke (pachi), <i>pachi@ietcc.csic.es</i>
            </p>
          </Col>
          <Col md={2}>
            <Image responsive alt="Daniel Jiménez González" src={FotoDani} />
            <p>
              Daniel Jiménez González, <i>danielj@ietcc.csic.es</i>
            </p>
          </Col>
          <Col md={2}>
            <Image responsive alt="Marta Sorribes Gil" src={FotoMarta} />
            <p>
              Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Licencia:</h2>
            <p>
              Esta aplicación es software libre y se distribuye con licencia
              MIT, que permite su uso, modificación y redistribución mientras se
              mantenga el copyright.
            </p>
            <p>
              El código está disponible en{" "}
              <a href="https://github.com/pachi/envolventecte">
                https://github.com/pachi/envolventecte
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="secondary">
              <p className="lead">The MIT License (MIT)</p>
              <p>
                Copyright (c) 2018 Rafael Villar Burke
                &lt;pachi&#64;ietcc.csic.es&gt;, Daniel Jiménez González
                &lt;danielj&#64;ietcc.csic.es&gt;, Marta Sorribes Gil
                &lt;msorribes&#64;ietcc.csic.es&gt;
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
                included in all copies or substantial portions of the Software.
              </p>

              <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </Alert>
          </Col>
        </Row>
        <Footer />
      </Container>
    );
  }
}
