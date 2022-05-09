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

// Tabla de desglose de K
// https://embed.plnkr.co/plunk/MV01Dl
// https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102
// Elementos de data: { element, color, a, u_mean, u_max, u_min },
const UElementsChart = ({
  data,
  K,
  width = 800,
  height = 400,
  bar_value_padding = 4,
}) => {
  const d3Container = useRef();

  useEffect(
    () => {
      const container = d3Container.current;
      const margin = { top: 30, right: 30, bottom: 60, left: 200 },
        chart_width = width - margin.left - margin.right,
        chart_height = height - margin.top - margin.bottom;

      const format = (d) =>
        d === null || d === undefined || isNaN(d) ? "-" : `${d.toFixed(2)}`;

      if (data && container) {
        const max = Math.round(d3.max(data, (d) => d.u_max) + 0.5);
        const filtered_data = data.filter(d => d.a > 0);

        // Limpia imagen preexistente
        d3.select(container).selectChildren().remove();

        // Escalas X e Y y de color
        const x = d3.scaleLinear().range([0, chart_width]).domain([0, max]);
        const y = d3
          .scaleBand()
          .range([chart_height, 0])
          .domain(data.map((d) => d.element));
        // .padding(0.4);
        const uColor = d3
          .scaleSequential()
          .domain([0, max])
          .range(["blue", "red"]);

        // SVG
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
          .text("U media y rango de valores por tipo de elemento [W/m²K]");

        // Axis
        svg
          .append("g")
          .attr("transform", `translate(0, ${chart_height})`)
          .call(d3.axisBottom(x).ticks(12))
          .select(".domain")
          .remove();
        svg
          .append("g")
          .call(d3.axisLeft(y).tickSizeOuter(0).tickSizeInner(-chart_width))
          .attr("font-weight", "bold")
          .select(".domain")
          .remove();

        svg.selectAll(".tick line").attr("stroke", "steelBlue");

        // X axis label
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", chart_width)
          .attr("y", chart_height + margin.top + 20)
          .text("U [W/m²K]");

        // Tooltips
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = (e, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(`U_media: ${format(d.u_mean)} W/m²K`)
            .style("left", e.pageX + 30 + "px")
            .style("top", e.pageY + "px");
        };
        const mousemove = (e, _d) => {
          tooltip
            .style("left", e.pageX + 30 + "px")
            .style("top", e.pageY + "px");
        };
        const mouseleave = (_e, _d) => {
          tooltip.transition().duration(200).style("opacity", 0);
        };

        // Rectángulos con max y min
        svg
          .selectAll("boxes")
          .data(filtered_data)
          .enter()
          .insert("rect")
          .attr("x", (d) => x(d.u_min))
          .attr("width", (d) => x(d.u_max - d.u_min))
          .attr("y", (d) => y(d.element) + y.bandwidth() * 0.1)
          .attr("height", y.bandwidth() * 0.8)
          .style("fill", (d) => d.color)
          .style("opacity", 0.3);

        // Puntos de valor medio
        svg
          .selectAll("indPoints")
          .data(filtered_data)
          .enter()
          .append("circle")
          .attr("cx", (d) => x(d.u_mean))
          .attr("cy", (d) => y(d.element) + y.bandwidth() / 2)
          .attr("r", 8)
          .style("stroke", "black")
          .style("stroke-width", 2)
          .style("fill", (d) => uColor(d.u_mean))
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

        // Línea con valor de K
        svg
          .append("line")
          .attr("x1", x(K))
          .attr("x2", x(K))
          .attr("y1", 0)
          .attr("y2", chart_height)
          .style("stroke", "steelBlue")
          .style("stroke-width", 3)
          .style("fill", "none");
        svg
          .append("text")
          .style("stroke", "steelBlue")
          .attr("text-anchor", "middle")
          .attr("x", x(K))
          .attr("y", 10)
          .attr('transform', `translate(${x(K) + 20}, ${0}) rotate(90)`)
          .text(`K: ${format(K)} [W/m²K]`);
      }
    },
    // Array de dependencias.
    // El bloque se ejecuta cuando cambia cualquiera de estas variables
    [data, K, height, width, bar_value_padding]
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

export default UElementsChart;
