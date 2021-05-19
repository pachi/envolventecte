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
import {
  wall_is_inside_tenv,
} from "../../utils";
import { AzimuthFmt, TiltFmt, Float2DigitsFmt, BoundaryFmt, BoundaryOpts, getFloatOrOld } from "./TableHelpers";

// Tabla de elementos opacos
const OpacosTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  // Diccionario para determinar si el opaco está o no dentro de la ET
  const is_outside_tenv = new Map();
  appstate.walls.forEach((w) => {
    const wall_inside_tenv = wall_is_inside_tenv(w, appstate.spaces);
    is_outside_tenv[w.id] = wall_inside_tenv ? null : "outsidetenv";
  });

  // Formato y opciones de construcciones de opacos
  const wallconsMap = new Map();
  appstate.wallcons.map((s) => (wallconsMap[s.id] = s.name));
  const WallconsFmt = (cell, _row) => <span>{wallconsMap[cell]}</span>;
  const WallconsOpts = Object.keys(wallconsMap).map((k) => {
    return { value: k, label: wallconsMap[k] };
  });

  // Formato y opciones de espacios y espacios adyacentes
  const spaceMap = new Map();
  spaceMap[""] = "";
  appstate.spaces.map((s) => (spaceMap[s.id] = s.name));
  const SpaceFmt = (cell, _row) => <span>{spaceMap[cell]}</span>;
  const SpaceOpts = Object.keys(spaceMap).map((k) => {
    return { value: k, label: spaceMap[k] };
  });

  const wallUValuesMap = appstate.he1_indicators.u_values.walls;
  const WallUFmt = (_cell, row) => {
    // cell == id
    const uvalue = wallUValuesMap[row.id];
    if (uvalue === undefined || uvalue === null || isNaN(uvalue)) {
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
      headerTitle: () =>
        "Nombre que identifica de forma única el elemento opaco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        const u_value_wall = wallUValuesMap[row.id];
        const u_value = !isNaN(u_value_wall)
          ? Number(u_value_wall).toFixed(2)
          : "-";
        return `Opaco id: ${row.id}, U: ${u_value} W/m²K`;
      },
    },
    {
      dataField: "A",
      text: "A",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () =>
        "Superficie neta (sin huecos) del elemento opaco, en m²",
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
      headerFormatter: () => (
        <>
          A<br />
          <span style={{ fontWeight: "normal" }}>
            <i>
              [m<sup>2</sup>]
            </i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "bounds",
      text: "Tipo",
      editor: {
        type: Type.SELECT,
        options: BoundaryOpts,
      },
      align: "center",
      formatter: BoundaryFmt,
      headerTitle: () =>
        "Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | GROUND | ADIABATIC)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Tipo
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "cons",
      text: "Construcción",
      editor: {
        type: Type.SELECT,
        options: WallconsOpts,
      },
      align: "center",
      formatter: WallconsFmt,
      headerTitle: () => "Construcción del opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "space",
      text: "Espacio",
      editor: {
        type: Type.SELECT,
        options: SpaceOpts,
      },
      align: "center",
      formatter: SpaceFmt,
      headerTitle: () => "Espacio al que pertenece el elemento opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "nextto",
      text: "Espacio ady.",
      editor: {
        type: Type.SELECT,
        options: SpaceOpts,
      },
      align: "center",
      formatter: SpaceFmt,
      headerTitle: () =>
        "Espacio adyacente con el que comunica el elemento opaco cuando es interior",
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
    },
    {
      dataField: "geometry.azimuth",
      text: "Orientación",
      align: "center",
      formatter: AzimuthFmt,
      headerTitle: () =>
        "Orientación (gamma) [-180,+180] (S=0, E=+90, W=-90). Medido como azimuth geográfico de la proyección horizontal de la normal a la superficie",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Orientación
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "geometry.tilt",
      text: "Inclinación",
      align: "center",
      formatter: TiltFmt,
      headerTitle: () =>
        "Inclinación (beta) [0, 180]. Medido respecto a la horizontal y normal hacia arriba (0 -> suelo, 180 -> techo)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Inclinación
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "wall_u",
      text: "wall_u",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WallUFmt,
      formatExtraData: appstate.he1_indicators.u_values.walls,
      headerTitle: () => "Transmitancia térmica del elemento opaco [W/m²K]",
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
      data={appstate.walls}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        // Corrige el valor del espacio adyacente de "" a null
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (column.dataField === "nextto" && newValue !== "") {
            row.nextto = null;
          } else if (column.dataField === "A" && newValue !== "") {
            // Convierte a número campos numéricos
            row.A = getFloatOrOld(newValue, oldValue);
          } else if (column.dataField === "geometry.tilt" && newValue !== "") {
            row.geometry.tilt = getFloatOrOld(newValue, oldValue);
          } else if (
            column.dataField === "geometry.azimuth" &&
            newValue !== ""
          ) {
            row.geometry.azimuth = getFloatOrOld(newValue, oldValue);
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

export default observer(OpacosTable);
