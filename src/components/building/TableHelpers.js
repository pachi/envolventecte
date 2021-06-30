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

import React from "react";

import nullPosIcon from "../img/null_pos_icon.svg";
import validPosIcon from "../img/valid_pos_icon.svg";
import validPolyIcon from "../img/valid_poly_icon.svg";
import nullPolyIcon from "../img/null_poly_icon.svg";
import fullGeometryIcon from "../img/full_geom_icon.svg";
import partialGeometryIcon from "../img/partial_geom_icon.svg";

import { OrientaIcon, TiltIcon } from "../climate/IconsOrientaciones";

// Formato y opciones de condiciones de contorno
export const BOUNDARYTYPESMAP = {
  EXTERIOR: "EXTERIOR",
  INTERIOR: "INTERIOR",
  ADIABATIC: "ADIABÁTICO",
  GROUND: "TERRENO",
};

// Tipos de espacios según nivel de acondicionamiento
export const SPACETYPESMAP = {
  CONDITIONED: "ACONDICIONADO",
  UNCONDITIONED: "NO ACONDICIONADO",
  UNINHABITED: "NO HABITABLE",
};

// Tipos de puentes térmicos
export const THERMALBRIDGETYPESMAP = {
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

// Devuelve el campo convertido a valor numérico o el valor previo
export const getFloatOrOld = (newValue, oldValue) => {
  const value = parseFloat(newValue.replace(",", "."));
  return isNaN(value) ? oldValue : value;
};

// Muestra número con 1 decimal
export const Float1DigitsFmt = (cell, _row, _rowIndex, _formatExtraData) => {
  if (cell === null || cell === undefined) {
    return <span>-</span>;
  }
  return <span>{Number(cell).toFixed(1)}</span>;
};

// Muestra número con 2 decimales
export const Float2DigitsFmt = (cell, _row) => {
  if (cell === null || cell === undefined) {
    return <span>-</span>;
  }

  return <span>{Number(cell).toFixed(2)}</span>;
};

// Muestra valor booleano
export const BoolFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{cell === true ? "Sí" : "No"}</span>
);

// Convierte ángulo de azimuth a nombre
export const AzimuthFmt = (azimuth_angle) =>
  azimuth_angle === undefined ? "-" : azimuth_name(azimuth_angle);

// Convierte ángulo de inclinación a nombre
export const TiltFmt = (tilt_angle) =>
  tilt_angle === undefined ? "-" : tilt_name(tilt_angle);

// Convierte punto 3D de posición a cadena de coordenadas
export const PosFmt = (pos) => {
  if (pos === null) {
    return "-";
  } else if (pos.length === 3) {
    return `[${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}]`;
  }
  if (pos.length === 2) {
    return `[${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}]`;
  }
  return "-";
};

// Convierte vector de puntos 2D de polígono a cadena de lista de coordenadas
export const PolyFmt = (poly) =>
  poly !== null && poly.length !== 0
    ? `[${poly
        .map((point) => `[${point[0].toFixed(2)}, ${point[1].toFixed(2)}]`)
        .join(", ")}]`
    : "-";

// Convierte punto 3D de posición o valor nulo a icono
export const PosIconFmt = (pos, _row) =>
  pos !== null ? (
    <img src={validPosIcon} alt="+" />
  ) : (
    <img src={nullPosIcon} alt="-" />
  );

// Convierte vector de puntos 3D a icono según tenga o no puntos
export const PolyIconFmt = (poly, _row) =>
  poly !== null && poly.length !== 0 ? (
    <img src={validPolyIcon} alt="+" />
  ) : (
    <img src={nullPolyIcon} alt="-" />
  );

// Línea descriptiva de geometría
export const OpaqueGeomFmt = (geom, _row) => {
  return `azimuth: ${geom.azimuth.toFixed(2)},
inclinación: (${geom.tilt.toFixed(2)}),
posición: ${PosFmt(geom.position)},
polígono: ${PolyFmt(geom.polygon)}`;
};

// Línea descriptiva de huecos
export const WindowGeomFmt = (geom, _row) => {
  return `ancho: ${geom.width.toFixed(2)},
alto: (${geom.height.toFixed(2)}),
retranqueo: (${geom.setback.toFixed(2)}),
posición: ${PosFmt(geom.position)}`;
};

// Convierte geometría de hueco a icono según tenga o no punto de inserción
export const WindowGeomIconFmt = (
  geometry,
  row,
  _rowIndex,
  formatExtraData
) => {
  const { wallData } = formatExtraData;
  const wall = wallData[row.wall];
  const azimuth_dir = AzimuthFmt(wall.azimuth);
  const azimuth = <OrientaIcon dir={azimuth_dir} />;
  const tilt_dir = TiltFmt(wall.tilt);
  const tilt = <TiltIcon dir={tilt_dir} />;
  const position = geometry.position ? (
    <img src={fullGeometryIcon} alt="+" />
  ) : (
    <img src={partialGeometryIcon} alt="-" />
  );
  return (
    <>
      {position} | {azimuth} {azimuth_dir} | {tilt} {tilt_dir[0]}
    </>
  );
};

// Convierte geometría de hueco a icono según tenga o no punto de inserción
export const OpaqueGeomIconFmt = (
  geometry,
  _row,
  _rowIndex,
  _formatExtraData
) => {
  const azimuth_dir = AzimuthFmt(geometry.azimuth);
  const azimuth = <OrientaIcon dir={azimuth_dir} />;
  const tilt_dir = TiltFmt(geometry.tilt);
  const tilt = <TiltIcon dir={tilt_dir} />;
  const position = geometry.position ? (
    <img src={fullGeometryIcon} alt="+" />
  ) : (
    <img src={partialGeometryIcon} alt="-" />
  );
  return (
    <>
      {position} | {azimuth} {azimuth_dir} | {tilt} {tilt_dir[0]}
    </>
  );
};

// Formato y opciones de condiciones de contorno
export const BoundaryFmt = (cell, _row) => (
  <span>{BOUNDARYTYPESMAP[cell]}</span>
);
export const BoundaryOpts = Object.keys(BOUNDARYTYPESMAP).map((k) => {
  return { value: k, label: BOUNDARYTYPESMAP[k] };
});

// Formato y opciones de tipos de puentes térmicos
export const ThermalBridgeTypesFmt = (cell, _row) => (
  <span>{THERMALBRIDGETYPESMAP[cell]}</span>
);

export const ThermalBridgeTypesOpts = Object.keys(THERMALBRIDGETYPESMAP).map(
  (k) => {
    return { value: k, label: THERMALBRIDGETYPESMAP[k] };
  }
);

// Muestra tipo de espacio
export const SpaceTypeFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{SPACETYPESMAP[cell]}</span>
);

// Opciones de tipo de espacio
export const spaceTypesOpts = Object.keys(SPACETYPESMAP).map((k) => {
  return { value: k, label: SPACETYPESMAP[k] };
});

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
