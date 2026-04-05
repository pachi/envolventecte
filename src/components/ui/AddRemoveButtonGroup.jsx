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

import React, { useContext } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import iconplus from "../img/baseline-add-24px.svg";
import iconless from "../img/baseline-remove-24px.svg";
import iconduplicate from "../img/outline-file_copy-24px.svg";
import iconarrowup from "../img/arrow_up.svg";
import iconarrowdown from "../img/arrow_down.svg";

const AddRemoveButtonGroup = observer(
  ({ elementType, gridRef }) => {
    const appstate = useContext(AppState);

    const getSelectedIds = () => {
      if (!gridRef?.current?.api) return [];
      return gridRef.current.api.getSelectedNodes().map(node => node.data.id);
    };

    const setSelectedIds = (ids) => {
      if (!gridRef?.current?.api) return;
      gridRef.current.api.deselectAll();
      if (ids.length > 0) {
        gridRef.current.api.forEachNode(node => {
          if (ids.includes(node.data.id)) {
            node.setSelected(true);
          }
        });
      }
    };

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
              const newid = appstate.addElement(elementType);
              setSelectedIds([newid]);
            }}
          >
            <img src={iconplus} alt="Añadir fila" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            title="Duplicar filas seleccionadas de la tabla"
            onClick={() => {
              const selectedIds = getSelectedIds();
              const newids = appstate.duplicateElements(
                elementType,
                selectedIds
              );
              setSelectedIds(newids);
            }}
          >
            <img src={iconduplicate} alt="Duplicar fila" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            title="Eliminar filas seleccionadas de la tabla"
            onClick={() => {
              const selectedIds = getSelectedIds();
              if (selectedIds.length > 0) {
                let newid = appstate.deleteElements(elementType, selectedIds);
                setSelectedIds(newid !== null ? [newid] : []);
              }
            }}
          >
            <img src={iconless} alt="Eliminar fila" />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Barra de subir o bajar filas">
          <Button
            variant="primary"
            size="sm"
            title="Subir primer elemento seleccionado en la tabla"
            onClick={() => {
              const selectedIds = getSelectedIds();
              appstate.moveUpFirstSelectedElement(elementType, selectedIds);
            }}
          >
            <img src={iconarrowup} alt="Subir filas" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            title="Bajar primer elemento seleccionado en la tabla"
            onClick={() => {
              const selectedIds = getSelectedIds();
              appstate.moveDownFirstSelectedElement(elementType, selectedIds);
            }}
          >
            <img src={iconarrowdown} alt="Bajar filas" />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
);

export default AddRemoveButtonGroup;
