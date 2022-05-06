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
import { Float2DigitsFmt, getFloatOrOld } from "../building/TableHelpers";

/// Formato de espesor total de construcción de opaco (id -> thickness)
const WallConsThicknessFmt = (_cell, row, _rowIndex, wallconsPropsMap) => {
  // cell == id
  const props = wallconsPropsMap[row.id];
  const p = props.thickness;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(3)}</span>;
};

/// Formato de resistencia intrínseca de construcción de opaco (id -> r_intrinsic)
const WallConsIntrinsicRFmt = (_cell, row, _rowIndex, wallconsPropsMap) => {
  // cell == id
  const props = wallconsPropsMap[row.id];
  const p = props.r_intrinsic;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

/// Formato de capas de construcción de opaco (id -> nº capas)
const LayersNumberFmt = (cell, _row, _rowIndex, _formatExtraData) => {
  // cell == id
  const nlayers = cell.length;
  if (nlayers === 0) {
    return <span>-</span>;
  }
  return <span>{nlayers}</span>;
};


// Tabla de opacos del edificio
const WallConsTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const wallconsPropsMap = appstate.energy_indicators.props.wallcons;
  const walls_Co100 = appstate.energy_indicators.n50_data.walls_c.toFixed(2);

  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      classes: "font-weight-bold",
      headerTitle: () =>
        "Nombre que identifica de forma única la construcción de opaco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Construcción de opaco id: ${row.id}`,
    },
    {
      dataField: "layers",
      text: "Capas",
      align: "center",
      formatter: LayersNumberFmt,
      headerTitle: () => "Capas de la construcción (nº)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Capas<br />
          <span style={{ fontWeight: "normal" }}>
            <i>[nº]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "absorptance",
      text: "Absortividad",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () => "Absortividad térmica de la solución constructiva (-)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          &alpha;
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "thickness",
      text: "Espesor",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WallConsThicknessFmt,
      formatExtraData: wallconsPropsMap,
      headerTitle: () => "Espesor total de la composición de capas (m)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          e<br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "R_intrinsic",
      text: "Resistencia intrínseca",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WallConsIntrinsicRFmt,
      formatExtraData: wallconsPropsMap,
      headerTitle: () =>
        "Resistencia intrínseca de la solución constructiva (solo capas, sin resistencias superficiales) (m²K/W)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          R<sub>e</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m²K/W]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "C_o",
      isDummyField: true,
      text: "C_o",
      editable: false,
      align: "center",
      classes: "td-column-readonly",
      formatter: () => walls_Co100,
      formatExtraData: walls_Co100,
      headerTitle: () =>
        "Coeficiente de caudal de aire de la parte opaca de la envolvente térmica (a 100 Pa). Varía según n50 de ensayo o tipo de edificio (nuevo / existente)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          C<sub>o</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            [m<sup>3</sup>/h·m<sup>2</sup>]
          </span>
        </>
      ),
    },
  ];

  return (
    <BootstrapTable
      data={appstate.cons.wallcons}
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
            ["thickness", "R_intrinsic", "absorptance"].includes(
              column.dataField
            )
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

export default observer(WallConsTable);
