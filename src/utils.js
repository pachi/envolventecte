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

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    // eslint-disable-next-line
    (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  );
}

// Hashing function based on code from https://jsperf.com/hashing-strings by Jelle De Loecker
export function hash(str) {
  let hashvalue = 0;
  if (str.length === 0) return hashvalue;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hashvalue = (hashvalue << 5) - hashvalue + char;
    hashvalue = hashvalue & hashvalue; // Convert to 32bit integer
  }
  return hashvalue;
}

export function UserException(message, kind = "UserException") {
  this.message = message;
  this.kind = kind;
}

// Formato y opciones de condiciones de contorno
export const BOUNDARYTYPESMAP = {
  EXTERIOR: "EXTERIOR",
  INTERIOR: "INTERIOR",
  ADIABATIC: "ADIABÁTICO",
  GROUND: "TERRENO",
};

export const SPACETYPESMAP = {
  CONDITIONED: "ACONDICIONADO",
  UNCONDITIONED: "NO ACONDICIONADO",
  UNINHABITED: "NO HABITABLE",
};

export const THERMALBRIDGETYPESMAP = {
  ROOF: "CUBIERTA",
  BALCONY: "BALCÓN",
  CORNER: "ESQUINA",
  INTERMEDIATEFLOOR: "FORJADO",
  INTERNALWALL: "PARTICIÓN",
  GROUNDFLOOR: "SOLERA",
  PILLAR: "PILAR",
  WINDOW: "HUECO",
  GENERIC: "GENÉRICO"
}

// Conversión de orientación de ángulo a nombre
export function azimuth_name(azimuth_angle) {
  const azimuth = normalize(azimuth_angle, 0.0, 360.0);
  if (azimuth < 18.0) {
    return "S";
  } else if (azimuth < 69.0) {
    return "SE";
  } else if (azimuth < 120.0) {
    return "E";
  } else if (azimuth < 157.5) {
    return "NE";
  } else if (azimuth < 202.5) {
    return "N";
  }
  // 202.5 = 360 - 157.5
  else if (azimuth < 240.0) {
    return "NW";
  }
  // 240 = 360 - 120
  else if (azimuth < 291.0) {
    return "W";
  }
  // 291 = 360 - 69
  else if (azimuth < 342.0) {
    return "SW";
  }
  // 342 = 360 - 18
  else {
    return "S";
  }
}

// Conversión de inclinación de ángulo a nombre
export function tilt_name(tilt_angle) {
  const tilt = normalize(tilt_angle, 0.0, 360.0);
  if (tilt <= 60.0) {
    return "TECHO";
  } else if (tilt < 120.0) {
    return "PARED";
  } else if (tilt < 240.0) {
    return "SUELO";
  } else if (tilt < 300.0) {
    return "PARED";
  } else {
    return "TECHO";
  }
}

// Cadena con valor redondeado si el valor es un número y está definido o, si no, guión
export const round_or_dash = (val, numDecimals = 2) =>
  val === null || val === undefined || isNaN(val)
    ? "-"
    : val.toFixed(numDecimals);

// Normaliza número a un intervalo arbitrario (wrapping)
export function normalize(value, start, end) {
  // ancho del intervalo
  const width = end - start;
  // convertimos el intervalo a [0, ancho] restando el valor inicial
  const offset = value - start;
  // volvemos a sumar el valor incial para volver al intervalo [start, end]
  return offset - Math.floor(offset / width) * width + start;
}

// Pertenencia de un muro a la envolvente térmica
export const wall_is_inside_tenv = (wall, spaces_list) => {
  const space = spaces_list.find((s) => s.id === wall.space);
  // 1. El muro no pertenece a ningún espacio -> fuera
  if (space === undefined) {
    return false;
  }

  const spacenxt = spaces_list.find((s) => s.id === wall.nextto);
  // 2. Muro que no es interior en un espacio exterior -> fuera
  if (wall.bounds !== "INTERIOR" && space.inside_tenv === false) {
    return false;
  }
  // 3. Muro interior que separa dos espacios o exteriores o interiores -> fuera
  if (
    wall.bounds === "INTERIOR" &&
    spacenxt !== undefined &&
    space.inside_tenv === spacenxt.inside_tenv
  ) {
    return false;
  }
  // 4. Caso mal definido con space !== null y spacenxt === null -> fuera
  if (wall.bounds === "INTERIOR" && spacenxt === undefined) {
    return false;
  }
  // 5. Resto de casos
  return true;
};
