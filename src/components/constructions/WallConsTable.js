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
import { Float2DigitsFmt } from "../tables/Formatters";
import { validateNonNegNumber } from "../tables/Validators";
import { getFloatOrOld } from "../tables/utils";

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

// Selecciona color según propiedades del material
// Combinar conductividad con densidad para mejorar heurística según
// https://www.codigotecnico.org/pdf/Programas/CEC/CAT-EC-v06.3_marzo_10.pdf
const getMatColor = (mat, _e) => {
  if (mat.conductivity) {
    const lambda = mat.conductivity;
    if (lambda < 0.1) {
      // Aislantes - amarillo
      return "yellow";
    } else if (lambda < 0.35) {
      // Madera / Morteros / piezas cerámicas ligeras - naranja
      return "orange";
    } else if (lambda < 0.9) {
      // Madera / Morteros / piezas cerámicas ligeras - verde
      return "green";
    } else if (lambda < 1.5) {
      // Cerámica - marrón
      return "brown";
    } else if (lambda < 3.0) {
      // Mortero / hormigón - gris oscuro
      return "darkgray";
    } else {
      // Metal - azul oscuro
      return "navyblue";
    }
  } else {
    return "lightblue";
  }
};

const LayersFmt = (cell, _row, _rowIndex, materials) => {
  // cell == id
  const nlayers = cell.length;
  if (nlayers === 0) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10">
        <rect x="0" y="0" width="100" height="10" fill="white" />
      </svg>
    );
  }
  let xPos = 0;
  const layers = [];
  for (const [idx, { material, e }] of cell.entries()) {
    const mat = materials.find((m) => m.id === material);
    const color = getMatColor(mat, e);
    const width = Math.round(e * 100);
    layers.push(
      <rect key={idx} x={xPos} y="0" width={width} height="10" fill={color} />
    );
    xPos += Math.round(e * 100);
  }

  //  = cell.map(({ material, e }, idx) => {
  //   const mat = materials.find((m) => m.id === material);
  //   return <rect key={idx} x={10 * idx} width="10" height="10" fill={getMatColor(mat, e)} />;
  // });
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10">
      {layers}
    </svg>
  );
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
      formatter: LayersFmt,
      // formatter: LayersImgFmt,
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
      formatter: Float2DigitsFmt,
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
