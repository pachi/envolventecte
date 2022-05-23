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
import { Float2DigitsFmt, getFloatOrOld } from "../building/TableHelpers";
import { LayersEditor } from "./LayersEditors";

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
const WallConsResistanceFmt = (_cell, row, _rowIndex, wallconsPropsMap) => {
  // cell == id
  const props = wallconsPropsMap[row.id];
  const p = props.resistance;
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

// Selecciona bloque de color según material
// Combinar conductividad con densidad según
// https://www.codigotecnico.org/pdf/Programas/CEC/CAT-EC-v06.3_marzo_10.pdf
const getMatColorBlock = (mat, e) => {
  const lambda = mat.conductivity || e / mat.resistance || 0;
  if (lambda < 0.1) {
    // Aislantes - amarillo
    return "\u{1F7E8}";
  } else if (lambda < 0.35) {
    // Madera / Morteros / piezas cerámicas ligeras - naranja
    return "\u{1F7E7}";
  } else if (lambda < 0.9) {
    // Madera / Morteros / piezas cerámicas ligeras - verde
    return "\u{1F7E9}";
  } else if (lambda < 1.5) {
    // Cerámica - marrón
    return "\u{1F7EB}";
  } else if (lambda < 3.0) {
    // Mortero / hormigón - azul
    return "\u{1F7E6}";
  } else {
    // Metal - negro
    return "\u{2B1B}";
  }
};

/// Formato de capas de construcción de opaco (id -> nº capas)
const LayersImgFmt = (cell, _row, _rowIndex, materials) => {
  // cell == id
  const nlayers = cell.length;
  if (nlayers === 0) {
    return <span>{"\u{25FB}"}</span>;
  }
  const layers = cell
    .map(({ material, e }) => {
      const mat = materials.find((m) => m.id === material);
      return getMatColorBlock(mat, e);
    })
    .join("");
  return <span>{layers}</span>;
};

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
      // formatter: LayersNumberFmt,
      formatter: LayersImgFmt,
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
      dataField: "resistance",
      text: "Resistencia intrínseca",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: WallConsResistanceFmt,
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
