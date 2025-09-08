/* -*- coding: utf-8 -*-

Copyright (c) 2016-2025 Rafael Villar Burke <pachi@rvburke.com>

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
import { optionalNumberFmt } from "../tables/Formatters.jsx";

import { SCHEDULE_YEAR } from "../../stores/types";

// Tabla de consignas de los espacios
//  {
//    "id": "2c7c691b-af33-66da-ec4b-eb51ad42ce3e",
//    "name": "Residencial",
//    "temp_max": "d02b9100-8895-0f1a-4f70-0bb216479f55",
//    "temp_min": "026bc569-dc14-ade8-f130-e5da31fc74b8"
//  }
const ThermostatsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const schedulesMap = useCallback(appstate.getIdNameMap(SCHEDULE_YEAR));
  const schedulesOpts = useCallback(appstate.getElementOptions(SCHEDULE_YEAR, true));

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
      flex: 2,
      cellClass: "font-weight-bold",
      headerTooltip: "Nombre que identifica la definición de consignas",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => `Consignas id: ${data.id}`,
    },
    {
      headerName: "Consigna alta (REF)",
      field: "temp_max",
      // TODO: esto puede ser opcional?
      cellDataType: "number",
      // editor: {
      //   type: Type.SELECT,
      //   options: schedulesOpts,
      // },
      // formatExtraData: schedulesMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => schedulesMap()[value],
      headerTooltip: "Consigna alta (REF)",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Consigna baja (CAL)",
      field: "temp_min",
      // TODO: esto puede ser opcional?
      cellDataType: "number",
      // editor: {
      //   type: Type.SELECT,
      //   options: schedulesOpts,
      // },
      // formatExtraData: schedulesMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => schedulesMap()[value],
      headerTooltip: "Consigna baja (CAL)",
      headerClass: "text-light bg-secondary text-center",
    },
  ]);

  const rowData = appstate.thermostats;

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
    />
  );
};

export default observer(ThermostatsTable);
