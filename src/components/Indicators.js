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
import { Col, Grid, Panel, Row, Tabs, Tab, Well } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import ReactDataGrid from 'react-data-grid';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';

const Float1DigitsFormatter = props =>
  <span>{ Number(props.value).toFixed(1) }</span>;
const Float2DigitsFormatter = props =>
  <span>{ Number(props.value).toFixed(2) }</span>;
const Float3DigitsFormatter = props =>
  <span>{ Number(props.value).toFixed(3) }</span>;

class HuecosTable extends Component {
  constructor(props) {
    super(props);
    // this.huecosorientaciones = this.props.appstate.orientations;
    this.columns = [
      { key: 'A', name: 'Area(m2)', editable: true,
        formatter: Float2DigitsFormatter },
      { key: 'U', name: 'U(W/m2K)', editable: true,
        formatter: Float3DigitsFormatter },
      { key: 'orientacion', name: 'orientacion', editable: true },
      { key: 'Ff', name: 'F_f', editable: true,
        formatter: Float1DigitsFormatter },
      { key: 'ggl', name: 'g_gl', editable: true,
        formatter: Float2DigitsFormatter },
      { key: 'Fshobst', name: 'F_sh,obst', editable: true,
        formatter: Float1DigitsFormatter },
      { key: 'Fshgl', name: 'F_sh,gl', editable: true,
        formatter: Float1DigitsFormatter },
      { key: 'nombre', name: 'Elemento', editable: true }
    ];
  }

  render() {
    const huecos = this.props.huecos;
    return (
      <Grid>
        <h2>Huecos de la envolvente térmica</h2>
        <ReactDataGrid
            enableCellSelect={ true }
            columns={ this.columns }
            rowGetter={ i => huecos[i] }
            rowsCount={ huecos.length }
            onRowUpdated={ v => this.handleRowUpdated(v) }
            minHeight={ 300 } />
        <p>&sum;A = { huecos.map(h => h.A)
                            .reduce((a, b) => a + b)
                            .toFixed(2) } m²</p>
        <p>&sum;A·U = { huecos.map(h => h.A * h.U)
                              .reduce((a, b) => a + b)
                              .toFixed(2) } W/K</p>
      </Grid>
    );
  }

  handleRowUpdated({ rowIdx, updated }) {
    // merge updated row with current row and rerender by setting state
    let value = Number(updated);
    value = Number.isNaN(value)? updated: value;
    Object.assign(this.props.huecos[rowIdx], value);
  }

}


class OpacosTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      { key: 'A', name: 'Area(m2)', editable: true,
        formatter: Float2DigitsFormatter },
      { key: 'U', name: 'U(W/m2K)', editable: true,
        formatter: Float3DigitsFormatter },
      { key: 'nombre', name: 'Elemento', editable: true }
    ];
  }

  render() {
    const opacos = this.props.opacos;
    return (
      <Grid>
        <h2>Elementos opacos de la envolvente térmica</h2>
        <ReactDataGrid
            columns={ this.columns }
            rowGetter={ i => opacos[i] }
            rowsCount={ opacos.length }
            minHeight={ 300 } />
        <p>&sum;A = { opacos.map(h => h.A)
                            .reduce((a, b) => a + b)
                            .toFixed(2) } m²</p>
        <p>&sum;A·U = { opacos.map(h => h.A * h.U)
                              .reduce((a, b) => a + b)
                              .toFixed(2) } W/K</p>
      </Grid>
    );
  }

  handleRowUpdated({ rowIdx, updated }) {
    // merge updated row with current row and rerender by setting state
    let value = Number(updated);
    value = Number.isNaN(value)? updated: value;
    Object.assign(this.props.opacos[rowIdx], value);
  }

}


class PTsTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      { key: 'L', name: 'Longitud(m)', editable: true,
        formatter: Float2DigitsFormatter },
      { key: 'psi', name: 'Psi(W/mK)', editable: true,
        formatter: Float2DigitsFormatter },
      { key: 'nombre', name: 'Encuentro', editable: true }
    ];
  }

  render() {
    const pts = this.props.pts;
    return (
      <Grid>
        <h2>Puentes térmicos de la envolvente térmica</h2>
        <ReactDataGrid
            columns={ this.columns }
            rowGetter={ i => pts[i] }
            rowsCount={ pts.length }
            minHeight={ 300 } />
        <p>&sum;L = { pts.map(h => h.L)
                         .reduce((a, b) => a + b)
                         .toFixed(2) } m</p>
        <p>&sum;L·&psi; = { pts.map(h => h.L * h.psi)
                           .reduce((a, b) => a + b)
                           .toFixed(2) } W/K</p>
      </Grid>
    );
  }

  handleRowUpdated({ rowIdx, updated }) {
    // merge updated row with current row and rerender by setting state
    let value = Number(updated);
    value = Number.isNaN(value)? updated: value;
    Object.assign(this.props.pts[rowIdx], value);
  }

}

