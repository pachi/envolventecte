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

import React from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";

import iconPlus from "../img/baseline-add-24px.svg";
import iconLess from "../img/baseline-remove-24px.svg";
import iconSelectAll from "../img/select-rows.svg";
import iconSelectNone from "../img/unselect-rows.svg";
import iconDuplicate from "../img/outline-file_copy-24px.svg";
import { uuidv4 } from "../../utils";

// Componente de edición de listas
// Permite añadir, duplicar, eliminar, seleccionar y deseleccionar elementos de la lista
export const ListEditor = ({
  list,
  setList,
  newElement,
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
          title="Añadir una fila al final de la tabla"
          onClick={() => {
            const element = newElement();
            setList([...list, element]);
            // seleccionamos nuevo elemento recién creado
            setSelectedIds([element.id]);
          }}
        >
          <img src={iconPlus} alt="Añadir fila" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Duplicar filas seleccionadas de la tabla"
          onClick={() => {
            const newids = [];
            selectedIds.forEach((id) => {
              const selectedIndex = list.findIndex((h) => h.id === id);
              if (selectedIndex !== -1) {
                const idx = selectedIndex >= 0 ? selectedIndex : 0;
                const selectedObj = list[idx];
                const dupObj = {
                  ...selectedObj,
                  id: uuidv4(),
                };
                newids.push(dupObj.id);
                list.splice(idx + 1, 0, dupObj);
                setList(list);
              }
            });
            // Reseleccionamos lo nuevo
            setSelectedIds(newids);
          }}
        >
          <img src={iconDuplicate} alt="Duplicar fila" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Eliminar filas seleccionadas de la tabla"
          onClick={() => {
            if (selectedIds.length > 0) {
              const indices = list.reduce((acc, cur, idx) => {
                if (selectedIds.includes(cur.id)) {
                  acc.push(idx);
                }
                return acc;
              }, []);
              const minidx = Math.max(0, Math.min(...indices) - 1);
              const newList = list.filter((h) => !selectedIds.includes(h.id));
              // Selecciona el elemento anterior al primero seleccionado salvo que no queden elementos o sea el primero, o nada si no hay elementos
              if (newList.length > 0) {
                setSelectedIds([newList[minidx].id]);
              } else {
                setSelectedIds([]);
              }
              setList(newList);
            }
          }}
        >
          <img src={iconLess} alt="Eliminar fila" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Barra de selección y deselección de filas">
        <Button
          variant="primary"
          size="sm"
          title="Seleccionar todas las filas de la tabla"
          onClick={() => {
            setSelectedIds(list.map((e) => e.id));
          }}
        >
          <img src={iconSelectAll} alt="Seleccionar todo" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Deseleccionar todas las filas de la tabla"
          onClick={() => {
            setSelectedIds([]);
          }}
        >
          <img src={iconSelectNone} alt="Deseleccionar todo" />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};
