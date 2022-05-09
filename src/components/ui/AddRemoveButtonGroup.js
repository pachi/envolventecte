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

import React, { useContext } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import iconplus from "../img/baseline-add-24px.svg";
import iconless from "../img/baseline-remove-24px.svg";
import iconselectall from "../img/select-rows.svg";
import iconselectnone from "../img/unselect-rows.svg";
import iconduplicate from "../img/outline-file_copy-24px.svg";
import { uuidv4 } from "../../utils";

const AddRemoveButtonGroup = observer(
  ({ elements, newobj, selected, setSelected }) => {
    const appstate = useContext(AppState);
    if (
      ![
        "spaces",
        "walls",
        "windows",
        "thermal_bridges",
        "shades",
        "wallcons",
        "wincons",
      ].includes(elements)
    ) {
      return <h1>Elementos no reconocidos {elements}</h1>;
    }

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
              const element = appstate[newobj]();
              appstate[elements].push(element);
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
                const selectedIndex = appstate[elements].findIndex(
                  (h) => h.id === id
                );
                if (selectedIndex !== -1) {
                  const idx = selectedIndex >= 0 ? selectedIndex : 0;
                  const selectedObj = appstate[elements][idx];
                  const newid = uuidv4();
                  const dupObj = {
                    ...selectedObj,
                    name: selectedObj.name + " (dup.)",
                    id: newid,
                  };
                  newids.push(newid);
                  appstate[elements].splice(idx + 1, 0, dupObj);
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
                const indices = appstate[elements].reduce((acc, cur, idx) => {
                  if (selected.includes(cur.id)) {
                    acc.push(idx);
                  }
                  return acc;
                }, []);
                const minidx = Math.max(0, Math.min(...indices) - 1);
                const filtered = appstate[elements].filter(
                  (h) => !selected.includes(h.id)
                );
                // usa replace: https://mobx.js.org/api.html#observablearray
                appstate[elements].replace(filtered);
                // Selecciona el elemento anterior al primero seleccionado salvo que no queden elementos o sea el primero, o nada si no hay elementos
                if (filtered.length > 0) {
                  setSelected([appstate[elements][minidx].id]);
                } else {
                  setSelected([]);
                }
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
              setSelected(appstate[elements].map((e) => e.id));
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
  }
);

export default AddRemoveButtonGroup;
