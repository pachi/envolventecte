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
  Grid, Panel, Row, Tabs, Tab
} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import NavBar from './Nav';

import { uuidv4 } from '../utils.js';

const Float1DigitsFormatter = (cell, row) => <span>{Number(cell).toFixed(1)}</span>;
const Float2DigitsFormatter = (cell, row) => <span>{Number(cell).toFixed(2)}</span>;
const Float3DigitsFormatter = (cell, row) => <span>{Number(cell).toFixed(3)}</span>;

// Orientaciones
const orientacionesType = ['Horiz.', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const PlusMinusButtonRow = ({ objects, newObj, selectedId }) =>
    <ButtonGroup className="pull-right">
      <Button bsStyle="primary" bsSize="xs"
        onClick={() => {
          objects.push({ ...newObj, id: uuidv4() });
        }}>
        <Glyphicon glyph="plus" />
      </Button>
      <Button bsStyle="primary" bsSize="xs"
        onClick={() => {
          // Duplicamos el seleccionado o el primer objeto si hay objetos
          if (objects.length > 0) {
            const selectedIndex = objects.findIndex(h => h.id === selectedId);
            const idx = selectedIndex >= 0 ? selectedIndex : 0;
            const dupObj = { ...objects[idx], id: uuidv4() };
            objects.splice(idx, 0, dupObj);
          // En caso contrario añadimos un objeto nuevo
          } else {
            objects.push({ ...newObj, id: uuidv4() });
          }
        }}>
        <Glyphicon glyph="duplicate" />
      </Button>
      <Button bsStyle="primary" bsSize="xs"
        onClick={() => {
          // https://mobx.js.org/refguide/array.html
          objects.replace(objects.filter(h => !selectedId.includes(h.id)));
        }}>
        <Glyphicon glyph="minus" />
      </Button>
    </ButtonGroup>;


class HuecosTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selectedId: [] };
  }

  render() {
    const { huecos, newHueco, huecosA, huecosAU } = this.props;
    return (
      <Grid>
        <h2>
          Huecos de la envolvente térmica
          <PlusMinusButtonRow objects={huecos} newObj={newHueco}
                              selectedId={this.state.selectedId} />
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
          <TableHeaderColumn dataField="A" dataFormat={Float2DigitsFormatter}>A (m<sup>2</sup>)</TableHeaderColumn>
          <TableHeaderColumn dataField="U" dataFormat={Float3DigitsFormatter}>U (W/m<sup>2</sup>K)</TableHeaderColumn>
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
          <TableHeaderColumn dataField="nombre">Descripción</TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;A = { huecosA.toFixed(2) } m²</Col>
          <Col md={6} className="text-right">&sum;A·U = { huecosAU.toFixed(2) } W/K</Col>
        </Row>
        <Row className="text-info small">
          <Col md={12}>
            NOTA: Para los huecos definidos en la tabla se considera, a efectos
            del cálculo de K, un factor de ajuste <i>b<sub>tr,x</sub> = 1.0</i>, de modo que
            solo deben incluirse aquellos pertenecientes a elementos con un factor de ajuste no nulo.
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

  render() {
    const { opacos, newOpaco, opacosA, opacosAU } = this.props;
    return (
      <Grid>
        <h2>
          Elementos opacos de la envolvente térmica
          <PlusMinusButtonRow objects={opacos} newObj={newOpaco}
                              selectedId={this.state.selectedId} />
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
          <TableHeaderColumn dataField="A" dataFormat={Float2DigitsFormatter}>A (m<sup>2</sup>)</TableHeaderColumn>
          <TableHeaderColumn dataField="U" dataFormat={Float3DigitsFormatter}>U (W/m<sup>2</sup>K)</TableHeaderColumn>
          <TableHeaderColumn dataField="btrx" dataFormat={Float1DigitsFormatter}>b<sub>tr,x</sub></TableHeaderColumn>
          <TableHeaderColumn dataField="nombre">Descripción</TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;b<sub>tr,x</sub>·A<sub>x</sub> = {opacosA.toFixed(2)} m²</Col>
          <Col md={6} className="text-right">&sum;b<sub>tr,x</sub>·&sum;<sub>i</sub>A<sub>i</sub>·U<sub>i</sub> = {opacosAU.toFixed(2)} W/K</Col>
        </Row>
        <Row className="text-info small">
          <Col md={12}>
            NOTA: El factor de ajuste propuesto para elementos en contacto con edificios o
            espacios adyacentes es <i>b<sub>tr,x</sub> = 0.0</i>, y <i>b<sub>tr,x</sub> = 1.0</i>
            para el resto de casos.
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

  render() {
    const { pts, newPT, ptsL, ptsPsiL } = this.props;
    return (
      <Grid>
        <h2>
          Puentes térmicos de la envolvente térmica
          <PlusMinusButtonRow objects={pts} newObj={newPT}
                              selectedId={this.state.selectedId} />
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
          <TableHeaderColumn dataField="L" dataFormat={Float2DigitsFormatter}>Longitud (m)</TableHeaderColumn>
          <TableHeaderColumn dataField="psi" dataFormat={Float2DigitsFormatter}>&psi; (W/mK)</TableHeaderColumn>
          <TableHeaderColumn dataField="nombre">Descripción</TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;L = {ptsL.toFixed(2)} m</Col>
          <Col md={6} className="text-right">&sum;L·&psi; = {ptsPsiL.toFixed(2)} W/K</Col>
        </Row>
        <Row className="text-info small">
          <Col md={12}>
            NOTA: Para los puentes térmicos definidos en la tabla se considera, a efectos
            del cálculo de K, un factor de ajuste <i>b<sub>tr,x</sub> = 1.0</i>, de modo que
            solo deben incluirse aquellos pertenecientes a elementos con un factor de ajuste no nulo.
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
      const { climateTotRad } = this.props.radstate;
      const Qsoljul_clima = Qsoljul(climateTotRad);
      const qsj_clima = qsj(climateTotRad);

      return (
        <Grid>
          <Row>
            <Col md={1}>
              <Button bsSize="xs" bsStyle="info" onClick={() => this.setState({ open: !this.state.open })}>
                <Glyphicon glyph="plus" />
              </Button>
            </Col>
            <Col md={3}><b><i>K</i> = {K.toFixed(2)} <i>W/m²K</i></b></Col>
            <Col md={3}><b><i>q<sub>sol;jul</sub></i> = {qsj_clima.toFixed(2)} <i>kWh/m²/mes</i></b></Col>
            <Col md={5} className="text-right">
              <p>
                <b>A<sub>util</sub></b> = <input type="text"
                                                 onChange={ e => this.handleChange(e) }
                                                 value={Autil} /> m²
              </p>
            </Col>
          </Row>
          <Panel collapsible expanded={this.state.open} bsStyle="info">
            <Grid>
              <Row>
                <h3>Transmitancia térmica global</h3>
                <p>H<sub>tr,adj</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> · [&sum;<sub>i</sub> A<sub>x,i</sub> · U<sub>x,i</sub> (huecos + opacos) + &sum;<sub>k</sub> l<sub>x,k</sub> · ψ<sub>x,k</sub> (PTs)] = {huecosAU.toFixed(2)} W/K (huecos) + {opacosAU.toFixed(2)} W/K (opacos) + {ptsPsiL.toFixed(2)} W/K (PTs) = {(totalAU + ptsPsiL).toFixed(2)} W/K </p>
                <p>&sum;A = &sum; b<sub>tr,x</sub> · A<sub>x</sub> = {Number(huecosA).toFixed(2)} m² (huecos) + {Number(opacosA).toFixed(2)} m² (opacos) = {Number(totalA).toFixed(2)} m²</p>
                <p><b>K</b> = H<sub>tr,adj</sub> / &sum;A &asymp; { (totalAU + ptsPsiL).toFixed(2) } / { (totalA).toFixed(2) } = <b>{Number(K).toFixed(2)} <i>W/m²K</i></b> </p>
              </Row>
              <Row>
                <h3>Captación solar</h3>
                <p>Q<sub>sol;jul</sub> &sum;<sub>k</sub>(F<sub>sh,obst</sub> · F <sub>sh,gl</sub> · g<sub>gl</sub> · (1 − F<sub>F</sub>) · A<sub>w,p</sub> · H<sub>sol;jul</sub>) = {Qsoljul_clima.toFixed(2)} kWh/mes</p>
                <p>A<sub>util</sub> = {Autil} m²</p>
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
      const { envolvente, newHueco, newOpaco, newPT,
              huecosA, huecosAU, opacosA, opacosAU, ptsL, ptsPsiL } = this.props.appstate;
      return (
        <Grid>
          <NavBar route={this.props.route} />
          <Row>
            <IndicatorsPanel />
          </Row>
          <Row>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Huecos">
                <HuecosTable huecos={envolvente.huecos} {...{ newHueco, huecosA, huecosAU }} />
              </Tab>
              <Tab eventKey={2} title="Opacos">
                <OpacosTable opacos={envolvente.opacos} {...{ newOpaco, opacosA, opacosAU }} />
              </Tab>
              <Tab eventKey={3} title="P. Térmicos">
                <PTsTable pts={envolvente.pts} {...{ newPT, ptsL, ptsPsiL }} />
              </Tab>
              <Tab eventKey={4} title="Carga de datos">
                <label>Carga archivo con datos de envolvente:</label>
                <input ref="fileInput" type="file"
                  onChange={e => this.handleFiles(e)} />
              </Tab>
            </Tabs>
          </Row>
          {<DevTools position={{ bottom: 0, right: 20 }} />}
        </Grid>
      );
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
