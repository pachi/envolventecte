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

import React from "react";

import nullPosIcon from "../img/null_pos_icon.svg";
import validPosIcon from "../img/valid_pos_icon.svg";
import validPolyIcon from "../img/valid_poly_icon.svg";
import nullPolyIcon from "../img/null_poly_icon.svg";
import fullGeometryIcon from "../img/full_geom_icon.svg";
import partialGeometryIcon from "../img/partial_geom_icon.svg";

import { OrientaIcon, TiltIcon } from "../helpers/IconsOrientaciones";

import { azimuth_name, tilt_name, getMatColor } from "./utils";

// Formato y opciones de condiciones de contorno
export const BOUNDARY_TYPES_MAP = {
  EXTERIOR: "EXTERIOR",
  INTERIOR: "INTERIOR",
  ADIABATIC: "ADIABÁTICO",
  GROUND: "TERRENO",
};

// Tipos de espacios según nivel de acondicionamiento
export const SPACE_TYPES_MAP = {
  CONDITIONED: "ACONDICIONADO",
  UNCONDITIONED: "NO ACONDICIONADO",
  UNINHABITED: "NO HABITABLE",
};

// Tipos de puentes térmicos
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

// Formateadores -------------------------------------------------------------

// Muestra número sin decimales
export const Float0DigitsFmt = (cell, _row, _rowIndex, _formatExtraData) => {
  if (cell === null || cell === undefined) {
    return <span>-</span>;
  }
  return <span>{Number(cell).toFixed(0)}</span>;
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

// Muestra número con 3 decimales
export const Float3DigitsFmt = (cell, _row) => {
  if (cell === null || cell === undefined) {
    return <span>-</span>;
  }

  return <span>{Number(cell).toFixed(3)}</span>;
};

/// Formato de id a nombre usando mapper
export const NameFromIdFmt = (cell, _row, _rowIndex, idMapper) => (
  <span>{idMapper[cell]}</span>
);

// Muestra valor booleano
export const BoolFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{cell === true ? "Sí" : "No"}</span>
);

// Multiplier (por defecto es 1.0)
export const MultiplierFmt = (cell, _row, _rowIndex, _formatExtraData) =>
  cell === null || cell === undefined ? (
    <span>1</span>
  ) : (
    <span>{Number(cell).toFixed(0)}</span>
  );

// Muestra pertenencia a la ET (por defecto es sí)
export const InsideTeFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{cell !== false ? "Sí" : "No"}</span>
);

