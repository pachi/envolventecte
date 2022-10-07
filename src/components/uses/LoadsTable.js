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

import React, { useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import {
  Float2DigitsFmt,
  getFloatOrOld,
  NameFromIdFmt,
  validateNonNegNumber,
  validateNonNegNumberOrEmpty,
} from "../building/TableHelpers";
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
  const schedulesOpts = appstate.getElementOptions(SCHEDULE_YEAR);

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  const columns = [
    { dataField: "id", isKey: true, hidden: true, text: "ID" },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "20%" }),
      headerTitle: () => "Nombre que identifica la definición de carga",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        return `Cargas id: ${row.id}`;
      },
    },
    {
      dataField: "people_sensible",
      text: "Ocup. sensible",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () => "Carga de ocupación, parte sensible (W/m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>oc,sen</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/m²]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "people_latent",
      text: "Ocup. latente",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () => "Carga de ocupación, parte latente (W/m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>oc,lat</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/m²]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "people_schedule",
      text: "Horario ocupación",
      editor: {
        type: Type.SELECT,
        options: schedulesOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "15%" }),
      formatter: NameFromIdFmt,
      formatExtraData: schedulesMap,
      headerTitle: () => "Horario de ocupación",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "illuminance",
      text: "Iluminancia",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumberOrEmpty,
      headerTitle: () => "Iluminancia media en el plano de trabajo (lux)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          E<sub>m</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[lux]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "lighting",
      text: "Iluminación",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () => "Carga de iluminación (W/m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>il</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/m²]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "lighting_schedule",
      text: "Horario iluminación",
      editor: {
        type: Type.SELECT,
        options: schedulesOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "15%" }),
      formatter: NameFromIdFmt,
      formatExtraData: schedulesMap,
      headerTitle: () => "Horario de iluminación",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "equipment",
      text: "Equipos",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () => "Carga de equipos (W/m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>eq</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/m²]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "equipment_schedule",
      text: "Horario equipos",
      editor: {
        type: Type.SELECT,
        options: schedulesOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "15%" }),
      formatter: NameFromIdFmt,
      formatExtraData: schedulesMap,
      headerTitle: () => "Horario de equipos",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "area_per_person",
      text: "Densidad ocupación",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () => "Superficie por ocupante (m²/pax)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          A<sub>oc</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m²/pax]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <BootstrapTable
      data={appstate.loads}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        // Corrige el valor del espacio adyacente de "" a null
        // y convierte campos numéricos a número
        afterSaveCell: (oldValue, newValue, row, column) => {
          switch (column.dataField) {
            // Campos opcionales numéricos
            case "illuminance":
              if (newValue == "") {
                delete row[column.dataField];
              } else {
                row[column.dataField] = getFloatOrOld(newValue, oldValue);
              }
              break;
            // Campos opcionales textuales
            case "people_schedule":
            case "lighting_schedule":
            case "equipment_schedule":
              if (newValue == "") {
                row[column.dataField] = null;
              }
              break;
            // Conversiones numéricas
            case "people_sensible":
            case "people_latent":
            case "lighting":
            case "equipment":
              if (newValue !== "") {
                row[column.dataField] = getFloatOrOld(newValue, oldValue);
              }
              break;
          }
        },
      })}
      selectRow={{
        mode: "checkbox",
        clickToSelect: true,
        clickToEdit: true,
        selected: selectedIds,
        onSelect: (row, isSelected) => {
          if (isSelected) {
            setSelectedIds([...selectedIds, row.id]);
          } else {
            setSelectedIds(selectedIds.filter((it) => it !== row.id));
          }
        },
        hideSelectColumn: true,
        bgColor: "lightgray",
      }}
      rowClasses={(row, _rowIdx) => {
        const classes = [];
        // Errores
        if (error_ids_danger.includes(row.id)) {
          classes.push("id_error_danger");
        }
        // Avisos
        if (error_ids_warning.includes(row.id)) {
          classes.push("id_error_warning");
        }
        return classes.join(" ");
      }}
      columns={columns}
    />
  );
};

export default observer(LoadsTable);
