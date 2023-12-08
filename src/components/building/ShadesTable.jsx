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

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";
import { getHeader } from "../tables/Helpers.jsx";

import { GeometryOpaquesEditor } from "./GeometryEditors";
// import { OpaqueGeomFmt, OpaqueGeomIconFmt } from "../tables/Formatters";

// Tabla de elementos de sombra del edificio
const ShadesTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerTooltip: "Nombre que identifica el elemento de sombra",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => `Elemento de sombra id: ${data.id}`,
    },
    {
      headerName: "Geometría",
      field: "geometry",
      cellDataType: "object",
      cellClass: "text-center",
      // valueFormatter: OpaqueGeomIconFmt,
      // tooltipValueGetter: OpaqueGeomFmt,
      headerTooltip:
        "Geometría (punto de inserción, vértices y orientación e inclinación de la superficie.",
      editorRenderer: (editorProps, value, row) => (
        <GeometryOpaquesEditor {...editorProps} value={value} name={row.name} />
      ),
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Geometría"),
    },
  ]);

  const rowData = appstate.shades;

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
  //     data={appstate.shades}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     tableHeaderClass="text-light bg-secondary"
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         if (
  //           column.field === "geometry.position" &&
  //           newValue === undefined
  //         ) {
  //           // Corrige el valor de position de undefined a null
  //           row.geometry.position = null;
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

export default observer(ShadesTable);
