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
import { observer } from "mobx-react";
import React, { useContext } from "react";
import { Alert, Button, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppState from "../../stores/AppState";
import IndicatorsPanel from "../indicators/IndicatorsPanel";
import Dropzone from "../ui/DropZone.js";
import Footer from "../ui/Footer";
import imglogo from "../img/logo.svg";
import iconclearmodel from "../img/outline-new_document-24px.svg";
import NavBar from "../ui/Nav";

const MainPage = observer((props) => {
  const appstate = useContext(AppState);

  const handleUpload = (acceptedFiles, _rejectedFiles, _event) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (rawdata) => {
        if (
          file.name.includes("KyGananciasSolares.txt") ||
          file.path.includes("KyGananciasSolares.txt")
        ) {
          appstate.loadData(rawdata.target.result, "FSHOBST");
        } else if (
          file.name.toLowerCase().includes(".ctehexml") ||
          file.path.toLowerCase().includes(".ctehexml")
        ) {
          appstate.loadData(rawdata.target.result, "CTEHEXML");
        } else {
          appstate.loadData(rawdata.target.result, "JSON");
        }
      };
      reader.readAsText(file);
    }
  };

  const dropHeight = "100px";
  return (
    <Container fluid>
      <NavBar route={props.route} />
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
                  <Link to="/building">Edificio</Link>: visualizar, introducir,
                  editar los componentes de la envolvente térmica del edificio.
                </li>
                <li>
                  <Link to="/constructions">Construcción</Link>: visualizar,
                  introducir, editar los materiales y construcciones usados en
                  el modelo.
                </li>
                <li>
                  <Link to="/climate">Clima</Link>: explorar diversos parámetros
                  relacionados con el clima exterior del edificio.
                </li>
                <li>
                  <Link to="/helpers">Cálculos</Link>: ayudas para el cálculo de
                  parámetros descriptivos de algunos elementos de la envolvente
                  térmica.
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>
                Parámetros de eficiencia energética de la envolvente térmica
              </h3>
              <p>Resultados obtenidos para el modelo actual:</p>
              <IndicatorsPanel />
              <Alert variant="info">
                Pulse en el botón de &quot;Detalles&quot; para más información.
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Carga de datos</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Opción 1: modelo nuevo</h4>
              <p>
                Pulse este botón para partir de un modelo vacío en el que
                introducir de cero los elementos de la envolvente térmica:
              </p>
              <div className="d-grid">
                <Button
                  variant="secondary"
                  onClick={(_e) => appstate.clearModel()}
                  title="Pulse para dejar el modelo actual vacío, sin elementos definidos"
                  style={{
                    fontSize: 20,
                    height: 50,
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <img src={iconclearmodel} alt="Limpiar modelo" /> Modelo vacío
                </Button>
              </div>
            </Col>
          </Row>
          <Row className="my-3">
            <Col>
              <h4>Opción 2: cargar modelo desde archivo de EnvolventeCTE</h4>
              <p>
                Arrastre y suelte en el área inferior o pulse para importar
                datos desde un archivo <b>.json</b> generado anteriormente por
                EnvolventeCTE.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Dropzone
                onDrop={handleUpload}
                accept={{ "application/json": [".json"] }}
                message={
                  <>
                    <h3>EnvolventeCTE</h3>
                    <p className="text-center">
                      Importar modelo nuevo desde archivo <i>.json</i>
                    </p>
                  </>
                }
                containerHeight={dropHeight}
              />
            </Col>
          </Row>
          <Row className="my-3">
            <Col>
              <h4>
                Opción 3: importar modelo y/o factores de sombras remotas desde
                archivo de HULC
              </h4>
              <p>
                Arrastre y suelte en el área inferior o pulse para importar
                datos desde un archivo <b>.ctehexml</b> o un archivo{" "}
                <b>KyGananciasSolares.txt</b> de HULC. Este último solo importa
                los factores de sombras remotas al modelo ya cargado,
                modificando la propiedad correspondiente de los huecos.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Dropzone
                onDrop={handleUpload}
                accept={{ "application/octet-stream": [".ctehexml"] }}
                message={
                  <>
                    <h3>HULC</h3>
                    <p className="text-center">
                      Importar modelo nuevo desde archivo <i>.ctehexml</i>
                    </p>
                  </>
                }
              />
            </Col>
            <Col
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                fontSize: 40,
              }}
            >
              +
            </Col>
            <Col md={3}>
              <Dropzone
                onDrop={handleUpload}
                accept={{ "text/plain": [".txt"] }}
                message={
                  <>
                    <h3>HULC</h3>
                    <p className="text-center">
                      Importar <b>solo</b> F<sub>sh;obst</sub> desde archivo{" "}
                      <i>KyGananciasSolares.txt</i>
                    </p>
                  </>
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
});

export default MainPage;
