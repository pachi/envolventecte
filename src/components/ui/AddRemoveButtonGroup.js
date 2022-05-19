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
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import iconplus from "../img/baseline-add-24px.svg";
import iconless from "../img/baseline-remove-24px.svg";
import iconselectall from "../img/select-rows.svg";
import iconselectnone from "../img/unselect-rows.svg";
import iconduplicate from "../img/outline-file_copy-24px.svg";

const AddRemoveButtonGroup = observer(({ elementType, selectedIds, setSelectedIds }) => {
  const appstate = useContext(AppState);

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
            const newids = appstate.duplicateElements(elementType, selectedIds);
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
            if (selectedIds.length > 0) {
              let newid = appstate.deleteElements(elementType, selectedIds);
              newid !== null ? setSelectedIds([newid]) : setSelectedIds([]);
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
            setSelectedIds(appstate.getElements(elementType).map((e) => e.id));
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
});

export default AddRemoveButtonGroup;
