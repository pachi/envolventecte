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

// TODO: editor de capas

import React, { useContext, useState } from "react";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";
import {
  optionalNumberDisplay,
  LayersCellRenderer,
} from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import { validateNonNegNumber } from "../tables/Validators.js";

import { LayersEditor } from "./LayersEditors";

// Tabla de opacos del edificio
const WallConsTable = ({ selectedIds, setSelectedIds }) => {
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
      cellClass: "text-center",
      cellRenderer: LayersCellRenderer,
      cellRendererParams: { materials: mats },
      headerTooltip: "Capas de la construcción (nº)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Capas", "", "nº"),
      // editorRenderer: (editorProps, value, row) => (
      //   <LayersEditor {...editorProps} value={value} name={row.name} />
      // ),
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
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Absortividad térmica de la solución constructiva (-)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("α", "", "-"),
    },
    {
      headerName: "Espesor",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) => wallconsPropsMap[data.id].thickness,
      valueFormatter: params => optionalNumberDisplay(params, 3),
      headerTooltip: "Espesor total de la composición de capas (m)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("e", "", "m"),
    },
    {
      headerName: "Resistencia intrínseca",
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({data}) => wallconsPropsMap[data.id].resistance,
      valueFormatter: optionalNumberDisplay,
      headerTooltip:
        "Resistencia térmica de la solución constructiva (sin resistencias superficiales) (m²·K/W)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("R", "c;op", "m²·K/W"),
    },
    {
      headerName: "C_o",
      editable: false,
      cellClass: "td-column-readonly text-center",
      valueGetter: (_p) => walls_Co100,
      valueFormatter: optionalNumberDisplay,
      headerTooltip:
        "Coeficiente de caudal de aire de la parte opaca de la envolvente térmica (a 100 Pa). Varía según n50 de ensayo o tipo de edificio (nuevo / existente)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "o", "m³/h·m²"),
    },
  ]);

  const rowData = appstate.cons.wallcons;

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
  //     data={appstate.cons.wallcons}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         // Convierte a número campos numéricos
  //         if (
  //           ["thickness", "resistance", "absorptance"].includes(
  //             column.field
  //           )
  //         ) {
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
  //     columns={columns}
  //   />
  // );
};

export default observer(WallConsTable);
