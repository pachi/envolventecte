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
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";

import { azimuth_name, tilt_name, wall_is_inside_tenv } from "../../utils";

const Float2DigitsFmt = (cell, _row) => <span>{Number(cell).toFixed(2)}</span>;

// Tabla de huecos del edificio
const HuecosTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);

  // Lista de IDs con errores
  const errors = appstate.warnings;
  const error_ids_warning = errors
    .filter((e) => e.level === "WARNING")
    .map((e) => e.id);
  const error_ids_danger = errors
    .filter((e) => e.level === "DANGER")
    .map((e) => e.id);

  const WindowOrientationFmt = (cell, _row) => {
    const wall = appstate.walls.find((s) => s.id === cell);
    if (wall === undefined) {
      return <span>-</span>;
    } else {
      return <span>{azimuth_name(wall.geometry.azimuth)}</span>;
    }
  };

  const WindowTiltFmt = (cell, _row) => {
    const wall = appstate.walls.find((s) => s.id === cell);
    if (wall === undefined) {
      return <span>-</span>;
    } else {
      return <span>{tilt_name(wall.geometry.tilt)}</span>;
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
      const wall_inside_tenv = wall_is_inside_tenv(wall, appstate.spaces);
      is_outside_tenv[win.id] = wall_inside_tenv ? null : "outsidetenv";
    }
  });

  // Formato y opciones de construcciones de huecos
  const winconsMap = new Map();
  appstate.wincons.map((s) => (winconsMap[s.id] = s.name));
  const WinconsFmt = (cell, _row) => <span>{winconsMap[cell]}</span>;
  const WinconsOpts = Object.keys(winconsMap).map((k) => {
    return { text: winconsMap[k], value: k };
  });

  // Formato y opciones de opacos
  const wallsMap = new Map();
  appstate.walls.map((s) => (wallsMap[s.id] = s.name));
  const WallsFmt = (cell, _row) => <span>{wallsMap[cell]}</span>;
  const WallsOpts = Object.keys(wallsMap).map((k) => {
    return { text: wallsMap[k], value: k };
  });

  // Transmitancias de huecos
  const he1_indicators = appstate.he1_indicators;
  const WindowUFmt = (cell, _row) => {
    // cell == id
    const uvalue = he1_indicators.u_values.windows[cell];
    if (uvalue === undefined || uvalue === null) {
      return <span>-</span>;
    } else {
      return <span>{uvalue.toFixed(2)}</span>;
    }
  };

  return (
    <BootstrapTable
      data={appstate.windows}
      version="4"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={{
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (row, cellName, cellValue) => {
          if (["A", "fshobst"].includes(cellName)) {
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
        headerText="Nombre que identifica de forma única el hueco"
        width="30%"
        columnTitle={(cell, row) => {
          const u_value_wall = appstate.he1_indicators.u_values.windows[row.id];
          const u_wall = !isNaN(u_value_wall)
            ? Number(u_value_wall).toFixed(2)
            : "-";
          return `Hueco id: ${row.id}, U: ${u_wall} W/m²K`;
        }}
      >
        Nombre
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="A"
        dataFormat={Float2DigitsFmt}
        headerText="Área proyectada del hueco (m2)"
        headerAlign="center"
        dataAlign="center"
      >
        A<sub>w,p</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>
            [m<sup>2</sup>]
          </i>
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="cons"
        dataFormat={WinconsFmt}
        headerText="Construcción del hueco"
        headerAlign="center"
        dataAlign="center"
        editable={{
          type: "select",
          options: { values: WinconsOpts },
        }}
      >
        Construcción
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="wall"
        dataFormat={WallsFmt}
        headerText="Opaco al que pertenece el hueco"
        headerAlign="center"
        dataAlign="center"
        editable={{
          type: "select",
          options: { values: WallsOpts },
        }}
      >
        Opaco
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="fshobst"
        dataFormat={Float2DigitsFmt}
        headerText="Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores."
        headerAlign="center"
        dataAlign="center"
      >
        F<sub>sh;obst</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="wall"
        dataFormat={WindowOrientationFmt}
        headerText="Orientación del hueco"
        editable={false}
        columnClassName="td-column-readonly"
        headerAlign="center"
        dataAlign="center"
      >
        Orientación
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="wall"
        dataFormat={WindowTiltFmt}
        headerText="Inclinación del hueco"
        editable={false}
        columnClassName="td-column-readonly"
        headerAlign="center"
        dataAlign="center"
      >
        Inclinación
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="id"
        dataFormat={WindowUFmt}
        headerText="Transmitancia térmica del hueco [W/m²K]"
        editable={false}
        columnClassName="td-column-computed-readonly"
        headerAlign="center"
        dataAlign="center"
      >
        U
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[W/m²K]</i>{" "}
        </span>
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default observer(HuecosTable);
