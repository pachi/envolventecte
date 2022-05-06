/* -*- coding: utf-8 -*-

Copyright (c) 2018-2021 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { useContext } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import { QSolJulChartWindRose as QSolJulChart } from "./IndicatorsQSolJulChart";
// import { QSolJulChartBar as QSolJulChart } from "./IndicatorsQSolJulChart";
import { round_or_dash } from "../../utils";

const QSolJulDetail = () => {
  const appstate = useContext(AppState);
  const { area_ref, q_soljul_data } = appstate.energy_indicators;
  const { q_soljul, Q_soljul, detail } = q_soljul_data;

  const q_soljul_detail = Orientations.map(([orient, color]) => [
    orient,
    color,
    detail[orient],
  ])
    .filter(([_orient, _color, det]) => det !== undefined && !isNaN(det.gains))
    .map(
      ([
        orient,
        color,
        { fshobst_mean, gglshwi_mean, Ff_mean, a, irradiance, gains },
      ]) => {
        return {
          orient,
          color,
          fshobst_mean,
          gglshwi_mean,
          Ff_mean,
          a,
          irradiance,
          gains,
          q_contrib: gains / area_ref,
          q_pct: (100 * gains) / area_ref / q_soljul,
        };
      }
    );

  return (
    <>
      <Row>
        <Col>
          <h3>
            Control solar de los huecos (q<sub>sol;jul</sub>)
          </h3>
          <p>
            Ganancias solares en el mes de julio con los dispositivos de sombra
            de los huecos activados
          </p>
          <p>
            Q<sub>sol;jul</sub> = &sum;<sub>k</sub>(F
            <sub>sh,obst</sub> · g<sub>gl;sh;wi</sub> · (1 − F<sub>F</sub>) · A
            <sub>w,p</sub> · H<sub>sol;jul</sub>) = {Q_soljul.toFixed(2)}{" "}
            kWh/mes
          </p>
          <p>Superficie útil</p>
          <p>
            A<sub>util</sub> = {area_ref.toFixed(2)} m²
          </p>
          <p>Valor del indicador:</p>
          <p>
            <b>
              q<sub>sol;jul</sub>
            </b>{" "}
            = Q<sub>sol;jul</sub> / A<sub>util</sub> ={Q_soljul.toFixed(2)} /{" "}
            {area_ref.toFixed(2)} ={" "}
            <b>
              {area_ref !== 0 ? q_soljul.toFixed(2) : "-"} <i>kWh/m²/mes</i>
            </b>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          {q_soljul_detail.length > 0 ? (
            <QSolJulTable
              area_ref={area_ref}
              data={q_soljul_data}
              detail_data={q_soljul_detail}
            />
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {q_soljul_detail.length > 0 ? (
            <QSolJulChart
              area_ref={area_ref}
              data={q_soljul_detail}
              width={Math.max(550, 100 * q_soljul_detail.length)}
            />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

const Orientations = [
  ["N", "#010164"],
  ["NE", "#00799e"],
  ["E", "#009e42"],
  ["SE", "#969e00"],
  ["S", "#ffff00"],
  ["SW", "#ffaa00"],
  ["W", "#aa0000"],
  ["NW", "#9600aa"],
  ["HZ", "#aaaaaa"],
];

// Tabla de desglose de q_soljul
const QSolJulTable = (props) => {
  const {
    q_soljul,
    Q_soljul,
    a_wp,
    irradiance_mean,
    fshobst_mean,
    gglshwi_mean,
    Ff_mean,
  } = props.data;
  const detail_data = props.detail_data;
  const area_ref = props.area_ref;

  const elem_tr = (
    {
      orient,
      color,
      fshobst_mean,
      gglshwi_mean,
      Ff_mean,
      a,
      irradiance,
      gains,
    },
    key = null
  ) => (
    <tr key={key}>
      <td style={{ width: "2em", background: `${color}` }} />
      <td>{orient}</td>
      <td className="text-center">{round_or_dash(fshobst_mean)}</td>
      <td className="text-center">{round_or_dash(gglshwi_mean)}</td>
      <td className="text-center">{round_or_dash(1 - Ff_mean)}</td>
      <td className="text-center">{round_or_dash(a)}</td>
      <td className="text-center">{round_or_dash(irradiance)}</td>
      <td className="text-center">{round_or_dash(gains)}</td>
      <td className="text-center">{round_or_dash(gains / area_ref)}</td>
      <td className="text-center">
        {round_or_dash((100 * gains) / area_ref / q_soljul, 1)}
      </td>
    </tr>
  );

  return (
    <Table striped bordered hover size="sm" className="small">
      <thead style={{ background: "lightGray" }}>
        <tr>
          <th colSpan="2">Orientación</th>
          <th className="text-center" title="Factor de obstáculos remotos">
            F<sub>sh;obst;orient</sub>
            <br />
            [-]
          </th>
          <th
            className="text-center"
            title="Factor solar con dispoisivos de sombra activados"
          >
            g<sub>gl;sh;wi;orient</sub>
            <br />
            [-]
          </th>
          <th
            className="text-center"
            title="Fracción transparente del hueco (no ocupada por el marco)"
          >
            (1 - F<sub>f;orient</sub>)
            <br />
            [-]
          </th>
          <th className="text-center" title="Superficie de huecos">
            A<sub>w;p;orient</sub>
            <br />
            [m²]
          </th>
          <th
            className="text-center"
            title="Irradiancia solar acumulada en el mes de julio"
          >
            H<sub>sol;jul;orient</sub>
            <br />
            [kWh/m²·mes]
          </th>
          <th
            className="text-center"
            title="Ganancias solares en el mes de julio con los dispositivos de sombra activados"
          >
            Q<sub>sol;jul;orient</sub>
            <br />
            [kWh/mes]
          </th>
          <th
            className="text-center"
            title="Fracción del parámetro de control solar imputable a la orientación"
          >
            &Delta;q<sub>sol;jul</sub>
            <br />
            [kWh/m²·mes]
          </th>
          <th
            className="text-center"
            title="Porcentaje del parámetro de control solar imputable a la orientación"
          >
            q<sub>sol;jul</sub>
            <br />
            [%]
          </th>
        </tr>
      </thead>
      <tbody>
        {detail_data.map((e, idx) => elem_tr(e, idx))}
        <tr>
          <td colSpan="2">
            <b>TOTAL / Promedio</b>
          </td>
          <td
            className="text-center"
            title="Factor de obstáculos remotos medio"
          >
            <b>{round_or_dash(fshobst_mean)}</b>
          </td>
          <td
            className="text-center"
            title="Factor solar con dispoisivos de sombra activados medio"
          >
            <b>{round_or_dash(gglshwi_mean)}</b>
          </td>
          <td
            className="text-center"
            title="Fracción transparente del hueco (no ocupada por el marco) media"
          >
            <b>{round_or_dash(1 - Ff_mean)}</b>
          </td>
          <td className="text-center" title="Superficie de huecos">
            <b>{round_or_dash(a_wp)}</b>
          </td>
          <td
            className="text-center"
            title="Irradiancia solar acumulada en el mes de julio media para los huecos"
          >
            <b>{round_or_dash(irradiance_mean)}</b>
          </td>
          <td
            className="text-center"
            title="Ganancias solares en el mes de julio con los dispositivos de sombra activados"
          >
            <b>{Q_soljul.toFixed(2)}</b>
          </td>
          <td
            className="text-center"
            title="Fracción del parámetro de control solar imputable a una orientación de huecos"
          >
            <b>{round_or_dash(q_soljul)}</b>
          </td>
          <td className="text-center">
            <b>100.0</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default observer(QSolJulDetail);
