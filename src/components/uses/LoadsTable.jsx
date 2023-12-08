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
import { optionalNumberDisplay } from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import { validateNonNegNumber } from "../tables/Validators.js";

import { SCHEDULE_YEAR } from "../../stores/types";

// Tabla de cargas de los espacios
//  {
//    "id": "6b351706-c5d1-19d2-3ef5-866eb367f90a",
//    "name": "NIVEL_ESTANQUEIDAD_1",
//    "people_schedule": "5c051b49-ccd9-9e69-d522-e7f20d8d8730",
//    "people_sensible": 0.0,
//    "people_latent": 0.0,
//    "equipment": 0.0,
//    "equipment_schedule": "5c051b49-ccd9-9e69-d522-e7f20d8d8730",
//    "lighting": 0.0,
//    "lighting_schedule": "5c051b49-ccd9-9e69-d522-e7f20d8d8730",
//    "illuminance": null,
//    "area_per_person": 0.0
//  },
const LoadsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const schedulesMap = appstate.getIdNameMap(SCHEDULE_YEAR);
  const schedulesOpts = appstate.getElementOptions(SCHEDULE_YEAR, true);
  const loadsPropsMap = appstate.energy_indicators.props.loads;

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
      headerTooltip: "Nombre que identifica la definición de carga",
      tooltipValueGetter: ({ data }) => `Cargas id: ${data.id}`,
    },
    {
      headerName: "Densidad ocupación",
      field: "area_per_person",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Superficie por ocupante (m²/pax)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "oc", "m²/pax"),
    },
    {
      headerName: "Ocup. sensible",
      field: "people_sensible",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Carga de ocupación, parte sensible (W/m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "oc,sen", "W/m²"),
    },
    {
      headerName: "Ocup. latente",
      field: "people_latent",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Carga de ocupación, parte latente (W/m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "oc,lat", "W/m²"),
    },
    {
      headerName: "Horario ocupación",
      field: "people_schedule",
      cellDataType: "text",
      // editor: {
      //   type: Type.SELECT,
      //   options: schedulesOpts,
      // },
      // formatExtraData: schedulesMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => schedulesMap[value],
      headerTooltip: "Horario de ocupación",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Iluminación",
      field: "lighting",
      cellDataType: "text",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Carga de iluminación (W/m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "il", "W/m²"),
    },
    {
      headerName: "Horario iluminación",
      field: "lighting_schedule",
      // editor: {
      //   type: Type.SELECT,
      //   options: schedulesOpts,
      // },
      // formatExtraData: schedulesMap,
      cellDataType: "text",
      cellClass: "text-center",
      valueFormatter: ({ value }) => schedulesMap[value],
      headerTooltip: "Horario de iluminación",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Equipos",
      field: "equipment",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Carga de equipos (W/m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "eq", "W/m²"),
    },
    {
      headerName: "Horario equipos",
      field: "equipment_schedule",
      // editor: {
      //   type: Type.SELECT,
      //   options: schedulesOpts,
      // },
      // formatExtraData: schedulesMap,
      cellDataType: "text",
      cellClass: "text-center",
      valueFormatter: ({ value }) => schedulesMap[value],
      headerTooltip: "Horario de equipos",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "C_fi",
      field: "loads_avg",
      cellDataType: "number",
      // isDummyField: true,
      editable: false,
      cellClass: "td-column-computed-readonly text-center",
      valueFormatter: (cell, row, _rowIndex, extraData) => {
        const load = extraData[row.id].loads_avg;
        if (load === null || isNaN(load)) {
          return <span>-</span>;
        }
        return <span>{load.toFixed(2)}</span>;
      },
      formatExtraData: loadsPropsMap,
      headerTooltip: "Carga interna media, en W/m²",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("C", "FI", "W/m²"),
    },
  ]);

  const rowData = appstate.loads;

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
  //     data={appstate.loads}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       // Corrige el valor del espacio adyacente de "" a null
  //       // y convierte campos numéricos a número
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         switch (column.field) {
  //           // Campos opcionales numéricos
  //           case "illuminance":
  //             if (newValue == "") {
  //               delete row[column.field];
  //             } else {
  //               row[column.field] = getFloatOrOld(newValue, oldValue);
  //             }
  //             break;
  //           // Campos opcionales textuales
  //           case "people_schedule":
  //           case "lighting_schedule":
  //           case "equipment_schedule":
  //             if (newValue == "") {
  //               row[column.field] = null;
  //             }
  //             break;
  //           // Conversiones numéricas
  //           case "people_sensible":
  //           case "people_latent":
  //           case "lighting":
  //           case "equipment":
  //           case "area_per_person":
  //             if (newValue !== "") {
  //               row[column.field] = getFloatOrOld(newValue, oldValue);
  //             }
  //             break;
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
  //       const classes = [];
  //       // Errores
  //       if (error_ids_danger.includes(row.id)) {
  //         classes.push("id_error_danger");
  //       }
  //       // Avisos
  //       if (error_ids_warning.includes(row.id)) {
  //         classes.push("id_error_warning");
  //       }
  //       return classes.join(" ");
  //     }}
  //     columns={columns}
  //   />
  // );
};

export default observer(LoadsTable);
