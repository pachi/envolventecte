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
export const LoadData = observer(() => {
  const appstate = useContext(AppState);

  const dropHeight = "100px";
  return (
    <>
      <Row>
        <Col>
          <p className="lead">Carga de datos desde un archivo de EnvolventeCTE</p>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <p>
            Arrastre y suelte en el área inferior o pulse para importar datos
            desde un archivo <b>.json</b> generado anteriormente por
            EnvolventeCTE.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Dropzone
            onDrop={(acceptedFiles, _rejectedFiles, _event) =>
              appstate.handleUpload(acceptedFiles)
            }
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
    </>
  );
});
