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

import { uuidv4 } from "../utils.js";

export const DEFAULT_SPACE = () => ({
  id: uuidv4(),
  name: `Espacio_${uuidv4()}`,
  area: 100.0,
  multiplier: 1.0,
  type: "CONDITIONED",
  inside_tenv: true,
  height: 3.0,
  n_v: null,
  z: 0.0,
  exposed_perimeter: 0.0,
});

export const DEFAULT_WALL = () => ({
  id: uuidv4(),
  name: `Elemento_opaco_${uuidv4()}`,
  A: 10.0,
  bounds: "EXTERIOR",
  cons: "",
  space: "",
  nextto: null,
  azimuth: 0.0,
  tilt: 90.0,
});

export const DEFAULT_WINDOW = () => ({
  id: uuidv4(),
  name: `Hueco_${uuidv4()}`,
  A: 1.0,
  cons: "",
  wall: "",
  fshobst: 1.0,
});

export const DEFAULT_TB = () => ({
  id: uuidv4(),
  name: `PT_${uuidv4()}`,
  L: 1.0,
  psi: 0.05,
});

export const DEFAULT_WALLCONS = () => ({
  id: uuidv4(),
  name: `Cons_opacos_${uuidv4()}`,
  group: "Fachada",
  thickness: 0.3,
  R_intrinsic: 2.0,
  absorptance: 0.6,
});

export const DEFAULT_WINCONS = () => ({
  id: uuidv4(),
  name: `Espacio_${uuidv4()}`,
  group: "Ventanas",
  U: 1.5,
  Ff: 0.25,
  gglwi: 0.65,
  gglshwi: 0.65,
  C_100: 27.0,
});
