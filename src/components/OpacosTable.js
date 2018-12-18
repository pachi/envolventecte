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
import { uuidv4 } from "../utils.js";

import icongroup from "./img/outline-add_comment-24px.svg";

const OpacosTable = inject("appstate")(
  observer(
    class OpacosTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selectedId: [] };
      }

      newOpaco = () => ({
        id: uuidv4(),
        A: 1.0,
        U: 0.2,
        btrx: 1.0,
        nombre: "Elemento opaco"
      });

      Float1DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(1)}</span>
      );
      Float2DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(2)}</span>
      );
      Float3DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(3)}</span>
      );

      render() {
        const { envolvente, opacosA, opacosAU } = this.props.appstate;
        const opacos = envolvente.opacos;

        return (
          <Col>
            <Row>
              <Col>
                <h4>Elementos opacos de la envolvente térmica</h4>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={opacos}
                  newObj={this.newOpaco}
                  selectedId={this.state.selectedId}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={opacos}
                  striped
                  hover
                  bordered={false}
                  cellEdit={{ mode: "dbclick", blurToSave: true }}
                  selectRow={{
                    mode: "radio",
                    clickToSelectAndEditCell: true,
                    selected: this.state.selectedId,
                    onSelect: (row, isSelected) =>
                      this.setState({
                        selectedId: isSelected ? [row.id] : []
                      }),
                    hideSelectColumn: true,
                    bgColor: "lightgray"
                  }}
                >
                  <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="A"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Área del elemento opaco (m²)"
                  >
                    A (m<sup>2</sup>)
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="U"
                    dataFormat={this.Float3DigitsFormatter}
                    headerText="Transmitancia térmica del elemento opaco (W/m²K)"
                  >
                    U (W/m<sup>2</sup>K)
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="btrx"
                    dataFormat={this.Float1DigitsFormatter}
                    headerText="Factor de ajuste del elemento opaco (fracción)"
                  >
                    b<sub>tr,x</sub>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="nombre"
                    headerText="Descripción identificativa del elemento opaco"
                    width="40%"
                  >
                    Descripción
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
            <Row>
              <Col>
                &sum;b<sub>tr,x</sub>·A<sub>x</sub> = {opacosA.toFixed(2)} m²
              </Col>
              <Col md="auto">
                &sum;b<sub>tr,x</sub>·&sum;<sub>i</sub>A<sub>i</sub>·U
                <sub>i</sub> = {opacosAU.toFixed(2)} W/K
              </Col>
            </Row>
            <Row className="mt-3 justify-content-end">
              <Col md="auto">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    title="Agrupa opacos, sumando áreas de igual transmitancia y factor de ajuste."
                    onClick={() => opacos.replace(this.agrupaOpacos(opacos))}
                  >
                    <img src={icongroup} alt="Agrupar opacos" /> Agrupar opacos
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            <Row className="text-info small mt-3">
              <Col>
                <p>Donde:</p>
                <ul>
                  <li>
                    <b>A</b>: área del elemento opaco (m²)
                  </li>
                  <li>
                    <b>U</b>: transmitancia térmica del elemento opaco (W/m²K)
                  </li>
                  <li>
                    <b>
                      b<sub>tr,x</sub>
                    </b>
                    : factor de ajuste del elemento opaco (fracción)
                  </li>
                </ul>
                <p>
                  <b>NOTA</b>: El factor de ajuste propuesto para elementos en
                  contacto con edificios o espacios adyacentes es{" "}
                  <i>
                    b<sub>tr,x</sub> = 0.0
                  </i>
                  , y{" "}
                  <i>
                    b<sub>tr,x</sub> = 1.0{" "}
                  </i>
                  para el resto de casos.
                </p>
                <p>
                  Esta simplificación introduce cierto error al considerar que
                  el intercambio de calor a través de los elementos en contacto
                  con otros edificios o espacios adyacentes es despreciable,
                  pero simplifica considerablemente los cálculos.
                </p>
              </Col>
            </Row>
          </Col>
        );
      }

      // Agrupa superficie de opacos por tipos
      agrupaOpacos(opacos) {
        const isequal = (o1, o2) =>
          Number(o1.U) === Number(o2.U) && Number(o1.btrx) === Number(o2.btrx);
        const opacosagrupados = [];
        for (let opaco of opacos) {
          const o = opacosagrupados.find(e => isequal(opaco, e));
          if (o) {
            o.A = o.A + opaco.A;
            o.id = uuidv4();
            o.nombre = o.nombre + ", " + opaco.nombre;
          } else {
            opacosagrupados.push(opaco);
          }
        }
        return opacosagrupados;
      }
    }
  )
);

export default OpacosTable;
