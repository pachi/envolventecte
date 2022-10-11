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

// TODO: falta constructores de horarios y valores predeterminados

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
  new_load,
  new_sys_setting,
  new_schedule_day,
  new_schedule_week,
  new_schedule_year,
} from "wasm-envolventecte";

export const newSpace = () => ({
  ...defaultsSpace,
  ...new_space(),
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
  let w = { ...defaultsWall, ...new_wall() };
  let geom = { ...defaultsWallgeom, ...w.geometry };
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
  let w = { ...defaultsWindow, ...new_window() };
  let geom = { ...defaultsWingeom, ...w.geometry };
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
  let w = { ...defaultsShade, ...new_shade() };
  let geom = { ...defaultsWallgeom, ...w.geometry };
  w.geometry = geom;

  return w;
};

export const defaultsShade = {
  name: "Sombra",
};

export const newTb = () => ({
  ...defaultsTb,
  ...new_thermalbridge(),
});

export const defaultsTb = {
  name: "Puente térmico",
  kind: "GENERIC",
  l: 1.0,
  psi: 0.0,
};

export const newWallcons = () => ({
  ...defaultsWallcons,
  ...new_wallcons(),
});

export const defaultsWallcons = {
  name: "Construcción de opaco",
  layers: [],
};

export const newWincons = () => ({
  ...defaultsWincons,
  ...new_wincons(),
});

export const defaultsWincons = {
  name: "Construcción de hueco",
  g_glshwi: null,
};

export const newMaterial = () => ({ ...defaultsMaterial, ...new_material() });

export const defaultsMaterial = {
  name: "Material",
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
  ...defaultsMeta,
  ...new_meta(),
});

export const defaultsMeta = {
  name: "Nombre del proyecto",
  global_ventilation_l_s: null,
  n50_test_ach: null,
  d_perim_insulation: 0.0,
  rn_perim_insulation: 0.0,
};

export const newLoad = () => ({
  ...defaultsLoad,
  ...new_load(),
});

export const defaultsLoad = {
  name: "Carga de espacio",
  people_schedule: null,
  lighting_schedule: null,
  equipment_schedule: null,
  illuminance: null,
};

export const newSysSetting = () => ({
  ...defaultsSysSetting,
  ...new_sys_setting(),
});

export const defaultsSysSetting = {
  name: "Consignas de espacio",
  temp_max: null,
  temp_min: null,
};

export const newScheduleDay = () => ({
  ...defaultsScheduleDay,
  ...new_schedule_day(),
});

export const defaultsScheduleDay = {
  name: "Horario diario todo 0",
  values: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
};

export const newScheduleWeek = () => ({
  ...defaultsScheduleWeek,
  ...new_schedule_week(),
});

export const defaultsScheduleWeek = {
  name: "Horario semanal vacío",
  values: [],
};

export const newScheduleYear = () => ({
  ...defaultsScheduleYear,
  ...new_schedule_year(),
});

export const defaultsScheduleYear = {
  name: "Horario anual vacío",
  values: [],
};
