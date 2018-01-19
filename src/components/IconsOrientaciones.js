/* -*- coding: utf-8 -*-

Copyright (c) 2016-2017 Rafael Villar Burke <pachi@rvburke.com>

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
const OrientacionesSprite = () => (
  <svg xmlns="http://www.w3.org/2000/svg" display="none">
    <defs>
      <symbol id="sN" viewBox="0 0 112 112">
        <path
          d="M29 8C45.6-.3 66 0 82 10L54 56 29 8"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sNE" viewBox="0 0 112 112">
        <path
          d="M82 7c9 5 16 12 21 21L54 55l28-48"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sNW" viewBox="0 0 112 112">
        <path
          d="M7 30A55 55 0 0 1 29 8l25 47-46-27"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sE" viewBox="0 0 112 112">
        <path
          d="M102 28a55 55 0 0 1 2.8 46L54 55 102 28"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sW" viewBox="0 0 112 112">
        <path
          d="M7.2 28a55 55 0 0 0-2.8 46l51-19-48-27"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sSE" viewBox="0 0 112 112">
        <path
          d="M105 73.7a55 55 0 0 1-33 33l-17-52 50 19"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sSW" viewBox="0 0 112 112">
        <path
          d="M5 73A55 55 0 0 0 37 106l17-52L5 73"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="sS" viewBox="0 0 112 112">
        <path
          d="M36 105a55 55 0 0 0 35 0L55 55l-18 52"
          fill="red"
          color="#000"
          opacity=".8"
        />
      </symbol>
      <symbol id="circulo" viewBox="0 0 112 112">
        <ellipse
          cx="55.4"
          cy="55.4"
          fill="none"
          stroke="#000"
          strokeWidth="2.8"
          color="#000"
          rx="53"
          ry="53"
        />
      </symbol>
    </defs>
  </svg>
);

const OrientaIcon = ({ dir, width = "1.2em", height = "1.2em" }) => {
  if (["NE", "E", "SE", "S", "SW", "W", "NW", "N"].includes(dir)) {
    return (
      <svg width={width} height={height} style={{ verticalAlign: "middle" }}>
        <use xlinkHref={`#s${dir}`} />
        <use xlinkHref="#circulo" />
      </svg>
    );
  }
  return (
    <svg width={width} height={height}>
      <use xlinkHref="#circulo" />
    </svg>
  );
};

export { OrientacionesSprite, OrientaIcon };
