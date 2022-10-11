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

// Devuelve el campo convertido a valor numérico o el valor previo
export const getFloatOrOld = (newValue, oldValue) => {
  const value = parseFloat(newValue.replace(",", "."));
  return isNaN(value) ? oldValue : value;
};

// Normaliza número a un intervalo arbitrario (wrapping)
export function normalize(value, start, end) {
  // ancho del intervalo
  const width = end - start;
  // convertimos el intervalo a [0, ancho] restando el valor inicial
  const offset = value - start;
  // volvemos a sumar el valor incial para volver al intervalo [start, end]
  return offset - Math.floor(offset / width) * width + start;
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
  } else if (azimuth < 240.0) {
    // 202.5 = 360 - 157.5
    return "NW";
  } else if (azimuth < 291.0) {
    // 240 = 360 - 120
    return "W";
  } else if (azimuth < 342.0) {
    // 291 = 360 - 69
    return "SW";
  }

  // 342 = 360 - 18
  return "S";
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
  }

  return "TECHO";
}

// Selecciona color según propiedades del material
// Combinar conductividad con densidad para mejorar heurística según
// https://www.codigotecnico.org/pdf/Programas/CEC/CAT-EC-v06.3_marzo_10.pdf
export const getMatColor = (mat, _e) => {
  if (mat.conductivity) {
    const lambda = mat.conductivity;
    if (lambda < 0.1) {
      // Aislantes - amarillo
      return "yellow";
    } else if (lambda < 0.35) {
      // Madera / Morteros / piezas cerámicas ligeras - naranja
      return "orange";
    } else if (lambda < 0.9) {
      // Madera / Morteros / piezas cerámicas ligeras - verde
      return "green";
    } else if (lambda < 1.5) {
      // Cerámica - marrón
      return "brown";
    } else if (lambda < 3.0) {
      // Mortero / hormigón - gris oscuro
      return "darkgray";
    } else {
      // Metal - azul oscuro
      return "navyblue";
    }
  } else {
    return "lightblue";
  }
};

// Selecciona color i
// Based on https://stackoverflow.com/a/20129594/901944
function selectColor(i, saturation = 100, opacity = 100) {
  const goldenAngle = 137.508;
  const hue = (i * goldenAngle).toFixed(2); // use golden angle approximation
  const brightness = ((((i + 50) * goldenAngle) % 30) + 20).toFixed(2);

  return `hsla(${hue},${saturation}%,${brightness}%,${opacity}%)`;
}

// Selecciona paleta de n colores
export default function palette(n, saturation = 100, opacity = 100) {
  return [...Array(n)].map((_, i) => selectColor(i, saturation, opacity));
}
