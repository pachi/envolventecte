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

import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { OrientaIcon } from "./IconsOrientaciones";
import { FshwithIcon } from "./IconsFshwith";

const LEVELS = ["200", "300", "500"];
const MESES = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SET,OCT,NOV,DIC".split(",");
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const selectedMonths = (start, end) => {
  const startIdx = MESES.indexOf(start);
  const endIdx = MESES.indexOf(end);
  // console.log(MESES.slice(startIdx, endIdx + 1));
  return [startIdx, endIdx];
};

// Tabla de factores de reducción para dispositivos solares móviles
//
// Para usar los iconos, OrientacionesSprite y FshwithSprite deben estar instanciados en la página
// en la que se incruste la tabla.
// import { OrientacionesSprite } from "./IconsOrientaciones"; -> <OrientacionesSprite/>
// import { FshwithSprite } from "./IconsFshwith"; -> <FshwithSprite/>
const ShadingFactorsTable = ({ data, climatezone }) => {
  const [showlevel, setShowlevel] = useState("500");
  const [startMonth, setStartMonth] = useState("JUN");
  const [endMonth, setEndMonth] = useState("SET");
  const [selStart, selEnd] = selectedMonths(startMonth, endMonth);

  const meanSummerVals = data.map((d) => {
    const vals = d[`f_shwith${showlevel}`].slice(selStart, selEnd + 1);
    const days = DAYS.slice(selStart, selEnd + 1);
    return (
      vals
        .map((val, idx) => [val, days[idx]])
        .map(([val, days]) => val * days)
        .reduce((sum, x) => sum + x) / days.reduce((sum, x) => sum + x)
    );
  });

  const meanWinterVals = data.map((d) => {
    const vals = d[`f_shwith${showlevel}`]
      .slice(0, selStart)
      .concat(d[`f_shwith${showlevel}`].slice(selEnd + 1));
    const days = DAYS.slice(0, selStart).concat(DAYS.slice(selEnd + 1));
    return (
      vals
        .map((val, idx) => [val, days[idx]])
        .map(([val, days]) => val * days)
        .reduce((sum, x) => sum + x) / days.reduce((sum, x) => sum + x)
    );
  });

  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Factores mensuales de reducción para sombreamientos solares móviles
            - {climatezone}
          </h4>
        </Col>
      </Row>
      <Form>
        <Form.Group as={Row} controlId="formControlsIrradiationLevel">
          <Form.Label column md={6}>
            Nivel de irradiación de activación / desactivación del sombreamiento
            solar móvil (W/m²):
          </Form.Label>
          <Col>
            <Form.Control
              value={showlevel}
              onChange={(e) => setShowlevel(e.target.value)}
              as="select"
              placeholder="select"
            >
              {LEVELS.map((z) => (
                <option value={z} key={"f_shwith" + z}>
                  {z}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>
      </Form>
      <Row>
        <Col>
          <p>Activación de elementos de sombra estacionales:</p>
        </Col>
      </Row>
      <Form className="form-inline">
        <Form.Group controlId="formControlsSummerMonths">
          <Form.Label column>Mes de inicio:</Form.Label>
          <Form.Control
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            as="select"
            placeholder="select"
          >
            {MESES.map((z) => (
              <option value={z} key={"start_month_" + z}>
                {z}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formControlsSummerMonths">
          <Form.Label column>Mes de finalización:</Form.Label>
          <Form.Control
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            as="select"
            placeholder="select"
          >
            {MESES.map((z) => (
              <option value={z} key={"end_month_" + z}>
                {z}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      <Row style={{ marginTop: "2em" }}>
        <Col>
          <table
            id="shadingfactorstable"
            className="table table-striped table-bordered table-condensed table-hover"
          >
            <thead className="text-light bg-secondary">
              <tr style={{ borderBottom: "3px solid darkgray" }}>
                <th className="col-md-1">Superficie</th>
                <th>
                  f<sub>sh;with</sub>
                </th>
                {MESES.map((m) => (
                  <th key={m}>{m}</th>
                ))}
                <th>
                  Media
                  <br />
                  {MESES[selStart] + "-" + MESES[selEnd]}
                </th>
                <th>
                  Media
                  <br />
                  {MESES[0] + "-" + MESES[selStart - 1]}
                  <br />
                  {MESES[selEnd + 1] + "-" + MESES[MESES.length - 1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, surfidx) => {
                const level = showlevel;
                return (
                  <tr key={"f_shwith200_" + d.orientation}>
                    <td>
                      <b className="pull-left">{d.orientation}</b>{" "}
                      <OrientaIcon dir={d.orientation} />
                    </td>
                    <td style={{ textAlign: "center" }}>I &gt; {level}</td>
                    {d[`f_shwith${level}`].map((v, i) => (
                      <td
                        key={`fshwith${level}_${i}`}
                        style={{
                          backgroundColor:
                            i >= selStart && i <= selEnd
                              ? "rgba(100, 0, 0, 0.05)"
                              : null,
                          borderRight:
                            i == selStart - 1 || i == selEnd || i == 11
                              ? "2px solid darkgray"
                              : null,
                        }}
                      >
                        {v.toFixed(2)} <FshwithIcon fsh={v} />
                      </td>
                    ))}
                    <td
                      key={`fshwith_mean_${surfidx}`}
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        backgroundColor: "rgba(100, 0, 0, 0.05)",
                        borderRight: "2px solid darkgray",
                      }}
                    >
                      {meanSummerVals[surfidx].toFixed(2)}{" "}
                      <FshwithIcon fsh={meanSummerVals[surfidx]} />
                    </td>
                    <td
                      key={`fshwith_winter_mean_${surfidx}`}
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {meanWinterVals[surfidx].toFixed(2)}{" "}
                      <FshwithIcon fsh={meanWinterVals[surfidx]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="text-info">
            <p>
              La tabla anterior recoge la fracción del tiempo (mensual) que el
              dispositivo de sombra móvil está conectado (se supera el nivel de
              irradiación indicado).
            </p>
            <p>
              Estos valores pueden resultar útiles para obtener el factor solar
              del hueco considerando los dispositivos de sombra móviles (
              <i>
                g<sub>gl;sh;wi</sub>
              </i>
              ). Para obtener valores estacionales se pueden promediar los
              valores mensuales correspondientes a la estación (p.e. verano e
              invierno).
            </p>
            <p>
              Se puede considerar que el dispositivo está conectado cuando la
              radiación (total) incidente supera el valor indicado (
              <i>
                I &gt; 200 W/m<sup>2</sup>
              </i>
              ,{" "}
              <i>
                I &gt; 300 W/m<sup>2</sup>
              </i>
              ,{" "}
              <i>
                I &gt; 500 W/m<sup>2</sup>
              </i>
              ) y desconectado cuando se encuentra por debajo de ese valor. Es
              decir, un valor de{" "}
              <i>
                f<sub>sh;with</sub> = 1
              </i>{" "}
              significa que el dispositivo de sombra móvil está completamente
              conectado o activado (p.e. un toldo extendido o una persiana
              bajada) y un valor de{" "}
              <i>
                f<sub>sh;with</sub> = 0
              </i>{" "}
              significa que el dispositivo de sombra móvil está completamente
              desconectado o desactivado (p.e. un toldo recogido o una persiana
              subida).
            </p>
            <p>
              Se han calculados los factores de reducción para los siguientes
              valores de la irradiación sobre el hueco, para los que se indican
              sus usos recomendados:
            </p>
            <ul>
              <li>
                <i>
                  I &gt; 300 W/m<sup>2</sup>
                </i>
                : dispositivos de sombra con accionamiento y control manual;
              </li>
              <li>
                <i>
                  I &gt; 200 W/m<sup>2</sup>
                </i>
                : dispositivos de sombra con control y accionamiento automático;
              </li>
              <li>
                <i>
                  I &gt; 500 W/m<sup>2</sup>
                </i>
                : dispositivos de sombra en modo de calefacción (evita cargas
                extremas).
              </li>
            </ul>
            <p>
              NOTA: Debe tenerse en cuenta que los valores de la tabla se han
              obtenido sin considerar el efecto de los obstáculos remotos sobre
              el hueco.
            </p>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default ShadingFactorsTable;
