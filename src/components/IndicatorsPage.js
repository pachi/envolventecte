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
import {
  Alert,
  Button,
  Glyphicon,
  Grid,
  Panel,
  Row,
  Tabs,
  Tab
} from "react-bootstrap";

import { observer, inject } from "mobx-react";
// import DevTools from 'mobx-react-devtools';

import Footer from "./Footer";
import HuecosTable from "./HuecosTable";
import IndicatorsPanel from "./IndicatorsPanel";
import NavBar from "./Nav";
import OpacosTable from "./OpacosTable";
import PTsTable from "./PTsTable";
import { hash, UserException } from "../utils.js";

class IndicatorsPage extends Component {
  render() {
    const {
      Autil,
      envolvente,
      huecosA,
      huecosAU,
      K,
      opacosA,
      opacosAU,
      ptsL,
      ptsPsiL,
      qsj,
      Qsoljul,
      totalA,
      totalAU,
      errors
    } = this.props.appstate;
    const { climateTotRadJul } = this.props.radstate;

    const errordisplay = errors.map((e, idx) => (
      <Alert bsStyle={e.type.toLowerCase()} key={`AlertId${idx}`}>
        {e.msg}
      </Alert>
    ));
    return (
      <Grid>
        <NavBar route={this.props.route} />
        <Row>
          <IndicatorsPanel
            {...{
              Autil,
              huecosA,
              huecosAU,
              opacosA,
              opacosAU,
              ptsPsiL,
              totalA,
              totalAU,
              K,
              Qsoljul,
              qsj,
              climateTotRadJul
            }}
          />
        </Row>
        <Row>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Huecos">
              <HuecosTable
                huecos={envolvente.huecos}
                {...{ huecosA, huecosAU }}
              />
            </Tab>
            <Tab eventKey={2} title="Opacos">
              <OpacosTable
                opacos={envolvente.opacos}
                {...{ opacosA, opacosAU }}
              />
            </Tab>
            <Tab eventKey={3} title="P. Térmicos">
              <PTsTable pts={envolvente.pts} {...{ ptsL, ptsPsiL }} />
            </Tab>
            <Tab eventKey={4} title="Carga / descarga de datos">
              <Grid>
                <Row>
                  <Panel
                    header="Carga archivo con datos de envolvente:"
                    bsStyle="primary"
                  >
                    <p>
                      Si ha descargado con anterioridad datos de esta
                      aplicación, cárguelos de nuevo seleccionando el archivo.
                    </p>
                    <input
                      ref="fileInput"
                      type="file"
                      onChange={e => this.handleUpload(e)}
                    />
                  </Panel>
                </Row>
                <Row>
                  <Button
                    bsStyle="primary"
                    ref="fileDownload"
                    className="pull-right"
                    onClick={e => this.handleDownload(e)}
                  >
                    <Glyphicon glyph="download" /> Descargar datos de envolvente
                  </Button>
                </Row>
                <Row>{errordisplay}</Row>
              </Grid>
            </Tab>
          </Tabs>
        </Row>
        {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
        <Footer />
      </Grid>
    );
  }

  handleDownload(_) {
    const { Autil, envolvente } = this.props.appstate;
    const contents = JSON.stringify({ Autil, envolvente }, null, 2);
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
        const { Autil, envolvente } = JSON.parse(rawdata.target.result);
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

export default (IndicatorsPage = inject("appstate", "radstate")(
  observer(IndicatorsPage)
));