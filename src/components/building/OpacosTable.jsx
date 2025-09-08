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

import React, { useCallback, useContext, useState } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";

import {
  optionalNumberFmt,
  OpaqueGeomIconCellRenderer,
  OpaqueGeomFmt,
} from "../tables/Formatters.jsx";
import { getHeader } from "../tables/Helpers.jsx";

import { GeometryOpaquesEditor } from "./GeometryEditors";
import { OrientacionesSprite } from "../helpers/IconsOrientaciones";
import { SPACE, WALLCONS, BOUNDARY_TYPES_MAP } from "../../stores/types";

// Tabla de elementos opacos del edificio
// {
//    id: "8e6f3f0e-1d5e-4c7a-8f3c-3b2f4e5e6f7a",
//    name: "Muro",
//    bounds: "EXTERIOR" // "GROUND" | "INTERIOR" | "ADIABATIC"
//    cons: "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
//    space: "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
//    next_to: null, // o UUID
//    geometry: {
//      position: null,
//      polygon: [],
//    }
//
// }
const OpacosTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const wallPropsMap = appstate.energy_indicators.props.walls;
  const wallconsMap = useCallback(() => appstate.getIdNameMap(WALLCONS));
  const wallconsMapKeys = useCallback(() => Object.keys(wallconsMap()));

  const spaceMap = useCallback(() => appstate.getIdNameMap(SPACE));
  const spaceMapKeys = useCallback(() => Object.keys(spaceMap()));

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
      headerClass: "text-light bg-secondary",
      headerTooltip: "Nombre que identifica el elemento opaco",
      tooltipValueGetter: ({ data }) => {
        const u_value_wall = wallPropsMap[data.id]?.u_value;
        const u_value = !isNaN(u_value_wall)
          ? Number(u_value_wall).toFixed(2)
          : "-";
        return `Opaco id: ${data.id}, U: ${u_value} W/m²K`;
      },
    },
    {
      headerName: "Tipo",
      field: "bounds",
      cellDataType: "text",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(BOUNDARY_TYPES_MAP) },
      refData: BOUNDARY_TYPES_MAP,
      valueFormatter: ({ value }) => BOUNDARY_TYPES_MAP[value],
      headerTooltip:
        "Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | TERRENO | ADIABÁTICO)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Tipo", "", "-"),
    },
    {
      headerName: "Construcción",
      field: "cons",
      cellDataType: "text",
      // TODO: puede ser null
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return { values: wallconsMapKeys() };
      },
      refData: wallconsMap,
      valueFormatter: ({ value }) => wallconsMap()[value] || "-",
      headerTooltip: "Construcción del opaco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Espacio",
      field: "space",
      cellDataType: "text",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return { values: spaceMapKeys() };
      },
      refData: spaceMap,
      valueFormatter: ({ value }) => spaceMap()[value] || "-",
      headerTooltip: "Espacio al que pertenece el elemento opaco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Espacio ady.",
      field: "next_to",
      cellDataType: "text",
      // TODO: puede ser null y solo puede tener un UUID si el bounds es INTERIOR
      cellClass: "text-center",
      editable: ({ data }) => data.bounds === "INTERIOR",
      // Este editor es especial porque debe poder ponerse en nulo
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        return {
          values: [...spaceMapKeys(), null],
        };
      },
      valueParser: (p) =>
        [...spaceMap().entries(), ["", null]].find(
          ([key, val]) => val == p.newValue
        )[0],
      valueFormatter: ({ value }) => spaceMap()[value] ?? "",
      headerTooltip:
        "Espacio adyacente con el que comunica el elemento opaco, cuando este es un elemento interior",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Geometría",
      field: "geometry",
      cellDataType: false,
      cellClass: "text-center",
      cellRenderer: OpaqueGeomIconCellRenderer,
      tooltipValueGetter: OpaqueGeomFmt,
      headerTooltip:
        "Geometría (punto de inserción, polígono, inclinación y orientación).",
      cellEditor: GeometryOpaquesEditor,
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Geometría"),
    },
    // Columnas calculadas
    {
      headerName: "A",
      field: "area",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Superficie neta (sin huecos) del elemento opaco, en m²",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "c", "m²"),
    },
    {
      headerName: "wall_u",
      field: "u_value",
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Transmitancia térmica del elemento opaco [W/m²K]",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "c", "W/m²K"),
    },
  ]);

  const rowData = appstate.walls.map((e) => {
    const d = wallPropsMap[e.id];
    return {
      ...e,
      // Columnas calculadas
      area: d?.area_net * d?.multiplier,
      u_value: d?.u_value,
    };
  });

  return (
    <>
      <OrientacionesSprite />
      <AgTable
        rowData={rowData}
        columnDefs={columnDefs}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onCellValueChanged={({ node, colDef, newValue }) => {
          if (colDef.field == "bounds" && newValue != "INTERIOR") {
            appstate.walls[node.rowIndex]["next_to"] = null;
          }
          appstate.walls[node.rowIndex][colDef.field] = newValue;
        }}
      />
    </>
  );
};

export default observer(OpacosTable);
