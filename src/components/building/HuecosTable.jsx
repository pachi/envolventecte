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

import // WindowGeomFmt,
// WindowGeomIconFmt,
"../tables/Formatters";

import { optionalNumberDisplay } from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";

import { GeometryWindowEditor } from "./GeometryEditors";
import { WINCONS, WALL } from "../../stores/types";

// Tabla de huecos del edificio
const HuecosTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const winPropsMap = appstate.energy_indicators.props.windows;
  const winconsMap = appstate.getIdNameMap(WINCONS);
  const wallsMap = appstate.getIdNameMap(WALL);

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
    ])
  );

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
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
      headerName: "Construcción",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(winconsMap) },
      refData: winconsMap,
      valueFormatter: ({ value }) => winconsMap[value],
      headerTooltip: "Construcción del hueco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Opaco",
      field: "wall",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(wallsMap) },
      refData: wallsMap,
      valueFormatter: ({ value }) => wallsMap[value],
      headerTooltip: "Opaco al que pertenece el hueco",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Geometría",
      field: "geometry",
      cellClass: "text-center",
      // valueFormatter: WindowGeomIconFmt,
      // formatExtraData: wallData,
      // tooltipValueGetter: WindowGeomFmt,
      headerTooltip:
        "Descripción geométrica del hueco (posición, ancho, alto, retranqueo). Posición en coordenadas de muro [x, y]. Para elementos sin definición geométrica completa la posición es una lista vacía.",
      // editorRenderer: (editorProps, value, row) => (
      //   <GeometryWindowEditor {...editorProps} value={value} name={row.name} />
      // ),
      headerClass: "text-center text-light bg-secondary",
    },
    {
      headerName: "A",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) =>
        winPropsMap[data.id].area * winPropsMap[data.id].multiplier,
      valueFormatter: optionalNumberDisplay,
      headerTooltip: "Superficie proyectada del hueco (m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "w,p", "m²"),
    },
    {
      headerName: "fshobst",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) =>
        winPropsMap[data.id].f_shobst_override || winPropsMap[data.id].f_shobst,
      valueFormatter: optionalNumberDisplay,
      headerTooltip:
        "Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores.",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("F", "sh;obst", "-"),
    },
    {
      headerName: "window U",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) => winPropsMap[data.id].u_value,
      valueFormatter: optionalNumberDisplay,
      headerTooltip: "Transmitancia térmica del hueco [W/m²K]",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("U", "w", "W/m²K"),
    },
  ]);

  const rowData = appstate.windows;

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
  //     data={appstate.windows}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         // Convierte a número campos numéricos
  //         if (["A", "fshobst"].includes(column.field)) {
  //           row[column.field] = getFloatOrOld(newValue, oldValue);
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
  //       const cellClass = [];
  //       // Errores
  //       if (error_ids_danger.includes(row.id)) {
  //         cellClass.push("id_error_danger");
  //       }
  //       // Avisos
  //       if (error_ids_warning.includes(row.id)) {
  //         cellClass.push("id_error_warning");
  //       }
  //       // clase para elementos fuera de la ET
  //       if (!winPropsMap[row.id].is_tenv) {
  //         cellClass.push("outsidetenv");
  //       }
  //       return cellClass.join(" ");
  //     }}
  //     columns={columns}
  //   />
  // );
};

export default observer(HuecosTable);
