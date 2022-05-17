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
import cellEditFactory from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import {
  Float1DigitsFmt,
  Float3DigitsFmt,
  getFloatOrOld,
} from "../building/TableHelpers";

// Tabla de materiales para opacos del edificio
const MaterialsTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);

  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "40%" }),
      headerTitle: () =>
        "Nombre que identifica de forma única el material de opaco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Material de opaco id: ${row.id}`,
    },
    {
      dataField: "resistance",
      text: "Resistencia térmica",
      align: "center",
      formatter: Float3DigitsFmt,
      headerTitle: () => "Resistencia térmica (m²K/W)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          R<br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m²K/W]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "conductivity",
      text: "Conductividad térmica",
      align: "center",
      formatter: Float3DigitsFmt,
      headerTitle: () => "Conductividad térmica (W/mK)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          &lambda;
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/mK]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "density",
      text: "Densidad",
      align: "center",
      formatter: Float1DigitsFmt,
      headerTitle: () => "Densidad del material (kg/m³)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          &rho;
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[kg/m³]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "specific_heat",
      text: "Calor específico",
      align: "center",
      formatter: Float1DigitsFmt,
      headerTitle: () => "Calor específico del material (J/kg·K)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>p</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[J/kg K]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "vapour_diff",
      text: "Factor de difusividad al vapor de agua",
      align: "center",
      formatter: Float1DigitsFmt,
      headerTitle: () =>
        "Factor de difusividad al vapor de agua del material (J/kg·K)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          &mu;
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <BootstrapTable
      data={appstate.cons.materials}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          // Convierte a número campos numéricos
          if (
            [
              "resistance",
              "conductivity",
              "density",
              "specific_heat",
              "vapour_diff",
            ].includes(column.dataField)
          ) {
            row[column.dataField] = getFloatOrOld(newValue, oldValue);
          }
        },
      })}
      selectRow={{
        mode: "checkbox",
        clickToSelect: true,
        clickToEdit: true,
        selected: selected,
        onSelect: (row, isSelected) => {
          if (isSelected) {
            setSelected([...selected, row.id]);
          } else {
            setSelected(selected.filter((it) => it !== row.id));
          }
        },
        hideSelectColumn: true,
        bgColor: "lightgray",
      }}
      columns={columns}
    />
  );
};

export default observer(MaterialsTable);