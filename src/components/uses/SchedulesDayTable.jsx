/* -*- coding: utf-8 -*-

Copyright (c) 2016-2026 Rafael Villar Burke <pachi@rvburke.com>

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

import { ScheduleHoursEditor } from "./ScheduleHoursEditor";
import { DayScheduleCellRenderer } from "../tables/Formatters.jsx";

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
const SchedulesDayTable = ({ gridRef }) => {
  const appstate = useContext(AppState);

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
      cellClass: "font-weight-bold",
      flex: 2,
      headerTooltip: "Nombre de la definición de horario",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => `Horario id: ${data.id}`,
    },
    {
      headerName: "Valores horarios diarios",
      field: "values",
      // TODO: en editor esto podría estar vacío []
      cellDataType: false,
      flex: 8,
      cellClass: "text-center",
      cellEditor: ScheduleHoursEditor,
      cellRenderer: DayScheduleCellRenderer,
      headerTooltip: "Lista de valores horarios",
      headerClass: "text-light bg-secondary text-center",
      tooltipValueGetter: ({ data }) => `Valores horarios: ${data.values}`,
    },
    {
      headerName: "n",
      flex: 1,
      cellDataType: "number",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: ({ data }) => data.values.length,
      headerTooltip: "Horas definidas en el horario diario",
      headerClass: "text-light bg-secondary text-center",
    },
  ]);

  return (
    <AgTable
      rowData={appstate.schedules.day}
      columnDefs={columnDefs}
      gridRef={gridRef}
    />
  );
};

export default observer(SchedulesDayTable);
