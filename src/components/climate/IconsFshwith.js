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

// Optimizador en https://jakearchibald.github.io/svgomg/
const FshwithSprite = () => (
  <svg xmlns="http://www.w3.org/2000/svg" display="none">
    <defs>
      <g id="hueco" opacity=".8">
        <rect
          id="marcoext"
          height="98"
          stroke="#000"
          strokeWidth="1"
          fill="#fff"
          width="74"
          y=".5"
          x=".5"
        />
        <rect
          id="marcoint"
          height="84"
          stroke="#000"
          strokeWidth="1"
          fill="#5c555d"
          width="59"
          y="7.5"
          x="7.5"
        />
        <path
          id="personaje"
          d="m12 92c0.0033-6.5 1-15 4.4-19 2.7-4 9.3-10 15-10-2.6-1.4-4.3-7.8-4.2-14-0.32-5.5 1.5-14 11-14 8.7 0.022 9.8 8.8 9.5 14 0.24 5.8-2.9 12-5.1 13 8.1 1 13 7.9 15 12 2.5 5.7 4 12 3.8 19"
          fillRule="evenodd"
          fill="#ccc"
        />
      </g>
      <rect
        id="cortina"
        height="21"
        stroke="#000"
        fill="#f2f2f2"
        width="59"
        opacity=".8"
        y="7.5"
        x="7.5"
      />
      <symbol id="ventana1" viewBox="0 0 75 100">
        <use xlinkHref="#hueco" />
      </symbol>
      <symbol id="ventana2" viewBox="0 0 75 100">
        <use xlinkHref="#hueco" />
        <use xlinkHref="#cortina" />
      </symbol>
      <symbol id="ventana3" viewBox="0 0 75 100">
        <use xlinkHref="#hueco" />
        <use xlinkHref="#cortina" />
        <use xlinkHref="#cortina" y="21" />
      </symbol>
      <symbol id="ventana4" viewBox="0 0 75 100">
        <use xlinkHref="#hueco" />
        <use xlinkHref="#cortina" />
        <use xlinkHref="#cortina" y="21" />
        <use xlinkHref="#cortina" y="42" />
      </symbol>
      <symbol id="ventana5" viewBox="0 0 75 100">
        <use xlinkHref="#hueco" />
        <use xlinkHref="#cortina" />
        <use xlinkHref="#cortina" y="21" />
        <use xlinkHref="#cortina" y="42" />
        <use xlinkHref="#cortina" y="63" />
      </symbol>
    </defs>
  </svg>
);

const FshwithIcon = ({ fsh, width = "1.2em", height = "1.6em" }) => {
  let name;
  if (fsh < 0.2) {
    name = "ventana1";
  } else if (fsh < 0.4) {
    name = "ventana2";
  } else if (fsh < 0.6) {
    name = "ventana3";
  } else if (fsh < 0.8) {
    name = "ventana4";
  } else {
    name = "ventana5";
  }
  return (
    <svg width={width} height={height} style={{ verticalAlign: "middle" }}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

export { FshwithSprite, FshwithIcon };
