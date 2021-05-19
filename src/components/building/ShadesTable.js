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
import { GeometryPosEditor } from "./GeometryPosEditor";
import { GeometryPolyEditor } from "./GeometryPolyEditor";
import { AzimuthFmt, TiltFmt, PosFmt, PolyFmt, PosIconFmt, PolyIconFmt } from "./TableHelpers";

// Tabla de elementos de sombra del edificio
const ShadesTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      headerTitle: () =>
        "Nombre que identifica de forma única el elemento de sombra",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Elemento de sombra id: ${row.id}`,
    },
    {
      dataField: "geometry.azimuth",
      text: "Orientación",
      align: "center",
      formatter: AzimuthFmt,
      headerTitle: () =>
        "Orientación (gamma) [-180,+180] (S=0, E=+90, W=-90). Medido como azimuth geográfico de la proyección horizontal de la normal a la superficie",
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
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
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
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
      dataField: "geometry.position",
      text: "Posicion",
      align: "center",
      formatter: PosIconFmt,
      title: PosFmt,
      headerTitle: () =>
        "Posición del polígono en coordenadas globales [x, y, z]. Para elementos sin definición geométrica completa no se define este elemento.",
      editorRenderer: (editorProps, value) => (
        <GeometryPosEditor {...editorProps} value={value} />
      ),
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
      headerFormatter: () => (
        <>
          Posición
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[x, y, z]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "geometry.polygon",
      text: "Polígono",
      align: "center",
      formatter: PolyIconFmt,
      title: PolyFmt,
      headerTitle: () =>
        "Lista de puntos 2D que configuran el polígono del elemento: [[x, y]...]. Para elementos sin definición geométrica completa no se define este elemento.",
      editorRenderer: (editorProps, value) => (
        <GeometryPolyEditor {...editorProps} value={value} />
      ),
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
      headerFormatter: () => (
        <>
          Polígono
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[[x, y]...]</i>{" "}
          </span>
        </>
      ),
    },
  ];
  return (
    <BootstrapTable
      data={appstate.shades}
      keyField="id"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (
            column.dataField === "geometry.position" &&
            newValue === undefined
          ) {
            // Corrige el valor de position de undefined a null
            row.geometry.position = null;
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

export default observer(ShadesTable);