// Cota (por defecto es 0.00)
export const ZFmt = (cell, _row, _rowIndex, _formatExtraData) =>
  cell === null || cell === undefined ? (
    <span>0.00</span>
  ) : (
    <span>{Number(cell).toFixed(2)}</span>
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
inclinación: ${geom.tilt.toFixed(2)},
posición: ${PosFmt(geom.position)},
polígono: ${PolyFmt(geom.polygon)}`;
};

// Línea descriptiva de huecos
export const WindowGeomFmt = (geom, _row) => {
  return `ancho: ${geom.width.toFixed(2)},
alto: ${geom.height.toFixed(2)},
retranqueo: ${geom.setback.toFixed(2)},
posición: ${PosFmt(geom.position)}`;
};

// Convierte geometría de hueco a icono según tenga o no punto de inserción
export const WindowGeomIconFmt = (geometry, row, _rowIndex, wallData) => {
  const wall = wallData[row.wall];
  const has_wall = wall !== undefined;
  const azimuth_dir = has_wall ? AzimuthFmt(wall.azimuth) : "-";
  const azimuth = has_wall ? <OrientaIcon dir={azimuth_dir} /> : "-";
  const tilt_dir = has_wall ? TiltFmt(wall.tilt) : "-";
  const tilt = has_wall ? <TiltIcon dir={tilt_dir} /> : "-";
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
  <span>{BOUNDARY_TYPES_MAP[cell]}</span>
);
export const BoundaryOpts = Object.keys(BOUNDARY_TYPES_MAP).map((k) => {
  return { value: k, label: BOUNDARY_TYPES_MAP[k] };
});

// Formato y opciones de tipos de puentes térmicos
export const ThermalBridgeTypesFmt = (cell, _row) => (
  <span>{THERMAL_BRIDGE_TYPES_MAP[cell]}</span>
);

export const ThermalBridgeTypesOpts = Object.keys(THERMAL_BRIDGE_TYPES_MAP).map(
  (k) => {
    return { value: k, label: THERMAL_BRIDGE_TYPES_MAP[k] };
  }
);

// Muestra tipo de espacio
export const SpaceTypeFmt = (cell, _row, _rowIndex, _formatExtraData) =>
  cell === null || cell === undefined ? (
    <span>ACONDICIONADO</span>
  ) : (
    <span>{SPACE_TYPES_MAP[cell]}</span>
  );

// Opciones de tipo de espacio
export const spaceTypesOpts = Object.keys(SPACE_TYPES_MAP).map((k) => {
  return { value: k, label: SPACE_TYPES_MAP[k] };
});

// Formato de horarios como listas de [id, repeticiones]
// con id a nombre usando mapper
export const ScheduleFmt = (cell, _row, _rowIndex, idMapper) => {
  const txt = cell
    .map(([id, count]) => `(${idMapper[id]}, ${count})`)
    .join(", ");
  return <span>[{txt}]</span>;
};

/// Formato de espesor total de construcción de opaco (id -> thickness)
export const WallConsThicknessFmt = (_cell, row, _rowIndex, wallconsPropsMap) => {
  // cell == id
  const props = wallconsPropsMap[row.id];
  const p = props.thickness;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(3)}</span>;
};

/// Formato de resistencia intrínseca de construcción de opaco (id -> r_intrinsic)
export const WallConsResistanceFmt = (_cell, row, _rowIndex, wallconsPropsMap) => {
  // cell == id
  const props = wallconsPropsMap[row.id];
  const p = props.resistance;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

export const LayersFmt = (cell, _row, _rowIndex, materials) => {
  // cell == id
  const num_layers = cell.length;
  if (num_layers === 0) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10">
        <rect x="0" y="0" width="100" height="10" fill="white" />
      </svg>
    );
  }
  let xPos = 0;
  const layers = [];
  for (const [idx, { material, e }] of cell.entries()) {
    const mat = materials.find((m) => m.id === material);
    const color = getMatColor(mat, e);
    const width = Math.round(e * 100);
    layers.push(
      <rect key={idx} x={xPos} y="0" width={width} height="10" fill={color} />
    );
    xPos += Math.round(e * 100);
  }

  //  = cell.map(({ material, e }, idx) => {
  //   const mat = materials.find((m) => m.id === material);
  //   return <rect key={idx} x={10 * idx} width="10" height="10" fill={getMatColor(mat, e)} />;
  // });
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10">
      {layers}
    </svg>
  );
};

// Formato de área de huecos (id -> area)
export const WinAreaFmt = (_cell, row, _rowIndex, winProps) => {
  // cell == id
  const props = winProps[row.id];
  const area = props.area * props.multiplier;
  if (area === undefined || area === null || isNaN(area)) {
    return <span>-</span>;
  }
  return <span>{area.toFixed(2)}</span>;
};

// Formato de fshobst (id -> fshobst)
export const FshobstFmt = (_cell, row, _rowIndex, winProps) => {
  // cell == id
  const props = winProps[row.id];
  const p = props.f_shobst_override || props.f_shobst;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

// Transmitancia de huecos (id -> window U-value)
export const WindowUFmt = (_cell, row, _rowIndex, winProps) => {
  const props = winProps[row.id];
  const p = props.u_value;
  if (p === undefined || p === null) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

/// Formato de area de opaco (id -> area)
export const WallAreaFmt = (_cell, row, _rowIndex, wallPropsMap) => {
  // cell == id
  const props = wallPropsMap[row.id];
  const p = props.area_net * props.multiplier;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

/// Formato de U de opaco (id -> U_value)
export const WallUFmt = (_cell, row, _rowIndex, wallPropsMap) => {
  // cell == id
  const uvalue = wallPropsMap[row.id].u_value;
  if (uvalue === undefined || uvalue === null || isNaN(uvalue)) {
    return <span>-</span>;
  }
  return <span>{uvalue.toFixed(2)}</span>;
};

// Formato de area de espacio (id -> area)
export const SpaceAreaFmt = (_cell, row, _rowIndex, spacePropsMap) => {
  // cell == id
  const props = spacePropsMap[row.id];
  const area = props.area * props.multiplier;
  if (area === undefined || area === null || isNaN(area)) {
    return <span>-</span>;
  }
  return <span>{area.toFixed(2)}</span>;
};

// Formato de volumen neto de espacio (id -> volume_net)
export const SpaceVolumeFmt = (_cell, row, _rowIndex, spacePropsMap) => {
  // cell == id
  const props = spacePropsMap[row.id];
  const volume_net = props.volume_net * props.multiplier;
  if (volume_net === undefined || volume_net === null || isNaN(volume_net)) {
    return <span>-</span>;
  }
  return <span>{volume_net.toFixed(2)}</span>;
};

/// Formato de U de hueco (id -> U)
export const WinconsUFmt = (_cell, row, _rowIndex, propsMap) => {
  const props = propsMap[row.id];
  const p = props.u_value;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};

/// Formato de g_gl;wi de hueco (id -> g_glwi)
export const WinconsGglwiFmt = (_cell, row, _rowIndex, propsMap) => {
  const props = propsMap[row.id];
  const p = props.g_glwi;
  if (p === undefined || p === null || isNaN(p)) {
    return <span>-</span>;
  }
  return <span>{p.toFixed(2)}</span>;
};
