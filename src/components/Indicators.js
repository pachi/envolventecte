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
import {
  Button, ButtonGroup, Col, Glyphicon,
  Grid, Panel, Row, Tabs, Tab, Well
} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';

import { uuidv4 } from '../utils.js';

const Float1DigitsFormatter = (cell, row) => <span>{Number(cell).toFixed(1)}</span>;
const Float2DigitsFormatter = (cell, row) => <span>{Number(cell).toFixed(2)}</span>;
const Float3DigitsFormatter = (cell, row) => <span>{Number(cell).toFixed(3)}</span>;

// Orientaciones
const orientacionesType = ['Horiz.', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const PlusMinusButtonRow = ({ objects, newObj, selectedId }) =>
  (<Row>
    <ButtonGroup>
      <Button bsStyle="primary" bsSize="small"
        onClick={() => {
          const object = newObj;
          object.id = uuidv4();
          objects.push(object);
        }}>
        <Glyphicon glyph="plus" />
      </Button>
      <Button bsStyle="primary" bsSize="small"
        onClick={() => {
          const indexOfSelected = objects.findIndex(h => h.id === selectedId);
          if (indexOfSelected >= 0) objects.splice(indexOfSelected, 1);
        }}>
        <Glyphicon glyph="minus" />
      </Button>
    </ButtonGroup>
  </Row>);


class HuecosTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selectedId: null };
  }

  render() {
    const { huecos, newHueco } = this.props;
    return (
      <Grid>
        <h2>Huecos de la envolvente térmica</h2>
        <BootstrapTable data={huecos} striped hover bordered={false}
          cellEdit={{ mode: 'dbclick', blurToSave: true }}
          selectRow={{
            mode: 'radio',
            clickToSelectAndEditCell: true,
            onSelect: (row, isSelected) => this.setState({ selectedId: isSelected ? row.id : null }),
            hideSelectColumn: true,
            bgColor: 'lightgray'
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="A" dataFormat={Float2DigitsFormatter}>Area(m<sup>2</sup>)</TableHeaderColumn>
          <TableHeaderColumn dataField="U" dataFormat={Float3DigitsFormatter}>U(W/m<sup>2</sup>K)</TableHeaderColumn>
          <TableHeaderColumn
            dataField="orientacion"
            editable={{ type: 'select', options: { values: orientacionesType } }}
          >
            orientacion
          </TableHeaderColumn>
          <TableHeaderColumn dataField="Ff" dataFormat={Float1DigitsFormatter}>F_f</TableHeaderColumn>
          <TableHeaderColumn dataField="ggl" dataFormat={Float2DigitsFormatter}>g_gl</TableHeaderColumn>
          <TableHeaderColumn dataField="Fshobst" dataFormat={Float2DigitsFormatter}>F_sh,obst</TableHeaderColumn>
          <TableHeaderColumn dataField="Fshgl" dataFormat={Float1DigitsFormatter}>F_sh,gl</TableHeaderColumn>
          <TableHeaderColumn dataField="nombre">Elemento</TableHeaderColumn>
        </BootstrapTable>
        <PlusMinusButtonRow objects={huecos} newObj={newHueco} selectedId={this.state.selectedId} />
        <Row>
          <p>&sum;A = {huecos.map(h => Number(h.A))
            .reduce((a, b) => a + b, 0)
            .toFixed(2)} m²</p>
          <p>&sum;A·U = {huecos.map(h => Number(h.A) * Number(h.U))
            .reduce((a, b) => a + b, 0)
            .toFixed(2)} W/K</p>
        </Row>
      </Grid>
    );
  }
}


class OpacosTable extends Component {
  render() {
    const opacos = this.props.opacos;
    return (
      <Grid>
        <h2>Elementos opacos de la envolvente térmica</h2>
        <BootstrapTable data={opacos} striped hover bordered={false}
          cellEdit={{ mode: 'dbclick', blurToSave: true }}
          selectRow={{
            mode: 'radio',
            clickToSelectAndEditCell: true,
            onSelect: this.onRowSelect,
            hideSelectColumn: true,
            bgColor: 'lightgray'
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="A" dataFormat={Float2DigitsFormatter}>Area(m<sup>2</sup>)</TableHeaderColumn>
          <TableHeaderColumn dataField="U" dataFormat={Float3DigitsFormatter}>U(W/m<sup>2</sup>K)</TableHeaderColumn>
          <TableHeaderColumn dataField="nombre">Elemento</TableHeaderColumn>
        </BootstrapTable>
        <p>&sum;A = {opacos.map(h => Number(h.A))
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} m²</p>
        <p>&sum;A·U = {opacos.map(h => Number(h.A) * Number(h.U))
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} W/K</p>
      </Grid>
    );
  }

  onRowSelect(row, isSelected, e) {
    /*    let rowStr = '';
        for (const prop in row) {
          rowStr += prop + ': "' + row[prop] + '"';
        }*/
    console.log(e);
    console.log(`is selected: ${isSelected}, ${row}`);
  }
}


class PTsTable extends Component {
  render() {
    const pts = this.props.pts;
    return (
      <Grid>
        <h2>Puentes térmicos de la envolvente térmica</h2>
        <BootstrapTable data={pts} striped hover bordered={false}
          cellEdit={{ mode: 'dbclick', blurToSave: true }}
          selectRow={{
            mode: 'radio',
            clickToSelectAndEditCell: true,
            onSelect: this.onRowSelect,
            hideSelectColumn: true,
            bgColor: 'lightgray'
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="L" dataFormat={Float2DigitsFormatter}>Longitud(m)</TableHeaderColumn>
          <TableHeaderColumn dataField="psi" dataFormat={Float2DigitsFormatter}>Psi(W/mK)</TableHeaderColumn>
          <TableHeaderColumn dataField="nombre">Encuentro</TableHeaderColumn>
        </BootstrapTable>
        <p>&sum;L = {pts.map(h => Number(h.L))
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} m</p>
        <p>&sum;L·&psi; = {pts.map(h => Number(h.L) * Number(h.psi))
          .reduce((a, b) => a + b, 0)
          .toFixed(2)} W/K</p>
      </Grid>
    );
  }

  onRowSelect(row, isSelected, e) {
    /*    let rowStr = '';
        for (const prop in row) {
          rowStr += prop + ': "' + row[prop] + '"';
        }*/
    console.log(e);
    console.log(`is selected: ${isSelected}, ${row}`);
  }

}

const KTable = ({ huecosA, huecosAU, opacosA, opacosAU, ptsPsiL, totalA, totalAU, K }) =>
  // TODO: comprobar por qué no coincide con los valores del documento (área de huecos, p.e.)
  <Grid>
    <h2>Transmitancia térmica global <b><i>K</i> = {Number(K).toFixed(2)} <i>W/m²K</i></b></h2>
    <p>K = H<sub>tr,adj</sub> / &sum;A<sub>i</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> · [&sum;<sub>i</sub> A<sub>i</sub> · U<sub>i</sub> + &sum;<sub>k</sub> l<sub>k</sub> · ψ<sub>k</sub>] / &sum;A<sub>i</sub></p>
    <p>&sum;<sub>i</sub> A<sub>i</sub> · U<sub>i</sub> + &sum;<sub>k</sub> l<sub>k</sub> · ψ<sub>k</sub> = {huecosAU.toFixed(2)} W/K (huecos) + {opacosAU.toFixed(2)} W/K (opacos) + {ptsPsiL.toFixed(2)} W/K (PTs) = {(totalAU + ptsPsiL).toFixed(2)} W/K </p>
    <p>&sum;A<sub>i</sub> = {Number(huecosA).toFixed(2)} m² (huecos) + {Number(opacosA).toFixed(2)} m² (opacos) = {Number(totalA).toFixed(2)} m²</p>
  </Grid>;

const QSolTable = ({ Qsoljul, qsj, Autil }) =>
  <Grid>
    <h2>Captación solar &nbsp;
        <b><i>q<sub>sol;jul</sub></i> =
          {Number(qsj).toFixed(2)} <i>kWh/m²/mes</i>
      </b>
    </h2>
    <p>q<sub>sol;jul</sub> = Q<sub>sol;jul</sub> / A<sub>util</sub> = &sum;<sub>k</sub>(F<sub>sh,obst</sub> · F <sub>sh,gl</sub> · g<sub>gl</sub> · (1 − F<sub>F</sub>) · A<sub>w,p</sub> · H<sub>sol;jul</sub>) / A<sub>util</sub></p>
    <p>Q<sub>sol;jul</sub> = {Qsoljul.toFixed(2)} kWh/mes</p>
    <p>A<sub>util</sub> = {Autil} m²</p>
  </Grid>;

const Indicators = inject("appstate", "radstate")(observer(
  class Indicators extends Component {
    render() {
      // climate, radiationdata,
      const { envolvente, Autil, newHueco, newOpaco, newPT } = this.props.appstate;
      const { climateTotRad } = this.props.radstate;
      const { huecos, opacos, pts } = envolvente;
      const huecosA = huecos.map(h => Number(h.A)).reduce((a, b) => a + b, 0);
      const huecosAU = huecos.map(h => Number(h.A) * Number(h.U)).reduce((a, b) => a + b, 0);
      const opacosA = opacos.map(o => Number(o.A)).reduce((a, b) => a + b, 0);
      const opacosAU = opacos.map(o => Number(o.A) * Number(o.U)).reduce((a, b) => a + b, 0);
      const ptsPsiL = pts.map(h => Number(h.L) * Number(h.psi)).reduce((a, b) => a + b, 0);
      const totalA = huecosA + opacosA;
      const totalAU = huecosAU + opacosAU;
      const K = (totalAU + ptsPsiL) / totalA;
      const Qsoljul = huecos
        .map(h =>
          Number(h.Fshobst) * Number(h.Fshgl) * Number(h.ggl)
          * (1 - Number(h.Ff)) * Number(h.A) * climateTotRad[h.orientacion])
        .reduce((a, b) => a + b, 0);
      const qsj = Qsoljul / Autil;

      return (
        <Grid>
          <NavBar route={this.props.route} />
          <Row>
            <Well>
              <ClimateSelector />
            </Well>
          </Row>
          <Row>
            <Panel>
              <Col md={4}><b><i>K</i> = {K.toFixed(2)} <i>W/m²K</i></b></Col>
              <Col md={4}><b><i>q<sub>sol;jul</sub></i> = {qsj.toFixed(2)} <i>kWh/m²/mes</i></b></Col>
              <Col md={4}><p><b>A<sub>util</sub></b> = <input type="text" onChange={e => this.handleChange(e)} value={Autil} /> m²</p></Col>
            </Panel>
          </Row>
          <Row>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Indicadores">
                <KTable huecosA={huecosA} huecosAU={huecosAU}
                  opacosA={opacosA} opacosAU={opacosAU}
                  ptsPsiL={ptsPsiL}
                  totalA={totalA} totalAU={totalAU}
                  K={K} />
                <QSolTable Qsoljul={Qsoljul}
                  qsj={qsj}
                  Autil={Autil} />
                <label>Carga archivo con datos de envolvente:</label>
                <input ref="fileInput" type="file"
                  onChange={e => this.handleFiles(e)} />
              </Tab>
              <Tab eventKey={2} title="Huecos">
                <HuecosTable huecos={envolvente.huecos} newHueco={newHueco} />
              </Tab>
              <Tab eventKey={3} title="Opacos">
                <OpacosTable opacos={envolvente.opacos} />
              </Tab>
              <Tab eventKey={4} title="P. Térmicos">
                <PTsTable pts={envolvente.pts} />
              </Tab>
            </Tabs>
          </Row>
          {<DevTools position={{ bottom: 0, right: 20 }} />}
        </Grid>
      );
    }

    handleChange(e) {
      const currentValue = e.target.value;
      this.props.appstate.Autil = Number(currentValue);
    }

    handleFiles(e) {
      let file;
      if (e.dataTransfer) {
        file = e.dataTransfer.files[0];
      } else if (e.target) {
        file = e.target.files[0];
      }

      const reader = new FileReader();
      reader.onload = e => {
        const data = JSON.parse(e.target.result);
        this.props.appstate.Autil = Number(data.Autil);
        this.props.appstate.envolvente = data.envolvente;
      };
      reader.readAsText(file);
    }
  }
));
export default Indicators;
