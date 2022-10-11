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
  NameFromIdFmt,
  WindowGeomFmt,
  WindowGeomIconFmt,
} from "../tables/Formatters";
import { getFloatOrOld } from "../tables/utils";

import { GeometryWindowEditor } from "./GeometryEditors";
import { WINCONS, WALL } from "../../stores/types";

// Formato de área de huecos (id -> area)
const WinAreaFmt = (_cell, row, _rowIndex, winProps) => {
  // cell == id
  const props = winProps[row.id];
  const area = props.area * props.multiplier;
  if (area === undefined || area === null || isNaN(area)) {
    return <span>-</span>;
  }
  return <span>{area.toFixed(2)}</span>;
};

// Formato de fshobst (id -> fshobst)
const FshobstFmt = (_cell, row, _rowIndex, winProps) => {
  // cell == id
  const props = winProps[row.id];
  const p = props.f_shobst_override || props.f_shobst;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

// Transmitancias de huecos (id -> window U-value)
const WindowUFmt = (_cell, row, _rowIndex, winProps) => {
  const props = winProps[row.id];
  const p = props.u_value;
  if (p === undefined || p === null) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

// Tabla de huecos del edificio
const HuecosTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const winPropsMap = appstate.energy_indicators.props.windows;
  const winconsMap = appstate.getIdNameMap(WINCONS);
  const wallsMap = appstate.getIdNameMap(WALL);
  const winconsOpts = appstate.getElementOptions(WINCONS);
  const wallsOpts = appstate.getElementOptions(WALL);

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  const wallData = Object.fromEntries(
    appstate.walls.map((w) => [
      w.id,
      { azimuth: w.geometry.azimuth, tilt: w.geometry.tilt, name: w.name },
    ])
  );

  const columns = [
    { dataField: "id", isKey: true, hidden: true, text: "ID" },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "20%" }),
      headerTitle: () => "Nombre que identifica el hueco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        const u_value_window = winPropsMap[row.id].u_value;
        const u_value = !isNaN(u_value_window)
          ? Number(u_value_window).toFixed(2)
          : "-";
        return `Hueco id: ${row.id}, U: ${u_value} W/m²K`;
      },
    },
    {
      dataField: "cons",
      text: "Construcción",
      align: "center",
      headerStyle: () => ({ width: "20%" }),
      formatter: NameFromIdFmt,
      formatExtraData: winconsMap,
      headerTitle: () => "Construcción del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      editor: {
        type: Type.SELECT,
        options: winconsOpts,
      },
    },
    {
      dataField: "wall",
      text: "Opaco",
      align: "center",
      headerStyle: () => ({ width: "20%" }),
      editor: {
        type: Type.SELECT,
        options: wallsOpts,
      },
      formatter: NameFromIdFmt,
      formatExtraData: wallsMap,
      headerTitle: () => "Opaco al que pertenece el hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "geometry",
      text: "Geometría",
      align: "center",
      formatter: WindowGeomIconFmt,
      formatExtraData: wallData,
      title: WindowGeomFmt,
      headerTitle: () =>
        "Descripción geométrica del hueco (posición, ancho, alto, retranqueo). Posición en coordenadas de muro [x, y]. Para elementos sin definición geométrica completa la posición es una lista vacía.",
      editorRenderer: (editorProps, value, row) => (
        <GeometryWindowEditor {...editorProps} value={value} name={row.name} />
      ),
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
    },
    {
      dataField: "area",
      isDummyField: true,
      editable: false,
      text: "A",
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WinAreaFmt,
      formatExtraData: winPropsMap,
      headerTitle: () => "Superficie proyectada del hueco (m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          A<sub>w,p</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>
              [m<sup>2</sup>]
            </i>
          </span>
        </>
      ),
    },
    {
      dataField: "fshobst",
      isDummyField: true,
      editable: false,
      text: "fshobst",
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: FshobstFmt,
      formatExtraData: winPropsMap,
      headerTitle: () =>
        "Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores.",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          F<sub>sh;obst</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>
          </span>
        </>
      ),
    },
    {
      dataField: "window_u",
      isDummyField: true,
      editable: false,
      text: "window U",
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WindowUFmt,
      formatExtraData: winPropsMap,
      headerTitle: () => "Transmitancia térmica del hueco [W/m²K]",
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
  ];

  return (
    <BootstrapTable
      data={appstate.windows}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          // Convierte a número campos numéricos
          if (["A", "fshobst"].includes(column.dataField)) {
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
        // clase para elementos fuera de la ET
        if (!winPropsMap[row.id].is_tenv) {
          classes.push("outsidetenv");
        }
        return classes.join(" ");
      }}
      columns={columns}
    />
  );
};

export default observer(HuecosTable);
