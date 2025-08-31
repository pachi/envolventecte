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

import AppState from "../../stores/AppState.js";

import { AgTable } from "../tables/AgTable.jsx";
import { optionalNumberFmt } from "../tables/Formatters.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import { validateNonNegNumber } from "../tables/Validators.js";

// TODO: reimplementar lógica para usar conductividad o resistencia
//         // Si se define  el material por resistencia dejar en null campos por propiedades
//         if (column.field === "resistance") {
//           row["resistance"] = getFloatOrOld(newValue, oldValue);
//           row?.conductivity ? delete row["conductivity"] : null;
//           row?.density ? delete row["density"] : null;
//           row?.specific_heat ? delete row["specific_heat"] : null;
//         }
//         // Si se define  el material por propiedades dejar resistencia a null y completar resto a valor por defecto
//         if (column.field === "conductivity") {
//           row["conductivity"] = getFloatOrOld(newValue, oldValue);
//           row?.resistance ? delete row["resistance"] : null;
//           row?.density ? null : (row["density"] = 1000.0);
//           row?.specific_heat ? null : (row["specific_heat"] = 1000.0);
//         }
//         if (column.field === "density") {
//           row["density"] = getFloatOrOld(newValue, oldValue);
//           row?.resistance ? delete row["resistance"] : null;
//           row?.conductivity ? null : (row["conductivity"] = 1.0);
//           row?.specific_heat ? null : (row["specific_heat"] = 1000.0);
//         }
//         if (column.field === "specific_heat") {
//           row["specific_heat"] = getFloatOrOld(newValue, oldValue);
//           row?.resistance ? delete row["resistance"] : null;
//           row?.conductivity ? null : (row["conductivity"] = 1.0);
//           row?.density ? null : (row["density"] = 1000.0);
//         }
//         row["vapour_diff"] === null ? delete row["vapour_diff"] : null;
//       },
//     })}


// Tabla de materiales para opacos del edificio
// TODO: mostrar ejemplo de objetos
const MaterialsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerClass: "text-light bg-secondary",
      headerTooltip:
        "Nombre que identifica de forma única el material de opaco",
      tooltipValueGetter: ({ data }) => `Material de opaco id: ${data.id}`,
    },
    {
      headerName: "Resistencia térmica",
      field: "resistance",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip: "Resistencia térmica (m²K/W)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("R", "", "m²K/W"),
      valueFormatter: (params) => optionalNumberFmt(params, 3),
      valueSetter: validateNonNegNumber,
    },
    {
      headerName: "Conductividad térmica",
      field: "conductivity",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip: "Conductividad térmica (W/mK)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("λ", "", "W/mK"),
      valueFormatter: (params) => optionalNumberFmt(params, 3),
      valueSetter: validateNonNegNumber,
    },
    {
      headerName: "Densidad",
      field: "density",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip: "Densidad del material (kg/m³)",
      headerClass: "text-light bg-secondary text-center",
      editable: ({ data }) =>
        data.conductivity == undefined || data.conductivity == null
          ? false
          : true,
      headerComponent: (_props) => getHeader("ρ", "", "kg/m³"),
      valueSetter: validateNonNegNumber,
      valueFormatter: (cell) => optionalNumberFmt(cell, 1),
    },
    {
      headerName: "Calor específico",
      field: "specific_heat",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip: "Calor específico del material (J/kg·K)",
      headerClass: "text-light bg-secondary text-center",
      editable: ({ data }) =>
        data.conductivity == undefined || data.conductivity == null
          ? false
          : true,
      headerComponent: (_props) => getHeader("C", "p", "J/kg K"),
      valueSetter: validateNonNegNumber,
      valueFormatter: (params) => optionalNumberFmt(params, 1),
    },
    {
      headerName: "Factor de difusividad al vapor de agua",
      field: "vapour_diff",
      cellDataType: "number",
      cellClass: "text-center",
      headerTooltip:
        "Factor de difusividad al vapor de agua del material (J/kg·K)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("μ", "", "-"),
      valueFormatter: (params) => optionalNumberFmt(params, 1),
      valueSetter: validateNonNegNumber,
    },
  ]);

  const rowData = appstate.cons.materials;

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
    />
  );
};

export default observer(MaterialsTable);
