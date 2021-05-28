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

import React, { useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
// import DevTools from 'mobx-react-devtools';

import AppState from "../stores/AppState";
import Dropzone from "./DropZone.js";

import iconclearmodel from "./img/outline-new_document-24px.svg";

const DownloadUpload = observer(() => {
  const appstate = useContext(AppState);

  const handleUpload = (acceptedFiles, rejectedFiles, event) => {
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

  return (
    <Col>
      <Row>
        <Col>
          <p>
            Arrastre y suelte en el área inferior o pulse para importar datos:
          </p>
          <ul>
            <li>
              desde un archivo <b>.json</b> generado por EnvolventeCTE
            </li>
            <li>
              desde un archivo <b>.ctehexml</b> de HULC
            </li>
            <li>
              desde un archivo <b>KyGananciasSolares.txt</b> de HULC
              (importación de factores de sombras remotas de los huecos).
            </li>
          </ul>
          <Dropzone onDrop={handleUpload} />
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Para empezar con un modelo vacío pulse en el botón:</p>
          <p>
            <Button
              variant="secondary"
              block
              onClick={(_e) => appstate.clearModel()}
            >
              <img src={iconclearmodel} alt="Limpiar modelo" /> Comenzar con
              modelo vacío
            </Button>
          </p>
        </Col>
      </Row>
    </Col>
  );
});

export default DownloadUpload;
