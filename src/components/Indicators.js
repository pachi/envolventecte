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

import React, { Component } from 'react';
import { Alert, Button, Col, Glyphicon, Grid, Panel, Row, Tabs, Tab } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { observer, inject } from 'mobx-react';
// import DevTools from 'mobx-react-devtools';

import AddRemoveButtonGroup from './AddRemoveButtonGroup';
import Footer from './Footer';
import NavBar from './Nav';

import { uuidv4, UserException } from '../utils.js';

const Float1DigitsFormatter = (cell, row) => <span>{ Number(cell).toFixed(1) }</span>;
const Float2DigitsFormatter = (cell, row) => <span>{ Number(cell).toFixed(2) }</span>;
const Float3DigitsFormatter = (cell, row) => <span>{ Number(cell).toFixed(3) }</span>;

// Orientaciones
const orientacionesType = ['Horiz.', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

class HuecosTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selectedId: [] };
  }

  newHueco = () => (
    { id: uuidv4(), nombre: 'Hueco nuevo', orientacion: 'N',
      A: 1.0, U: 1.0, Ff: 0.2, gglshwi: 0.67, Fshobst: 1.0 }
  )

  render() {
    const { huecos, huecosA, huecosAU } = this.props;
    return (
      <Grid>
        <h2>
          Huecos de la envolvente térmica
          <AddRemoveButtonGroup objects={ huecos } newObj={ this.newHueco } selectedId={ this.state.selectedId }/>
        </h2>
        <BootstrapTable data={huecos} striped hover bordered={false}
          cellEdit={{ mode: 'dbclick', blurToSave: true }}
          selectRow={{
            mode: 'radio',
            clickToSelectAndEditCell: true,
            selected: this.state.selectedId,
            onSelect: (row, isSelected) => this.setState({ selectedId: isSelected ? [row.id] : [] }),
            hideSelectColumn: true,
            bgColor: 'lightgray'
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn
            dataField="orientacion"
            editable={{ type: 'select', options: { values: orientacionesType } }}
            headerText="Orientación del hueco">
            Orientación</TableHeaderColumn>
          <TableHeaderColumn dataField="A"
            dataFormat={Float2DigitsFormatter}
            headerText="Área del hueco (m2)">
            A<sub>w,p</sub> (m<sup>2</sup>)</TableHeaderColumn>
          <TableHeaderColumn dataField="U"
            dataFormat={Float3DigitsFormatter}
            headerText="Transmitancia térmica del hueco (W/m²K)">
            U (W/m<sup>2</sup>K)</TableHeaderColumn>
          <TableHeaderColumn dataField="Ff"
            dataFormat={Float2DigitsFormatter}
            headerText="Fracción de marco del hueco (fracción)">
            F<sub>F</sub> (-)</TableHeaderColumn>
          <TableHeaderColumn dataField="gglshwi"
            dataFormat={Float2DigitsFormatter}
            headerText="Transmitancia total de energía solar del acristalamiento con el dispositivo de sombra móvil activado (fracción)">
            g<sub>gl;sh;wi</sub> (-)</TableHeaderColumn>
          <TableHeaderColumn dataField="Fshobst"
            dataFormat={Float2DigitsFormatter}
            headerText="Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción)">
            F<sub>sh;obst</sub> (-)</TableHeaderColumn>
          <TableHeaderColumn dataField="nombre"
            headerText="Descripción identificativa del hueco">
            Descripción</TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;A = { huecosA.toFixed(2) } m²</Col>
          <Col md={6} className="text-right">&sum;A·U = { huecosAU.toFixed(2) } W/K</Col>
        </Row>
        <Row className="text-info small top20">
          <Col md={12}>
            <p>Donde:</p>
            <ul>
              <li><b>A<sub>w,p</sub></b>: área (proyectada) del hueco (m²)</li>
              <li><b>Orientación</b>: orientación del hueco (N, NE, NW, E, W, SE, SW, S, Horiz.)</li>
              <li><b>U</b>: transmitancia térmica del hueco (W/m²K)</li>
              <li><b>F<sub>F</sub></b>: fracción de marco del hueco (fracción). A falta de otros datos puede tomarse F_F = 0.25 (25%)</li>
              <li>
                <b>g<sub>gl;sh;wi</sub></b>: transmitancia total de energía solar del acristalamiento con el dispositivo de sombra móvil activado (f_sh;with = 1), para el mes de julio (fracción).
                <br/>Este valor puede obtenerse a partir del factor solar del vidrio a incidencia normal (g<sub>gl;n</sub>), el factor de dispersión del vidrio (F<sub>w</sub>~=0.9) y la definición del elemento de sombreamiento.
                El Documento de Apoyo DA DB-HE/1 incluye valores tabulados para diversos tipos de vidrio y protecciones solares. A la hora de introducir este valor en las aplicaciones de cálculo, debe tenerse en cuenta que estas emplean
                de manera predefinida un dispositivo de sombra que incide con un factor igual 0.7 (de acuerdo con el Documento de Condiciones Técnicas para la Evaluación de la Eficiencia Energética de Edificios),
                de modo que el valor introducido en los programas debe descontar dicho efecto.
              </li>
              <li>
                <b>F<sub>sh;obst</sub></b>: factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción).
                <br/>Este valor puede asimilarse al factor de sombra del hueco (FS).
                El Documento de Apoyo DA DB-HE/1 incluye valores tabulados para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores.
              </li>
            </ul>
            <p><b>NOTA</b>: Para los huecos definidos en la tabla se considera, a efectos
            del cálculo de K, un factor de ajuste <i>b<sub>tr,x</sub> = 1.0</i>, de modo que
            solo deben incluirse aquellos pertenecientes a elementos con un factor de ajuste distinto de cero.
            Es decir, deben excluirse aquellos huecos situados en elementos en contacto con edificios o espacios adyacentes, cuyo <i>b<sub>tr,x</sub> = 0.0</i>.</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class OpacosTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selectedId: [] };
  }

  newOpaco = () => ({ id: uuidv4(), A: 1.00, U: 0.200, btrx: 1.0, nombre: 'Elemento opaco' })

  render() {
    const { opacos, opacosA, opacosAU } = this.props;
    return (
      <Grid>
        <h2>
          Elementos opacos de la envolvente térmica
          <AddRemoveButtonGroup objects={ opacos } newObj={ this.newOpaco } selectedId={ this.state.selectedId }/>
        </h2>
        <BootstrapTable data={opacos} striped hover bordered={false}
          cellEdit={{ mode: 'dbclick', blurToSave: true }}
          selectRow={{
            mode: 'radio',
            clickToSelectAndEditCell: true,
            selected: this.state.selectedId,
            onSelect: (row, isSelected) => this.setState({ selectedId: isSelected ? [row.id] : [] }),
            hideSelectColumn: true,
            bgColor: 'lightgray'
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="A"
            dataFormat={Float2DigitsFormatter}
            headerText="Área del elemento opaco (m²)">
            A (m<sup>2</sup>)</TableHeaderColumn>
          <TableHeaderColumn dataField="U"
            dataFormat={Float3DigitsFormatter}
            headerText="Transmitancia térmica del elemento opaco (W/m²K)">
            U (W/m<sup>2</sup>K)</TableHeaderColumn>
          <TableHeaderColumn dataField="btrx"
            dataFormat={Float1DigitsFormatter}
            headerText="Factor de ajuste del elemento opaco (fracción)">
            b<sub>tr,x</sub></TableHeaderColumn>
          <TableHeaderColumn dataField="nombre"
            headerText="Descripción identificativa del elemento opaco">
            Descripción</TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;b<sub>tr,x</sub>·A<sub>x</sub> = {opacosA.toFixed(2)} m²</Col>
          <Col md={6} className="text-right">&sum;b<sub>tr,x</sub>·&sum;<sub>i</sub>A<sub>i</sub>·U<sub>i</sub> = {opacosAU.toFixed(2)} W/K</Col>
        </Row>
        <Row className="text-info small top20">
          <Col md={12}>
            <p>Donde:</p>
            <ul>
              <li><b>A</b>: área del elemento opaco (m²)</li>
              <li><b>U</b>: transmitancia térmica del elemento opaco (W/m²K)</li>
              <li><b>b<sub>tr,x</sub></b>: factor de ajuste del elemento opaco (fracción)</li>
            </ul>
            <p><b>NOTA</b>: El factor de ajuste propuesto para elementos en contacto con edificios o
            espacios adyacentes es <i>b<sub>tr,x</sub> = 0.0</i>, y <i>b<sub>tr,x</sub> = 1.0 </i>
            para el resto de casos.</p>
            <p>Esta simplificación introduce cierto error al considerar que el intercambio de calor
            a través de los elementos en contacto con otros edificios o espacios adyacentes es despreciable,
            pero simplifica considerablemente los cálculos.</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}


class PTsTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selectedId: [] };
  }

  newPT = () => ({ id: uuidv4(), L: 1.0, psi: 0.05, nombre: 'PT por defecto' })

  render() {
    const { pts, ptsL, ptsPsiL } = this.props;
    return (
      <Grid>
        <h2>
          Puentes térmicos de la envolvente térmica
          <AddRemoveButtonGroup objects={ pts } newObj={ this.newPT } selectedId={ this.state.selectedId }/>
        </h2>
        <BootstrapTable data={pts} striped hover bordered={false}
          cellEdit={{ mode: 'dbclick', blurToSave: true }}
          selectRow={{
            mode: 'radio',
            clickToSelectAndEditCell: true,
            selected: this.state.selectedId,
            onSelect: (row, isSelected) => this.setState({ selectedId: isSelected ? [row.id] : [] }),
            hideSelectColumn: true,
            bgColor: 'lightgray'
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="L"
            dataFormat={Float2DigitsFormatter}
            headerText="Longitud del puente térmico (m)">
            Longitud (m)</TableHeaderColumn>
          <TableHeaderColumn dataField="psi"
            dataFormat={Float2DigitsFormatter}
            headerText="Transmitancia térmica lineal del puente térmico (W/mK)">
            &psi; (W/mK)</TableHeaderColumn>
          <TableHeaderColumn dataField="nombre"
            headerText="Descripción identificativa del puente térmico">
            Descripción</TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;L = {ptsL.toFixed(2)} m</Col>
          <Col md={6} className="text-right">&sum;L·&psi; = {ptsPsiL.toFixed(2)} W/K</Col>
        </Row>
        <Row className="text-info small top20">
          <Col md={12}>
            <p>Donde:</p>
            <ul>
              <li><b>Longitud</b>: longitud del puente térmico (m)</li>
              <li><b>&psi;</b>: transmitancia térmica lineal del puente térmico (W/mK)</li>
            </ul>
            <p><b>NOTA</b>: Para los puentes térmicos definidos en la tabla se considera, a efectos
            del cálculo de K, un factor de ajuste <i>b<sub>tr,x</sub> = 1.0</i>, de modo que
            solo deben incluirse aquellos pertenecientes a elementos con un factor de ajuste no nulo.</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const IndicatorsPanel = inject("appstate", "radstate")(observer(
  class IndicatorsPanel extends Component {
    constructor(...args) {
      super(...args);
      this.state = { open: false };
    }

    render() {
      // climate, radiationdata,
      const { Autil, huecosA, huecosAU, opacosA, opacosAU, ptsPsiL,
        totalA, totalAU, K, Qsoljul, qsj } = this.props.appstate;
      const { climateTotRadJul } = this.props.radstate;
      const Qsoljul_clima = Qsoljul(climateTotRadJul);
      const qsj_clima = qsj(climateTotRadJul);

      return (
        <Grid>
          <Row>
            <Col md={1}>
              <Button bsSize="xs" bsStyle="info" onClick={() => this.setState({ open: !this.state.open })}>
                <Glyphicon glyph="plus" />
              </Button>
            </Col>
            <Col md={3} title="Transmitancia térmica global del edificio">
              <b><i>K</i> = {K.toFixed(2)} <i>W/m²K</i></b>
            </Col>
            <Col md={3} title="Indicador de control solar">
              <b><i>q<sub>sol;jul</sub></i> = {qsj_clima.toFixed(2)} <i>kWh/m²/mes</i></b>
            </Col>
            <Col md={5} className="text-right">
              <p title="Superficie útil del edificio o parte del edificio">
                <b>A<sub>util</sub></b> = <input type="text"
                                                 onChange={ e => this.handleChange(e) }
                                                 value={Autil} /> m²
              </p>
            </Col>
          </Row>
          <Panel id="detalleindicadores" collapsible expanded={this.state.open} bsStyle="info">
            <Grid>
              <Row>
                <h3>Transmitancia térmica global</h3>
                <p>Transmisión de calor a través de la envolvente térmica (huecos, opacos y puentes térmicos)</p>
                <p>H<sub>tr,adj</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> · [&sum;<sub>i</sub> A<sub>x,i</sub> · U<sub>x,i</sub> (huecos + opacos) + &sum;<sub>k</sub> l<sub>x,k</sub> · ψ<sub>x,k</sub> (PTs)] = {huecosAU.toFixed(2)} W/K (huecos) + {opacosAU.toFixed(2)} W/K (opacos) + {ptsPsiL.toFixed(2)} W/K (PTs) = {(totalAU + ptsPsiL).toFixed(2)} W/K </p>
                <p>Superficie de intercambio de la envolvente térmica</p>
                <p>&sum;A = &sum; b<sub>tr,x</sub> · A<sub>x</sub> = { Number(huecosA).toFixed(2) } m² (huecos) + { Number(opacosA).toFixed(2) } m² (opacos) = { Number(totalA).toFixed(2) } m²</p>
                <p>Valor del indicador:</p>
                <p><b>K</b> = H<sub>tr,adj</sub> / &sum;A &asymp; { (totalAU + ptsPsiL).toFixed(2) } / { (totalA).toFixed(2) } = <b>{ Number(K).toFixed(2) } <i>W/m²K</i></b> </p>
              </Row>
              <Row>
                <h3>Control solar</h3>
                <p>Ganancias solares en el mes de julio con los dispositivos de sombra activados</p>
                <p>Q<sub>sol;jul</sub> &sum;<sub>k</sub>(F<sub>sh,obst</sub> · g<sub>gl;sh;wi</sub> · (1 − F<sub>F</sub>) · A<sub>w,p</sub> · H<sub>sol;jul</sub>) = { Qsoljul_clima.toFixed(2) } kWh/mes</p>
                <p>Superficie útil</p>
                <p>A<sub>util</sub> = {Autil} m²</p>
                <p>Valor del indicador:</p>
                <p><b>q<sub>sol;jul</sub></b> = Q<sub>sol;jul</sub> / A<sub>util</sub> = {Qsoljul_clima.toFixed(2)} / { Autil } = <b><i>{ Number(qsj_clima).toFixed(2) } kWh/m²/mes</i></b></p>
              </Row>
            </Grid>
          </Panel>
        </Grid>
      );
    }

    // Actualización de Autil
    handleChange(e) {
      const currentValue = e.target.value;
      this.props.appstate.Autil = Number(currentValue);
    }
  }
));

const Indicators = inject("appstate", "radstate")(observer(
  class Indicators extends Component {
    render() {
      // climate, radiationdata,
      const {
        envolvente, huecosA, huecosAU, opacosA, opacosAU, ptsL, ptsPsiL, errors
      } = this.props.appstate;
      const errordisplay = errors.map((e, idx) =>
        <Alert bsStyle={ e.type.toLowerCase() }
          key={ `AlertId${ idx }` }>{ e.msg }</Alert>);
      return (
        <Grid>
          <NavBar route={this.props.route} />
          <Row>
            <IndicatorsPanel />
          </Row>
          <Row>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Huecos">
                <HuecosTable huecos={envolvente.huecos} {...{ huecosA, huecosAU }} />
              </Tab>
              <Tab eventKey={2} title="Opacos">
                <OpacosTable opacos={envolvente.opacos} {...{ opacosA, opacosAU }} />
              </Tab>
              <Tab eventKey={3} title="P. Térmicos">
                <PTsTable pts={envolvente.pts} {...{ ptsL, ptsPsiL }} />
              </Tab>
              <Tab eventKey={4} title="Carga / descarga de datos">
                <Panel header="Carga archivo con datos de envolvente:" bsStyle="primary">
                  <p>Si ha descargado con anterioridad datos de esta aplicación, cárguelos de nuevo seleccionando el archivo.</p>
                  <input ref="fileInput" type="file" onChange={e => this.handleUpload(e)} />
                </Panel>
                <Row>
                  <Button bsStyle="primary" ref="fileDownload" className="pull-right"
                    onClick={ e => this.handleDownload(e) }>
                    <Glyphicon glyph="download" /> Descargar datos de envolvente
                  </Button>
                </Row>
                <Row>
                { errordisplay }
                </Row>
              </Tab>
            </Tabs>
          </Row>
          {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
          <Footer/>
        </Grid>
      );
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
          if (!(Autil && envolvente
            && Array.isArray(huecos) && Array.isArray(opacos)
            && Array.isArray(pts))) throw UserException("Formato incorrecto");
          this.props.appstate.Autil = Number(Autil);
          this.props.appstate.envolvente = envolvente;
          this.props.appstate.errors = [
            { type: 'SUCCESS', msg: "Datos cargados correctamente." },
            { type: 'INFO', msg: `Autil: ${ Autil } m², Elementos: `
              + `${ huecos.length } huecos, ${ opacos.length } opacos, ${ pts.length } PTs.` }
          ];
        } catch (err) {
          this.props.appstate.errors = [
            { type: 'DANGER', msg: "El archivo no contiene datos con un formato adecuado." }
          ];
        }
      };
      reader.readAsText(file);
    }

    handleDownload(e) {
      const { Autil, envolvente } = this.props.appstate;
      const contents = JSON.stringify({ Autil, envolvente }, null, 2);
      const filename = "solarcte.json";
      const blob = new Blob([contents], { type: 'application/json' });
      const uri = URL.createObjectURL(blob);
      // from http://stackoverflow.com/questions/283956/
      const link = document.createElement('a');
      if (typeof link.download === 'string') {
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
  }
));
export default Indicators;
