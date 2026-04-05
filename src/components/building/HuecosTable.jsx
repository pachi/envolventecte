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

import React, { useContext, useCallback, useState } from "react";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";

import {
  optionalNumberFmt,
  WindowGeomFmt,
  WindowGeomIconCellRenderer,
} from "../tables/Formatters.jsx";
import { getHeader } from "../tables/Helpers.jsx";

import { GeometryWindowEditor } from "./GeometryEditors";
import { WINCONS, WALL } from "../../stores/types";

// Tabla de huecos del edificio
// {
//    "id": "8e6f3f0e-1d5e-4c7a-8f3c-3b2f4e5e6f7a",
//    "name": "Hueco",
//    "cons": "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
//    "wall": "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
//    "geometry": {
//      "position": [1.0, 2.0], // opcional
//      "height": 1.2,
//      "width": 1.5,
//      "setback": 0.0
//    }
// }
const HuecosTable = ({ gridRef }) => {
  const appstate = useContext(AppState);
  const winPropsMap = appstate.energy_indicators.props.windows;
  const winconsMap = useCallback(() => appstate.getIdNameMap(WINCONS));
  const wallsMap = useCallback(() => appstate.getIdNameMap(WALL));

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  const wallData = Object.fromEntries(
    appstate.walls.map((w) => [
      w.id,
      { azimuth: w.geometry.azimuth, tilt: w.geometry.tilt, name: w.name },
    ]),
  );

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerTooltip: "Nombre que identifica el hueco",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => {
        const u_value_window = winPropsMap[data.id].u_value;
        const u_value = !isNaN(u_value_window)
          ? Number(u_value_window).toFixed(2)
          : "-";
        return `Hueco id: ${data.id}, U: ${u_value} W/m²K`;
      },
    },
    {
      field: "cons",
      cellDataType: "text",
      headerName: "Construcción",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => ({ values: Object.keys(winconsMap()) }),
      refData: winconsMap,
      valueFormatter: ({ value }) => winconsMap()[value] ?? "-",
      headerTooltip: "Construcción del hueco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Opaco",
      field: "wall",
      cellDataType: "text",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => ({ values: Object.keys(wallsMap()) }),
      refData: wallsMap,
      valueFormatter: ({ value }) => wallsMap()[value] ?? "-",
      headerTooltip: "Opaco al que pertenece el hueco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Geometría",
      field: "geometry",
      cellDataType: false,
      cellClass: "text-center",
      cellRenderer: WindowGeomIconCellRenderer,
      cellRendererParams: { wallData },
      tooltipValueGetter: WindowGeomFmt,
      headerTooltip:
        "Descripción geométrica del hueco (posición, ancho, alto, retranqueo). Posición en coordenadas de muro [x, y]. Para elementos sin definición geométrica completa la posición es una lista vacía.",
      cellEditor: GeometryWindowEditor,
      headerClass: "text-center text-light bg-secondary",
    },
    // Columnas calculadas
    {
      headerName: "A",
      field: "area",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Superficie proyectada del hueco (m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "w,p", "m²"),
    },
    {
      headerName: "fshobst",
      field: "f_shobst",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip:
        "Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores.",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("F", "sh;obst", "-"),
    },
    {
      headerName: "window U",
      field: "u_value",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Transmitancia térmica del hueco [W/m²K]",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "w", "W/m²K"),
    },
  ]);

  const rowData = appstate.windows.map((e) => {
    const d = winPropsMap[e.id];
    return {
      ...e,
      // Columnas calculadas
      area: d?.area * d?.multiplier,
      f_shobst: d?.f_shobst_override || d?.f_shobst,
      u_value: d?.u_value,
    };
  });

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      getRowStyle={(params) =>
        winPropsMap[params.data.id]?.is_tenv ? null : { opacity: 0.5 }
      }
      gridRef={gridRef}
      onCellValueChanged={({ node, colDef, newValue }) => {
        appstate.windows[node.rowIndex][colDef.field] = newValue;
      }}
    />
  );
};

export default observer(HuecosTable);
