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

import React, { useState, useContext } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { AgTable } from "../tables/AgTable.jsx";
import {
  MultiplierFmt,
  optionalNumberDisplay,
  SpaceTypeFmt,
  ZFmt,
} from "../tables/FormattersAg.jsx";
import { getHeader } from "../tables/Helpers.jsx";
import {
  validateIntegerNumber,
  validateNonNegNumber,
  validateNumber,
} from "../tables/Validators.js";

import { LOAD, THERMOSTAT, SPACE_TYPES_MAP } from "../../stores/types";

// Custom editor para pertenencia a la ET
//
// The getElement function returns a JSX value and takes two arguments:
//  - onUpdate: if you want to apply the modified data, call this function
//  - props: contain customEditorParameters, whole row data, defaultValue and attrs
// Usamos forwardRef para poder tener referencias en componentes funcionales
// ver: https://github.com/reactjs/reactjs.org/issues/2120
const InsideTeEditor = React.forwardRef((props, _ref) => {
  const { value: cellValue, onUpdate } = props;
  const [value, setValue] = useState(cellValue);

  return (
    <input
      type="checkbox"
      checked={value}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onUpdate(value);
        }
      }}
      onChange={(_e) => setValue(!value)}
      onBlur={(_e) => onUpdate(value)}
    />
  );
});

// Custom editor para nivel de ventilación de los espacios n_v
const NVEditor = React.forwardRef((props, _ref) => {
  const { defaultValue, onUpdate } = props;
  const [value, setValue] = useState(defaultValue);
  const updateData = () => {
    // onUpdate cancela la edición si se pasa null así que usamos undefined en ese caso
    // en BootstrapTable usamos cellEdit.afterSaveCell para cambiar undefined por null
    const res =
      value === null || value === ""
        ? undefined
        : Number(value.replace(",", "."));
    onUpdate(res);
  };

  return (
    <span>
      <input
        type="text"
        value={value === null || undefined ? "" : value}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateData();
          }
        }}
        onChange={(e) => {
          let val = e.currentTarget.value;
          val =
            val === "" ||
            val === null ||
            Number.isNaN(Number(val.replace(",", ".")))
              ? ""
              : val;
          setValue(val);
        }}
        onBlur={(_e) => updateData()}
      />
    </span>
  );
});

