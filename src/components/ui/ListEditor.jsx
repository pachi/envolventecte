/* -*- coding: utf-8 -*-

Copyright (c) 2016-2025 Rafael Villar Burke <pachi@rvburke.com>

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
import iconDuplicate from "../img/outline-file_copy-24px.svg";
import { uuidv4 } from "../../utils";

// Componente de edición de listas
// Permite añadir, duplicar, eliminar, seleccionar y deseleccionar elementos de la lista
export const ListEditor = ({
  list,
  setList,
  newElement,
  gridRef,
  selectedIds: propsSelectedIds,
  setSelectedIds: propsSetSelectedIds,
}) => {
  // Funciones helper para obtener/setear selección desde gridRef o props
  const getSelectedIds = () => {
    if (gridRef?.current?.api) {
      return gridRef.current.api.getSelectedNodes().map((node) => node.data.id);
    }
    return propsSelectedIds || [];
  };

  const setSelectedIds = (ids) => {
    if (gridRef?.current?.api) {
      gridRef.current.api.deselectAll();
      if (ids.length > 0) {
        gridRef.current.api.forEachNode((node) => {
          if (ids.includes(node.data.id)) node.setSelected(true);
        });
      }
    } else if (propsSetSelectedIds) {
      propsSetSelectedIds(ids);
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
            const selectedIds = getSelectedIds();
            if (selectedIds.length === 0) return;
            let newList = [...list];
            const newids = [];
            selectedIds.forEach((id) => {
              const selectedIndex = newList.findIndex((h) => h.id === id);
              if (selectedIndex !== -1) {
                const idx = selectedIndex >= 0 ? selectedIndex : 0;
                const selectedObj = newList[idx];
                const dupObj = {
                  ...selectedObj,
                  id: uuidv4(),
                };
                newids.push(dupObj.id);
                newList = [
                  ...newList.slice(0, idx + 1),
                  dupObj,
                  ...newList.slice(idx + 1),
                ];
              }
            });
            setList(newList);
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
            const selectedIds = getSelectedIds();
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
    </ButtonToolbar>
  );
};
