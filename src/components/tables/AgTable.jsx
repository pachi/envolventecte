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

import React, { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// TODO: tal vez sería mejor definir la altura en el elemento que envuelva a AgTable
export const AgTable = ({
  rowData,
  columnDefs,
  selectedIds,
  setSelectedIds,
  sizeReduce = 21,
  onCellValueChanged = (e) => {
    // Manejador por defecto de cambios en celdas
    rowData[e.node.rowIndex][e.column.colId] = e.newValue;
  },
}) => {
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    editable: true,
    sortable: true,
    resizable: false,
    filter: true,
    flex: 1,
    minWidth: 50,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  }));

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      enableClickSelection: true,
      enableSelectionWithoutKeys: true,
      checkboxes: true,
      headerCheckbox: true,
    };
  }, []);

  const getRowId = useCallback((params) => String(params.data.id), []);

  // Datos con casilla de selección
  const selRowData = rowData.map((r) => ({
    ...r,
    selected: selectedIds ? r.id in selectedIds : false,
  }));

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: `calc(100dvh - ${sizeReduce}rem)`, width: "100%" }}
    >
      <AgGridReact
        rowData={selRowData}
        getRowId={getRowId}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        tooltipShowDelay={500}
        animateRows={true}
        rowSelection={rowSelection}
        onSelectionChanged={(params) => {
          if (setSelectedIds) {
            setSelectedIds(
              params.api.getSelectedNodes().map((node) => node.data.id)
            );
          }
        }}
        // https://www.ag-grid.com/javascript-data-grid/column-properties/#reference-events-onCellValueChanged
        onCellValueChanged={onCellValueChanged}
        theme="legacy"
      />
    </div>
  );
};
