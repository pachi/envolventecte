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

import { uuidv4 } from "../utils.js";

export const DEFAULT_WINDOW = () => ({
  name: `Hueco_${uuidv4()}`,
  A: 1.0,
  U: 1.0,
  orientation: "N",
  Ff: 0.2,
  gglshwi: 0.67,
  gglwi: 0.67,
  Fshobst: 1.0,
  C_100: 27.0,
});

export const DEFAULT_WALL = () => ({
  name: `Elemento_opaco_${uuidv4()}`,
  A: 1.0,
  U: 0.2,
  bounds: "EXTERIOR",
});

export const DEFAULT_TB = () => ({
  name: `PT_${uuidv4()}`,
  L: 1.0,
  psi: 0.05,
});

export const DEFAULT_SPACE = () => ({
  name: `Espacio_${uuidv4()}`,
  area: 1.0,
  height_net: 2.7,
  height_gross: 3.0,
  inside_tenv: true,
  multiplier: 1.0,
  type: "CONDITIONED",
});
