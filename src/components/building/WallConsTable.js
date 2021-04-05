/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { useContext } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";

const Float2DigitsFmt = (cell, _row) => <span>{Number(cell).toFixed(2)}</span>;

// Tabla de opacos del edificio
const WallConsTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const walls_Co100 = appstate.he1_indicators.C_o;
  return (
    <BootstrapTable
      data={appstate.wallcons}
      version="4"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={{
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (row, cellName, cellValue) => {
          if (["thickness", "R_intrinsic", "absorptance"].includes(cellName)) {
            // Convierte a número campos numéricos
            row[cellName] = Number(cellValue.replace(",", "."));
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
        headerText="Nombre que identifica de forma única la construcción de opaco"
        width="30%"
        columnTitle={(cell, row) => `Construcción de opaco id: ${row.id}`}
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
        dataField="thickness"
        dataFormat={Float2DigitsFmt}
        headerText="Grosor el elemento (m)"
        headerAlign="center"
        dataAlign="center"
      >
        e
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[m]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="R_intrinsic"
        dataFormat={Float2DigitsFmt}
        headerText="Resistencia intrínseca de la solución constructiva (solo capas, sin resistencias superficiales) (m²K/W)"
        headerAlign="center"
        dataAlign="center"
      >
        R<sub>e</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[m²K/W]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="absorptance"
        dataFormat={Float2DigitsFmt}
        headerText="Absortividad térmica de la solución constructiva (-)"
        headerAlign="center"
        dataAlign="center"
      >
        &alpha;
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>

      <TableHeaderColumn
        datatField="name"
        dataFormat={() => walls_Co100}
        headerText="Coeficiente de caudal de aire de la parte opaca de la envolvente
    térmica (a 100 Pa). Varía según n50 de ensayo o tipo de edificio (nuevo / existente)"
        editable={false}
        columnClassName="td-column-readonly"
        headerAlign="center"
        dataAlign="center"
      >
        C<sub>o</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          [m<sup>3</sup>/h·m<sup>2</sup>]
        </span>
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default observer(WallConsTable);
