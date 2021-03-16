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

import React, { useContext } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
// import DevTools from 'mobx-react-devtools';

import { hash } from "../utils.js";

import AppState from "../stores/AppState";
import Dropzone from "./DropZone.js";

import icondownload from "./img/baseline-archive-24px.svg";

const DownloadUpload = observer(() => {
  const appstate = useContext(AppState);

  const handleDownload = (e) => {
    const contents = appstate.asJSON;
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
  };

  const handleUpload = (acceptedFiles, rejectedFiles, event) => {
    console.log(
      "Aceptados: ",
      acceptedFiles,
      ", Rechazados: ",
      rejectedFiles,
      ", evento: ",
      event
    );
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (rawdata) => {
        appstate.loadJSON(rawdata.target.result);
      };
      reader.readAsText(file);
    }
  };

  const fileDownload = React.createRef();

  return (
    <Col>
      <Row>
        <Col>
          <p>
            Si ha descargado con anterioridad datos de esta aplicación, puede
            cargarlos de nuevo arranstrando el archivo o pulsando para
            seleccionarlo:
          </p>
          <Dropzone onDrop={handleUpload} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Alert variant="info">
            <p>
              Puede generar un archivo de datos para su importación a partir de
              un proyecto de la <i>Herramienta unificada LIDER-CALENER</i>{" "}
              usando la herramienta{" "}
              <a href="https://github.com/pachi/hulc2envolventecte">
                hulc2envolventecte
              </a>
              .
            </p>
            <p>
              Para generar dicho archivo, descargue en su equipo la aplicación{" "}
              <i>hulc2envolventecte</i> (
              <a href="https://github.com/pachi/hulc2envolventecte/releases/download/v2.2.0/hulc2envolventecte.exe">
                ejecutable para MS-Windows
              </a>
              ,{" "}
              <a href="https://github.com/pachi/hulc2envolventecte/releases/download/v2.2.0/hulc2envolventecte">
                ejecutable para GNU/Linux
              </a>
              ) y úsela desde la consola de comandos (terminal), indicando como
              parámetro la ruta al directorio del proyecto que quiere exportar,
              y redirija la salida del programa a un archivo:
            </p>
            <code>
              C:\ProyectosCTEyCEE\CTEHE2019\&gt; hulc2envolventecte.exe
              Proyectos\miproyectoHULC/ &gt; archivo_salida.json
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
            ref={fileDownload}
            className="pull-right"
            onClick={(e) => handleDownload(e)}
          >
            <img src={icondownload} alt="Descargar datos de envolvente" />{" "}
            Descargar datos de envolvente
          </Button>
        </Col>
      </Row>
    </Col>
  );
});

export default DownloadUpload;
