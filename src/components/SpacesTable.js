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

import React, { useState, useContext } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer } from "mobx-react-lite";
import { SPACETYPESMAP } from "../utils";

import AppState from "../stores/AppState";

const spaceTypesOpts = Object.keys(SPACETYPESMAP).map((k) => {
  return { text: SPACETYPESMAP[k], value: k };
});

const Float1DigitsFmt = (cell, _row) => <span>{Number(cell).toFixed(1)}</span>;
const Float2DigitsFmt = (cell, _row) => {
  if (cell === null || cell === undefined) {
    return <span>-</span>;
  } else {
    return <span>{Number(cell).toFixed(2)}</span>;
  }
};
const BoolFmt = (cell, _row) => <span>{cell === true ? "Sí" : "No"}</span>;
const SpaceTypeFmt = (cell, _row) => <span>{SPACETYPESMAP[cell]}</span>;

// Custom editor para booleanos
//
// The getElement function returns a JSX value and takes two arguments:
//  - onUpdate: if you want to apply the modified data, call this function
//  - props: contain customEditorParameters, whole row data, defaultValue and attrs
// Usamos forwardRef para poder tener referencias en componentes funcionales
// ver: https://github.com/reactjs/reactjs.org/issues/2120
const BoolEditor = React.forwardRef((props, ref) => {
  const { defaultValue, onKeyDown, onUpdate } = props;
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      type="checkbox"
      checked={value}
      onKeyDown={onKeyDown}
      onChange={(e) => setValue(!value)}
      onBlur={(e) => onUpdate(value)}
    />
  );
});

// Custom editor para nivel de ventilación de los espacios n_v
const NVEditor = React.forwardRef((props, ref) => {
  const { defaultValue, onUpdate } = props;
  const [value, setValue] = useState(defaultValue);
  const updateData = () => {
    // onUpdate cancela la edición si se pasa null así que usamos undefined en ese caso
    // en BootstrapTable usamos cellEdit.afterSaveCell para cambiar undefined por null
    const res = value === null || value === "" ? undefined : Number(value);
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
            val === "" || val === null || Number.isNaN(Number(val)) ? "" : val;
          setValue(val);
        }}
        onBlur={(e) => updateData()}
      />
    </span>
  );
});

// Tabla de espacios
const SpacesTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  return (
    <BootstrapTable
      data={appstate.spaces}
      version="4"
      striped
      hover
      bordered={false}
      tableHeaderClass="text-light bg-secondary"
      cellEdit={{
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (row, cellName, cellValue) => {
          if (
            (cellName === "n_v" && cellValue === undefined) ||
            (cellName === "type" && cellValue !== "UNINHABITED")
          ) {
            // Corrige el valor de n_v de undefined a null
            // o cambia a null cuando no son espacios no habitables
            row.n_v = null;
          } else if (!["name", "inside_tenv", "type"].includes(cellName)) {
            // Convierte a número salvo en el caso del nombre o de inside_tenv
            row[cellName] = Number(cellValue);
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
      trClassName={(row, rowIdx) => (row.inside_tenv ? null : "outsidetenv")}
    >
      <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
        - ID -{" "}
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="name"
        headerText="Nombre del espacio"
        width="30%"
      >
        Nombre
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="area"
        dataFormat={Float2DigitsFmt}
        headerText="Superficie útil del espacio (m²)"
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
        dataField="multiplier"
        dataFormat={Float1DigitsFmt}
        headerText="Multiplicador (-)"
        headerAlign="center"
        dataAlign="center"
      >
        mult.
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[-]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="type"
        editable={{
          type: "select",
          options: { values: spaceTypesOpts },
        }}
        dataFormat={SpaceTypeFmt}
        headerText="Tipo de espacio: ACONDICIONADO, NO ACONDICIONADO, NO HABITABLE"
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
        dataField="inside_tenv"
        customEditor={{
          getElement: (onUpdate, props) => (
            <BoolEditor onUpdate={onUpdate} {...props} />
          ),
        }}
        dataFormat={BoolFmt}
        headerText="¿Pertenece a la envolvente térmica?"
        headerAlign="center"
        dataAlign="center"
      >
        ¿Interior <br />a la E.T.?
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="height"
        dataFormat={Float2DigitsFmt}
        headerText="Altura total, bruta, o suelo a suelo, del espacio (m)"
        headerAlign="center"
        dataAlign="center"
      >
        h<sub>s-s</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[m]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="n_v"
        dataFormat={Float2DigitsFmt}
        customEditor={{
          getElement: (onUpdate, props) => (
            <NVEditor onUpdate={onUpdate} defaultValue={null} {...props} />
          ),
        }}
        headerText="Ventilación, en ren/h. Sólo para espacios no habitables."
        headerAlign="center"
        dataAlign="center"
      >
        n<sub>v</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[ren/h]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="z"
        dataFormat={Float2DigitsFmt}
        headerText="Cota de la planta, en m"
        headerAlign="center"
        dataAlign="center"
      >
        z
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[m]</i>{" "}
        </span>
      </TableHeaderColumn>
      <TableHeaderColumn
        dataField="exposed_perimeter"
        dataFormat={Float2DigitsFmt}
        headerText="Perímetro del espacio expuesto al exterior, en m. Excluye la que lo separa de otros espacios acondicionados. Es relevante en el caso de espacios en contacto con el terreno."
        headerAlign="center"
        dataAlign="center"
      >
        p<sub>ext</sub>
        <br />
        <span style={{ fontWeight: "normal" }}>
          <i>[m]</i>{" "}
        </span>
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default observer(SpacesTable);
