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
import { optionalNumberDisplay } from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import {
  validateNonNegNumber,
  validateNumber,
} from "../tables/Validators.js";

import { FRAME, GLASS } from "../../stores/types";

// Tabla de construcciones de huecos del edificio
const WinConsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const winconsPropsMap = appstate.energy_indicators.props.wincons;
  const glassMap = appstate.getIdNameMap(GLASS);
  const frameMap = appstate.getIdNameMap(FRAME);

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerClass: "text-light bg-secondary",
      headerTooltip: "Nombre que identifica la construcción de hueco",
      tooltipValueGetter: ({ data }) => `Construcción de hueco id: ${data.id}`,
    },
    {
      headerName: "Vidrio",
      field: "glass",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(glassMap) },
      refData: glassMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => glassMap[value],
      headerTooltip: "Tipo de vidrio del hueco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Marco",
      field: "frame",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(frameMap) },
      refData: frameMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => frameMap[value],
      headerTooltip: "Tipo de marco del hueco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "F_f",
      field: "f_f",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip:
        "Fracción de marco de la construcción de hueco (-)\n0.0 = sin marco, 1.0 = completamente opaco",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("F", "f", "-"),
    },
    {
      headerName: "delta_u",
      field: "delta_u",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNumber,
      headerTooltip:
        "Porcentaje de incremento de transmitancia por intercalarios o cajones de persiana (%)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Δ", "U", "%"),
    },
    {
      headerName: "g_gl;sh;wi",
      field: "g_glshwi",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip:
        "Factor solar del hueco con la protección solar móvil activada (-)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("g", "gl;sh;wi", "-"),
    },
    {
      headerName: "C_100",
      field: "c_100",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip:
        "Coeficiente de permeabilidad al aire del hueco a 100 Pa (m³/hm²).\n" +
        "La clase de permeabilidad al aire de los huecos, " +
        "según la norma UNE EN 12207:2000 es:\n" +
        "Clase 1: Cw;100 ≤ 50m3/hm2,\nClase 2: Cw;100 ≤ 27 m³/hm²,\n" +
        "Clase 3: Cw;100 ≤ 9 m³/hm²,\nClase 4: Cw;100 ≤ 3 m³/hm².",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "h;100", "m³/h·m²"),
    },
    {
      headerName: "U_w",
      editable: false,
      cellDataType: "number",
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) => winconsPropsMap[data.id].u_value,
      valueFormatter: optionalNumberDisplay,
      headerTooltip:
        "Transmitancia térmica del hueco (W/m²K).\nSe especifica en su posición final y teniendo en cuenta las resistencias superficiales correspondientes.",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "w", "W/m²K"),
    },
    {
      headerName: "g_gl;wi",
      editable: false,
      cellDataType: "number",
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) => winconsPropsMap[data.id].g_glwi,
      valueFormatter: optionalNumberDisplay,
      headerTooltip:
        "Factor solar del hueco sin la protección solar activada (g_glwi = g_gln * 0.90) (-).\nTiene en cuenta el factor de difusión del vidrio y la transmitancia a incidencia normal.",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("g", "gl;wi", "-"),
    },
  ]);

  const rowData = appstate.cons.wincons;

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
    />
  );
};

export default observer(WinConsTable);
