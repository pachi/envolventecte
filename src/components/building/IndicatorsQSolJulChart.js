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

// Gráfica de desglose de q_soljul
export const QSolJulChartBar = ({
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
          .text("Descomposición de q_sol;jul por orientaciones [%]");

        // X axis
        const x = d3
          .scaleBand()
          .range([0, chart_width])
          .domain(data.map((d) => d.orient))
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
        const [min, max] = d3.extent(data, (d) => d.q_pct);
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
          .attr("x", (d) => x(d.orient))
          .attr("y", (d) => y(d.q_pct))
          .attr("width", x.bandwidth())
          .attr("height", (d) => y(0) - y(d.q_pct))
          .attr("fill", (d) => d.color);

        bar
          .append("text")
          .attr("x", (d) => x(d.orient) + x.bandwidth() / 2)
          .attr("y", (d) => y(Math.max(0, d.q_pct)) - bar_value_padding)
          .attr("text-anchor", "middle")
          .text((d) => format(d.q_pct));
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

// Gráfica de desglose de q_soljul
export const QSolJulChartWindRose = ({
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
      const margin = { top: 40, right: 30, bottom: 10, left: 30 },
        chart_width = width - margin.left - margin.right,
        chart_height = height - margin.top - margin.bottom;

      const cx = chart_width / 2;
      const cy = chart_height / 2;
      const radius = Math.min(cx, cy);
      const outerRadius = radius - 35;
      const innerRadius = 0.4 * radius;
      const angleOffset = 180 / 8;

      if (data && container) {
        // Limpia imagen preexistente
        d3.select(container).selectChildren().remove();

        // Genera imagen
        const svg = d3
          .select(container)
          .attr("class", "canvas")
          .append("g")
          .style("font-size", "12px")
          .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);

        // Título
        svg
          .append("text")
          .attr("x", cx)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Descomposición de q_sol;jul por orientaciones [%]");

        const chart = svg.append("g");
        chart.attr("transform", `translate(${cx}, ${cy})`);

        const dataOrientations = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

        // Escala de porcentajes sobre el radio
        const max_pct = 20 * Math.ceil(d3.max(data, (d) => d.q_pct) / 20);
        const y = d3
          .scaleLinear()
          .range([innerRadius, outerRadius])
          .domain([0, max_pct]);
        // the xScale is for the bars, one full turn around circle
        const x = d3
          .scaleBand()
          .range([0 + Math.PI / 8, 2 * Math.PI + Math.PI / 8])
          .domain(dataOrientations)
          .align(0);

        // Arc for pie chart
        const arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius((d) => y(d.data.q_pct))
          .startAngle((d) => x(d.data.orient))
          .endAngle((d) => x(d.data.orient) - x.bandwidth());

        // Piechart layout, all equal width wedges
        const pie = d3
          .pie()
          .sort(null)
          .value((_d) => 1);

        const g = chart
          .selectAll(".arc")
          .data(pie(data))
          .join("g")
          .attr("class", "arc")
          .call((g) =>
            g
              .append("path")
              .attr("d", arc)
              .style("fill", (d) => d.data.color)
              .style("stroke", "white")
              .style("stroke-width", "2px")
              .style("opacity", 0.7)
          )
          .call((g) =>
            g
              .append("text")
              .text((d) => format(d.data.q_pct))
              .attr("text-anchor", "middle")
              .attr("font-weight", "bold")
              .attr("x", (d) => arc.centroid(d)[0])
              .attr("y", (d) => arc.centroid(d)[1])
              .attr("dy", "6px")
          );

        // Etiqueta central
        const txt = chart
          .append("text")
          .attr("text-anchor", "middle")
          .attr("font-weight", "bold")
          .attr("dy", "0.5em");
        txt.append("tspan").text("q").style("font-size", "24px");
        txt
          .append("tspan")
          .text("sol;jul")
          .attr("dy", "0.5em")
          .style("font-size", "20px");

        // Etiquetas de orientación
        const inLowerHalf = (d) =>
          (x(d.orient) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) <
          Math.PI;

        const label = chart
          .append("g")
          .attr("class", "direction-labels")
          .selectAll("g")
          .data(pie(dataOrientations.map((d) => ({ orient: d }))))
          .join("g")
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d) =>
              `rotate(${
                (x(d.data.orient) - x.bandwidth()) * (180 / Math.PI) -
                (90 - angleOffset)
              }) translate(${outerRadius + 10},0)`
          );
        label
          .append("text")
          .attr("transform", (d) =>
            inLowerHalf(d)
              ? "rotate(90)translate(0,6)"
              : "rotate(-90)translate(0,6)"
          ) // flip bottom labels
          .text((d) => d.data.orient)
          .attr("font-weight", 500)
          .attr("font-size", 14);

        // Círculos de 10%
        const yAxis = (_g) =>
          chart
            .append("g")
            .attr("class", "yAxis")
            .selectAll("g")
            .data(y.ticks(max_pct / 20)) // .slice(1) to skip 0
            .join("g")
            .call((g) =>
              g
                .append("circle")
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("stroke-dasharray", "1,3")
                .attr("r", y)
            )
            .call((g) =>
              g
                .append("text")
                .text((d) => `${d}%`)
                .style("color", "gray")
                .attr("font-size", 10)
                .attr("x", (d) => y(d + 2))
                .attr("transform", (d) => `rotate(${-50 + d})`)
            );
        g.call(yAxis);
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