//TODO: comprobar por qué no coincide con los valores del documento (área de huecos, p.e.)
const KTable = ({ huecosA, huecosAU, opacosA, opacosAU, ptsPsiL, totalA, totalAU, K }) =>
  <Grid>
    <h2>Transmitancia térmica global <b><i>K</i> = { K.toFixed(2) } <i>W/m²K</i></b></h2>
    <p>K = H<sub>tr,adj</sub> / &sum;A<sub>i</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> · [&sum;<sub>i</sub> A<sub>i</sub> · U<sub>i</sub> + &sum;<sub>k</sub> l<sub>k</sub> · ψ<sub>k</sub>] / &sum;A<sub>i</sub></p>
    <p>&sum;<sub>i</sub> A<sub>i</sub> · U<sub>i</sub> + &sum;<sub>k</sub> l<sub>k</sub> · ψ<sub>k</sub> = { huecosAU.toFixed(2) } W/K (huecos) + { opacosAU.toFixed(2) } W/K (opacos) + { ptsPsiL.toFixed(2) } W/K (PTs) = { (totalAU + ptsPsiL).toFixed(2) } W/K </p>
    <p>&sum;A<sub>i</sub> = { huecosA.toFixed(2) } m² (huecos) + { opacosA.toFixed(2) } m² (opacos) = { totalA.toFixed(2)} m²</p>
  </Grid>;

const QSolTable = ({ Qsoljul, qsj, Autil }) =>
    <Grid>
      <h2>Captación solar &nbsp;
        <b><i>q<sub>sol;jul</sub></i> =
          { qsj.toFixed(2) } <i>kWh/m²/mes</i>
        </b>
      </h2>
      <p>q<sub>sol;jul</sub> = Q<sub>sol;jul</sub> / A<sub>util</sub> = &sum;<sub>k</sub>(F<sub>sh,obst</sub> · F <sub>sh,gl</sub> · g<sub>gl</sub> · (1 − F<sub>F</sub>) · A<sub>w,p</sub> · H<sub>sol;jul</sub>) / A<sub>util</sub></p>
      <p>Q<sub>sol;jul</sub> = { Qsoljul.toFixed(2) } kWh/mes</p>
      <p>A<sub>util</sub> = { Autil } m²</p>
    </Grid>;

const Indicators = inject("appstate")(
  observer(class Indicators extends Component {
    render() {
      // climate, radiationdata,
      const { envolvente, Autil, climateTotRad } = this.props.appstate;
      const { huecos, opacos, pts } = envolvente;
      const huecosA = huecos.map(h => h.A).reduce((a, b)=> a+b);
      const huecosAU = huecos.map(h => h.A * h.U).reduce((a, b)=> a+b);
      const opacosA = opacos.map(o => o.A).reduce((a, b)=> a+b);
      const opacosAU = opacos.map(o => o.A * o.U).reduce((a, b)=> a+b);
      const ptsPsiL = pts.map(h => h.L * h.psi).reduce((a, b) => a + b);
      const totalA = huecosA + opacosA;
      const totalAU = huecosAU + opacosAU;
      const K = (totalAU + ptsPsiL) / totalA;
      const Qsoljul = huecos
        .map(h =>
          h.Fshobst * h.Fshgl * h.ggl * (1 - h.Ff) * h.A * climateTotRad[h.orientacion])
        .reduce((a, b) => a + b);
      const qsj = Qsoljul / Autil;

      return (
        <Grid>
          <NavBar route={ this.props.route } />
          <Row>
            <Well>
              <ClimateSelector />
            </Well>
          </Row>
          <Row>
            <Panel>
              <Col md={4}><b><i>K</i> = { K.toFixed(2) } <i>W/m²K</i></b></Col>
              <Col md={4}><b><i>q<sub>sol;jul</sub></i> = { qsj.toFixed(2) } <i>kWh/m²/mes</i></b></Col>
              <Col md={4}><p><b>A<sub>util</sub></b> = <input type="text" onChange={ e => this.handleChange(e) } value={ Autil } /> m²</p></Col>
            </Panel>
          </Row>
          <Row>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Indicadores">
                <KTable huecosA={ huecosA } huecosAU={ huecosAU }
                        opacosA={ opacosA } opacosAU={ opacosAU }
                        ptsPsiL={ ptsPsiL }
                        totalA={ totalA } totalAU={ totalAU }
                        K={ K } />
                <QSolTable Qsoljul={ Qsoljul }
                           qsj={ qsj }
                           Autil={ Autil } />
              </Tab>
              <Tab eventKey={2} title="Huecos">
                <HuecosTable huecos={ envolvente.huecos } />
              </Tab>
              <Tab eventKey={3} title="Opacos">
                <OpacosTable opacos={ envolvente.opacos } />
              </Tab>
              <Tab eventKey={4} title="P. Térmicos">
                <PTsTable pts={ envolvente.pts } />
              </Tab>
            </Tabs>
          </Row>
          { <DevTools position={{ bottom: 0, right: 20 }} /> }
        </Grid>
      );
    }
    handleChange(e) {
      const currentValue = e.target.value;
      this.props.appstate.Autil = Number(currentValue);
    }

  })
);

export default Indicators;
