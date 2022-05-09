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

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { Float2DigitsFmt, getFloatOrOld } from "../building/TableHelpers";

/// Formato de U de hueco (id -> U)
const WinconsUFmt = (_cell, row, _rowIndex, propsMap) => {
  const props = propsMap[row.id];
  const p = props.u_value;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

/// Formato de g_gl;wi de hueco (id -> g_glwi)
const WinconsGglwiFmt = (_cell, row, _rowIndex, propsMap) => {
  const props = propsMap[row.id];
  const p = props.g_glwi;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};


// Tabla de construcciones de huecos del edificio
const WinConsTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const winconsPropsMap = appstate.energy_indicators.props.wincons;

  // Formato y opciones de vidrios y marcos
  const glassMap = new Map();
  appstate.cons.glasses.map((s) => (glassMap[s.id] = s.name));
  const GlassFmt = (cell, _row) => <span>{glassMap[cell]}</span>;
  const GlassOpts = Object.keys(glassMap).map((k) => {
    return { value: k, label: glassMap[k] };
  });

  const frameMap = new Map();
  appstate.cons.frames.map((s) => (frameMap[s.id] = s.name));
  const FrameFmt = (cell, _row) => <span>{frameMap[cell]}</span>;
  const FrameOpts = Object.keys(frameMap).map((k) => {
    return { value: k, label: frameMap[k] };
  });


  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      classes: "font-weight-bold",
      headerTitle: () =>
        "Nombre que identifica de forma única la construcción de hueco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Construcción de hueco id: ${row.id}`,
    },
    {
      dataField: "glass",
      text: "Vidrio",
      editor: {
        type: Type.SELECT,
        options: GlassOpts,
      },
      align: "center",
      formatter: GlassFmt,
      headerTitle: () => "Vidrio del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "frame",
      text: "Marco",
      editor: {
        type: Type.SELECT,
        options: FrameOpts,
      },
      align: "center",
      formatter: FrameFmt,
      headerTitle: () => "Marco del opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "f_f",
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
          </span>
        </>
      ),
    },
    {
      dataField: "delta_u",
      text: "F_f",
      align: "center",
      formatter: Float2DigitsFmt,
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
      headerTitle: () =>
        "Factor solar del hueco con la protección solar activada (-)",
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
      headerTitle: () => "Permeabilidad al aire a 100 Pa (m³/hm²)",
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
      headerTitle: () => "Transmitancia térmica del hueco (W/m²K)",
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
        "Factor solar del hueco sin la protección solar activada (g_glwi = g_gln * 0.90) (-)",
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
            ["U", "Ff", "gglwi", "gglshwi", "C_100"].includes(column.dataField)
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

export default observer(WinConsTable);
