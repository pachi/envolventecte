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
import { ScheduleHoursEditor } from "./ScheduleHoursEditor";
import { DayScheduleFmt } from "../tables/Formatters";

// Tabla de horarios diarios
//  {
//    "id": "fa7e1d88-0fc9-5f85-77a8-efee23a76cd8",
//    "name": "SSHSVD",
//    "values": [
//      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
//      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
//      0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
//    ]
//  }
const SchedulesDayTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  const columns = [
    { dataField: "id", isKey: true, hidden: true, text: "ID" },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "20%" }),
      headerTitle: () => "Nombre de la definición de horario",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        return `Horario id: ${row.id}`;
      },
    },
    {
      dataField: "values",
      text: "Valores horarios diarios",
      align: "center",
      editorRenderer: (editorProps, value, row) => (
        <ScheduleHoursEditor {...editorProps} value={value} name={row.name} />
      ),
      formatter: DayScheduleFmt,
      headerTitle: () => "Lista de valores horarios",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      title: (cell) => `Valores horarios: ${cell}`,
    },
    {
      dataField: "n_hours",
      text: "n",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: (cell, row) => row.values.length,
      headerTitle: () => "Horas definidas en el horario diario",
      headerStyle: () => ({ width: "10%" }),
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
  ];

  return (
    <BootstrapTable
      data={appstate.schedules.day}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        // Corrige el valor del horario de "" a null
        afterSaveCell: (oldValue, newValue, row, column) => {
          switch (column.dataField) {
            // Campos opcionales textuales
            case "values":
              if (newValue == "") {
                row[column.dataField] = [];
              }
              break;
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
      rowClasses={(row, _rowIdx) => {
        const classes = [];
        // Errores
        if (error_ids_danger.includes(row.id)) {
          classes.push("id_error_danger");
        }
        // Avisos
        if (error_ids_warning.includes(row.id)) {
          classes.push("id_error_warning");
        }
        return classes.join(" ");
      }}
      columns={columns}
    />
  );
};

export default observer(SchedulesDayTable);
