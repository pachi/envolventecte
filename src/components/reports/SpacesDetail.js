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

import React, { useContext } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";
import { round_or_dash } from "../../utils";

const formatted = (elem, bold = false) => (bold ? <b>{elem}</b> : <>{elem}</>);

const SpacesDetail = () => {
  const appstate = useContext(AppState);

  const { props } = appstate.energy_indicators;

  // TODO: roofs, floors, windows
  // TODO: ordenar tablas, ordenar elementos dentro de las tablas, etc

  const wall_area_by_cons = Object.entries(
    Object.values(props.walls).reduce((acc, w) => {
      acc[w.cons] = (acc[w.cons] ?? 0) + w.area_net;
      return acc;
    }, {})
  );

  const wall_area_by_bound = Object.entries(
    Object.values(props.walls).reduce((acc, w) => {
      acc[w.bounds] = (acc[w.bounds] ?? 0) + w.area_net;
      return acc;
    }, {})
  );

  const wall_area_by_orientation = Object.entries(
    Object.values(props.walls).reduce((acc, w) => {
      acc[w.orientation] = (acc[w.orientation] ?? 0) + w.area_net;
      return acc;
    }, {})
  );

  // console.log(wall_area_by_cons, wall_area_by_bound, wall_area_by_orientation);

  return (
    <>
      <Row className="mb-4 print-section">
        <Col>
          <h3 className="mb-4">Opacos</h3>
          <p>
            Elementos opacos (muros, cubiertas, suelos, particiones interiores)
            pertenecientes o no a la envolvente térmica.
          </p>
        </Col>
      </Row>
      <Row className="mb-4 print-section">
        <Col>
          <h4 className="mb-4">Muros</h4>
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <WallsByConceptTable
            concept="Construcción"
            data={wall_area_by_cons}
          />
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <WallsByConceptTable
            concept="Condición de contorno"
            data={wall_area_by_bound}
          />
        </Col>
      </Row>
      <Row className="print-section">
        <Col>
          <WallsByConceptTable
            concept="Orientación"
            data={wall_area_by_orientation}
          />
        </Col>
      </Row>
    </>
  );
};

// Tabla de desglose de K
const WallsByConceptTable = ({ concept, data }) => {
  const total = data.reduce((acc, e) => (acc += e[1]), 0);
  return (
    <Table
      striped
      bordered
      hover
      size="sm"
      className="small"
      style={{ margin: "0 auto", marginBottom: "2em", width: "70%" }}
    >
      <thead style={{ background: "lightGray" }}>
        <tr>
          <th>
            {concept}
            <br />
          </th>
          <th className="text-center" style={{ width: "20%" }}>
            A<br />
            [m²]
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(([concept, area], idx) => (
          <tr key={idx}>
            <td>{formatted(concept, false)}</td>
            <td className="text-center">
              {formatted(round_or_dash(area), false)}
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <b>TOTAL</b>
          </td>
          <td className="text-center">
            {formatted(round_or_dash(total), true)}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default observer(SpacesDetail);
