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
import {
  Modal,
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
  ButtonToolbar,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import iconplus from "../img/baseline-add-24px.svg";
import iconless from "../img/baseline-remove-24px.svg";
import iconselectall from "../img/select-rows.svg";
import iconselectnone from "../img/unselect-rows.svg";
import iconduplicate from "../img/outline-file_copy-24px.svg";
import { uuidv4 } from "../../utils";
import AppState, { EMPTY_ID } from "../../stores/AppState";

import {
  Float3DigitsFmt,
  getFloatOrOld,
  NameFromIdFmt,
} from "../building/TableHelpers";
import { MATERIAL } from "../../stores/types";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de capas de construcciones de opacos (id = UUID de material, e= espesor)
// Recibe las capas de una construcción [{id, e}, ...]
export const LayersEditor = React.forwardRef(
  ({ onUpdate, value, name }, _ref) => {
    const [show, setShow] = useState(true);
    // Lista de puntos 2D del polígono como objetos
    const [layers, setLayers] = useState(
      (value || []).map((layer) => ({ id: uuidv4(), ...layer }))
    );

    const updateData = () => {
      const polygon = layers.map((p) => ({ material: p.material, e: p.e }));
      return onUpdate(polygon);
    };

    const handleClose = () => {
      setShow(false);
      updateData();
    };

    const handleCancel = () => {
      setShow(false);
      return onUpdate(value);
    };

    return (
      <Modal
        role="dialog"
        show={show}
        centered
        size="lg"
        onHide={() => handleCancel()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Construcción de elementos opacos ({name})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <LayersTable layers={layers} setLayers={setLayers} />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

// Tabla de puentes térmicos del edificio
const LayersTable = ({ layers, setLayers }) => {
  const appstate = useContext(AppState);
  const matsMap = appstate.getIdNameMap(MATERIAL);
  const materialOpts = appstate.getElementOptions(MATERIAL);

  // Filas de puntos 2D seleccionados
  const [selected, setSelected] = useState([]);

  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "material",
      text: "Material de opaco",
      editor: {
        type: Type.SELECT,
        options: materialOpts,
      },
      formatter: NameFromIdFmt,
      formatExtraData: matsMap,
      align: "left",
      headerTitle: (_col, _colIndex) => "Material de opaco",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => <>Material</>,
    },
    {
      dataField: "e",
      formatter: Float3DigitsFmt,
      text: "Espesor",
      align: "center",
      headerTitle: (_col, _colIndex) => "Espesor de la capa",
      headerStyle: () => ({ width: "20%" }),
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Espesor
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <Row id="ctable">
      <Col>
        <p htmlFor="ctable">Capas (de exterior a interior):</p>
        <AddRemovePolyButtonGroup
          layers={layers}
          setLayers={setLayers}
          selectedIds={selected}
          setSelectedIds={setSelected}
        />
        <BootstrapTable
          data={layers}
          keyField="id"
          striped
          hover
          bordered={false}
          cellEdit={cellEditFactory({
            mode: "dbclick",
            blurToSave: true,
            afterSaveCell: (oldValue, newValue, row, column) => {
              // Convierte a número campos numéricos
              if (["e"].includes(column.dataField)) {
                row[column.dataField] = getFloatOrOld(newValue, oldValue);
              }
            },
          })}
          selectRow={{
            mode: "checkbox",
            clickToSelect: true,
            clickToEdit: true,
            selected: selected,
            onSelect: (row, isSelected, _rowIndex, _e) => {
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
      </Col>
    </Row>
  );
};

const AddRemovePolyButtonGroup = ({
  layers,
  setLayers,
  selectedIds,
  setSelectedIds,
}) => {
  return (
    <ButtonToolbar>
      <ButtonGroup
        className="mr-2"
        aria-label="Barra de modificación de líneas"
      >
        <Button
          variant="primary"
          size="sm"
          title="Añadir una capa al final de la tabla"
          onClick={() => {
            const element = { id: uuidv4(), material: EMPTY_ID, e: 0.1 };
            setLayers([...layers, element]);
            // seleccionamos nuevo elemento recién creado
            setSelectedIds([element.id]);
          }}
        >
          <img src={iconplus} alt="Añadir capa" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Duplicar capas seleccionadas de la tabla"
          onClick={() => {
            const newids = [];
            selectedIds.forEach((id) => {
              const selectedIndex = layers.findIndex((h) => h.id === id);
              if (selectedIndex !== -1) {
                const idx = selectedIndex >= 0 ? selectedIndex : 0;
                const selectedObj = layers[idx];
                const dupObj = {
                  ...selectedObj,
                  id: uuidv4(),
                };
                newids.push(dupObj.id);
                layers.splice(idx + 1, 0, dupObj);
                setLayers(layers);
              }
            });
            // Reseleccionamos lo nuevo
            setSelectedIds(newids);
          }}
        >
          <img src={iconduplicate} alt="Duplicar capas" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Eliminar capas seleccionadas de la tabla"
          onClick={() => {
            if (selectedIds.length > 0) {
              const indices = layers.reduce((acc, cur, idx) => {
                if (selectedIds.includes(cur.id)) {
                  acc.push(idx);
                }
                return acc;
              }, []);
              const minidx = Math.max(0, Math.min(...indices) - 1);
              const newPoly = layers.filter((h) => !selectedIds.includes(h.id));
              // Selecciona el elemento anterior al primero seleccionado salvo que no queden elementos o sea el primero, o nada si no hay elementos
              if (newPoly.length > 0) {
                setSelectedIds([newPoly[minidx].id]);
              } else {
                setSelectedIds([]);
              }
              setLayers(newPoly);
            }
          }}
        >
          <img src={iconless} alt="Eliminar capa" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Barra de selección y deselección de capas">
        <Button
          variant="primary"
          size="sm"
          title="Seleccionar todas las capas de la tabla"
          onClick={() => {
            setSelectedIds(layers.map((e) => e.id));
          }}
        >
          <img src={iconselectall} alt="Seleccionar todo" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Deseleccionar todas las filas de la tabla"
          onClick={() => {
            setSelectedIds([]);
          }}
        >
          <img src={iconselectnone} alt="Deseleccionar todo" />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};
