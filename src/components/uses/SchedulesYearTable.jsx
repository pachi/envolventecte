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
// import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";

import { SCHEDULE_WEEK } from "../../stores/types";
import { CountScheduleFmt } from "../tables/Formatters";
import { ScheduleCountsEditor } from "./ScheduleCountsEditor";

// Tabla de horarios anuales
//  {
//    "id": "fa7e1d88-0fc9-5f85-77a8-efee23a76cd8",
//    "name": "SSHA",
//    "values": [
//      [
//        "SSHSI",
//        21
//      ],
//      [
//        "SSHSV",
//        18
//      ],
//      [
//        "SSHSI",
//        13
//      ]
//    ]
//  }
const SchedulesYearTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const weekSchedulesMap = appstate.getIdNameMap(SCHEDULE_WEEK);
  const weekSchedulesOpts = appstate.getElementOptions(SCHEDULE_WEEK);

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

    const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      flex:2,
      cellClass: "font-weight-bold",
      headerTooltip: "Nombre de la definición de horario",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => {
        return `Horario id: ${data.id}`;
      },
    },
    {
      headerName: "Horarios semanales",
      field: "values",
      // cellDataType: "text",
      cellClass: "text-center",
      // editorRenderer: (editorProps, value, row) => (
      //   <ScheduleCountsEditor
      //     {...editorProps}
      //     value={value}
      //     name={row.name}
      //     idMap={weekSchedulesMap}
      //     scheduleOpts={weekSchedulesOpts}
      //   />
      // ),
      valueFormatter: CountScheduleFmt,
      formatExtraData: weekSchedulesMap,
      headerTooltip: "Lista de horarios semanales",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "n",
      field: "n_weeks",
      cellDataType: "number",
      // isDummyField: true,
      editable: false,
      cellClass: "text-center",
      cellClass: "td-column-computed-readonly",
      valueFormatter: ({data}) =>
        data.values.map(([_id, count]) => count).reduce((a, b) => a + b, 0),
      headerTooltip: "Semanas definidas en el horario anual",
      headerClass: "text-light bg-secondary text-center",
    },
  ]);

  const rowData = appstate.schedules.year;

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
  //     data={appstate.schedules.year}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       // Corrige el valor del horario de "" a null
  //       // y convierte campos numéricos a número
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         switch (column.field) {
  //           // Campos opcionales textuales
  //           case "values":
  //             if (newValue == "") {
  //               row[column.field] = [];
  //             }
  //             break;
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
  //     rowClasses={(row, _rowIdx) => {
  //       const classes = [];
  //       // Errores
  //       if (error_ids_danger.includes(row.id)) {
  //         classes.push("id_error_danger");
  //       }
  //       // Avisos
  //       if (error_ids_warning.includes(row.id)) {
  //         classes.push("id_error_warning");
  //       }
  //       return classes.join(" ");
  //     }}
  //     columns={columns}
  //   />
  // );
};

export default observer(SchedulesYearTable);
