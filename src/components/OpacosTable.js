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

const Float1DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(1)}</span>
);
const Float2DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(2)}</span>
);
const Float3DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(3)}</span>
);

const BoundaryTypeFormatter = (cell, _row) => (
  <span>{boundarytypesmap[cell]}</span>
);

const boundarytypesmap = {
  EXTERIOR: "EXTERIOR",
  INTERIOR: "INTERIOR",
  ADIABATIC: "ADIABÁTICO",
  UNDERGROUND: "TERRENO",
};

const boundarytypes = [
  { text: "EXTERIOR", value: "EXTERIOR" },
  { text: "INTERIOR", value: "INTERIOR" },
  { text: "ADIABÁTICO", value: "ADIABATIC" },
  { text: "TERRENO", value: "UNDERGROUND" },
];

const OpacosTable = inject("appstate")(
  observer(
    class OpacosTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selectedId: [] };
      }

      render() {
        const { Co100, envelope, opacosA, opacosAU } = this.props.appstate;
        const walls = envelope.walls;

        return (
          <Col>
            <Row>
              <Col>
                <h4>Elementos opacos de la envolvente térmica</h4>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={walls}
                  newObj={this.props.appstate.newOpaco}
                  selectedId={this.state.selectedId}
                />
              </Col>
            </Row>
            <Row>
              <Col
                title="Coeficiente de caudal de aire de la parte opaca de la envolvente
                térmica (a 100 Pa)"
                className="my-3 text-right"
              >
                <b>
                  C<sub>o</sub>
                </b>{" "}
                ={" "}
                <input
                  type="text"
                  onChange={(e) => {
                    this.props.appstate.Co100 = Number(e.target.value);
                  }}
                  value={Co100}
                />{" "}
                m<sup>3</sup>/h·m<sup>2</sup>
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={walls}
                  version="4"
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
                        selectedId: isSelected ? [row.id] : [],
                      }),
                    hideSelectColumn: true,
                    bgColor: "lightgray",
                  }}
                >
                  <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="A"
                    dataFormat={Float2DigitsFormatter}
                    headerText="Área del elemento opaco (m²)"
                  >
                    A<br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>
                        [m<sup>2</sup>]
                      </i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="U"
                    dataFormat={Float3DigitsFormatter}
                    headerText="Transmitancia térmica del elemento opaco (W/m²K)"
                  >
                    U<br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>
                        [W/m<sup>2</sup>K]
                      </i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="bounds"
                    editable={{
                      type: "select",
                      options: { values: boundarytypes },
                    }}
                    dataFormat={BoundaryTypeFormatter}
                    headerText="Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | UNDERGROUND | ADIABATIC)"
                  >
                    Tipo
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
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
                    onClick={() => this.props.appstate.agrupaOpacos()}
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
                    <b>Tipo</b>: Condición de contorno del elemento opaco
                    (EXTERIOR, INTERIOR, ADIABÁTICO, TERRENO). Determina el
                    factor de ajuste del elemento opaco (b<sub>tr,x</sub>), que
                    vale 1 para elementos en contacto con el aire exterior o el
                    terreno y 0 para el resto (adiabáticos y en contacto con
                    otros espacios).
                    <p>
                      Esta simplificación introduce cierto error al considerar
                      que el intercambio de calor a través de los elementos en
                      contacto con otros edificios o espacios adyacentes es
                      despreciable, pero simplifica considerablemente los
                      cálculos y el objetivo del parámetro K no es, en el caso
                      del DB-HE, el cálculo de la demanda energética si no como
                      indicador de la calidad de la envolvente térmica.
                    </p>
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

export default OpacosTable;
