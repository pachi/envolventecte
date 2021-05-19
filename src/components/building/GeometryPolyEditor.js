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

import React, { useState } from "react";
import { Modal, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import iconplus from "../img/baseline-add-24px.svg";
import iconless from "../img/baseline-remove-24px.svg";
import iconselectall from "../img/select-rows.svg";
import iconselectnone from "../img/unselect-rows.svg";
import iconduplicate from "../img/outline-file_copy-24px.svg";
import { uuidv4 } from "../../utils";

import { Float2DigitsFmt, getFloatOrOld } from "./TableHelpers";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de datos geométricos de elementos opacos y sombras
// Recibe el polígono de un elemento geometry {azimuth: f32, tilt: f32, position: [f32, f32, f32], polygon: [[f32, f32], ...]}
// Devuelve una lista de puntos 2D
export const GeometryPolyEditor = React.forwardRef(
  ({ onUpdate, value, ...rest }, ref) => {
    // Muestra el diálogo modal
    const [show, setShow] = useState(true);
    // Lista de puntos 2D del polígono como objetos
    const [poly, setPoly] = useState(
      (value || []).map((p) => ({ id: uuidv4(), X: p[0], Y: p[1] }))
    );
    const updateData = () => onUpdate(poly.map((p) => [p.X, p.Y]));
    const handleClose = () => {
      setShow(false);
      updateData();
    };

    return (
      <Modal
        role="dialog"
        show={show}
        centered
        onHide={() => handleClose()}
        // Evitar enviar acciones a la tabla posterior
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Posición del elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CoordsTable poly={poly} setPoly={setPoly} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateData}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

// Tabla de puentes térmicos del edificio
const CoordsTable = ({ poly, setPoly }) => {
  // Filas de puntos 2D seleccionados
  const [selected, setSelected] = useState([]);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "X",
      formatter: Float2DigitsFmt,
      text: "Coordenada X (coordenadas locales)",
      align: "center",
      headerTitle: (_col, _colIndex) => "Coordenadas locales eje X",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          X
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "Y",
      formatter: Float2DigitsFmt,
      text: "Coordenada Y (coordenadas locales)",
      align: "center",
      headerTitle: (_col, _colIndex) => "Coordenadas locales eje Y",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Y
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <>
      <AddRemoveButtonGroup
        poly={poly}
        setPoly={setPoly}
        selected={selected}
        setSelected={setSelected}
      />
      <BootstrapTable
        data={poly}
        keyField="id"
        striped
        hover
        bordered={false}
        cellEdit={cellEditFactory({
          mode: "dbclick",
          blurToSave: true,
          afterSaveCell: (oldValue, newValue, row, column) => {
            // Convierte a número campos numéricos
            if (["X", "Y"].includes(column.dataField)) {
              row[column.dataField] = getFloatOrOld(newValue, oldValue);
            }
          },
        })}
        selectRow={{
          mode: "checkbox",
          clickToSelect: true,
          clickToEdit: true,
          selected: selected,
          onSelect: (row, isSelected, _rowIndex, e) => {
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
    </>
  );
};

const AddRemoveButtonGroup = ({ poly, setPoly, selected, setSelected }) => {
  return (
    <ButtonToolbar>
      <ButtonGroup
        className="mr-2"
        aria-label="Barra de modificación de líneas"
      >
        <Button
          variant="primary"
          size="sm"
          title="Añadir una fila al final de la tabla"
          onClick={() => {
            const element = { id: uuidv4(), X: 0.0, Y: 0.0 };
            setPoly([...poly, element]);
            // seleccionamos nuevo elemento recién creado
            setSelected([element.id]);
          }}
        >
          <img src={iconplus} alt="Añadir fila" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Duplicar filas seleccionadas de la tabla"
          onClick={() => {
            const newids = [];
            selected.forEach((id) => {
              const selectedIndex = poly.findIndex((h) => h.id === id);
              if (selectedIndex !== -1) {
                const idx = selectedIndex >= 0 ? selectedIndex : 0;
                const selectedObj = poly[idx];
                const dupObj = {
                  ...selectedObj,
                  id: uuidv4(),
                };
                newids.push(dupObj.id);
                poly.splice(idx + 1, 0, dupObj);
                setPoly(poly);
              }
            });
            // Reseleccionamos lo nuevo
            setSelected(newids);
          }}
        >
          <img src={iconduplicate} alt="Duplicar fila" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Eliminar filas seleccionadas de la tabla"
          onClick={() => {
            if (selected.length > 0) {
              const indices = poly.reduce((acc, cur, idx) => {
                if (selected.includes(cur.id)) {
                  acc.push(idx);
                }
                return acc;
              }, []);
              const minidx = Math.max(0, Math.min(...indices) - 1);
              const newPoly = poly.filter((h) => !selected.includes(h.id));
              // Selecciona el elemento anterior al primero seleccionado salvo que no queden elementos o sea el primero, o nada si no hay elementos
              if (newPoly.length > 0) {
                setSelected([newPoly[minidx].id]);
              } else {
                setSelected([]);
              }
              setPoly(newPoly);
            }
          }}
        >
          <img src={iconless} alt="Eliminar fila" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Barra de selección y deselección de filas">
        <Button
          variant="primary"
          size="sm"
          title="Seleccionar todas las filas de la tabla"
          onClick={() => {
            setSelected(poly.map((e) => e.id));
          }}
        >
          <img src={iconselectall} alt="Seleccionar todo" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Deseleccionar todas las filas de la tabla"
          onClick={() => {
            setSelected([]);
          }}
        >
          <img src={iconselectnone} alt="Deseleccionar todo" />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};
