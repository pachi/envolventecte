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
// import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";

import {
  // OpaqueGeomFmt,
  // OpaqueGeomIconFmt,
} from "../tables/Formatters";

import { optionalNumberDisplay } from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";

import { GeometryOpaquesEditor } from "./GeometryEditors";
import { OrientacionesSprite } from "../helpers/IconsOrientaciones";
import { SPACE, WALLCONS, BOUNDARY_TYPES_MAP } from "../../stores/types";

// Tabla de elementos opacos
const OpacosTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const wallPropsMap = appstate.energy_indicators.props.walls;
  const wallconsMap = appstate.getIdNameMap(WALLCONS);
  const spaceMap = appstate.getIdNameMap(SPACE);

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
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(BOUNDARY_TYPES_MAP) },
      refData: BOUNDARY_TYPES_MAP,
      valueFormatter: ({ value }) => BOUNDARY_TYPES_MAP[value],
      cellClass: "text-center",
      headerTooltip:
        "Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | TERRENO | ADIABÁTICO)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Tipo", "", "-"),
    },
    {
      headerName: "Construcción",
      field: "cons",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(wallconsMap) },
      refData: wallconsMap,
      valueFormatter: ({ value }) => wallconsMap[value],
      cellClass: "text-center",
      headerTooltip: "Construcción del opaco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Espacio",
      field: "space",
      cellDataType: "text",
      cellEditorParams: { values: Object.keys(spaceMap) },
      refData: spaceMap,
      valueFormatter: ({ value }) => spaceMap[value],
      headerTooltip: "Espacio al que pertenece el elemento opaco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Espacio ady.",
      field: "next_to",
      cellClass: "text-center",
      editable: ({ data }) => data.bounds === "INTERIOR",
      // Este editor es especial porque debe poder ponerse en nulo
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [...Object.keys(spaceMap), "<Vacio>"],
      },
      valueParser: (p) =>
        spaceMap.entries().find(([key, val]) => val == p.newValue)[0],
      valueFormatter: ({ value }) => spaceMap[value] ?? "",
      valueFormatter: ({ value }) => spaceMap[value],
      headerTooltip:
        "Espacio adyacente con el que comunica el elemento opaco, cuando este es un elemento interior",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Geometría",
      field: "geometry",
      cellDataType: "text",
      cellClass: "text-center",
      // valueFormatter: OpaqueGeomIconFmt,
      // tooltipValueGetter: ({data}) => OpaqueGeomFmt,
      headerTooltip:
        "Geometría (punto de inserción, polígono, inclinación y orientación).",
      editorRenderer: (editorProps, value, row) => (
        <GeometryOpaquesEditor {...editorProps} value={value} name={row.name} />
      ),
      headerClass: "text-center",
      headerClass: "text-light bg-secondary",
      headerComponent: (_props) => getHeader("Geometría"),
    },
    {
      headerName: "A",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) =>
        wallPropsMap[data.id]?.area_net * wallPropsMap[data.id]?.multiplier,
      valueFormatter: optionalNumberDisplay,
      headerTooltip: "Superficie neta (sin huecos) del elemento opaco, en m²",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "c", "m²"),
    },
    {
      headerName: "wall_u",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) => wallPropsMap[data.id]?.u_value,
      valueFormatter: optionalNumberDisplay,
      headerTooltip: "Transmitancia térmica del elemento opaco [W/m²K]",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "c", "W/m²K"),
    },
  ]);

  const rowData = appstate.walls;

  return (
    <>
      <OrientacionesSprite />
      <AgTable
        rowData={rowData}
        columnDefs={columnDefs}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </>
  );
  // return (
  //   <>
  //     <OrientacionesSprite />
  //     <BootstrapTable
  //       data={appstate.walls}
  //       keyField="id"
  //       striped
  //       hover
  //       bordered={false}
  //       cellEdit={cellEditFactory({
  //         mode: "dbclick",
  //         blurToSave: true,
  //         // Corrige el valor del espacio adyacente de "" a null
  //         afterSaveCell: (oldValue, newValue, row, column) => {
  //           if (
  //             (column.field === "next_to" && newValue === "") ||
  //             (column.field === "bounds" && row.bounds !== "INTERIOR")
  //           ) {
  //             row.next_to = null;
  //           } else if (column.field === "A") {
  //             // Convierte a número campos numéricos
  //             row.A = getFloatOrOld(newValue, oldValue);
  //           } else if (
  //             column.field === "geometry.tilt" &&
  //             newValue !== ""
  //           ) {
  //             row.geometry.tilt = getFloatOrOld(newValue, oldValue);
  //           } else if (
  //             column.field === "geometry.azimuth" &&
  //             newValue !== ""
  //           ) {
  //             row.geometry.azimuth = getFloatOrOld(newValue, oldValue);
  //           }
  //         },
  //       })}
  //       selectRow={{
  //         mode: "checkbox",
  //         clickToSelect: true,
  //         clickToEdit: true,
  //         selected: selectedIds,
  //         onSelect: (row, isSelected) => {
  //           if (isSelected) {
  //             setSelectedIds([...selectedIds, row.id]);
  //           } else {
  //             setSelectedIds(selectedIds.filter((it) => it !== row.id));
  //           }
  //         },
  //         hideSelectColumn: true,
  //         bgColor: "lightgray",
  //       }}
  //       rowClasses={(row, _rowIdx) => {
  //         const classes = [];
  //         // Errores
  //         if (error_ids_danger.includes(row.id)) {
  //           classes.push("id_error_danger");
  //         }
  //         // Avisos
  //         if (error_ids_warning.includes(row.id)) {
  //           classes.push("id_error_warning");
  //         }
  //         // clase para elementos fuera de la ET
  //         if (!wallPropsMap[row.id].is_tenv) {
  //           classes.push("outsidetenv");
  //         }
  //         return classes.join(" ");
  //       }}
  //       columns={columns}
  //     />
  //   </>
  // );
};

export default observer(OpacosTable);
