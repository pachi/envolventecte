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

import React from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import { uuidv4 } from '../utils.js';

const AddRemoveButtonGroup = ({ objects, newObj, selectedId }) =>
  <ButtonGroup className="pull-right">
    <Button bsStyle="primary" bsSize="xs"
      onClick={ () => { objects.push(newObj()); } }>
      <Glyphicon glyph="plus" />
    </Button>
    <Button bsStyle="primary" bsSize="xs"
      onClick={ () => {
        // Duplicamos el seleccionado o el primer objeto si hay objetos
        if (objects.length > 0) {
          const selectedIndex = objects.findIndex(h => h.id === selectedId);
          const idx = selectedIndex >= 0 ? selectedIndex : 0;
          const dupObj = { ...objects[idx], id: uuidv4() };
          objects.splice(idx, 0, dupObj);
        // En caso contrario añadimos un objeto nuevo
        } else {
          objects.push(newObj());
        }
      } }>
      <Glyphicon glyph="duplicate" />
    </Button>
    <Button bsStyle="primary" bsSize="xs"
      onClick={ () => {
        // https://mobx.js.org/refguide/array.html
        objects.replace(objects.filter(h => !selectedId.includes(h.id)));
      } }>
      <Glyphicon glyph="minus" />
    </Button>
  </ButtonGroup>;

export default AddRemoveButtonGroup;