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
import { Float2DigitsFmt, getFloatOrOld, TiltFmt, AzimuthFmt } from "./TableHelpers";

// Tabla de huecos del edificio
const HuecosTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const he1_indicators = appstate.he1_indicators;
  const winUValuesMap = he1_indicators.u_values.windows;

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  const wallOrientMap = Object.fromEntries(appstate.walls.map(w => [w.id, w.geometry.azimuth]));
  const WindowOrientationFmt = (_cell, row, _rowIndex, _formatExtraData) => {
    const azimuth = wallOrientMap[row.wall];
    return AzimuthFmt(azimuth)
  };

  const WindowTiltFmt = (_cell, row, _rowIndex, _formatExtraData) => {
    const wall = appstate.walls.find((s) => s.id === row.wall);
    if (wall === undefined) {
      return <span>-</span>;
    } else {
      return TiltFmt(wall.geometry.tilt);
    }
  };

  // Diccionario para determinar si el hueco está o no dentro de la ET
  const is_outside_tenv = new Map();
  appstate.windows.forEach((win) => {
    const wall = appstate.walls.find((w) => w.id === win.wall);
    // 1. No tiene definido muro -> fuera
    if (wall === undefined) {
      is_outside_tenv[win.id] = "outsidetenv";
    } else {
      const wall_inside_tenv = appstate.wall_is_inside_tenv(wall);
      is_outside_tenv[win.id] = wall_inside_tenv ? null : "outsidetenv";
    }
  });

  // Formato y opciones de construcciones de huecos
  const winconsMap = new Map();
  appstate.wincons.map((s) => (winconsMap[s.id] = s.name));
  const WinconsFmt = (cell, _row) => <span>{winconsMap[cell]}</span>;
  const WinconsOpts = Object.keys(winconsMap).map((k) => {
    return { value: k, label: winconsMap[k], };
  });

  // Formato y opciones de opacos
  const wallsMap = new Map();
  appstate.walls.map((s) => (wallsMap[s.id] = s.name));
  const WallsFmt = (cell, _row) => <span>{wallsMap[cell]}</span>;
  const WallsOpts = Object.keys(wallsMap).map((k) => {
    return { value: k, label: wallsMap[k] };
  });

  // Transmitancias de huecos
  const WindowUFmt = (_cell, row, _rowIndex, _formatExtraData) => {
    const uvalue = winUValuesMap[row.id];
    if (uvalue === undefined || uvalue === null) {
      return <span>-</span>;
    } else {
      return <span>{uvalue.toFixed(2)}</span>;
    }
  };

  const columns = [
    { dataField: "id", isKey: true, hidden: true, text: "ID" },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      headerTitle: () => "Nombre que identifica de forma única el hueco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        const u_value_window = winUValuesMap[row.id];
        const u_value = !isNaN(u_value_window)
          ? Number(u_value_window).toFixed(2)
          : "-";
        return `Hueco id: ${row.id}, U: ${u_value} W/m²K`;
      },
    },
    {
      dataField: "A",
      text: "A",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () => "Área proyectada del hueco (m2)",
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
      dataField: "cons",
      text: "Construcción",
      align: "center",
      formatter: WinconsFmt,
      headerTitle: () => "Construcción del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      editor: {
        type: Type.SELECT,
        options: WinconsOpts,
      },
    },
    {
      dataField: "wall",
      text: "Opaco",
      align: "center",
      editor: {
        type: Type.SELECT,
        options: WallsOpts,
      },
      formatter: WallsFmt,
      headerTitle: () => "Opaco al que pertenece el hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "fshobst",
      text: "fshobst",
      align: "center",
      formatter: Float2DigitsFmt,
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
      dataField: "wall_azimuth",
      isDummyField: true,
      editable: false,
      text: "Orientación",
      align: "center",
      classes: "td-column-readonly",
      formatter: WindowOrientationFmt,
      formatExtraData: appstate.windows.map(w=> w.wall),
      headerTitle: () => "Orientación del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "wall_tilt",
      isDummyField: true,
      editable: false,
      text: "Inclinación",
      align: "center",
      classes: "td-column-readonly",
      formatter: WindowTiltFmt,
      formatExtraData: appstate.windows.map(w => w.wall),
      headerTitle: () => "Inclinación del hueco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "window_u",
      isDummyField: true,
      editable: false,
      text: "window U",
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WindowUFmt,
      formatExtraData: appstate.he1_indicators.u_values.windows,
      headerTitle: () => "Transmitancia térmica del hueco [W/m²K]",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          U
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
        const outside = is_outside_tenv[row.id];
        if (outside !== null) {
          classes.push(outside);
        }
        return classes.join(" ");
      }}
      columns={columns}
    />
  );
};

export default observer(HuecosTable);
