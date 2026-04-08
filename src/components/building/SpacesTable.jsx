/* -*- coding: utf-8 -*-

Copyright (c) 2016-2026 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { useState, useContext } from "react";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";
import {
  DefaultOneFmt,
  optionalNumberFmt,
  SpaceTypeFmt,
  DefaultZeroFmt,
} from "../tables/Formatters.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import {
  validateIntegerNumber,
  validateNonNegNumber,
  validateNumber,
} from "../tables/Validators.js";

import { LOAD, THERMOSTAT, SPACE_TYPES_MAP } from "../../stores/types";

// TODO: completa validaciones y valores que pueden ser null

// Tabla de espacios del edificio
// {
//    id: "6b351706-c5d1-19d2-3ef5-866eb367f90a",
//    name: "Espacio",
//    multiplier: 1.0,
//    kind: "CONDITIONED", // UNCONDITIONED, UNINHABITED
//    inside_tenv: true,
//    height: 3.0,
//    z: 0.0,
//    loads: null, // o UUID
//    thermostats: null, // o UUID
//    n_v: null, // o número
//    illuminance: null, // o número
// }
const SpacesTable = ({ gridRef }) => {
  const appstate = useContext(AppState);

  const spacePropsMap = appstate.energy_indicators.props.spaces;
  const loadsMap = () => appstate.getIdNameMap(LOAD);
  const thermostatsMap = () => appstate.getIdNameMap(THERMOSTAT);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Nombre",
      field: "name",
      cellDataType: "text",
      cellClass: "font-weight-bold",
      flex: 2,
      headerTooltip: "Nombre del espacio",
      headerClass: "text-light bg-secondary",
      tooltipValueGetter: ({ data }) => `Espacio id: ${data.id}`,
    },
    {
      headerName: "Multiplicador",
      field: "multiplier",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: DefaultOneFmt,
      valueSetter: validateIntegerNumber,
      headerTooltip: "Multiplicador (-). Número de espacios iguales",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("mult.", "", "-"),
    },
    {
      headerName: "Tipo de espacio",
      field: "kind",
      cellDataType: "text",
      cellClass: "text-center",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(SPACE_TYPES_MAP) },
      refData: SPACE_TYPES_MAP,
      valueFormatter: SpaceTypeFmt,
      headerTooltip:
        "Tipo de espacio: ACONDICIONADO, NO ACONDICIONADO, NO HABITABLE",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("Tipo"),
    },
    {
      headerName: "Interior a ET",
      field: "inside_tenv",
      cellDataType: "boolean",
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      cellClass: "text-center",
      headerTooltip:
        "¿Pertenece el espacio al interior de la envolvente térmica?",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("¿Interior a la E.T.?"),
    },
    {
      field: "height",
      headerName: "Altura",
      cellDataType: "number",
      cellClass: "text-center",
      valueSetter: validateNonNegNumber,
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Altura total, bruta, o de suelo a suelo, del espacio (m)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("h", "s-s", "m"),
    },

    {
      headerName: "z",
      field: "z",
      cellDataType: "number",
      cellClass: "text-center",
      valueSetter: validateNumber,
      valueFormatter: DefaultZeroFmt,
      headerTooltip: "Cota de la planta respecto al terreno, en m",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("z", "", "m"),
    },
    {
      headerName: "Cargas",
      field: "loads",
      cellDataType: "text",
      // TODO: este campo se debería poder dejar a null
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => ({ values: Object.keys(loadsMap()) }),
      refData: loadsMap,
      valueFormatter: ({ value }) => loadsMap()[value] ?? "-",
      cellClass: "text-center",
      headerTooltip: "Perfil de cargas del espacio",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Consignas",
      field: "thermostat",
      cellDataType: "text",
      // TODO: este campo se debería poder dejar a null
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => ({ values: Object.keys(thermostatsMap()) }),
      refData: thermostatsMap,
      valueFormatter: ({ value }) => thermostatsMap()[value] ?? "-",
      cellClass: "text-center",
      headerTooltip: "Consignas de temperatura en el espacio",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Infiltraciones ren/h",
      field: "n_v",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberFmt,
      editable: ({ data }) => {
        return data.kind === "UNINHABITED";
      },
      // TODO: este campo tiene que ponerse a null cuando no es no habitable
      headerTooltip: "Nivel de infiltraciones del espacio, en ren/h",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("n", "v", "ren/h"),
    },
    {
      headerName: "Iluminancia lux",
      field: "illuminance",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberFmt,
      // TODO: ver que este campo se pueda dejar a null o a un número
      headerTooltip: "Iluminancia media en el plano de trabajo, en lux",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("E", "m", "lux"),
    },
    // Columnas calculadas ----
    {
      headerName: "A",
      field: "area",
      editable: false,
      cellDataType: "number",
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Superficie útil del espacio (m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "use;zt", "m²"),
    },
    {
      headerName: "Volumen neto",
      field: "volume_net",
      editable: false,
      cellDataType: "number",
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip: "Volumen neto del espacio, en m³",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("V", "net", "m³"),
    },
    {
      headerName: "VEEI",
      field: "veei",
      editable: false,
      cellDataType: "number",
      cellClass: "column-computed-readonly text-center",
      valueFormatter: optionalNumberFmt,
      headerTooltip:
        "Valor de la eficiencia energética de la iluminación, en W/m²·100lx",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("VEEI", "", "W/m²·100lx"),
    },
  ]);

  // Genera filas con columnas adicionales calculadas
  const rowData = appstate.spaces.map((e) => {
    const d = spacePropsMap[e.id];
    return {
      ...e,
      // Columnas calculadas
      area: d?.area * d?.multiplier,
      volume_net: d?.volume_net * d?.multiplier,
      veei: d?.veei,
    };
  });

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      gridRef={gridRef}
      getRowStyle={(params) =>
        params.data.inside_tenv ? null : { opacity: 0.5 }
      }
      onCellValueChanged={({ node, colDef, newValue }) => {
        // XXX: esto en terciario no necesariamente es así,
        // ya que se pueden definir las infiltraciones
        // cuando no funcionan los equipos
        if (colDef.field == "kind" && newValue != "UNINHABITED") {
          appstate.spaces[node.rowIndex]["n_v"] = null;
        } else {
          appstate.spaces[node.rowIndex]["n_v"] = 1.0;
        }
        appstate.spaces[node.rowIndex][colDef.field] = newValue;
      }}
    />
  );
};

export default observer(SpacesTable);
