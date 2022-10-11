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
import { SCHEDULE_YEAR } from "../../stores/types";
import { NameFromIdFmt } from "../tables/Formatters";

// Tabla de consignas de los espacios
//  {
//    "id": "2c7c691b-af33-66da-ec4b-eb51ad42ce3e",
//    "name": "Residencial",
//    "temp_max": "d02b9100-8895-0f1a-4f70-0bb216479f55",
//    "temp_min": "026bc569-dc14-ade8-f130-e5da31fc74b8"
//  }
const SysSettingsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const schedulesMap = appstate.getIdNameMap(SCHEDULE_YEAR);
  const schedulesOpts = appstate.getElementOptions(SCHEDULE_YEAR, true);

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
      headerTitle: () => "Nombre que identifica la definición de consignas",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        return `Consignas id: ${row.id}`;
      },
    },
    {
      dataField: "temp_max",
      text: "Consigna alta (REF)",
      editor: {
        type: Type.SELECT,
        options: schedulesOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "25%" }),
      formatter: NameFromIdFmt,
      formatExtraData: schedulesMap,
      headerTitle: () => "Consigna alta (REF)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "temp_min",
      text: "Consigna baja (CAL)",
      editor: {
        type: Type.SELECT,
        options: schedulesOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "25%" }),
      formatter: NameFromIdFmt,
      formatExtraData: schedulesMap,
      headerTitle: () => "Consigna baja (CAL)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
  ];

  return (
    <BootstrapTable
      data={appstate.sys_settings}
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
            // Campos opcionales textuales
            case "temp_max":
            case "temp_min":
              if (newValue == "") {
                row[column.dataField] = null;
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

export default observer(SysSettingsTable);
