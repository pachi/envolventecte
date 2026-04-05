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

// TODO: editor de capas

import React, { useContext, useState } from "react";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";
import {
  optionalNumberFmt,
  LayersCellRenderer,
} from "../tables/Formatters.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import { validateNonNegNumber } from "../tables/Validators.js";

import { LayersEditor } from "./LayersEditors";

// Tabla de opacos del edificio
// TODO: mostrar ejemplo de objetos
const WallConsTable = ({ gridRef }) => {
  const appstate = useContext(AppState);
  const wallconsPropsMap = appstate.energy_indicators.props.wallcons;
  const walls_Co100 = appstate.energy_indicators.n50_data.walls_c.toFixed(2);
  const mats = appstate.cons.materials;

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerTooltip: "Nombre que identifica la construcción de opaco",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => `Construcción de opaco id: ${data.id}`,
    },
    {
      headerName: "Capas",
      field: "layers",
      cellDataType: false,
      cellClass: "text-center",
      cellRenderer: LayersCellRenderer,
      cellRendererParams: { materials: mats },
      headerTooltip: "Capas de la construcción (nº)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Capas", "", "nº"),
      cellEditor: LayersEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: "under",
      tooltipValueGetter: ({ data }) =>
        `Construcción de opaco:\n ${data.layers
          .map(
            ({ material, e }) =>
              "- " +
              mats.find((m) => m.id == material)?.name +
              ": " +
              e.toFixed(2)
          )
          .join("\n")}`,
    },
    {
      headerName: "Absortividad",
      field: "absorptance",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberFmt,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Absortividad térmica de la solución constructiva (-)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("α", "", "-"),
    },
    // Columnas calculadas
    {
      headerName: "Espesor",
      field: "thickness",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: (params) => optionalNumberFmt(params, 3),
      headerTooltip: "Espesor total de la composición de capas (m)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("e", "", "m"),
    },
    {
      headerName: "Resistencia intrínseca",
      field: "resistance",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip:
        "Resistencia térmica de la solución constructiva (sin resistencias superficiales) (m²·K/W)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("R", "c;op", "m²·K/W"),
    },
    {
      headerName: "C_o",
      field: "walls_Co100",
      editable: false,
      cellClass: "column-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip:
        "Coeficiente de caudal de aire de la parte opaca de la envolvente térmica (a 100 Pa). Varía según n50 de ensayo o tipo de edificio (nuevo / existente)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "o", "m³/h·m²"),
    },
  ]);

  const rowData = appstate.cons.wallcons.map((e) => {
    const d = wallconsPropsMap[e.id];
    return {
      ...e,
      // Columnas calculadas
      thickness: d?.thickness,
      resistance: d?.resistance,
      walls_Co100,
    };
  });

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      gridRef={gridRef}
      onCellValueChanged={({ node, colDef, newValue }) => {
        appstate.cons.wallcons[node.rowIndex][colDef.field] = newValue;
      }}
    />
  );
};

export default observer(WallConsTable);
