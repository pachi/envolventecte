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

const formatted = (elem, bold = false) => (bold ? <b>{elem}</b> : <>{elem}</>);

const KDetail = () => {
  const appstate = useContext(AppState);
  const {
    area_ref,
    qsoljul,
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
  const Qsoljul = qsoljul * area_ref;

  // Elementos detallados: título, a, au, tipo, ¿con formato especial?
  const all_elements = [
    ["Huecos", windows.a, windows.au, "Tipo", true],
    ["Opacos", opaques_a, opaques_au, "Tipo", true],
    ["- Fachadas (aire)", walls.a, walls.au, "TipoOpaco", false],
    ["- Cubiertas (aire)", roofs.a, roofs.au, "TipoOpaco", false],
    ["- Suelos (aire)", floors.a, floors.au, "TipoOpaco", false],
    ["- Elementos contra el terreno", ground.a, ground.au, "TipoOpaco", false],
    ["Puentes térmicos", tbs_l, tbs_psil, "Tipo", true],
    [
      "- Cubierta o suelo con fachada",
      tbs.roof.l,
      tbs.roof.psil,
      "TipoPT",
      false,
    ],
    ["- Balcón", tbs.balcony.l, tbs.balcony.psil, "TipoPT", false],
    ["- Esquina de fachadas", tbs.corner.l, tbs.corner.psil, "TipoPT", false],
    [
      "- Frente de forjado",
      tbs.intermediate_floor.l,
      tbs.intermediate_floor.psil,
      "TipoPT",
      false,
    ],
    [
      "- Partición interior con envolvente",
      tbs.internal_wall.l,
      tbs.internal_wall.psil,
      "TipoPT",
      false,
    ],
    [
      "- Elementos contra el terreno con fachada",
      tbs.ground_floor.l,
      tbs.ground_floor.psil,
      "TipoPT",
      false,
    ],
    ["- Pilar", tbs.pillar.l, tbs.pillar.psil, "TipoPT", false],
    ["- Contorno de huecos", tbs.window.l, tbs.window.psil, "TipoPT", false],
    ["- Genérico", tbs.generic.l, tbs.generic.psil, "TipoPT", false],
  ];

  const data = build_data(K, a, all_elements);
  const filtered_data = data.filter(({ a }) => a > 0.001);

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
          <KElementsTable K={K} data={filtered_data} />
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
            <sub>w,p</sub> · H<sub>sol;jul</sub>) = {Qsoljul.toFixed(2)} kWh/mes
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
            = Q<sub>sol;jul</sub> / A<sub>util</sub> ={Qsoljul.toFixed(2)} /{" "}
            {area_ref.toFixed(2)} ={" "}
            <b>
              {area_ref !== 0 ? qsoljul.toFixed(2) : "-"} <i>kWh/m²/mes</i>
            </b>
          </p>
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
  const round_or_dash = (val) => (val !== null ? val.toFixed(2) : "-");
  const elem_tr = (
    { title, a, au, type, u_mean, k_contrib, k_pct, format = false },
    key = null
  ) => (
    <tr key={key}>
      <td>{formatted(title, format)}</td>
      <td className="text-center">{formatted(round_or_dash(a), format)}</td>
      <td className="text-center">{formatted(round_or_dash(au), format)}</td>
      <td className="text-center">
        {formatted(round_or_dash(u_mean), format)}
      </td>
      <td className="text-center">
        {formatted(round_or_dash(k_contrib), format)}
      </td>
      <td className="text-center">{formatted(round_or_dash(k_pct), format)}</td>
    </tr>
  );

  return (
    <Table striped bordered hover size="sm" className="small">
      <thead style={{ background: "lightGray" }}>
        <tr>
          <th>Elemento</th>
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
            U promedio
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
          <td>
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
            <b>100.00</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

// Genera datos a partir de lista
const build_data = (K, a, data) => {
  const U_mean = (elem_au, elem_a) => {
    if (elem_a && elem_a > 0.0001) {
      return elem_au / elem_a;
    } else return null;
  };

  const K_contrib = (elem_au) => {
    if (a && a > 0.0001) {
      return elem_au / a;
    } else return null;
  };

  const K_pct = (elem_au) => {
    if (a && a > 0.0001 && K && K > 0.0001) {
      return (100 * elem_au) / a / K;
    } else return null;
  };
  return data.map(([title, a, au, type, format]) => ({
    title,
    a,
    au,
    type,
    format,
    u_mean: U_mean(au, a),
    k_contrib: K_contrib(au),
    k_pct: K_pct(au),
  }));
};

export default observer(KDetail);
