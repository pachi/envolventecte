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
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer, inject } from "mobx-react";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import { uuidv4 } from "../utils.js";

import icongroup from "./img/outline-add_comment-24px.svg";

const PTsTable = inject("appstate")(
  observer(
    class PTsTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selectedId: [] };
      }

      newPT = () => ({
        id: uuidv4(),
        L: 1.0,
        psi: 0.05,
        nombre: "PT por defecto"
      });

      Float2DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(2)}</span>
      );

      render() {
        const { envolvente, ptsL, ptsPsiL } = this.props.appstate;
        const pts = envolvente.pts;

        return (
          <Container className="mt-3">
            <Row>
              <Col>
                <h4>Puentes térmicos de la envolvente térmica</h4>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={pts}
                  newObj={this.newPT}
                  selectedId={this.state.selectedId}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BootstrapTable
                  data={pts}
                  striped
                  hover
                  bordered={false}
                  cellEdit={{ mode: "dbclick", blurToSave: true }}
                  selectRow={{
                    mode: "radio",
                    clickToSelectAndEditCell: true,
                    selected: this.state.selectedId,
                    onSelect: (row, isSelected) =>
                      this.setState({ selectedId: isSelected ? [row.id] : [] }),
                    hideSelectColumn: true,
                    bgColor: "lightgray"
                  }}
                >
                  <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="L"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Longitud del puente térmico (m)"
                  >
                    Longitud (m)
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="psi"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Transmitancia térmica lineal del puente térmico (W/mK)"
                  >
                    &psi; (W/mK)
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="nombre"
                    headerText="Descripción identificativa del puente térmico"
                    width="40%"
                  >
                    Descripción
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
            <Row>
              <Col>&sum;L = {ptsL.toFixed(2)} m</Col>
              <Col md="auto">&sum;L·&psi; = {ptsPsiL.toFixed(2)} W/K</Col>
            </Row>
            <Row className="top20 justify-content-end">
              <Col md="auto">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    title="Agrupa puentes térmicos, sumando longitudes de igual transmitancia térmica lineal."
                    onClick={() => pts.replace(this.agrupaPts(pts))}
                  >
                    <img src={icongroup} alt="Agrupar PTs" /> Agrupar PTs
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
            <Row className="text-info small top20">
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
          </Container>
        );
      }
      // Agrupa longitudes de puentes térmicos por tipos
      agrupaPts(pts) {
        const isequal = (p1, p2) => Number(p1.psi) === Number(p2.psi);
        const ptsagrupados = [];
        for (let pt of pts) {
          const p = ptsagrupados.find(e => isequal(pt, e));
          if (p) {
            p.A = p.L + pt.L;
            p.id = uuidv4();
            p.nombre = p.nombre + ", " + pt.nombre;
          } else {
            ptsagrupados.push(pt);
          }
        }
        return ptsagrupados;
      }
    }
  )
);

export default PTsTable;
