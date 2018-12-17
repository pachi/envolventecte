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
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { observer, inject } from "mobx-react";
// import DevTools from 'mobx-react-devtools';

import { hash, UserException } from "../utils.js";

import icondownload from "./img/baseline-archive-24px.svg";

class DownloadUpload extends Component {
  render() {
    const errordisplay = this.props.appstate.errors.map((e, idx) => (
      <Alert variant={e.type.toLowerCase()} key={`AlertId${idx}`}>
        {e.msg}
      </Alert>
    ));

    return (
      <Container className="top20">
        <Row>
          <Col>
            <p>
              Si ha descargado con anterioridad datos de esta aplicación, puede
              cargarlos de nuevo seleccionando el archivo:
            </p>
            <input
              ref="fileInput"
              type="file"
              onChange={e => this.handleUpload(e)}
            />
          </Col>
        </Row>
        <Row className="top20">
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
                <a href="https://github.com/pachi/hulc2envolventecte/releases/download/v1.3/hulc2envolventecte.exe">
                  ejecutable para MS-Windows
                </a>
                ,{" "}
                <a href="https://github.com/pachi/hulc2envolventecte/releases/download/v1.3/hulc2envolventecte">
                  ejecutable para GNU/Linux
                </a>
                ) y úsela desde la consola de comandos (terminal), indicando
                como parámetro la ruta al directorio del proyecto que quiere
                exportar, y redirija la salida del programa a un archivo:
              </p>
              <code>
                C:\ProyectosCTEyCEE\CTEHE2018\> hulc2envolventecte.exe
                Proyectos\miproyectoHULC/ > archivo_salida.json
              </code>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="primary"
              ref="fileDownload"
              className="pull-right"
              onClick={e => this.handleDownload(e)}
            >
              <img src={icondownload} alt="Descargar datos de envolvente" />{" "}
              Descargar datos de envolvente
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{errordisplay}</Col>
        </Row>
      </Container>
    );
  }

  handleDownload(_) {
    const { Autil, envolvente } = this.props.appstate;
    const { clima } = this.props.radstate;
    const contents = JSON.stringify({ Autil, clima, envolvente }, null, 2);
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
    reader.onload = rawdata => {
      try {
        const { Autil, clima = "D3", envolvente } = JSON.parse(
          rawdata.target.result
        );
        const { huecos, opacos, pts } = envolvente;
        if (
          !(
            Autil &&
            envolvente &&
            Array.isArray(huecos) &&
            Array.isArray(opacos) &&
            Array.isArray(pts)
          )
        ) {
          throw UserException("Formato incorrecto");
        }
        this.props.radstate.clima = clima;
        this.props.appstate.Autil = Number(Autil);
        this.props.appstate.envolvente = envolvente;
        this.props.appstate.errors = [
          { type: "SUCCESS", msg: "Datos cargados correctamente." },
          {
            type: "INFO",
            msg:
              `Autil: ${Autil} m², Elementos: ` +
              `${huecos.length} huecos, ${opacos.length} opacos, ${
                pts.length
              } PTs.`
          }
        ];
      } catch (err) {
        this.props.appstate.errors = [
          {
            type: "DANGER",
            msg: "El archivo no contiene datos con un formato adecuado."
          }
        ];
      }
    };
    reader.readAsText(file);
  }
}

export default (DownloadUpload = inject("appstate", "radstate")(
  observer(DownloadUpload)
));
