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
import { Alert, Button, Col, Row } from "react-bootstrap";
import { observer, inject } from "mobx-react";
// import DevTools from 'mobx-react-devtools';

import { hash } from "../utils.js";

import icondownload from "./img/baseline-archive-24px.svg";

class DownloadUpload extends Component {
  render() {
    const errordisplay = this.props.appstate.errors.map((e, idx) => (
      <Alert variant={e.type.toLowerCase()} key={`AlertId${idx}`}>
        {e.msg}
      </Alert>
    ));

    return (
      <Col>
        <Row>
          <Col>
            <p>
              Si ha descargado con anterioridad datos de esta aplicación, puede
              cargarlos de nuevo seleccionando el archivo:
            </p>
            <input
              ref="fileInput"
              type="file"
              onChange={(e) => this.handleUpload(e)}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Alert variant="info">
              <p>
                Puede generar un archivo de datos para su importación a partir
                de un proyecto de la <i>Herramienta unificada LIDER-CALENER</i>{" "}
                usando la herramienta{" "}
                <a href="https://github.com/pachi/hulc2envolventecte">
                  hulc2envolventecte
                </a>
                .
              </p>
              <p>
                Para generar dicho archivo, descargue en su equipo la aplicación{" "}
                <i>hulc2envolventecte</i> (
                <a href="https://github.com/pachi/hulc2envolventecte/releases/download/v1.5.0/hulc2envolventecte.exe">
                  ejecutable para MS-Windows
                </a>
                ,{" "}
                <a href="https://github.com/pachi/hulc2envolventecte/releases/download/v1.5.0/hulc2envolventecte">
                  ejecutable para GNU/Linux
                </a>
                ) y úsela desde la consola de comandos (terminal), indicando
                como parámetro la ruta al directorio del proyecto que quiere
                exportar, y redirija la salida del programa a un archivo:
              </p>
              <code>
                C:\ProyectosCTEyCEE\CTEHE2019\> hulc2envolventecte.exe
                Proyectos\miproyectoHULC/ > archivo_salida.json
              </code>
              <p>
                Alternativamente, en sistemas MS-Windows al pulsar sobre el
                ejecutable se abre una interfaz gráfica en la que puede
                seleccionar el directorio de proyecto HULC sobre el que desea
                trabajar, y en el que se generará el archivo <tt>.json</tt> que
                puede cargar aquí.
              </p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="primary"
              ref="fileDownload"
              className="pull-right"
              onClick={(e) => this.handleDownload(e)}
            >
              <img src={icondownload} alt="Descargar datos de envolvente" />{" "}
              Descargar datos de envolvente
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{errordisplay}</Col>
        </Row>
      </Col>
    );
  }

  handleDownload(_) {
    const contents = this.props.appstate.asJSON;
    const contenthash = hash(contents).toString(16);
    const filename = `EnvolventeCTE-${contenthash}.json`;
    const blob = new Blob([contents], { type: "application/json" });
    const uri = URL.createObjectURL(blob);
    // from http://stackoverflow.com/questions/283956/
    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      // Firefox requires the link to be in the body
      document.body.appendChild(link);
      // Simulate click
      link.click();
      // Remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }

  handleUpload(e) {
    let file;
    if (e.dataTransfer) {
      file = e.dataTransfer.files[0];
    } else if (e.target) {
      file = e.target.files[0];
    }

    const reader = new FileReader();
    reader.onload = (rawdata) => {
      this.props.appstate.loadJSON(rawdata.target.result);
    };
    reader.readAsText(file);
  }
}

export default DownloadUpload = inject("appstate")(observer(DownloadUpload));
