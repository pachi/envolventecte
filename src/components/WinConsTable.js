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

import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer } from "mobx-react-lite";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";

const Float2DigitsFmt = (cell, _row) => <span>{Number(cell).toFixed(2)}</span>;

const WinConsTable = observer(({ appstate }) => {
  const [selected, setSelected] = useState([]);

  return (
    <Col>
      <Row>
        <Col>
          <h4>Construcciones de Huecos</h4>
        </Col>
        <Col md="auto">
          <AddRemoveButtonGroup
            objects={appstate.wincons}
            newObj={appstate.newWinCons}
            selected={selected}
            clear={() => setSelected([])}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BootstrapTable
            data={appstate.wincons}
            version="4"
            striped
            hover
            bordered={false}
            tableHeaderClass="text-light bg-secondary"
            cellEdit={{
              mode: "dbclick",
              blurToSave: true,
              afterSaveCell: (row, cellName, cellValue) => {
                if (
                  ["U", "Ff", "gglwi", "gglshwi", "C_100"].includes(cellName)
                ) {
                  // Convierte a número campos numéricos
                  row[cellName] = Number(cellValue);
                }
              },
            }}
            selectRow={{
              mode: "checkbox",
              clickToSelectAndEditCell: true,
              selected: selected,
              onSelect: (row, isSelected) => {
                if (isSelected) {
                  setSelected([...selected, row.id]);
                } else {
                  setSelected(selected.filter((it) => it !== row.id));
                }
              },
              hideSelectColumn: true,
              bgColor: "lightgray",
            }}
          >
            <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
              - ID -{" "}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="name"
              headerText="Nombre que identifica de forma única la construcción de hueco"
              width="30%"
            >
              Nombre
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="group"
              headerText="Grupo de soluciones al que pertenece la construcción (solo a efectos de clasificación)"
              headerAlign="center"
              dataAlign="center"
            >
              Grupo
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="U"
              dataFormat={Float2DigitsFmt}
              headerText="Transmitancia térmica del hueco (W/m²K)"
              headerAlign="center"
              dataAlign="center"
            >
              U<sub>w</sub>
              <br />
              <span style={{ fontWeight: "normal" }}>
                <i>[W/m²K]</i>{" "}
              </span>
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="Ff"
              dataFormat={Float2DigitsFmt}
              headerText="Fracción de marco de la construcción de hueco (-)"
              headerAlign="center"
              dataAlign="center"
            >
              F<sub>f</sub>
              <br />
              <span style={{ fontWeight: "normal" }}>
                <i>[-]</i>{" "}
              </span>
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="gglwi"
              dataFormat={Float2DigitsFmt}
              headerText="Factor solar del hueco sin la protección solar activada (g_glwi = g_gln * 0.90) (-)"
              headerAlign="center"
              dataAlign="center"
            >
              g<sub>gl;wi</sub>
              <br />
              <span style={{ fontWeight: "normal" }}>
                <i>[-]</i>{" "}
              </span>
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="gglshwi"
              dataFormat={Float2DigitsFmt}
              headerText="Factor solar del hueco con la protección solar activada (g_glwi = g_gln * 0.90) (-)"
              headerAlign="center"
              dataAlign="center"
            >
              g<sub>gl;sh;wi</sub>
              <br />
              <span style={{ fontWeight: "normal" }}>
                <i>[-]</i>{" "}
              </span>
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="C_100"
              dataFormat={Float2DigitsFmt}
              headerText="Permeabilidad al aire a 100 Pa (m³/hm²)"
              headerAlign="center"
              dataAlign="center"
            >
              C<sub>h;100</sub>
              <br />
              <span style={{ fontWeight: "normal" }}>
                <i>[m³/h·m²]</i>{" "}
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
              <b>Grupo</b>: grupo de clasificación de las construcciones de
              opacos
            </li>
            <li>
              <b>U</b>: Transmitancia térmica del hueco (W/m²K)
            </li>
            <li>
              <b>
                F<sub>f</sub>
              </b>
              : fracción de marco (-)
            </li>
            <li>
              <b>
                g<sub>gl;wi</sub>
              </b>
              : factor solar del hueco sin la protección solar activada (g_glwi
              = g_gln * 0.90) (-)
            </li>
            <li>
              <b>
                g<sub>gl;sh;wi</sub>
              </b>
              : factor solar del hueco con la protección solar activada (-)
            </li>
            <li>
              <b>
                C<sub>h;100</sub>
              </b>
              : Coeficiente de permeabilidad al aire del hueco a 100 Pa de
              diferencia de presión (m³/h·m²). La clase de permeabilidad al aire
              de los huecos, según la norma UNE EN 12207:2000 es: Clase 1: C
              <sub>w;100</sub> &le; 50m3/hm2, Clase 2: C<sub>w;100</sub> &le; 27
              m³/hm², Clase 3: C<sub>w;100</sub> &le; 9 m³/hm², Clase 4: C
              <sub>w;100</sub> &le; 3 m³/hm².
            </li>
          </ul>
        </Col>
      </Row>
    </Col>
  );
});

export default WinConsTable;
