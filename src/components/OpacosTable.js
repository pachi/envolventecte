/* -*- coding: utf-8 -*-

Copyright (c) 2016-2017 Rafael Villar Burke <pachi@rvburke.com>

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
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer } from "mobx-react-lite";

import AppState from "../stores/AppState";

import {
  azimuth_name,
  tilt_name,
  wall_is_inside_tenv,
  BOUNDARYTYPESMAP,
} from "../utils";

// Formato y opciones de condiciones de contorno
const BoundaryFmt = (cell, _row) => <span>{BOUNDARYTYPESMAP[cell]}</span>;
const BoundaryOpts = Object.keys(BOUNDARYTYPESMAP).map((k) => {
  return { text: BOUNDARYTYPESMAP[k], value: k };
});

const Float2DigitsFmt = (cell, _row) => <span>{Number(cell).toFixed(2)}</span>;
const AzimuthFmt = (cell, _row) => <span>{azimuth_name(cell)}</span>;
const TiltFmt = (cell, _row) => <span>{tilt_name(cell)}</span>;

// Tabla de elementos opacos
const OpacosTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);

  // Lista de IDs con errores
  const errors = appstate.errors
    .slice()
    .concat(appstate.he1_indicators.warnings);
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
    return { text: wallconsMap[k], value: k };
  });

  // Formato y opciones de espacios y espacios adyacentes
  const spaceMap = new Map();
  spaceMap[""] = "";
  appstate.spaces.map((s) => (spaceMap[s.id] = s.name));
  const SpaceFmt = (cell, _row) => <span>{spaceMap[cell]}</span>;
  const SpaceOpts = Object.keys(spaceMap).map((k) => {
    return { text: spaceMap[k], value: k };
  });

  return (
    <BootstrapTable
      data={appstate.walls}
      version="4"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={{
        mode: "dbclick",
        blurToSave: true,
        // Corrige el valor del espacio adyacente de "" a null
        afterSaveCell: (row, cellName, cellValue) => {
          if (cellName === "nextto" && cellValue !== "") {
            row.nextto = null;
          } else if (["A", "azimuth", "tilt"].includes(cellName)) {
            // Convierte a número campos numéricos
            row[cellName] = Number(cellValue.replace(",", "."));
          }
        },
      }}
      selectRow={{
        mode: "checkbox",
        clickToSelectAndEditCell: true,
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
      trClassName={(row, rowIdx) => {
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
    >
      <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
        - ID -{" "}
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="name"
        headerText="Nombre que identifica de forma única el elemento opaco"
        width="30%"
      >
        Nombre
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="A"
        dataFormat={Float2DigitsFmt}
        headerText="Superficie neta (sin huecos) del elemento opaco, en m²"
        headerAlign="center"
        dataAlign="center"
      >
        A<br />
        <span style={{ fontWeight: "normal" }}>
          <i>
            [m<sup>2</sup>]
          </i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="bounds"
        editable={{
          type: "select",
          options: { values: BoundaryOpts },
        }}
        dataFormat={BoundaryFmt}
        headerText="Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | GROUND | ADIABATIC)"
        headerAlign="center"
        dataAlign="center"
      >
        Tipo
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="cons"
        dataFormat={WallconsFmt}
        headerText="Construcción del opaco"
        headerAlign="center"
        dataAlign="center"
        editable={{
          type: "select",
          options: { values: WallconsOpts },
        }}
      >
        Construcción
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="space"
        dataFormat={SpaceFmt}
        headerText="Espacio al que pertenece el elemento opaco"
        headerAlign="center"
        dataAlign="center"
        editable={{
          type: "select",
          options: { values: SpaceOpts },
        }}
      >
        Espacio
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="nextto"
        dataFormat={SpaceFmt}
        headerText="Espacio adyacente con el que comunica el elemento opaco cuando es interior"
        headerAlign="center"
        dataAlign="center"
        editable={{
          type: "select",
          options: { values: SpaceOpts },
        }}
      >
        Espacio ady.
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="azimuth"
        dataFormat={AzimuthFmt}
        headerText="Orientación (gamma) [-180,+180] (S=0, E=+90, W=-90). Medido como azimuth geográfico de la proyección horizontal de la normal a la superficie"
        headerAlign="center"
        dataAlign="center"
      >
        Orientación
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="tilt"
        dataFormat={TiltFmt}
        headerText="Inclinación (beta) [0, 180]. Medido respecto a la horizontal y normal hacia arriba (0 -> suelo, 180 -> techo)"
        headerAlign="center"
        dataAlign="center"
      >
        Inclinación
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default observer(OpacosTable);
