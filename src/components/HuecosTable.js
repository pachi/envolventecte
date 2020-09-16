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

const Float2DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(2)}</span>
);

const HuecosTable = inject("appstate")(
  observer(
    class HuecosTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selected: [] };
        this.orientacionesList = [
          "Horiz.",
          "N",
          "NE",
          "E",
          "SE",
          "S",
          "SW",
          "W",
          "NW",
        ];
      }

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
        const { windows: windows_obj, huecosA, huecosAU } = this.props.appstate;
        const windows = Object.values(windows_obj);

        return (
          <Col>
            <Row>
              <Col>
                <h4>Huecos del edificio</h4>
              </Col>
              <Col md="auto">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    title="Agrupar huecos de igual orientación, fracción de marco, transmitancia y factor de transmisión solar con protecciones solares activadas. Suma las áreas y calcula el factor equivalente de sombras remotas."
                    onClick={() => this.props.appstate.agrupaHuecos()}
                  >
                    <img src={icongroup} alt="Agrupar huecos" /> Agrupar huecos
                  </Button>
                </ButtonGroup>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={windows}
                  newObj={this.props.appstate.newHueco}
                  selected={this.state.selected}
                  clear={() => this.setState({ selected: [] })}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={windows}
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
                    headerText="Nombre que identifica de forma única el hueco"
                    width="30%"
                  >
                    Nombre
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="A"
                    dataFormat={Float2DigitsFormatter}
                    headerText="Área proyectada del hueco (m2)"
                  >
                    A<sub>w,p</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>
                        [m<sup>2</sup>]
                      </i>
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="cons"
                    headerText="Construcción del hueco"
                  >
                    Construcción
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="wall"
                    headerText="Opaco al que pertenece el hueco"
                  >
                    Opaco
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="fshobst"
                    dataFormat={Float2DigitsFormatter}
                    headerText="Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores."
                  >
                    F<sub>sh;obst</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>
                    </span>
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
            <Row>
              <Col>&sum;A = {huecosA.toFixed(2)} m²</Col>
            </Row>
            <Row>
              <Col md="auto">&sum;A·U = {huecosAU.toFixed(2)} W/K</Col>
            </Row>
            <Row className="text-info small mt-3">
              <Col>
                <p>Donde:</p>
                <ul>
                  <li>
                    <b>
                      A<sub>w,p</sub>
                    </b>
                    : área (proyectada) del hueco (m²)
                  </li>
                  <li>
                    <b>Construcción</b>: Solución constructiva del hueco.
                  </li>
                  <li>
                    <b>Opaco</b>: Elemento opaco en el que se sitúa el hueco
                  </li>
                  <li>
                    <b>
                      F<sub>sh;obst</sub>
                    </b>
                    : factor reductor por sombreamiento por obstáculos externos
                    (comprende todos los elementos exteriores al hueco como
                    voladizos, aletas laterales, retranqueos, obstáculos
                    remotos, etc.), para el mes de julio (fracción).
                    <br />
                    Este valor puede asimilarse al factor de sombra del hueco (
                    <i>
                      F<sub>S</sub>
                    </i>
                    ). El Documento de Apoyo <i>DA DB-HE/1</i> recoge valores
                    del factor de sombra{" "}
                    <i>
                      F<sub>S</sub>
                    </i>{" "}
                    para considerar el efecto de voladizos, retranqueos, aletas
                    laterales o lamas exteriores.
                  </li>
                </ul>
                <p>
                  <b>NOTA</b>: Para los huecos definidos en la tabla se
                  considera, a efectos del cálculo de K, un factor de ajuste{" "}
                  <i>
                    b<sub>tr,x</sub> = 1.0
                  </i>
                  , de modo que solo deben incluirse aquellos pertenecientes a
                  elementos con un factor de ajuste distinto de cero. Es decir,
                  deben excluirse aquellos huecos situados en elementos en
                  contacto con edificios o espacios adyacentes, cuyo{" "}
                  <i>
                    b<sub>tr,x</sub> = 0.0
                  </i>
                  .
                </p>
              </Col>
            </Row>
          </Col>
        );
      }
    }
  )
);

export default HuecosTable;
