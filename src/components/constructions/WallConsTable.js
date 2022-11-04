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
import cellEditFactory from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { optionalNumberDisplay, LayersFmt } from "../tables/Formatters";
import { validateNonNegNumber } from "../tables/Validators";
import { getFloatOrOld } from "../tables/utils";

import { LayersEditor } from "./LayersEditors";

// Tabla de opacos del edificio
const WallConsTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const wallconsPropsMap = appstate.energy_indicators.props.wallcons;
  const walls_Co100 = appstate.energy_indicators.n50_data.walls_c.toFixed(2);
  const mats = appstate.cons.materials;

  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "30%" }),
      headerTitle: () => "Nombre que identifica la construcción de opaco",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Construcción de opaco id: ${row.id}`,
    },
    {
      dataField: "layers",
      text: "Capas",
      align: "center",
      formatter: LayersFmt,
      formatExtraData: mats,
      headerTitle: () => "Capas de la construcción (nº)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Capas
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[nº]</i>{" "}
          </span>
        </>
      ),
      editorRenderer: (editorProps, value, row) => (
        <LayersEditor {...editorProps} value={value} name={row.name} />
      ),
      title: (_cell, row) =>
        `Construcción de opaco:\n ${row.layers
          .map(
            ({ material, e }) =>
              "- " +
              mats.find((m) => m.id == material)?.name +
              ": " +
              e.toFixed(2)
          )
          .join("\n")}`,
    },
    {
      dataField: "absorptance",
      text: "Absortividad",
      align: "center",
      formatter: (cell) => optionalNumberDisplay(cell, 2),
      validator: validateNonNegNumber,
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
      formatter: (_cell, row, _rowIndex, extraData) =>
        optionalNumberDisplay(extraData[row.id].thickness, 3),
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
      dataField: "resistance",
      text: "Resistencia intrínseca",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: (_cell, row, _rowIndex, extraData) =>
        optionalNumberDisplay(extraData[row.id].resistance, 2),
      formatExtraData: wallconsPropsMap,
      headerTitle: () =>
        "Resistencia térmica de la solución constructiva (sin resistencias superficiales) (m²·K/W)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          R<sub>c;op</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m²·K/W]</i>{" "}
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
            ["thickness", "resistance", "absorptance"].includes(
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

export default observer(WallConsTable);
