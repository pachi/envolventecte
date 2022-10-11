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
  BoundaryFmt,
  BoundaryOpts,
  OpaqueGeomFmt,
  OpaqueGeomIconFmt,
  NameFromIdFmt,
} from "../tables/Formatters";
import { getFloatOrOld } from "../tables/utils";

import { GeometryOpaquesEditor } from "./GeometryEditors";
import { OrientacionesSprite } from "../helpers/IconsOrientaciones";
import { SPACE, WALLCONS } from "../../stores/types";

/// Formato de area de opaco (id -> area)
const WallAreaFmt = (_cell, row, _rowIndex, wallPropsMap) => {
  // cell == id
  const props = wallPropsMap[row.id];
  const p = props.area_net * props.multiplier;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

/// Fromato de U de opaco (id -> U_value)
const WallUFmt = (_cell, row, _rowIndex, wallPropsMap) => {
  // cell == id
  const uvalue = wallPropsMap[row.id].u_value;
  if (uvalue === undefined || uvalue === null || isNaN(uvalue)) {
    return <span>-</span>;
  }
  return <span>{uvalue.toFixed(2)}</span>;
};

// Tabla de elementos opacos
const OpacosTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const wallPropsMap = appstate.energy_indicators.props.walls;
  const wallconsMap = appstate.getIdNameMap(WALLCONS);
  const spaceMap = appstate.getIdNameMap(SPACE);
  const wallconsOpts = appstate.getElementOptions(WALLCONS);
  const spaceOpts = appstate.getElementOptions(SPACE);
  const spaceOptsAndNull = appstate.getElementOptions(SPACE, true);

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
      headerTitle: () => "Nombre que identifica el elemento opaco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => {
        const u_value_wall = wallPropsMap[row.id].u_value;
        const u_value = !isNaN(u_value_wall)
          ? Number(u_value_wall).toFixed(2)
          : "-";
        return `Opaco id: ${row.id}, U: ${u_value} W/m²K`;
      },
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
        "Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | TERRENO | ADIABÁTICO)",
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
        options: wallconsOpts,
      },
      align: "center",
      headerStyle: () => ({ width: "20%" }),
      formatter: NameFromIdFmt,
      formatExtraData: wallconsMap,
      headerTitle: () => "Construcción del opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "space",
      text: "Espacio",
      editor: {
        type: Type.SELECT,
        options: spaceOpts,
      },
      align: "center",
      formatter: NameFromIdFmt,
      formatExtraData: spaceMap,
      headerTitle: () => "Espacio al que pertenece el elemento opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "next_to",
      text: "Espacio ady.",
      editable: (cell, row) => {
        return row.bounds === "INTERIOR";
      },
      editor: {
        type: Type.SELECT,
        options: spaceOptsAndNull,
      },
      align: "center",
      formatter: NameFromIdFmt,
      formatExtraData: spaceMap,
      headerTitle: () =>
        "Espacio adyacente con el que comunica el elemento opaco, cuando este es un elemento interior",
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
    },
    {
      dataField: "geometry",
      text: "Geometría",
      align: "center",
      formatter: OpaqueGeomIconFmt,
      title: OpaqueGeomFmt,
      headerTitle: () =>
        "Geometría (punto de inserción, polígono, inclinación y orientación).",
      editorRenderer: (editorProps, value, row) => (
        <GeometryOpaquesEditor {...editorProps} value={value} name={row.name} />
      ),
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
      headerFormatter: () => <>Geometría</>,
    },
    {
      dataField: "area",
      text: "A",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WallAreaFmt,
      formatExtraData: wallPropsMap,
      headerTitle: () =>
        "Superficie neta (sin huecos) del elemento opaco, en m²",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          A<sub>c</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>
              [m<sup>2</sup>]
            </i>{" "}
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
      formatExtraData: wallPropsMap,
      headerTitle: () => "Transmitancia térmica del elemento opaco [W/m²K]",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          U<sub>c</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[W/m²K]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <>
      <OrientacionesSprite />
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
            if (
              (column.dataField === "next_to" && newValue === "") ||
              (column.dataField === "bounds" && row.bounds !== "INTERIOR")
            ) {
              row.next_to = null;
            } else if (column.dataField === "A") {
              // Convierte a número campos numéricos
              row.A = getFloatOrOld(newValue, oldValue);
            } else if (
              column.dataField === "geometry.tilt" &&
              newValue !== ""
            ) {
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
          if (!wallPropsMap[row.id].is_tenv) {
            classes.push("outsidetenv");
          }
          return classes.join(" ");
        }}
        columns={columns}
      />
    </>
  );
};

export default observer(OpacosTable);
