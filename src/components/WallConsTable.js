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
import { Col, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer, inject } from "mobx-react";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";

const WallConsTable = inject("appstate")(
  observer(
    class WallConsTable extends Component {
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
        const wallcons = Object.values(this.props.appstate.wallcons);

        return (
          <Col>
            <Row>
              <Col>
                <h4>Construcciones de Opacos</h4>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={wallcons}
                  newObj={this.props.appstate.newWallCons}
                  selected={this.state.selected}
                  clear={() => this.setState({ selected: [] })}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={wallcons}
                  version="4"
                  striped
                  hover
                  bordered={false}
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
                    headerText="Nombre que identifica de forma única la construcción de opaco"
                    width="30%"
                  >
                    Nombre
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="group"
                    headerText="Grupo de soluciones al que pertenece la construcción (solo a efectos de clasificación)"
                  >
                    Grupo
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="R_intrinsic"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Resistencia intrínseca de la solución constructiva (solo capas, sin resistencias superficiales) (m²K/W)"
                  >
                    R<sub>e</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[m²K/W]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="absorptance"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Absortividad térmica de la solución constructiva (-)"
                  >
                    &alpha;
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
            <Row className="text-info small mt-3">
              <Col>
                <p>Donde:</p>
                <ul>
                  <li>
                    <b>Grupo</b>: grupo de clasificación de las construcciones
                    de opacos
                  </li>
                  <li>
                    <b>
                      R<sub>e</sub>
                    </b>
                    : resistencia intrínseca (sin resistencias superficiales,
                    solo de las capas) del elemento (m²K/W)
                  </li>
                  <li>
                    <b>&alpha;</b>: absortividad térmica de la construcción [-]
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        );
      }
    }
  )
);

export default WallConsTable;
