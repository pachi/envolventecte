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

import { APP_VERSION } from "../../version.js";
import React from "react";
import { Alert, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Page } from "../ui/Page.js";
import imglogo from "../img/logo.svg";

const MainPage = () => {
  return (
    <Page>
      <Row>
        <Col md={3} className="text-center">
          <Image src={imglogo} width="90%" />
          <Alert variant="warning">
            <b>NOTA:</b> Esta aplicación y la información contenida en ella{" "}
            <b>no tienen valor reglamentario</b>.
          </Alert>
        </Col>
        <Col md={9}>
          <Row>
            <Col>
              <h1>
                EnvolventeCTE <small>(v.{APP_VERSION})</small>
              </h1>
              <p>
                Aplicación para el cálculo de indicadores de calidad y
                parámetros descriptivos de la envolvente térmica de los
                edificios para la evaluación energética y aplicación del CTE
                DB-HE (2019):
              </p>
              <ul>
                <li>
                  <b>transmitancia térmica global</b> (<b>K</b>)
                </li>
                <li>
                  <b>tasa de renovación de aire a 50 Pa</b> (
                  <b>
                    n<sub>50</sub>
                  </b>
                  ) y valor de referencia (n<sub>50,ref</sub>)
                </li>
                <li>
                  <b>parámetro de control solar</b> (
                  <b>
                    q<sub>sol;jul</sub>
                  </b>
                  )
                </li>
                <li>
                  área útil a efectos del cálculo de indicadores energéticos (A
                  <sub>util</sub>), compacidad (<b>V/A</b>) , volumen bruto (
                  <b>V</b>) , volumen neto (
                  <b>
                    V<sub>int</sub>
                  </b>
                  ), ...
                </li>
              </ul>

              <p>Los distintos apartados del programa permiten:</p>
              <ul>
                <li>
                  <Link to="/project">Proyecto</Link>: cargar datos, visualizar
                  y editar los datos generales del modelo.
                </li>
                <li>
                  <Link to="/elements">Elementos</Link>: visualizar, introducir,
                  editar los espacios y superficies del edificio y su envolvente
                  térmica.
                </li>
                <li>
                  <Link to="/constructions">Construcción</Link>: visualizar,
                  introducir, editar los materiales y construcciones usados en
                  el modelo.
                </li>
                <li>
                  <Link to="/uses">Usos</Link>: visualizar,
                  introducir, editar las cargas y condiciones operacionales de
                  los espacios del modelo.
                </li>
                <li>
                  <Link to="/3d">Vista3D</Link>: explorar visualmente el modelo.
                </li>
                <li>
                  <Link to="/reports">Construcción</Link>: mostrar una
                  evaluación de los indicadores de eficiencia energética del
                  modelo o sus mediciones.
                </li>
                <li>
                  <Link to="/helpers">Ayudas</Link>: herramientas para el
                  cálculo de parámetros descriptivos de algunos elementos de la
                  envolvente térmica y visualización de datos climáticos.
                </li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    </Page>
  );
};

export default MainPage;
