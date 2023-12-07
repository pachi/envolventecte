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

import React, { useContext, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { optionalNumberDisplay } from "../tables/FormattersAg";
import { validateNonNegNumber } from "../tables/ValidatorsAg";
import { getFloatOrOld } from "../tables/utils";

const getHeader = (name, sub, units) => (
  <>
    {name}
    {sub ? <sub>{sub}</sub> : null}
    <br />
    <span style={{ fontWeight: "normal" }}>
      <i>[{units}]</i>{" "}
    </span>
  </>
);

// Tabla de materiales para opacos del edificio
const GlassesTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  const [columnDefs, setColumnDefs] = useState([
    // https://www.ag-grid.com/javascript-data-grid/column-properties/
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      // cellStyle: (params) => ({ width: "40%" }),
      cellClass: "font-weight-bold",
      flex: 2,
      headerClass: "text-light bg-secondary",
      headerTooltip: "Nombre que identifica de forma única el tipo de vidrio",
      tooltipValueGetter: ({data}) => `Vidrio id: ${data.id}`,
      // tooltipField: "id",
    },
    {
      headerName: "U",
      field: "u_value",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip: "Transmitancia térmica del vidrio (W/m²K)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "", "W/m²K"),
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
    },
    {
      headerName: "Factor solar del vidrio a incidencia normal",
      field: "g_gln",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip: "Factor solar del vidrio a incidencia normal (-)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("g", "gl;n", "W/m²K"),
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    editable: true,
    singleClickEdit: true,
    sortable: true,
    resizable: false,
    filter: true,
    flex: 1,
    minWidth: 50,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  }));

  const rowData = appstate.cons.glasses;

  const onCellValueChanged = (params) => {
    if (params.column.getColId() === "u_value") {
      const value = getFloatOrOld(params.newValue, params.oldValue);
      params.data[params.column.getColId()] = value;
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        tooltipShowDelay={500}
        onCellValueChanged={onCellValueChanged}
        rowMultiSelectWithClick
        suppressRowClickSelection
        onSelectionChanged={(params) => {
          setSelectedIds(
            params.api.getSelectedNodes().map((node) => node.data.id)
          );
        }}
        rowDeselection
      />
    </div>
  );
};

export default observer(GlassesTable);
