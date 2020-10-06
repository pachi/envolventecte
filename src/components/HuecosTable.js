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

import React, { useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer, inject } from "mobx-react";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import icongroup from "./img/outline-add_comment-24px.svg";
import { azimuth_name, tilt_name } from "../utils";

const Float2DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(2)}</span>
);

const HuecosTable = inject("appstate")(
  observer((props) => {
    const [selected, setSelected] = useState([]);
    const {
      spaces,
      walls,
      windows: windows_obj,
      wincons,
      huecosA,
      huecosAU,
    } = props.appstate;
    const windows = Object.values(windows_obj);

    const WindowOrientationFormatter = (cell, _row) => (
      <span>{azimuth_name(walls[cell].azimuth)}</span>
    );

    const WindowTiltFormatter = (cell, _row) => (
      <span>{tilt_name(walls[cell].tilt)}</span>
    );

    const is_outside_tenv = {};
    windows.forEach((win) => {
      const w = walls[win.wall];
      // Identifica si el muro del hueco está en el interior de la envolvente térmica
      if (w.bounds !== "INTERIOR" && spaces[w.space].inside_tenv !== true) {
        is_outside_tenv[win.name] = "outsidetenv";
      } else if (
        w.bounds === "INTERIOR" &&
        spaces[w.space].inside_tenv === spaces[w.nextto].inside_tenv
      ) {
        is_outside_tenv[win.name] = "outsidetenv";
      } else {
        is_outside_tenv[win.name] = null;
      }
    });

    const winconsOptions = [
      ...new Set(Object.values(wincons).map((s) => s.name)),
    ].sort();
    const wallOptions = [
      ...new Set(Object.values(walls).map((s) => s.name)),
    ].sort();

    return (
      <Col>
        <Row>
          <Col>
            <h4>Huecos del edificio</h4>
          </Col>
          <Col md="auto">
            <ButtonGroup>
              <Button
                variant="default"
                size="sm"
                title="Agrupar huecos de igual orientación, fracción de marco, transmitancia y factor de transmisión solar con protecciones solares activadas. Suma las áreas y calcula el factor equivalente de sombras remotas."
                onClick={() => props.appstate.agrupaHuecos()}
              >
                <img src={icongroup} alt="Agrupar huecos" /> Agrupar huecos
              </Button>
            </ButtonGroup>
          </Col>
          <Col md="auto">
            <AddRemoveButtonGroup
              objects={windows}
              newObj={props.appstate.newHueco}
              selected={selected}
              clear={() => setSelected([])}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable
              data={windows}
              version="4"
              striped
              hover
              bordered={false}
              tableHeaderClass="text-light bg-secondary"
              cellEdit={{ mode: "dbclick", blurToSave: true }}
              selectRow={{
                mode: "checkbox",
                clickToSelectAndEditCell: true,
                selected: selected,
                onSelect: (row, isSelected) => {
                  if (isSelected) {
                    setSelected([...selected, row.name]);
                  } else {
                    setSelected(selected.filter((it) => it !== row.name));
                  }
                },
                hideSelectColumn: true,
                bgColor: "lightgray",
              }}
              trClassName={(row, rowIdx) => is_outside_tenv[row.name]}
            >
              {/* <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
                    - ID -{" "}
                  </TableHeaderColumn> */}
              <TableHeaderColumn
                dataField="name"
                isKey={true}
                headerText="Nombre que identifica de forma única el hueco"
                width="30%"
              >
                Nombre
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="A"
                dataFormat={Float2DigitsFormatter}
                headerText="Área proyectada del hueco (m2)"
                headerAlign="center"
                dataAlign="center"
              >
                A<sub>w,p</sub>
                <br />
                <span style={{ fontWeight: "normal" }}>
                  <i>
                    [m<sup>2</sup>]
                  </i>
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="cons"
                headerText="Construcción del hueco"
                headerAlign="center"
                dataAlign="center"
                editable={{
                  type: "select",
                  options: { values: winconsOptions },
                }}
              >
                Construcción
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="wall"
                headerText="Opaco al que pertenece el hueco"
                headerAlign="center"
                dataAlign="center"
                editable={{
                  type: "select",
                  options: { values: wallOptions },
                }}
              >
                Opaco
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="fshobst"
                dataFormat={Float2DigitsFormatter}
                headerText="Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores."
                headerAlign="center"
                dataAlign="center"
              >
                F<sub>sh;obst</sub>
                <br />
                <span style={{ fontWeight: "normal" }}>
                  <i>[-]</i>
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="wall"
                dataFormat={WindowOrientationFormatter}
                headerText="Orientación del hueco"
                editable={false}
                columnClassName="td-column-readonly"
                headerAlign="center"
                dataAlign="center"
              >
                Orientación
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="wall"
                dataFormat={WindowTiltFormatter}
                headerText="Inclinación del hueco"
                editable={false}
                columnClassName="td-column-readonly"
                headerAlign="center"
                dataAlign="center"
              >
                Inclinación
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
        <Row>
          <Col>&sum;A = {huecosA.toFixed(2)} m²</Col>
        </Row>
        <Row>
          <Col md="auto">&sum;A·U = {huecosAU.toFixed(2)} W/K</Col>
        </Row>
        <Row className="text-info small mt-3">
          <Col>
            <p>
              <b>NOTA:</b>Se marcan en color más claro aquellos elementos que no
              pertenecen a la ET.
            </p>
            <p>Donde:</p>
            <ul>
              <li>
                <b>
                  A<sub>w,p</sub>
                </b>
                : área (proyectada) del hueco (m²)
              </li>
              <li>
                <b>Construcción</b>: Solución constructiva del hueco.
              </li>
              <li>
                <b>Opaco</b>: Elemento opaco en el que se sitúa el hueco
              </li>
              <li>
                <b>
                  F<sub>sh;obst</sub>
                </b>
                : factor reductor por sombreamiento por obstáculos externos
                (comprende todos los elementos exteriores al hueco como
                voladizos, aletas laterales, retranqueos, obstáculos remotos,
                etc.), para el mes de julio (fracción).
                <br />
                Este valor puede asimilarse al factor de sombra del hueco (
                <i>
                  F<sub>S</sub>
                </i>
                ). El Documento de Apoyo <i>DA DB-HE/1</i> recoge valores del
                factor de sombra{" "}
                <i>
                  F<sub>S</sub>
                </i>{" "}
                para considerar el efecto de voladizos, retranqueos, aletas
                laterales o lamas exteriores.
              </li>
            </ul>
            <p>
              <b>NOTA</b>: Para los huecos definidos en la tabla se considera, a
              efectos del cálculo de K, un factor de ajuste{" "}
              <i>
                b<sub>tr,x</sub> = 1.0
              </i>
              , de modo que solo deben incluirse aquellos pertenecientes a
              elementos con un factor de ajuste distinto de cero. Es decir,
              deben excluirse aquellos huecos situados en elementos en contacto
              con edificios o espacios adyacentes, cuyo{" "}
              <i>
                b<sub>tr,x</sub> = 0.0
              </i>
              .
            </p>
          </Col>
        </Row>
      </Col>
    );
  })
);

export default HuecosTable;
