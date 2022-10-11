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
  NameFromIdFmt,
  WinconsUFmt,
  WinconsGglwiFmt,
} from "../tables/Formatters";
import { validateNonNegNumber, validateNumber } from "../tables/Validators";
import { getFloatOrOld } from "../tables/utils";

import { FRAME, GLASS } from "../../stores/types";

// Tabla de construcciones de huecos del edificio
const WinConsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const winconsPropsMap = appstate.energy_indicators.props.wincons;
  const glassMap = appstate.getIdNameMap(GLASS);
  const frameMap = appstate.getIdNameMap(FRAME);
  const glassOpts = appstate.getElementOptions(GLASS);
  const frameOpts = appstate.getElementOptions(FRAME);

  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "20%" }),
      headerTitle: () => "Nombre que identifica la construcción de hueco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Construcción de hueco id: ${row.id}`,
    },
    {
      dataField: "glass",
      text: "Vidrio",
      editor: {
        type: Type.SELECT,
        options: glassOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "20%" }),
      formatter: NameFromIdFmt,
      formatExtraData: glassMap,
      headerTitle: () => "Tipo de vidrio del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "frame",
      text: "Marco",
      editor: {
        type: Type.SELECT,
        options: frameOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "20%" }),
      formatter: NameFromIdFmt,
      formatExtraData: frameMap,
      headerTitle: () => "Tipo de marco del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "f_f",
      text: "F_f",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () =>
        "Fracción de marco de la construcción de hueco (-)\n0.0 = sin marco, 1.0 = completamente opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          F<sub>f</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "delta_u",
      text: "delta_u",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNumber,
      headerTitle: () =>
        "Procentaje de incremento de trasnmitancia por intercalarios o cajones de persiana (%)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          &Delta;<sub>U</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[%]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "g_glshwi",
      text: "g_gl;sh;wi",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () =>
        "Factor solar del hueco con la protección solar móvil activada (-)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          g<sub>gl;sh;wi</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "c_100",
      text: "C_100",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () =>
        "Coeficiente de permeabilidad al aire del hueco a 100 Pa (m³/hm²).\n" +
        "La clase de permeabilidad al aire de los huecos, " +
        "según la norma UNE EN 12207:2000 es:\n" +
        "Clase 1: Cw;100 ≤ 50m3/hm2,\nClase 2: Cw;100 ≤ 27 m³/hm²,\n" +
        "Clase 3: Cw;100 ≤ 9 m³/hm²,\nClase 4: Cw;100 ≤ 3 m³/hm².",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>h;100</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m³/h·m²]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "U",
      text: "U_w",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WinconsUFmt,
      formatExtraData: winconsPropsMap,
      headerTitle: () =>
        "Transmitancia térmica del hueco (W/m²K).\nSe especifica en su posición final y teniendo en cuenta las resistencias superficiales correspondientes.",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          U<sub>w</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/m²K]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "gglwi",
      isDummyField: true,
      editable: false,
      text: "g_gl;wi",
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WinconsGglwiFmt,
      formatExtraData: winconsPropsMap,
      headerTitle: () =>
        "Factor solar del hueco sin la protección solar activada (g_glwi = g_gln * 0.90) (-).\nTiene en cuenta el factor de difusión del vidrio y la transmitancia a incidencia normal.",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          g<sub>gl;wi</sub>
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
      data={appstate.cons.wincons}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (
            ["f_f", "delta_u", "g_glshwi", "c_100"].includes(column.dataField)
          ) {
            row[column.dataField] = getFloatOrOld(newValue, oldValue);
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
      columns={columns}
    />
  );
};

export default observer(WinConsTable);
