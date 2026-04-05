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

import React, { useCallback, useContext, useState } from "react";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";

import { SCHEDULE_DAY } from "../../stores/types";
import { CountScheduleCellRenderer } from "../tables/Formatters.jsx";
import { ScheduleCountsEditor } from "./ScheduleCountsEditor";

// Tabla de horarios semanales
//  {
//    "id": "fa7e1d88-0fc9-5f85-77a8-efee23a76cd8",
//    "name": "SSHSV",
//    "values": [
//      [
//        "de9a3b5d-c024-aee7-1907-6498ef6427f4",
//        5
//      ],
//      [
//        "1dce7386-0848-5404-d2f2-3bcde8f9d086",
//        1
//      ],
//      [
//        "6836973b-5a43-97d6-840e-825f4bdcbeb9",
//        1
//      ]
//    ]
//  }
const SchedulesWeekTable = ({ gridRef }) => {
  const appstate = useContext(AppState);
  const daySchedulesMap = useCallback(() => appstate.getIdNameMap(SCHEDULE_DAY));

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
      headerName: "Horarios diarios",
      field: "values",
      // TODO: esto podría ser una lista vacía al editarlo
      cellDataType: false,
      flex: 8,
      cellClass: "text-center",
      cellEditor: ScheduleCountsEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: "under",
      cellEditorParams: (params) => ({ idMap: daySchedulesMap() }),
      cellRenderer: CountScheduleCellRenderer,
      cellRendererParams: (params) => ({ idMapper: daySchedulesMap() }),
      headerTooltip: "Lista de horarios diarios",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "n",
      flex: 1,
      cellDataType: "number",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: ({ data }) =>
        data.values.map(([_id, count]) => count).reduce((a, b) => a + b, 0),
      headerTooltip: "Días definidos en el horario semanal",
      headerClass: "text-light bg-secondary text-center",
    },
  ]);

  const rowData = [...appstate.schedules.week];

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      gridRef={gridRef}
    />
  );
};

export default observer(SchedulesWeekTable);
