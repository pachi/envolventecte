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
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import {
  Float2DigitsFmt,
  InsideTeFmt,
  MultiplierFmt,
  NameFromIdFmt,
  SpaceTypeFmt,
  spaceTypesOpts,
  SpaceAreaFmt,
  SpaceVolumeFmt,
  ZFmt,
} from "../tables/Formatters";
import {
  validateNonNegNumber,
  validateNumber,
  validateIntegerNumber,
} from "../tables/Validators";

import { getFloatOrOld } from "../tables/utils";

import { LOAD, SYS_SETTING } from "../../stores/types";

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
  const loadsOpts = appstate.getElementOptions(LOAD, true);
  const sysSettingsMap = appstate.getIdNameMap(SYS_SETTING);
  const sysSettingsOpts = appstate.getElementOptions(SYS_SETTING, true);

  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      classes: "font-weight-bold",
      headerStyle: () => ({ width: "30%" }),
      headerTitle: () => "Nombre del espacio",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Espacio id: ${row.id}`,
    },
    {
      dataField: "multiplier",
      text: "Multiplicador",
      align: "center",
      formatter: MultiplierFmt,
      validator: validateIntegerNumber,
      headerTitle: () => "Multiplicador (-). Número de espacios iguales",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          mult.
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "kind",
      text: "Tipo de espacio",
      align: "center",
      formatter: SpaceTypeFmt,
      editor: {
        type: Type.SELECT,
        options: spaceTypesOpts,
      },
      headerTitle: () =>
        "Tipo de espacio: ACONDICIONADO, NO ACONDICIONADO, NO HABITABLE",
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
      dataField: "inside_tenv",
      text: "Interior a ET",
      align: "center",
      formatter: InsideTeFmt,
      editorRenderer: (
        editorProps,
        value,
        _row,
        _column,
        _rowIndex,
        _columnIndex
      ) => <InsideTeEditor value={value} {...editorProps} />,
      headerTitle: () =>
        "¿Pertenece el espacio al interior de la envolvente térmica?",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          ¿Interior <br />a la E.T.?
        </>
      ),
    },
    {
      dataField: "height",
      text: "Altura",
      align: "center",
      formatter: Float2DigitsFmt,
      validator: validateNonNegNumber,
      headerTitle: () =>
        "Altura total, bruta, o de suelo a suelo, del espacio (m)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          h<sub>s-s</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "n_v",
      text: "Ventilación ren/h",
      align: "center",
      formatter: Float2DigitsFmt,
      editable: (cell, row) => {
        return row.type === "UNINHABITED";
      },
      customEditor: {
        getElement: (onUpdate, props) => (
          <NVEditor onUpdate={onUpdate} defaultValue={null} {...props} />
        ),
      },
      headerTitle: () =>
        "Ventilación del espacio, en ren/h. Sólo cuando se trata de espacios no habitables.",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          n<sub>v</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[ren/h]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "z",
      text: "z",
      align: "center",
      formatter: ZFmt,
      validator: validateNumber,
      headerTitle: () => "Cota de la planta respecto al terreno, en m",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          z
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "loads",
      text: "Cargas",
      editor: {
        type: Type.SELECT,
        options: loadsOpts,
      },
      align: "center",
      formatter: NameFromIdFmt,
      formatExtraData: loadsMap,
      headerTitle: () => "Perfil de cargas del espacio",
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
    },
    {
      dataField: "sys_settings",
      text: "Consignas",
      editor: {
        type: Type.SELECT,
        options: sysSettingsOpts,
      },
      align: "center",
      formatter: NameFromIdFmt,
      formatExtraData: sysSettingsMap,
      headerTitle: () => "Consignas de temperatura en el espacio",
      headerAlign: "center",
      headerClasses: "text-light bg-secondary",
    },
    {
      dataField: "area",
      text: "A",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: SpaceAreaFmt,
      formatExtraData: spacePropsMap,
      headerTitle: () => "Superficie útil del espacio (m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          A<sub>use;zt</sub>
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
      dataField: "volume_net",
      text: "Volumen neto",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: SpaceVolumeFmt,
      formatExtraData: spacePropsMap,
      headerTitle: () => "Volumen neto del espacio, en m³",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          V<sub>net</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>
              [m<sup>3</sup>]
            </i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <BootstrapTable
      data={appstate.spaces}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (
            (column.dataField === "n_v" && newValue === undefined) ||
            (column.dataField === "kind" && newValue !== "UNINHABITED")
          ) {
            // Corrige el valor de n_v de undefined a null
            // o cambia a null cuando no son espacios no habitables
            row.n_v = null;
          } else if (
            ["loads", "sys_settings"].includes(column.dataField) &&
            newValue === ""
          ) {
            row[column.dataField] = null;
          } else if (
            !["name", "inside_tenv", "kind", "loads", "sys_settings"].includes(
              column.dataField
            )
          ) {
            // Convierte a número salvo en el caso del nombre o de inside_tenv
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
      // clase para elementos fuera de la ET
      rowClasses={(row, _rowIndex) => (row.inside_tenv ? null : "outsidetenv")}
      columns={columns}
    />
  );
};

export default observer(SpacesTable);
// export default observer(()=> <p>Prueba</p>)
