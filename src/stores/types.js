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

export const SPACE = "spaces";
export const WALL = "walls";
export const WINDOW = "windows";
export const THERMAL_BRIDGE = "thermal_bridges";
export const SHADE = "shades";
export const WALLCONS = "wallcons";
export const WINCONS = "wincons";
export const MATERIAL = "materials";
export const GLASS = "glasses";
export const FRAME = "frames";
export const SCHEDULE_YEAR = "year";
export const SCHEDULE_WEEK = "week";
export const SCHEDULE_DAY = "day";
export const LOAD = "loads";
export const THERMOSTAT = "thermostats";

// Lista y mapeado de de condiciones de contorno
export const BOUNDARY_TYPES = ["EXTERIOR", "INTERIOR", "ADIABATIC", "GROUND"];
export const BOUNDARY_TYPES_MAP = {
  EXTERIOR: "EXTERIOR",
  INTERIOR: "INTERIOR",
  ADIABATIC: "ADIABÁTICO",
  GROUND: "TERRENO",
};

// Tipos de espacios según nivel de acondicionamiento
export const SPACE_TYPES = ["CONDITIONED", "UNCONDITIONED", "UNINHABITED"];
export const SPACE_TYPES_MAP = {
  CONDITIONED: "ACONDICIONADO",
  UNCONDITIONED: "NO ACONDICIONADO",
  UNINHABITED: "NO HABITABLE",
};

// Tipos de puentes térmicos
export const THERMAL_BRIDGE_TYPES = [
  "ROOF",
  "BALCONY",
  "CORNER",
  "INTERMEDIATEFLOOR",
  "INTERNALWALL",
  "GROUNDFLOOR",
  "PILLAR",
  "WINDOW",
  "GENERIC",
];
export const THERMAL_BRIDGE_TYPES_MAP = {
  ROOF: "CUBIERTA",
  BALCONY: "BALCÓN",
  CORNER: "ESQUINA",
  INTERMEDIATEFLOOR: "FORJADO",
  INTERNALWALL: "PARTICIÓN",
  GROUNDFLOOR: "SOLERA",
  PILLAR: "PILAR",
  WINDOW: "HUECO",
  GENERIC: "GENÉRICO",
};

export const ORIENTATION_TYPES = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "HZ"];