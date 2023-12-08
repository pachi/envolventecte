/* -*- coding: utf-8 -*-

Copyright (c) 2016-2022 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { useContext, useState } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";
import { optionalNumberDisplay } from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import { validateNonNegNumber, validateNumber } from "../tables/Validators.js";
import { THERMAL_BRIDGE_TYPES_MAP } from "../../stores/types.js";

// Tabla de puentes térmicos del edificio
const PTsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerTitle: "Nombre que identifica el puente térmico",
      headerClass: "text-light bg-secondary",
      headerComponent: (_props) => getHeader("Nombre"),
      tooltipValueGetter: ({ data }) => `Puente térmico id: ${data.id}`,
    },
    {
      headerName: "Longitud",
      field: "l",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Longitud del puente térmico (m)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Longitud", "", "m"),
    },
    {
      headerName: "Tipo",
      field: "kind",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(THERMAL_BRIDGE_TYPES_MAP) },
      refData: THERMAL_BRIDGE_TYPES_MAP,
      valueFormatter: ({value})=> THERMAL_BRIDGE_TYPES_MAP[value],
      headerTitle:
        "Tipo del puente térmico: CUBIERTA (encuentro de cubierta o suelo con fachada) | BALCÓN (suelo en vuelo exterior) | ESQUINA (encuentro de cerramientos verticales) | FORJADO (encuentro forjado-fachada) | PARTICIÓN (encuentro de partición interior con fachada, cubierta o suelo) | SOLERA (encuentra de solera o cámara ventilada con fachada) | PILAR (pilar en fachada, cubierta o suelo) | HUECO (contorno de hueco)  | GENÉRICO (puente térmico genérico))",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Tipo", "", "-"),
    },
    {
      headerName: "Transmitancia",
      field: "psi",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      ValueSetter: validateNumber,
      headerClass: "text-light bg-secondary text-center",
      headerTooltip: "Transmitancia térmica lineal del puente térmico (W/mK)",
      headerComponent: (_props) => getHeader("ψ", "", "W/mK"),
    },
  ]);

  const rowData = appstate.thermal_bridges;

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
    />
  );
  // return (
  //   <BootstrapTable
  //     data={appstate.thermal_bridges}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         // Convierte a número campos numéricos
  //         if (["L", "psi"].includes(column.field)) {
  //           row[column.field] = getFloatOrOld(newValue, oldValue);
  //         }
  //       },
  //     })}
  //     selectRow={{
  //       mode: "checkbox",
  //       clickToSelect: true,
  //       clickToEdit: true,
  //       selected: selectedIds,
  //       onSelect: (row, isSelected) => {
  //         if (isSelected) {
  //           setSelectedIds([...selectedIds, row.id]);
  //         } else {
  //           setSelectedIds(selectedIds.filter((it) => it !== row.id));
  //         }
  //       },
  //       hideSelectColumn: true,
  //       bgColor: "lightgray",
  //     }}
  //     columns={columns}
  //   />
  // );
};

export default observer(PTsTable);
