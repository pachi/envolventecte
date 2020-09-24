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
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer, inject } from "mobx-react";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import icongroup from "./img/outline-add_comment-24px.svg";

const PTsTable = inject("appstate")(
  observer(
    class PTsTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selected: [] };
      }

      Float2DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(2)}</span>
      );

      onRowSelect(row, isSelected) {
        const name = row.name;
        if (isSelected) {
          this.setState({ selected: [...this.state.selected, name] });
        } else {
          this.setState({
            selected: this.state.selected.filter((it) => it !== name),
          });
        }
      }

      render() {
        const {
          thermal_bridges: thermal_bridges_obj,
          ptsL,
          ptsPsiL,
        } = this.props.appstate;
        const thermal_bridges = Object.values(thermal_bridges_obj);

        return (
          <Col>
            <Row>
              <Col>
                <h4>Puentes térmicos</h4>
              </Col>
              <Col md="auto">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    title="Agrupa puentes térmicos, sumando longitudes de igual transmitancia térmica lineal."
                    onClick={() => this.props.appstate.agrupaPts()}
                  >
                    <img src={icongroup} alt="Agrupar PTs" /> Agrupar PTs
                  </Button>
                </ButtonGroup>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={thermal_bridges}
                  newObj={this.props.appstate.newPT}
                  selected={this.state.selected}
                  clear={() => this.setState({ selected: [] })}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={thermal_bridges}
                  version="4"
                  striped
                  hover
                  bordered={false}
                  tableHeaderClass="text-light bg-secondary"
                  cellEdit={{ mode: "dbclick", blurToSave: true }}
                  selectRow={{
                    mode: "checkbox",
                    clickToSelectAndEditCell: true,
                    selected: this.state.selected,
                    onSelect: this.onRowSelect.bind(this),
                    hideSelectColumn: true,
                    bgColor: "lightgray",
                  }}
                >
                  <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
                    - ID -{" "}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
                    headerText="Nombre que identifica de forma única el puente térmico"
                    width="30%"
                  >
                    Nombre
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="L"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Longitud del puente térmico (m)"
                    headerAlign="center"
                    dataAlign="center"
                  >
                    Longitud
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[m]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="psi"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Transmitancia térmica lineal del puente térmico (W/mK)"
                    headerAlign="center"
                    dataAlign="center"
                  >
                    &psi;
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[W/mK]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
            <Row>
              <Col>&sum;L = {ptsL.toFixed(2)} m</Col>
            </Row>
            <Row>
              <Col md="auto">&sum;L·&psi; = {ptsPsiL.toFixed(2)} W/K</Col>
            </Row>
            <Row className="text-info small mt-3">
              <Col>
                <p>Donde:</p>
                <ul>
                  <li>
                    <b>Longitud</b>: longitud del puente térmico (m)
                  </li>
                  <li>
                    <b>&psi;</b>: transmitancia térmica lineal del puente
                    térmico (W/mK)
                  </li>
                </ul>
                <p>
                  <b>NOTA</b>: Para los puentes térmicos definidos en la tabla
                  se considera, a efectos del cálculo de K, un factor de ajuste{" "}
                  <i>
                    b<sub>tr,x</sub> = 1.0
                  </i>
                  , de modo que solo deben incluirse aquellos pertenecientes a
                  elementos con un factor de ajuste no nulo.
                </p>
              </Col>
            </Row>
          </Col>
        );
      }
    }
  )
);

export default PTsTable;
