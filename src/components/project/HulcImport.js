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

import React, { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import Dropzone from "../ui/DropZone.js";

// Vista de elementos de sombra del edificio
export const HulcImport = observer(() => {
  const appstate = useContext(AppState);

  return (
    <>
      <Row>
        <Col>
          <p className="lead">
            Importación de un nuevo modelo o de los factores de sombras remotas
            desde archivo de HULC
          </p>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <p>
            Arrastre y suelte en el área inferior o pulse para importar datos
            desde un archivo <b>.ctehexml</b> de HULC.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Dropzone
            onDrop={(acceptedFiles, _rejectedFiles, _event) =>
              appstate.handleUpload(acceptedFiles)
            }
            accept={{ "application/octet-stream": [".ctehexml"] }}
            message={
              <>
                <h3>Importación .ctehexml de HULC</h3>
                <p className="text-center">
                  Importar y cargar nuevo modelo desde un archivo{" "}
                  <i>.ctehexml</i> de HULC
                </p>
              </>
            }
          />
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <p>
            Arrastre y suelte en el área inferior o pulse para importar los
            factores de sombras remotas al modelo ya cargado desde un archivo{" "}
            <b>KyGananciasSolares.txt</b> de HULC. Se sustituirán los valores
            correspondientes de los huecos.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Dropzone
            onDrop={(acceptedFiles, _rejectedFiles, _event) =>
              appstate.handleUpload(acceptedFiles)
            }
            accept={{ "text/plain": [".txt"] }}
            message={
              <>
                <h3>Archivo KyGananciasSolares.txt de HULC</h3>
                <p className="text-center">
                  Importa datos del factor de sombras remotas, F
                  <sub>sh;obst</sub>, desde el archivo{" "}
                  <i>KyGananciasSolares.txt</i>
                </p>
              </>
            }
          />
        </Col>
      </Row>
    </>
  );
});
