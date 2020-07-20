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

const SpacesTable = inject("appstate")(
  observer(
    class SpacesTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selectedId: [] };
        this.spacetypes = ["ACONDICIONADO", "NO_ACONDICIONADO", "NO_HABITABLE"];
      }

      Float1DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(1)}</span>
      );
      Float2DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(2)}</span>
      );
      BoolFormatter = (cell, _row) => (
        <span>{cell === true ? "Sí" : "No"}</span>
      );

      render() {
        const { spaces } = this.props.appstate;

        return (
          <Col>
            <Row>
              <Col>
                <h4>Espacios de la envolvente térmica</h4>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={spaces}
                  newObj={this.props.appstate.newSpace}
                  selectedId={this.state.selectedId}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={spaces}
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
                    dataField="name"
                    headerText="Nombre del espacio"
                    width="30%"
                  >
                    Nombre
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="inside_tenv"
                    // dataFormat={this.BoolFormatter}
                    // editable={{
                    //   type: "checkbox",
                    //   options: { values: "Sí:No" },
                    //   // options: [
                    //   //   { value: "Sí", value: true },
                    //   //   { value: "No", value: false },
                    //   // ],
                    // }}
                    headerText="¿Pertenece a la envolvente térmica?"
                  >
                    ET
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="multiplier"
                    dataFormat={this.Float1DigitsFormatter}
                    headerText="Multiplicador (-)"
                  >
                    n<br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="area"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Superficie útil del espacio (m²)"
                  >
                    A<br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>
                        [m<sup>2</sup>]
                      </i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="type"
                    editable={{
                      type: "select",
                      options: { values: this.spacetypes },
                    }}
                    headerText="Tipo de espacio (ACONDICIONADO | NO_ACONDICIONADO | NO_HABITABLE)"
                  >
                    Tipo
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="height_net"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Altura libre, o suelo a techo, del espacio (m)"
                  >
                    h<sub>s-t</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[m]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="height_gross"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Altura suelo a suelo del espacio (m)"
                  >
                    h<sub>s-s</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[m]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
          </Col>
        );
      }
    }
  )
);

export default SpacesTable;
