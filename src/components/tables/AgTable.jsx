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

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

export const AgTable = ({rowData, columnDefs, selectedIds, setSelectedIds}) => {

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
}