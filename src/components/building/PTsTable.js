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
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import { Float2DigitsFmt, ThermalBridgeTypesFmt, ThermalBridgeTypesOpts, getFloatOrOld } from "./TableHelpers";


// Tabla de puentes térmicos del edificio
const PTsTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      classes: "font-weight-bold",
      headerTitle: (_col, _colIndex) =>
        "Nombre que identifica de forma única el puente térmico",
      headerClasses: "text-light bg-secondary",
      headerFormatter: () => (
        <>
          Nombre
          <br />{" "}
        </>
      ),
      title: (_cell, row) => `Puente térmico id: ${row.id}`,
    },
    {
      dataField: "L",
      formatter: Float2DigitsFmt,
      text: "Longitud",
      align: "center",
      headerTitle: (_col, _colIndex) => "Longitud del puente térmico (m)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Longitud
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "kind",
      text: "Tipo",
      align: "center",
      editor: {
        type: Type.SELECT,
        options: ThermalBridgeTypesOpts,
      },
      formatter: ThermalBridgeTypesFmt,
      headerTitle: (_col, _colIndex) =>
        "Tipo del puente térmico: CUBIERTA (encuentro de cubierta o suelo con fachada) | BALCÓN (suelo en vuelo exterior) | ESQUINA (encuentro de cerramientos verticales) | FORJADO (encuentro forjado-fachada) | PARTICIÓN (encuentro de partición interior con fachada, cubierta o suelo) | SOLERA (encuentra de solera o cámara ventilada con fachada) | PILAR (pilar en fachada, cubierta o suelo) | HUECO (contorno de hueco)  | GENÉRICO (puente térmico genérico))",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Tipo
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>-</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "psi",
      text: "Transmitancia",
      align: "center",
      formatter: Float2DigitsFmt,
      headerClasses: "text-light bg-secondary",
      headerAttrs: {
        title: "Transmitancia térmica lineal del puente térmico (W/mK)",
        "text-align": "center",
      },
      headerAlign: "center",
      headerFormatter: () => (
        <>
          &psi;
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/mK]</i>
          </span>
        </>
      ),
    },
  ];

  return (
    <BootstrapTable
      data={appstate.thermal_bridges}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          // Convierte a número campos numéricos
          if (["L", "psi"].includes(column.dataField)) {
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

export default observer(PTsTable);
