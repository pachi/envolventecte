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

import {
  new_glass,
  new_frame,
  new_material,
  new_shade,
  new_space,
  new_thermalbridge,
  new_wall,
  new_wallcons,
  new_wincons,
  new_window,
  new_meta,
} from "wasm-envolventecte";

export const newSpace = () => ({
  ...new_space(),
  ...defaultsSpace,
});

export const defaultsSpace = {
  kind: "CONDITIONED",
  name: "Espacio",
  multiplier: 1.0,
  inside_tenv: true,
  n_v: null,
  z: 0.0,
};

export const newWall = () => {
  let w = { ...new_wall(), ...defaultsWall };
  let geom = { ...w.geometry, ...defaultsWallgeom };
  w.geometry = geom;

  return w;
};

export const defaultsWall = {
  name: "Opaco",
  next_to: null,
};

export const defaultsWallgeom = {
  position: null,
  polygon: [],
};

export const newWindow = () => {
  let w = { ...new_window(), ...defaultsWindow };
  let geom = { ...w.geometry, ...defaultsWingeom };
  w.geometry = geom;

  return w;
};

export const defaultsWindow = {
  name: "Hueco",
};

export const defaultsWingeom = {
  position: null,
};

export const newShade = () => {
  let w = { ...new_shade(), ...defaultsShade };
  let geom = { ...w.geometry, ...defaultsWallgeom };
  w.geometry = geom;

  return w;
};

export const defaultsShade = {
  name: "Sombra",
};

export const newTb = () => ({
  ...new_thermalbridge(),
  ...defaultsTb,
});

export const defaultsTb = {
  name: "Puente térmico",
  kind: "GENERIC",
  l: 1.0,
  psi: 0.0,
};

export const newWallcons = () => ({
  ...new_wallcons(),
  ...defaultsWallcons,
});

export const defaultsWallcons = {
  name: "Construcción de opaco",
  layers: [],
};

export const newWincons = () => ({
  ...new_wincons(),
  ...defaultsWincons,
});

export const defaultsWincons = {
  name: "Construcción de hueco",
  g_glshwi: null,
};

export const newMaterial = () => new_material();

export const defaultsMaterial = {
  name: "Material",
  vapour_diff: null,
};

export const newGlass = () => new_glass();

export const defaultsGlass = {
  name: "Vidrio",
};

export const newFrame = () => new_frame();

export const defaultsFrame = {
  name: "Marco",
};

export const newMeta = () => ({
  ...new_meta(),
  ...defaultsMeta,
});

export const defaultsMeta = {
  name: "Nombre del proyecto",
  global_ventilation_l_s: null,
  n50_test_ach: null,
  d_perim_insulation: 0.0,
  rn_perim_insulation: 0.0,
};
