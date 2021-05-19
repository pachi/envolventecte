/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

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

import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import { Float2DigitsFmt, getFloatOrOld } from "./TableHelpers";


// Tabla de construcciones de huecos del edificio
const WinConsTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      headerTitle: () =>
        "Nombre que identifica de forma única la construcción de hueco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Construcción de hueco id: ${row.id}`,
    },
    {
      dataField: "group",
      text: "Grupo",
      align: "center",
      headerTitle: (_col, _colIndex) =>
        "Grupo de soluciones al que pertenece la construcción (solo a efectos de clasificación)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
        dataField: "U",
        text: "U_w",
        align: "center",
        formatter: Float2DigitsFmt,
        headerTitle: () => "Transmitancia térmica del hueco (W/m²K)",
        headerClasses: "text-light bg-secondary",
        headerAlign: "center",
        headerFormatter: () => (
          <>
        U<sub>w</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[W/m²K]</i>{" "}
        </span></>)
      },
      {
        dataField: "Ff",
        text: "F_f",
        align: "center",
        formatter: Float2DigitsFmt,
        headerTitle: () => "Fracción de marco de la construcción de hueco (-)",
        headerClasses: "text-light bg-secondary",
        headerAlign: "center",
        headerFormatter: () => (
          <>
        F<sub>f</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span></>)
      },
      {
        dataField: "gglwi",
        text: "g_gl;wi",
        align: "center",
        formatter: Float2DigitsFmt,
        headerTitle: () => "Factor solar del hueco sin la protección solar activada (g_glwi = g_gln * 0.90) (-)",
        headerClasses: "text-light bg-secondary",
        headerAlign: "center",
        headerFormatter: () => (
          <>
        g<sub>gl;wi</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span></>)
      },
      {
        dataField: "gglshwi",
        text: "g_gl;sh;wi",
        align: "center",
        formatter: Float2DigitsFmt,
        headerTitle: () => "Factor solar del hueco con la protección solar activada (g_glwi = g_gln * 0.90) (-)",
        headerClasses: "text-light bg-secondary",
        headerAlign: "center",
        headerFormatter: () => (
          <>
        g<sub>gl;sh;wi</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span></>)
      },
      {
        dataField: "C_100",
        text: "C_100",
        align: "center",
        formatter: Float2DigitsFmt,
        headerTitle: () => "Permeabilidad al aire a 100 Pa (m³/hm²)",
        headerClasses: "text-light bg-secondary",
        headerAlign: "center",
        headerFormatter: () => (
          <>
        C<sub>h;100</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[m³/h·m²]</i>{" "}
        </span></>)
      },
  ];

  return (
    <BootstrapTable
      data={appstate.wincons}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (["U", "Ff", "gglwi", "gglshwi", "C_100"].includes(column.dataField)) {
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
      columns = {columns}
    />
  );
};

export default observer(WinConsTable);
