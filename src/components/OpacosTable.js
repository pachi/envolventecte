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
import { azimuth_name, tilt_name } from "../utils";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import icongroup from "./img/outline-add_comment-24px.svg";

const boundarytypesmap = {
  EXTERIOR: "EXTERIOR",
  INTERIOR: "INTERIOR",
  ADIABATIC: "ADIABÁTICO",
  GROUND: "TERRENO",
};

const boundaryTypesOptions = Object.keys(boundarytypesmap).map((k) => {
  return { text: boundarytypesmap[k], value: k };
});

const Float2DigitsFormatter = (cell, _row) => (
  <span>{Number(cell).toFixed(2)}</span>
);
const BoundaryTypeFormatter = (cell, _row) => (
  <span>{boundarytypesmap[cell]}</span>
);
const AzimuthFormatter = (cell, _row) => <span>{azimuth_name(cell)}</span>;
const TiltFormatter = (cell, _row) => <span>{tilt_name(cell)}</span>;

const OpacosTable = inject("appstate")(
  observer((props) => {
    const [selected, setSelected] = useState([]);
    const {
      walls: walls_obj,
      spaces,
      wallcons,
      opacosA,
      opacosAU,
    } = props.appstate;
    const walls = Object.values(walls_obj);

    const is_outside_tenv = {};
    walls.forEach((w) => {
      if (w.bounds !== "INTERIOR" && spaces[w.space].inside_tenv === false) {
        is_outside_tenv[w.name] = "outsidetenv";
      } else if (
        w.bounds === "INTERIOR" &&
        spaces[w.space].inside_tenv === spaces[w.nextto].inside_tenv
      ) {
        is_outside_tenv[w.name] = "outsidetenv";
      } else {
        is_outside_tenv[w.name] = null;
      }
    });

    const wallconsOptions = [
      ...new Set(Object.values(wallcons).map((s) => s.name)),
    ].sort();
    const spaceOptions = [
      ...new Set(Object.values(spaces).map((s) => s.name)),
    ].sort();
    const adjSpaceOptions = ["", ...spaceOptions];

    return (
      <Col>
        <Row>
          <Col>
            <h4>Elementos opacos del edificio</h4>
          </Col>
          <Col md="auto">
            <ButtonGroup>
              <Button
                variant="default"
                size="sm"
                title="Agrupa opacos, sumando áreas de igual transmitancia y factor de ajuste."
                onClick={() => props.appstate.agrupaOpacos()}
              >
                <img src={icongroup} alt="Agrupar opacos" /> Agrupar opacos
              </Button>
            </ButtonGroup>
          </Col>
          <Col md="auto">
            <AddRemoveButtonGroup
              objects={walls}
              newObj={props.appstate.newOpaco}
              selected={selected}
              clear={() => setSelected([])}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable
              data={walls}
              version="4"
              striped
              hover
              bordered={false}
              tableHeaderClass="text-light bg-secondary"
              cellEdit={{
                mode: "dbclick",
                blurToSave: true,
                // Corrige el valor del espacio adyacente de "" a null
                afterSaveCell: (row, cellName, cellValue) => {
                  if (cellName === "nextto" && cellValue !== "") {
                    row.nextto = null;
                  } else if (["A", "azimuth", "tilt"].includes(cellName)) {
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
                headerText="Nombre que identifica de forma única el elemento opaco"
                width="30%"
              >
                Nombre
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="A"
                dataFormat={Float2DigitsFormatter}
                headerText="Superficie neta (sin huecos) del elemento opaco, en m²"
                headerAlign="center"
                dataAlign="center"
              >
                A<br />
                <span style={{ fontWeight: "normal" }}>
                  <i>
                    [m<sup>2</sup>]
                  </i>{" "}
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="bounds"
                editable={{
                  type: "select",
                  options: { values: boundaryTypesOptions },
                }}
                dataFormat={BoundaryTypeFormatter}
                headerText="Condición de contorno del elemento opaco (INTERIOR | EXTERIOR | GROUND | ADIABATIC)"
                headerAlign="center"
                dataAlign="center"
              >
                Tipo
                <br />
                <span style={{ fontWeight: "normal" }}>
                  <i>[-]</i>{" "}
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="cons"
                headerText="Construcción del opaco"
                headerAlign="center"
                dataAlign="center"
                editable={{
                  type: "select",
                  options: { values: wallconsOptions },
                }}
              >
                Construcción
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="space"
                headerText="Espacio al que pertenece el elemento opaco"
                headerAlign="center"
                dataAlign="center"
                editable={{
                  type: "select",
                  options: { values: spaceOptions },
                }}
              >
                Espacio
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="nextto"
                headerText="Espacio adyacente con el que comunica el elemento opaco cuando es interior"
                headerAlign="center"
                dataAlign="center"
                editable={{
                  type: "select",
                  options: { values: adjSpaceOptions },
                }}
              >
                Espacio ady.
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="azimuth"
                dataFormat={AzimuthFormatter}
                headerText="Orientación (gamma) [-180,+180] (S=0, E=+90, W=-90). Medido como azimuth geográfico de la proyección horizontal de la normal a la superficie"
                headerAlign="center"
                dataAlign="center"
              >
                Orientación
                <br />
                <span style={{ fontWeight: "normal" }}>
                  <i>[-]</i>{" "}
                </span>
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="tilt"
                dataFormat={TiltFormatter}
                headerText="Inclinación (beta) [0, 180]. Medido respecto a la horizontal y normal hacia arriba (0 -> suelo, 180 -> techo)"
                headerAlign="center"
                dataAlign="center"
              >
                Inclinación
                <br />
                <span style={{ fontWeight: "normal" }}>
                  <i>[-]</i>{" "}
                </span>
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
        <Row>
          <Col>
            &sum;b<sub>tr,x</sub>·A<sub>x</sub> = {opacosA.toFixed(2)} m²
          </Col>
        </Row>
        <Row>
          <Col md="auto">
            &sum;b<sub>tr,x</sub>·&sum;<sub>i</sub>A<sub>i</sub>·U
            <sub>i</sub> = {opacosAU.toFixed(2)} W/K
          </Col>
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
                <b>A</b>: área del elemento opaco (m²)
              </li>
              <li>
                <b>Tipo</b>: Condición de contorno del elemento opaco (EXTERIOR,
                INTERIOR, ADIABÁTICO, TERRENO). Determina el factor de ajuste
                del elemento opaco (b<sub>tr,x</sub>), que vale 1 para elementos
                en contacto con el aire exterior o el terreno y 0 para el resto
                (adiabáticos y en contacto con otros espacios).
                <p>
                  Esta simplificación introduce cierto error al considerar que
                  el intercambio de calor a través de los elementos en contacto
                  con otros edificios o espacios adyacentes es despreciable,
                  pero simplifica considerablemente los cálculos y el objetivo
                  del parámetro K no es, en el caso del DB-HE, el cálculo de la
                  demanda energética si no como indicador de la calidad de la
                  envolvente térmica.
                </p>
              </li>
              <li>
                <b>Construcción</b>: solución constructiva del elemento opaco
              </li>
              <li>
                <b>Espacio</b>: Espacio al que pertenece el elemento opaco
              </li>
              <li>
                <b>Espacio ady.</b>: Espacio adyacente con el que comunica el
                elemento opaco, cuando este es un elemento interior
              </li>
              <li>
                <b>Orientación</b>: Orientación (gamma) [-180,+180] (S=0, E=+90,
                W=-90). Medido como azimuth geográfico de la proyección
                horizontal de la normal a la superficie.
              </li>
              <li>
                <b>Inclinación</b>: Inclinación (beta) [0, 180]. Medido respecto
                a la horizontal y normal hacia arriba (0 -&gt; suelo, 180 -&gt;
                techo)
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
    );
  })
);

export default OpacosTable;