// Tabla de espacios del edificio
const SpacesTable = ({ selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);
  const spacePropsMap = appstate.energy_indicators.props.spaces;
  const loadsMap = appstate.getIdNameMap(LOAD);
  const thermostatsMap = appstate.getIdNameMap(THERMOSTAT);

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
      cellClass: "text-center",
      valueFormatter: MultiplierFmt,
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
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      cellClass: "text-center",
      // editorRenderer: (
      //   editorProps,
      //   value,
      //   _row,
      //   _column,
      //   _rowIndex,
      //   _columnIndex
      // ) => <InsideTeEditor value={value} {...editorProps} />,
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
      valueFormatter: optionalNumberDisplay,
      valueSetter: validateNonNegNumber,
      headerTooltip: "Altura total, bruta, o de suelo a suelo, del espacio (m)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("h", "s-s", "m"),
    },

    {
      headerName: "z",
      field: "z",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: ZFmt,
      valueSetter: validateNumber,
      headerTooltip: "Cota de la planta respecto al terreno, en m",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("z", "", "m"),
    },
    {
      headerName: "Cargas",
      field: "loads",
      cellDataType: "text",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(loadsMap) },
      refData: loadsMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => loadsMap[value],
      headerTooltip: "Perfil de cargas del espacio",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Consignas",
      field: "thermostat",
      cellDataType: "text",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(thermostatsMap) },
      refData: thermostatsMap,
      cellClass: "text-center",
      valueFormatter: ({ value }) => thermostatsMap[value],
      headerTooltip: "Consignas de temperatura en el espacio",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "Infiltraciones ren/h",
      field: "n_v",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      editable: ({ data }) => {
        return data.type === "UNINHABITED";
      },
      // customEditor: {
      //   getElement: (onUpdate, props) => (
      //     <NVEditor onUpdate={onUpdate} defaultValue={null} {...props} />
      //   ),
      // },
      headerTooltip: "Nivel de infiltraciones del espacio, en ren/h",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("n", "v", "ren/h"),
    },
    {
      headerName: "Iluminancia lux",
      field: "illuminance",
      cellDataType: "number",
      cellClass: "text-center",
      valueFormatter: optionalNumberDisplay,
      // customEditor: {
      //   getElement: (onUpdate, props) => (
      //     <NVEditor onUpdate={onUpdate} defaultValue={null} {...props} />
      //   ),
      // },
      headerTooltip: "Iluminancia media en el plano de trabajo, en lux",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("E", "m", "lux"),
    },
    {
      headerName: "A",
      editable: false,
      cellDataType: "number",
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) =>
        spacePropsMap[data.id].area * spacePropsMap[data.id].multiplier,
      valueFormatter: optionalNumberDisplay,
      headerTooltip: "Superficie útil del espacio (m²)",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("A", "use;zt", "m²"),
    },
    {
      headerName: "Volumen neto",
      editable: false,
      cellDataType: "number",
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) =>
        spacePropsMap[data.id].volume_net * spacePropsMap[data.id].multiplier,
      valueFormatter: optionalNumberDisplay,
      headerTooltip: "Volumen neto del espacio, en m³",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("V", "net", "m³"),
    },
    {
      headerName: "VEEI",
      editable: false,
      cellDataType: "number",
      cellClass: "td-column-computed-readonly text-center",
      valueGetter: ({ data }) => spacePropsMap[data.id].veei,
      valueFormatter: optionalNumberDisplay,
      headerTooltip:
        "Valor de la eficiencia energética de la iluminación, en W/m²·100lx",
      headerClass: "text-light bg-secondary text-center",
      headerComponent: (_props) => getHeader("VEEI", "", "W/m²·100lx"),
    },
  ]);

  const rowData = appstate.spaces;

  return (
    <AgTable
      rowData={rowData}
      columnDefs={columnDefs}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
    />
  );

  // return (
  //   <BootstrapTable
  //     data={appstate.spaces}
  //     keyField="id"
  //     striped
  //     hover
  //     bordered={false}
  //     cellEdit={cellEditFactory({
  //       mode: "dbclick",
  //       blurToSave: true,
  //       afterSaveCell: (oldValue, newValue, row, column) => {
  //         if (
  //           (column.field === "n_v" && newValue === undefined) ||
  //           (column.field === "kind" && newValue !== "UNINHABITED")
  //         ) {
  //           // Corrige el valor de n_v de undefined a null
  //           // o cambia a null cuando no son espacios no habitables
  //           // TODO: esto en terciario no necesariamente es así,
  //           // ya que se pueden definir las infiltraciones
  //           // cuando no funcionan los equipos
  //           row.n_v = null;
  //         } else if (
  //           column.field === "illuminance" &&
  //           newValue === undefined
  //         ) {
  //           // Corrige el valor de illuminance de undefined a null
  //           row.illuminance = null;
  //         } else if (
  //           ["loads", "thermostat"].includes(column.field) &&
  //           newValue === ""
  //         ) {
  //           row[column.field] = null;
  //         } else if (
  //           !["name", "inside_tenv", "kind", "loads", "thermostat"].includes(
  //             column.field
  //           )
  //         ) {
  //           // Convierte a número salvo en el caso del nombre, inside_tenv, kind, loads y thermostat
  //           row[column.field] = getFloatOrOld(newValue, oldValue);
  //         }
  //       },
  //     })}
  //     selectRow={{
  //       mode: "checkbox",
  //       clickToSelect: true,
  //       clickToEdit: true,
  //       selected: selectedIds,
  //       onSelect: (row, isSelected) => {
  //         if (isSelected) {
  //           setSelectedIds([...selectedIds, row.id]);
  //         } else {
  //           setSelectedIds(selectedIds.filter((it) => it !== row.id));
  //         }
  //       },
  //       hideSelectColumn: true,
  //       bgColor: "lightgray",
  //     }}
  //     // clase para elementos fuera de la ET
  //     rowClasses={(row, _rowIndex) => (row.inside_tenv ? null : "outsidetenv")}
  //     columns={columns}
  //   />
  // );
};

export default observer(SpacesTable);
// export default observer(()=> <p>Prueba</p>)
