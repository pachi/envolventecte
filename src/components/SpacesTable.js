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

import React, { Component, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer, inject } from "mobx-react";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";

const Float1DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(1)}</span>
);

const Float2DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(2)}</span>
);

const BoolFormatter = (cell, _row) => (
  <span>{cell === true ? "Sí" : "No"}</span>
);

const SpaceTypeFormatter = (cell, _row) => (
  <span>{spacetypesmapinv[cell]}</span>
);

const spacetypesmapinv = {
  CONDITIONED: "ACONDICIONADO",
  UNCONDITIONED: "NO ACONDICIONADO",
  UNINHABITED: "NO HABITABLE",
};

const spacetypes = [
  { text: "ACONDICIONADO", value: "CONDITIONED" },
  { text: "NO ACONDICONADO", value: "UNCONDITIONED" },
  { text: "NO HABITABLE", value: "UNINHABITED" },
];

// Custom editor para booleanos
//
// The getElement function returns a JSX value and takes two arguments:
//  - onUpdate: if you want to apply the modified data, call this function
//  - props: contain customEditorParameters, whole row data, defaultValue and attrs
// Usamos forwardRef para poder tener referencias en componentes funcionales
// ver: https://github.com/reactjs/reactjs.org/issues/2120
const BoolEditor = React.forwardRef((props, ref) => {
  const { defaultValue, onKeyDown, onUpdate } = props;
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      type="checkbox"
      checked={value}
      onKeyDown={onKeyDown}
      onChange={(e) => setValue(!value)}
      onBlur={(e) => onUpdate(value)}
    />
  );
});

const SpacesTable = inject("appstate")(
  observer(
    class SpacesTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selectedId: [] };
      }

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
                    customEditor={{
                      getElement: (onUpdate, props) => (
                        <BoolEditor onUpdate={onUpdate} {...props} />
                      ),
                    }}
                    dataFormat={BoolFormatter}
                    headerText="¿Pertenece a la envolvente térmica?"
                  >
                    ¿Interior <br />a la E.T.?
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="multiplier"
                    dataFormat={Float1DigitsFormatter}
                    headerText="Multiplicador (-)"
                  >
                    n<br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="area"
                    dataFormat={Float2DigitsFormatter}
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
                      options: { values: spacetypes },
                    }}
                    dataFormat={SpaceTypeFormatter}
                    headerText="Tipo de espacio: ACONDICIONADO, NO ACONDICIONADO, NO HABITABLE"
                  >
                    Tipo
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>{" "}
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="height_net"
                    dataFormat={Float2DigitsFormatter}
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
                    dataFormat={Float2DigitsFormatter}
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
