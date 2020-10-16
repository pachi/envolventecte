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
import { observer } from "mobx-react-lite";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import icongroup from "./img/outline-add_comment-24px.svg";
import { azimuth_name, tilt_name, wall_is_inside_tenv } from "../utils";

const Float2DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(2)}</span>
);

const HuecosTable = observer(({ appstate }) => {
  const [selected, setSelected] = useState([]);
  const { spaces, walls, windows, wincons, huecosA, huecosAU } = appstate;

  const WindowOrientationFormatter = (cell, _row) => {
    const wall = walls.find((s) => s.id === cell);
    return <span>{azimuth_name(wall.azimuth)}</span>;
  };

  const WindowTiltFormatter = (cell, _row) => {
    const wall = walls.find((s) => s.id === cell);
    return <span>{tilt_name(wall.tilt)}</span>;
  };

  // Diccionario para determinar si el hueco está o no dentro de la ET
  const is_outside_tenv = new Map();
  windows.forEach((win) => {
    const w = walls.find((w) => w.id === win.wall);
    // 1. No tiene definido muro -> fuera
    if (w === undefined) {
      is_outside_tenv[win.id] = "outsidetenv";
    } else {
      const wall_inside_tenv = wall_is_inside_tenv(w, spaces);
      is_outside_tenv[win.id] = wall_inside_tenv ? null : "outsidetenv";
    }
  });

  // Formato y opciones de construcciones de huecos
  const winconsMap = new Map();
  wincons.map((s) => (winconsMap[s.id] = s.name));
  const WinconsFormatter = (cell, _row) => <span>{winconsMap[cell]}</span>;
  const WinconsOptions = Object.keys(winconsMap).map((k) => {
    return { text: winconsMap[k], value: k };
  });

  // Formato y opciones de opacos
  const wallsMap = new Map();
  walls.map((s) => (wallsMap[s.id] = s.name));
  const WallsFormatter = (cell, _row) => <span>{wallsMap[cell]}</span>;
  const WallsOptions = Object.keys(wallsMap).map((k) => {
    return { text: wallsMap[k], value: k };
  });

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
              onClick={() => appstate.agrupaHuecos()}
            >
              <img src={icongroup} alt="Agrupar huecos" /> Agrupar huecos
            </Button>
          </ButtonGroup>
        </Col>
        <Col md="auto">
          <AddRemoveButtonGroup
            objects={windows}
            newObj={appstate.newHueco}
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
            cellEdit={{
              mode: "dbclick",
              blurToSave: true,
              afterSaveCell: (row, cellName, cellValue) => {
                if (["A", "fshobst"].includes(cellName)) {
                  // Convierte a número campos numéricos
                  row[cellName] = Number(cellValue);
                }
              },
            }}
            selectRow={{
              mode: "checkbox",
              clickToSelectAndEditCell: true,
              selected: selected,
              onSelect: (row, isSelected) => {
                if (isSelected) {
                  setSelected([...selected, row.id]);
                } else {
                  setSelected(selected.filter((it) => it !== row.id));
                }
              },
              hideSelectColumn: true,
              bgColor: "lightgray",
            }}
            trClassName={(row, rowIdx) => is_outside_tenv[row.id]}
          >
            <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
              - ID -{" "}
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="name"
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
              dataFormat={WinconsFormatter}
              headerText="Construcción del hueco"
              headerAlign="center"
              dataAlign="center"
              editable={{
                type: "select",
                options: { values: WinconsOptions },
              }}
            >
              Construcción
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="wall"
              dataFormat={WallsFormatter}
              headerText="Opaco al que pertenece el hueco"
              headerAlign="center"
              dataAlign="center"
              editable={{
                type: "select",
                options: { values: WallsOptions },
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
              (comprende todos los elementos exteriores al hueco como voladizos,
              aletas laterales, retranqueos, obstáculos remotos, etc.), para el
              mes de julio (fracción).
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
            elementos con un factor de ajuste distinto de cero. Es decir, deben
            excluirse aquellos huecos situados en elementos en contacto con
            edificios o espacios adyacentes, cuyo{" "}
            <i>
              b<sub>tr,x</sub> = 0.0
            </i>
            .
          </p>
        </Col>
      </Row>
    </Col>
  );
});

export default HuecosTable;
