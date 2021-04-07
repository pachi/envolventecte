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
import {
  azimuth_name,
  tilt_name,
} from "../../utils";

const AzimuthFmt = (cell, _row) => <span>{azimuth_name(cell)}</span>;
const TiltFmt = (cell, _row) => <span>{tilt_name(cell)}</span>;

// Tabla de elementos de sombra del edificio
const ShadesTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  return (
    <BootstrapTable
      data={appstate.shades}
      version="4"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={{
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (row, cellName, cellValue) => {
          if (["azimuth", "tilt"].includes(cellName)) {
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
        headerText="Nombre que identifica de forma única el elemento de sombra"
        width="30%"
        columnTitle={(_cell, row) => `Elemento de sombra id: ${row.id}`}
      >
        Nombre
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="azimuth"
        dataFormat={AzimuthFmt}
        headerText="Orientación (gamma) [-180,+180] (S=0, E=+90, W=-90). Medido como azimuth geográfico de la proyección horizontal de la normal a la superficie"
        headerAlign="center"
        dataAlign="center"
      >
        Orientación
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="tilt"
        dataFormat={TiltFmt}
        headerText="Inclinación (beta) [0, 180]. Medido respecto a la horizontal y normal hacia arriba (0 -> suelo, 180 -> techo)"
        headerAlign="center"
        dataAlign="center"
      >
        Inclinación
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default observer(ShadesTable);
