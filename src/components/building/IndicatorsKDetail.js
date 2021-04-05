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

import React, { useContext } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import KElementsChart from "./IndicatorsKChart";
import QSolJulChart from "./IndicatorsQSolJulChart";

const round_or_dash = (val, numDecimals = 2) =>
  val === null || val === undefined || isNaN(val)
    ? "-"
    : val.toFixed(numDecimals);

const formatted = (elem, bold = false) => (bold ? <b>{elem}</b> : <>{elem}</>);

const IndicatorsDetail = ({ isShown }) => {
  const appstate = useContext(AppState);
  const {
    area_ref,
    n50_he2019,
    n50,
    C_o,
    C_o_he2019,
  } = appstate.he1_indicators;
  const {
    K,
    summary,
    roofs,
    floors,
    walls,
    windows,
    ground,
    tbs,
  } = appstate.he1_indicators.K;
  const { q_soljul, Q_soljul } = appstate.he1_indicators.q_soljul;
  const {
    a,
    au,
    opaques_a,
    opaques_au,
    windows_a,
    windows_au,
    tbs_l,
    tbs_psil,
  } = summary;

  // Elementos detallados: título, a, au, tipo, ¿con formato especial?
  const all_elements = [
    ["Huecos", "Huecos", windows.a, windows.au, "Tipo", true, "#0096e1"],
    ["Opacos", "Opacos", opaques_a, opaques_au, "Tipo", true, "#a0401a"],
    [
      "- Fachadas (O-W)",
      "O-W",
      walls.a,
      walls.au,
      "TipoOpaco",
      false,
      "#eedaa3",
    ],
    [
      "- Cubiertas (O-R)",
      "O-R",
      roofs.a,
      roofs.au,
      "TipoOpaco",
      false,
      "#c28586",
    ],
    [
      "- Suelos (O-F)",
      "O-F",
      floors.a,
      floors.au,
      "TipoOpaco",
      false,
      "#c99fde",
    ],
    [
      "- Cerramientos en contacto con el terreno (O-G)",
      "O-G",
      ground.a,
      ground.au,
      "TipoOpaco",
      false,
      "#d3aa86",
    ],
    ["Puentes térmicos", "PTs", tbs_l, tbs_psil, "Tipo", true, "#447c2c"],
    [
      "- Cubierta o suelo con fachada (R)",
      "TB-R",
      tbs.roof.l,
      tbs.roof.psil,
      "TipoPT",
      false,
      "#c281ac",
    ],
    [
      "- Balcón (B)",
      "TB-B",
      tbs.balcony.l,
      tbs.balcony.psil,
      "TipoPT",
      false,
      "#c28bb5",
    ],
    [
      "- Esquina de fachadas (C)",
      "TB-C",
      tbs.corner.l,
      tbs.corner.psil,
      "TipoPT",
      false,
      "#eee8a4",
    ],
    [
      "- Frente de forjado (IF)",
      "TB-IF",
      tbs.intermediate_floor.l,
      tbs.intermediate_floor.psil,
      "TipoPT",
      false,
      "#bda7de",
    ],
    [
      "- Partición interior con envolvente (IW)",
      "TB-IW",
      tbs.internal_wall.l,
      tbs.internal_wall.psil,
      "TipoPT",
      false,
      "#d8eea8",
    ],
    [
      "- Elementos contra el terreno con fachada (GF)",
      "TB-GF",
      tbs.ground_floor.l,
      tbs.ground_floor.psil,
      "TipoPT",
      false,
      "#d3ca86",
    ],
    [
      "- Pilar (P)",
      "TB-P",
      tbs.pillar.l,
      tbs.pillar.psil,
      "TipoPT",
      false,
      "#98de7b",
    ],
    [
      "- Contorno de huecos (W)",
      "TB-W",
      tbs.window.l,
      tbs.window.psil,
      "TipoPT",
      false,
      "#91decf",
    ],
    [
      "- Genérico (G)",
      "TB-G",
      tbs.generic.l,
      tbs.generic.psil,
      "TipoPT",
      false,
      "#a200ff",
    ],
  ];

  const k_data = build_k_data(K, a, all_elements).filter(({ a }) => a > 0.001);

  const det = appstate.he1_indicators.q_soljul.detail;
  const q_soljul_detail = Orientations.map(([orient, color]) => [
    orient,
    color,
    det[orient],
  ])
    .filter(
      ([_orient, _color, detail]) =>
        detail !== undefined && !isNaN(detail.gains)
    )
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
          <h3>Transmitancia térmica global (K)</h3>
          <p>
            Transmisión de calor a través de la envolvente térmica (huecos,
            opacos y puentes térmicos)
          </p>
          <p>
            H<sub>tr,adj</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> ·
            [&sum;
            <sub>i</sub> A<sub>x,i</sub> · U<sub>x,i</sub> (huecos + opacos) +
            &sum;<sub>k</sub> l<sub>x,k</sub> · ψ<sub>x,k</sub> (PTs)] ={" "}
            {windows_au.toFixed(2)} W/K (huecos) + {opaques_au.toFixed(2)} W/K
            (opacos) + {tbs_psil.toFixed(2)} W/K (PTs) = {au.toFixed(2)} W/K{" "}
          </p>
          <p>Superficie de intercambio de la envolvente térmica</p>
          <p>
            &sum;A = &sum; b<sub>tr,x</sub> · A<sub>x</sub> ={" "}
            {windows_a.toFixed(2)} m² (huecos) + {opaques_a.toFixed(2)} m²
            (opacos) = {a.toFixed(2)} m²
          </p>
          <p>Valor del indicador:</p>
          <p>
            <b>K</b> = H<sub>tr,adj</sub> / &sum;A &asymp; {au.toFixed(2)} /{" "}
            {a.toFixed(2)} ={" "}
            <b>
              {K.toFixed(2)} <i>W/m²K</i>
            </b>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          {k_data.length > 0 ? <KElementsTable K={K} data={k_data} /> : null}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {k_data.length > 0 ? (
            <KElementsChart data={k_data} width={1200} />
          ) : null}
        </Col>
      </Row>
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
              data={appstate.he1_indicators.q_soljul}
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
      <Row>
        <Col>
          <h3>
            Tasa de renovación de aire a 50 Pa (n<sub>50</sub>)
          </h3>
          <p>
            <b>Tasa de renovación de aire a 50 Pa (teórica)</b>
          </p>
          <p>Permeabilidad de opacos calculada según criterio de DB-HE:</p>
          <p>
            C<sub>o, ref</sub> = {C_o_he2019.toFixed(2)} m³/h·m²
          </p>
          <p>
            <b>
              n<sub>50, ref</sub>
            </b>{" "}
            = 0.629 · (&sum;C<sub>o</sub> · A<sub>o</sub>+ &sum;C
            <sub>h</sub>· A<sub>h</sub>) / V<sub>int</sub> = 0.629 · (
            {n50_he2019.walls_c_a.toFixed(2)} +{" "}
            {n50_he2019.windows_c_a.toFixed(2)}) / {n50_he2019.vol.toFixed(2)} ={" "}
            <b>
              {n50_he2019.n50.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </b>
          </p>
          <p>
            <b>Tasa de renovación de aire a 50 Pa</b>
          </p>
          <p>
            Permeabilidad de opacos obtenida mediante ensayo, si está
            disponible, o según criterio del DB-HE:
          </p>
          <p>
            C<sub>o</sub> = {C_o.toFixed(2)} m³/h·m²
          </p>
          <p>
            <b>
              n<sub>50</sub>
            </b>{" "}
            = 0.629 · (&sum;C<sub>o</sub> · A<sub>o</sub>+ &sum;C
            <sub>h</sub>· A<sub>h</sub>) / V<sub>int</sub> = 0.629 · (
            {((n50_he2019.walls_c_a * C_o) / C_o_he2019).toFixed(2)} +{" "}
            {n50_he2019.windows_c_a.toFixed(2)}) / {n50_he2019.vol.toFixed(2)} ={" "}
            <b>
              {n50.toFixed(2)}{" "}
              <i>
                h<sup>-1</sup>
              </i>
            </b>
          </p>
        </Col>
      </Row>
    </>
  );
};

