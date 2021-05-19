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

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Gráfica de desglose de n50
export const N50ChartBar = ({
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
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Descomposición de n50 por elemento [%]");

        // X axis
        const x = d3
          .scaleBand()
          .range([0, chart_width])
          .domain(data.map((d) => d.name))
          .padding(0.1);

        // X ticks
        svg
          .append("g")
          .style("font-size", "12px")
          .attr("transform", `translate(0, ${chart_height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(0,5)")
          .style("text-anchor", "middle");

        // Y axis
        const [min, max] = d3.extent(data, (d) => d.pct);
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
          .text("q_sol;jul [%]");

        // Bars
        const bar = svg.selectAll("mybar").data(data).enter().append("g");

        bar
          .append("rect")
          .attr("x", (d) => x(d.name))
          .attr("y", (d) => y(d.pct))
          .attr("width", x.bandwidth())
          .attr("height", (d) => y(0) - y(d.pct))
          .attr("fill", (d) => d.color);

        bar
          .append("text")
          .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
          .attr("y", (d) => y(Math.max(0, d.pct)) - bar_value_padding)
          .attr("text-anchor", "middle")
          .text((d) => format(d.pct));
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

// Gráfica de desglose de n50
export const N50ChartPie = ({
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
      const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        chart_width = width - margin.left - margin.right,
        chart_height = height - margin.top - margin.bottom;
      const cx = chart_width / 2;
      const cy = chart_height / 2;
      const radius = Math.min(chart_width, chart_height) / 2;

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
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Descomposición de n50 por elementos [%]");

        const chart = svg.append("g");
        chart.attr("transform", `translate(${cx}, ${cy})`);

        chart.append("g").attr("class", "slices");
        chart.append("g").attr("class", "labels");
        chart.append("g").attr("class", "lines");

        const pie = d3
          .pie()
          .sort(null)
          .value((d) => d.pct);
        const arc = d3
          .arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.4);
        var outerArc = d3
          .arc()
          .outerRadius(radius * 0.9)
          .innerRadius(radius * 0.9);

        // Sectores
        const slice = svg
          .select(".slices")
          .selectAll("path.slice")
          .data(pie(data));

        slice
          .enter()
          .insert("path")
          .attr("d", (d) => arc(d))
          .attr("fill", (d) => d.data.color)
          .attr("stroke", "white")
          .attr("class", "slice")
          .style("stroke-width", "2px")
          .style("opacity", 0.7);

        // Etiqueta central
        slice
          .enter()
          .append("text")
          .text("n50")
          .attr("dy", "0.5em")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle")
          .style("font-size", "24px");

        slice.exit().remove();

        // Etiquetas
        const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

        const text = svg.select(".labels").selectAll("text").data(pie(data));

        const txt = text
          .enter()
          .append("text")
          .attr("transform", (d) => {
            const pos = outerArc.centroid(d);
            pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
            return `translate(${pos[0]}, ${pos[1]})`;
          })
          .attr("dy", ".35em")
          .style("text-anchor", (d) =>
            midAngle(d) < Math.PI ? "start" : "end"
          );

        // Primera línea de texto - elemento
        txt
          .append("tspan")
          .attr("font-weight", "bold")
          .attr("x", "0")
          .text((d) => d.data.name);
        // segundo texto - pct
        txt
          .append("tspan")
          .attr("x", "0")
          .attr("dy", "1.5em")
          .text((d) => format(d.data.pct));

        text.exit().remove();

        // Polilíneas de conexión
        const polyline = svg
          .select(".lines")
          .selectAll("polyline")
          .data(pie(data));

        polyline
          .enter()
          .append("polyline")
          .attr("stroke", "black")
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr("points", (d) => {
            const posA = arc.centroid(d); // inserción en la cuña
            const posB = outerArc.centroid(d); // ángulo de la línea
            const posC = outerArc.centroid(d); // posición de la etiqueta, un poco movida de B
            posC[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [posA, posB, posC];
          });

        polyline.exit().remove();
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
