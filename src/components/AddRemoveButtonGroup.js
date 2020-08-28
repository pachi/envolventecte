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

import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import iconplus from "./img/baseline-add-24px.svg";
import iconless from "./img/baseline-remove-24px.svg";
import iconduplicate from "./img/outline-file_copy-24px.svg";

const AddRemoveButtonGroup = ({ objects, newObj, selected, clear }) => (
  <ButtonGroup>
    <Button
      variant="primary"
      size="sm"
      title="Añadir una fila al final de la tabla"
      onClick={() => {
        objects.push(newObj());
      }}
    >
      <img src={iconplus} alt="Añadir fila" />
    </Button>
    <Button
      variant="primary"
      size="sm"
      title="Duplicar filas seleccionadas de la tabla"
      onClick={() => {
        selected.forEach((name) => {
          const selectedIndex = objects.findIndex((h) => h.name === name);
          if (selectedIndex !== -1) {
            const idx = selectedIndex >= 0 ? selectedIndex : 0;
            const selectedObj = objects[idx];
            const dupObj = {
              ...selectedObj,
              name: selectedObj.name + " (dup.)",
            };
            objects.splice(idx + 1, 0, dupObj);
          }
        });
      }}
    >
      <img src={iconduplicate} alt="Duplicar fila" />
    </Button>
    <Button
      variant="primary"
      size="sm"
      title="Eliminar filas seleccionadas de la tabla"
      onClick={() => {
        // https://mobx.js.org/refguide/array.html
        objects.replace(objects.filter((h) => !selected.includes(h.name)));
        clear();
      }}
    >
      <img src={iconless} alt="Eliminar fila" />
    </Button>
  </ButtonGroup>
);

export default AddRemoveButtonGroup;
