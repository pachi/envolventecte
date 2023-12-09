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

import palette, { azimuth_name, tilt_name } from "./utils";
import {
  BOUNDARY_TYPES_MAP,
  SPACE_TYPES_MAP,
  THERMAL_BRIDGE_TYPES_MAP,
} from "../../stores/types";

// Formateadores ---------------------------------------------------------------

// Formato de horarios como listas de [id, repeticiones]
// con id a nombre usando mapper
export const ScheduleFmt = (cell, _row, _rowIndex, idMapper) => (
  <span>
    [{cell.map(([id, count]) => `(${idMapper[id]}, ${count})`).join(", ")}]
  </span>
);

// Valor en Y del valor value para una altura total disponible height
// y con valores máximos y mínimo max y min, y un desplazamiento diff
function getY(max, min, height, diff, value) {
  return parseFloat(
    (height - ((value - min) * height) / (max - min) + diff).toFixed(2)
  );
}

// Formato de horario diario como sparkline
export const DayScheduleFmt = (cell, _row, _rowIndex) => {
  // cell == [f32, ...]
  const svgWidth = 200;
  const svgHeight = 4;

  if (cell.length === 0) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="white" />
      </svg>
    );
  }

  const strokeWidth = 0.5;
  const height = svgHeight - 2 * strokeWidth;
  const stepX = svgWidth / (24.0 - 1.0);
  const max = Math.max(...cell, 1);
  const min = Math.min(...cell, 0);

  const pathY = getY(max, min, height, strokeWidth, cell[0]);
  let pathCoords = `M0 ${pathY}`;
  let tickCoords = "";
  cell.forEach((value, idx) => {
    const x = (idx * stepX).toFixed(2);
    const y = getY(max, min, height, strokeWidth, value);
    pathCoords += `L ${x} ${y}`;
    tickCoords += `M${x} 0 L${x} ${svgHeight}`;
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <path
        className="line"
        d={pathCoords}
        fill="none"
        strokeWidth={0.5}
        stroke="black"
      />
      <path
        className="fill"
        d={`${pathCoords} V ${svgHeight} L 0 ${svgHeight} Z`}
        stroke="none"
        fill="#FF333355"
      />
      <path
        className="tick_lines"
        d={tickCoords}
        fill="none"
        strokeWidth={0.1}
        stroke="gray"
      />
    </svg>
  );
};

// Formato de horario mensual o anual como sparkline
// Colorea cada elemento de repetición según su id
export const CountScheduleFmt = (cell, _row, _rowIndex, idMapper) => {
  // cell == [(string, u32), ...]
  const svgWidth = 200;
  const svgHeight = 4;

  if (cell.length === 0) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="white" />
      </svg>
    );
  }

  const totalCount = cell.map((v) => v[1]).reduce((a, b) => a + b, 0);
  let keys = Object.keys(idMapper);
  const colors = palette(keys.length, 100, 40);
  const colorMap = new Map(keys.map((k, i) => [k, colors[i]]));

  const stepX = svgWidth / totalCount;

  let xPos = 0;
  const layers = [];
  let tickCoords = "";
  for (const [idx, [key, count]] of cell.entries()) {
    const color = colorMap.get(key);
    for (let i = 0; i < count; i++) {
      layers.push(
        <rect
          key={`${idx}-${i}`}
          x={xPos.toFixed(2)}
          y="0"
          width={stepX}
          height="10"
          fill={color}
        >
          <title>
            {idMapper[key]} ({count} repeticiones)
          </title>
        </rect>
      );
      tickCoords += `M${xPos} 0 L${xPos} ${svgHeight}`;
      xPos += stepX;
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <path
        className="tick_lines"
        d={tickCoords}
        fill="none"
        strokeWidth={0.1}
        stroke="gray"
      />
      {layers}
    </svg>
  );
};
