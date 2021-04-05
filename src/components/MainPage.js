/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

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
import { Alert, Col, Container, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import Footer from "./Footer";
import NavBar from "./Nav";

import imglogo from "./img/logo.svg";

const HelpPage = (props) => (
  <Container fluid>
    <NavBar route={props.route} />
    <Row>
      <Col md={3}>
        <Image src={imglogo} width="90%" />
      </Col>
      <Col md={9}>
        <h1>Envolvente CTE</h1>
        <h3>Parámetros de eficiencia energética de la envolvente térmica</h3>
        <p>
          Esta aplicación facilita el cálculo de indicadores de calidad y
          parámetros descriptivos de la envolvente térmica de los edificios para
          su evaluación energética y para la aplicación del CTE DB-HE (2019).
        </p>
        <p>
          Puede comenzar introduciendo la{" "}
          <b>descripción de la envolvente térmica y sus elementos</b> en el
          apartado <Link to="/building">Edificio</Link> y seleccionando la{" "}
          <b>zona climática</b> en el desplegable del menú superior.
        </p>
        <p>
          El apartado <Link to="/building">Edificio</Link> muestra en un panel
          el valor actualizado y el desglose del cálculo de la{" "}
          <b>transmitancia térmica global</b> (<b>K</b>) y del{" "}
          <b>parámetro de control solar</b> (
          <b>
            q<sub>sol;jul</sub>
          </b>
          ) de la envolvente definida.
        </p>
        <p>
          Como ayuda para completar la descripción de la envolvente térmica
          puede consultar:
        </p>
        <ul>
          <li>
            el apartado <Link to="/climate">Clima</Link>, para aquellos
            parámetros relacionados con el clima exterior del edificio.
          </li>
          <li>
            el apartado <Link to="/elements">Elementos</Link>, para parámetros
            de elementos de la envolvente térmica que se pueden obtener a partir
            de otros parámetros básicos.
          </li>
        </ul>
      </Col>
    </Row>
    <Row>
      <Alert variant="warning">
        <b>NOTA:</b> Esta aplicación y la información contenida en ella no tiene
        valor reglamentario.
      </Alert>
    </Row>
    <Footer />
  </Container>
);

export default HelpPage;
