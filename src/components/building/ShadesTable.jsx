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
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { GeometryOpaquesEditor } from "./GeometryEditors";
import { OpaqueGeomFmt, OpaqueGeomIconFmt } from "../tables/Formatters";

// Tabla de elementos de sombra del edificio
const ShadesTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "30%" }),
      headerTitle: () => "Nombre que identifica el elemento de sombra",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Elemento de sombra id: ${row.id}`,
    },
    {
      dataField: "geometry",
      text: "Geometría",
      align: "center",
      formatter: OpaqueGeomIconFmt,
      title: OpaqueGeomFmt,
      headerTitle: () =>
        "Geometría (punto de inserción, vértices y orientación e inclinación de la superficie.",
      editorRenderer: (editorProps, value, row) => (
        <GeometryOpaquesEditor {...editorProps} value={value} name={row.name} />
      ),
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
      headerFormatter: () => <>Geometría</>,
    },
  ];
  return (
    <BootstrapTable
      data={appstate.shades}
      keyField="id"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (
            column.dataField === "geometry.position" &&
            newValue === undefined
          ) {
            // Corrige el valor de position de undefined a null
            row.geometry.position = null;
          }
        },
      })}
      selectRow={{
        mode: "checkbox",
        clickToSelect: true,
        clickToEdit: true,
        selected: selectedIds,
        onSelect: (row, isSelected) => {
          if (isSelected) {
            setSelectedIds([...selectedIds, row.id]);
          } else {
            setSelectedIds(selectedIds.filter((it) => it !== row.id));
          }
        },
        hideSelectColumn: true,
        bgColor: "lightgray",
      }}
      columns={columns}
    />
  );
};

export default observer(ShadesTable);
