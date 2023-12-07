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
import { getHeader } from "../tables/Helpers";
import { validateNonNegNumber } from "../tables/ValidatorsAg";

// Tabla de materiales para opacos del edificio
const FamesTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  const [columnDefs, setColumnDefs] = useState([
    // https://www.ag-grid.com/javascript-data-grid/column-properties/
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerClass: "text-light bg-secondary",
      headerTooltip: "Nombre que identifica de forma única el tipo de marco",
      tooltipValueGetter: ({ data }) => `Marco id: ${data.id}`,
    },
    {
      headerName: "U",
      field: "u_value",
      cellClass: "text-center",
      headerTooltip: "Transmitancia térmica del marco (W/m²K)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "", "W/m²K"),
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
    },
    {
      headerName: "Absortividad del marco",
      field: "absorptivity",
      cellDataType: "number",
      cellClass: "center",
      headerTooltip: "Absortividad del marco (-)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("α", "", "-"),
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

  const rowData = appstate.cons.frames;

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        tooltipShowDelay={500}
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

export default observer(FamesTable);
