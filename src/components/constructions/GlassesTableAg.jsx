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

import React, { useContext } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { optionalNumberDisplay } from "../tables/Formatters";
import { validateNonNegNumber } from "../tables/Validators";
import { getFloatOrOld } from "../tables/utils";

// Tabla de materiales para opacos del edificio
const GlassesTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  const columns = [
    { headerName: "ID", field: "id", hide: true },
    {
      field: "name",
      headerName: "Nombre",
      cellClass: "font-weight-bold",
      // headerStyle: () => ({ width: "40%" }),
      headerClass: "text-light bg-secondary",
      headerTooltip: "Nombre que identifica de forma única el tipo de vidrio",
      // title: (_cell, row) => `Vidrio id: ${row.id}`,
    },
    {
      field: "u_value",
      headerName: "U",
      cellClass: "text-center",
      // cellRenderer: cell => optionalNumberDisplay(cell, 2),
      // validator: validateNonNegNumber,
      headerTooltip: "Transmitancia térmica del vidrio (W/m²K)",
      headerClass: "text-light bg-secondary",
      // headerAlign: "center",
      // headerFormatter: () => (
      //   <>
      //     U<br />
      //     <span style={{ fontWeight: "normal" }}>
      //       <i>[W/m²K]</i>{" "}
      //     </span>
      //   </>
      // ),
    },
    {
      field: "g_gln",
      headerName: "Factor solar del vidrio a incidencia normal",
      cellClass: "text-center",
      // align: "center",
      // cellRenderer: cell => optionalNumberDisplay(cell, 2),
      // validator: validateNonNegNumber,
      headerTooltip: "Factor solar del vidrio a incidencia normal (-)",
      headerClass: "text-light bg-secondary",
      // headerFormatter: () => (
      //   <>
      //     g<sub>gl;n</sub>
      //     <br />
      //     <span style={{ fontWeight: "normal" }}>
      //       <i>[-]</i>{" "}
      //     </span>
      //   </>
      // ),
    },
  ];

  const rowData = appstate.cons.glasses;

 const onCellValueChanged = (params) => {
    if (params.column.getColId() === "u_value") {
      const value = getFloatOrOld(params.newValue, params.oldValue);
      params.data[params.column.getColId()] = value;
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
     <AgGridReact
       rowData={rowData}
       columnDefs={columns}
       onCellValueChanged={onCellValueChanged}
       rowSelection="multiple"
       rowMultiSelectWithClick
       suppressRowClickSelection
       onSelectionChanged={(params) => {
         setSelectedIds(params.api.getSelectedNodes().map(node => node.data.id));
       }}
       rowDeselection
     />
   </div>
  );
};

export default observer(GlassesTable);
