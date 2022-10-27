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

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Tabla de desglose de K
// https://embed.plnkr.co/plunk/MV01Dl
// https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102
// Elementos de data: { title, a, au, type, u_mean, k_contrib, k_pct, format = false, color },
const KChart = ({
  data,
  format,
  width = 800,
  height = 400,
  bar_value_padding = 4,
}) => {
  const d3Container = useRef();
  format =
    format ||
    ((d) =>
      d === null || d === undefined || isNaN(d) ? "-" : `${d.toFixed(1)}%`);

  useEffect(
    () => {
      const container = d3Container.current;
      const margin = { top: 30, right: 30, bottom: 30, left: 60 },
        chart_width = width - margin.left - margin.right,
        chart_height = height - margin.top - margin.bottom;

      if (data && container) {
        // Limpia imagen preexistente
        d3.select(container).selectChildren().remove();

        // Genera imagen
        const svg = d3
          .select(container)
          .attr("class", "canvas")
          .append("g")
          .style("font-size", "12px")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Título
        svg
          .append("text")
          .attr("x", chart_width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Descomposición de K por elementos y tipos [%]");

        // X axis
        const x = d3
          .scaleBand()
          .range([0, chart_width])
          .domain(data.map((d) => d.short_title))
          .padding(0.1);

        const areSubtype = data.map((d) => d.type !== "Tipo");
        // X ticks
        svg
          .append("g")
          .style("font-size", "12px")
          .attr("transform", `translate(0, ${chart_height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(0,5)")
          .attr("font-weight", (_, i) => (areSubtype[i] ? "normal" : "bold"))
          .style("text-anchor", "middle");

        // Y axis
        const [min, max] = d3.extent(data, (d) => d.k_pct);
        const y = d3
          .scaleLinear()
          .domain([Math.min(0, min), max])
          .range([chart_height, 0])
          .nice();

        svg.append("g").call(d3.axisLeft(y));

        // Rótulo eje Y (girado)
        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("K [%]");

        // Y = 0
        svg
          .append("g")
          .attr("class", "baseline")
          .attr("transform", `translate(0, ${y(0)})`)
          .call(d3.axisBottom(x).tickSize(0).tickFormat(""));

        // Bars
        const bar = svg
          .selectAll("mybar")
          .data(data)
          .enter()
          .append("g")
          .attr("class", (d) => `bar ${d.k_pct < 0 ? "negative" : "positive"}`);

        bar
          .append("rect")
          .attr(
            "x",
            (d) =>
              x(d.short_title) +
              x.bandwidth() * (d.type === "Tipo" ? 0.0 : 0.25)
          )
          .attr("y", (d) => y(Math.max(0, d.k_pct)))
          .attr("width", (d) => x.bandwidth() * (d.type === "Tipo" ? 1.0 : 0.5))
          .attr("height", (d) => Math.abs(y(d.k_pct) - y(0)))
          .attr("mask", (d) =>
            d.type === "Tipo" ? null : "url(#mask-diagonal)"
          )
          .attr("fill", (d) => d.color);

        bar
          .append("text")
          .attr("x", (d) => x(d.short_title) + x.bandwidth() / 2)
          .attr("y", (d) => y(Math.max(0, d.k_pct)) - bar_value_padding)
          .attr("text-anchor", "middle")
          .attr("font-weight", (_, i) => (areSubtype[i] ? "normal" : "bold"))
          .text((d) => format(d.k_pct));
      }
    },
    // Array de dependencias.
    // El bloque se ejecuta cuando cambia cualquiera de estas variables
    [data, height, width, bar_value_padding, format]
  );

  return (
    <svg
      className="d3-component"
      width={width}
      height={height}
      ref={d3Container}
    />
  );
};

export default KChart;