// Tabla de desglose de K
const KElementsTable = ({ K, data }) => {
  const elem_tr = (
    { title, a, au, type, u_mean, k_contrib, k_pct, color, format = false },
    key = null
  ) => (
    <tr key={key}>
      <td style={{ width: "2em", background: `${color}` }}></td>
      <td>{formatted(title, format)}</td>
      <td className="text-center">{formatted(round_or_dash(a), format)}</td>
      <td className="text-center">{formatted(round_or_dash(au), format)}</td>
      <td className="text-center">
        {formatted(round_or_dash(u_mean), format)}
      </td>
      <td className="text-center">
        {formatted(round_or_dash(k_contrib), format)}
      </td>
      <td className="text-center">
        {formatted(round_or_dash(k_pct, 1), format)}
      </td>
    </tr>
  );

  return (
    <Table striped bordered hover size="sm" className="small">
      <thead style={{ background: "lightGray" }}>
        <tr>
          <th colSpan="2">Elemento</th>
          <th className="text-center">
            A o L<br />
            [m² o m]
          </th>
          <th className="text-center">
            A·U o ψ·L
            <br />
            [W/K]
          </th>
          <th className="text-center">
            U o ψ media
            <br />
            [W/m²K]
          </th>
          <th className="text-center">
            &Delta;K
            <br />
            [W/m²K]
          </th>
          <th className="text-center">
            K
            <br />
            [%]
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((e, idx) => elem_tr(e, idx))}
        <tr>
          <td colSpan="2">
            <b>TOTAL</b>
          </td>
          <td></td>
          <td></td>
          <td className="text-center">
            <b>{K.toFixed(2)}</b>
          </td>
          <td className="text-center">
            <b>{K.toFixed(2)}</b>
          </td>
          <td className="text-center">
            <b>100.0</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

// Genera datos a partir de lista
const build_k_data = (K, total_a, data) => {
  return data.map(([title, short_title, a, au, type, format, color]) => ({
    title,
    short_title,
    a,
    au,
    type,
    format,
    color,
    u_mean: U_mean(au, a),
    k_contrib: K_contrib(au, total_a),
    k_pct: K_pct(au, total_a, K),
  }));
};

const U_mean = (elem_au, elem_a) => {
  if (elem_a && elem_a > 0.0001) {
    return elem_au / elem_a;
  } else return null;
};

const K_contrib = (elem_au, a) => {
  if (a && a > 0.0001) {
    return elem_au / a;
  } else return null;
};

const K_pct = (elem_au, a, K) => {
  if (a && a > 0.0001 && K && K > 0.0001) {
    return (100 * elem_au) / a / K;
  } else return null;
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
      <td style={{ width: "2em", background: `${color}` }}></td>
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

export default observer(IndicatorsDetail);
