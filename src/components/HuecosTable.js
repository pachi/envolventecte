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

import React, { Component } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { observer, inject } from "mobx-react";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";
import icongroup from "./img/outline-add_comment-24px.svg";

const HuecosTable = inject("appstate")(
  observer(
    class HuecosTable extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = { selected: [] };
        this.orientacionesList = [
          "Horiz.",
          "N",
          "NE",
          "E",
          "SE",
          "S",
          "SW",
          "W",
          "NW",
        ];
      }

      Float2DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(2)}</span>
      );

      Float3DigitsFormatter = (cell, _row) => (
        <span>{Number(cell).toFixed(3)}</span>
      );

      onRowSelect(row, isSelected) {
        const name = row.name;
        if (isSelected) {
          this.setState({ selected: [...this.state.selected, name] });
        } else {
          this.setState({
            selected: this.state.selected.filter((it) => it !== name),
          });
        }
      }

      render() {
        const { envelope, huecosA, huecosAU } = this.props.appstate;
        const windows = envelope.windows;

        return (
          <Col>
            <Row>
              <Col>
                <h4>Huecos de la envolvente térmica</h4>
              </Col>
              <Col md="auto">
                <ButtonGroup>
                  <Button
                    variant="default"
                    size="sm"
                    title="Agrupar huecos de igual orientación, fracción de marco, transmitancia y factor de transmisión solar con protecciones solares activadas. Suma las áreas y calcula el factor equivalente de sombras remotas."
                    onClick={() => this.props.appstate.agrupaHuecos()}
                  >
                    <img src={icongroup} alt="Agrupar huecos" /> Agrupar huecos
                  </Button>
                </ButtonGroup>
              </Col>
              <Col md="auto">
                <AddRemoveButtonGroup
                  objects={windows}
                  newObj={this.props.appstate.newHueco}
                  selected={this.state.selected}
                  clear={() => this.setState({ selected: [] })}
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
                  cellEdit={{ mode: "dbclick", blurToSave: true }}
                  selectRow={{
                    mode: "checkbox",
                    clickToSelectAndEditCell: true,
                    selected: this.state.selected,
                    onSelect: this.onRowSelect.bind(this),
                    hideSelectColumn: true,
                    bgColor: "lightgray",
                  }}
                >
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
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Área proyectada del hueco (m2)"
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
                    dataField="U"
                    dataFormat={this.Float3DigitsFormatter}
                    headerText="Transmitancia térmica del hueco (W/m²K). Se obtiene a partir de valores de proyecto, y el Documento de Apoyo DA DB-HE/1 recoge el cálculo a partir de las transmitancias de los componentes del hueco."
                  >
                    U<br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>
                        [W/m<sup>2</sup>K]
                      </i>
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="orientation"
                    editable={{
                      type: "select",
                      options: { values: this.orientacionesList },
                    }}
                    headerText="Orientación del hueco (N, NE, NW, E, W, SE, SW, S, Horiz.)"
                  >
                    Orientación
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="Ff"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Fracción de marco del hueco (fracción). A falta de otros datos puede tomarse F_F = 0.25 (25%)"
                  >
                    F<sub>F</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="gglwi"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Transmitancia total de energía solar del acristalamiento SIN el dispositivo de sombra móvil activado (fracción). Este valor puede obtenerse a partir del factor solar del vidrio a incidencia normal (ggl;n) y el factor de dispersión del vidrio (Fw~=0.9)."
                  >
                    g<sub>gl;wi</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="gglshwi"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Transmitancia total de energía solar del acristalamiento CON el dispositivo de sombra móvil activado (fracción). Este valor puede obtenerse a partir del factor solar del vidrio a incidencia normal (ggl;n), el factor de dispersión del vidrio (Fw~=0.9) y la definición del elemento de sombreamiento. El Documento de Apoyo DA DB-HE/1 recoge valores de ggl;sh;wi para diversos tipos de vidrio y protecciones solares. A la hora de introducir este valor en las aplicaciones de cálculo, debe tenerse en cuenta que estas emplean de manera predefinida un dispositivo de sombra que incide con un factor igual 0.7 (de acuerdo con el Documento de Condiciones Técnicas para la Evaluación de la Eficiencia Energética de Edificios), de modo que el valor introducido en los programas debe descontar dicho efecto."
                  >
                    g<sub>gl;sh;wi</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="Fshobst"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción). Este valor puede asimilarse al factor de sombra del hueco (FS). El Documento de Apoyo DA DB-HE/1 recoge valores del factor de sombra FS para considerar el efecto de voladizos, retranqueos, aletas laterales o lamas exteriores."
                  >
                    F<sub>sh;obst</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>[-]</i>
                    </span>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="C_100"
                    dataFormat={this.Float2DigitsFormatter}
                    headerText="Coeficiente de permeabilidad al aire del hueco a 100 Pa (m3/hm2). La clase de permeabilidad al aire de los huecos, según la norma UNE EN 12207:2000 es: Clase 1: Ch;100 ≤ 50m3/hm2, Clase 2: Ch;100 ≤ 27 m3/hm2, Clase 3: Ch;100 ≤ 9 m3/hm2, Clase 4: Ch;100 ≤ 3 m3/hm2."
                  >
                    C<sub>h;100</sub>
                    <br />
                    <span style={{ fontWeight: "normal" }}>
                      <i>
                        [m<sup>3</sup>/h·m<sup>2</sup>]
                      </i>
                    </span>
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
                <p>Donde:</p>
                <ul>
                  <li>
                    <b>
                      A<sub>w,p</sub>
                    </b>
                    : área (proyectada) del hueco (m²)
                  </li>
                  <li>
                    <b>Orientación</b>: orientación del hueco (N, NE, NW, E, W,
                    SE, SW, S, Horiz.)
                  </li>
                  <li>
                    <b>U</b>: transmitancia térmica del hueco (W/m²K). Se
                    obtiene a partir de valores de proyecto, y el Documento de
                    Apoyo <i>DA DB-HE/1</i> recoge el cálculo a partir de las
                    transmitancias de los componentes del hueco.
                  </li>
                  <li>
                    <b>
                      F<sub>F</sub>
                    </b>
                    : fracción de marco del hueco (fracción). A falta de otros
                    datos puede tomarse F_F = 0.25 (25%)
                  </li>
                  <li>
                    <b>
                      g<sub>gl;wi</sub>
                    </b>
                    : transmitancia total de energía solar del acristalamiento
                    SIN el dispositivo de sombra móvil activado.
                    <br />
                    Este valor puede obtenerse a partir del factor solar del
                    vidrio a incidencia normal (g<sub>gl;n</sub>) y el factor de
                    dispersión del vidrio (F<sub>w</sub>~=0.9).
                  </li>
                  <li>
                    <b>
                      g<sub>gl;sh;wi</sub>
                    </b>
                    : transmitancia total de energía solar del acristalamiento
                    CON el dispositivo de sombra móvil activado (f_sh;with = 1),
                    para el mes de julio (fracción).
                    <br />
                    Este valor puede obtenerse a partir del factor solar del
                    vidrio a incidencia normal (g<sub>gl;n</sub>), el factor de
                    dispersión del vidrio (F<sub>w</sub>~=0.9) y la definición
                    del elemento de sombreamiento. El Documento de Apoyo{" "}
                    <i>DA DB-HE/1</i> recoge valores de{" "}
                    <i>
                      g<sub>gl;sh;wi</sub>
                    </i>{" "}
                    para diversos tipos de vidrio y protecciones solares. A la
                    hora de introducir este valor en las aplicaciones de
                    cálculo, debe tenerse en cuenta que estas emplean de manera
                    predefinida un dispositivo de sombra que incide con un
                    factor igual 0.7 (de acuerdo con el Documento de Condiciones
                    Técnicas para la Evaluación de la Eficiencia Energética de
                    Edificios), de modo que el valor introducido en los
                    programas debe descontar dicho efecto.
                  </li>
                  <li>
                    <b>
                      F<sub>sh;obst</sub>
                    </b>
                    : factor reductor por sombreamiento por obstáculos externos
                    (comprende todos los elementos exteriores al hueco como
                    voladizos, aletas laterales, retranqueos, obstáculos
                    remotos, etc.), para el mes de julio (fracción).
                    <br />
                    Este valor puede asimilarse al factor de sombra del hueco (
                    <i>
                      F<sub>S</sub>
                    </i>
                    ). El Documento de Apoyo <i>DA DB-HE/1</i> recoge valores
                    del factor de sombra{" "}
                    <i>
                      F<sub>S</sub>
                    </i>{" "}
                    para considerar el efecto de voladizos, retranqueos, aletas
                    laterales o lamas exteriores.
                  </li>
                  <li>
                    <b>
                      C<sub>h;100</sub>
                    </b>
                    : Coeficiente de permeabilidad al aire del hueco a 100 Pa de
                    diferencia de presión (m<sup>3</sup>/h·m<sup>2</sup>). La
                    clase de permeabilidad al aire de los huecos, según la norma
                    UNE EN 12207:2000 es: Clase 1: C<sub>h;100</sub> &le;
                    50m3/hm2, Clase 2: C<sub>h;100</sub> &le; 27 m3/hm2, Clase
                    3: C<sub>h;100</sub> &le; 9 m3/hm2, Clase 4: C
                    <sub>h;100</sub> &le; 3 m3/hm2.
                  </li>
                </ul>
                <p>
                  <b>NOTA</b>: Para los huecos definidos en la tabla se
                  considera, a efectos del cálculo de K, un factor de ajuste{" "}
                  <i>
                    b<sub>tr,x</sub> = 1.0
                  </i>
                  , de modo que solo deben incluirse aquellos pertenecientes a
                  elementos con un factor de ajuste distinto de cero. Es decir,
                  deben excluirse aquellos huecos situados en elementos en
                  contacto con edificios o espacios adyacentes, cuyo{" "}
                  <i>
                    b<sub>tr,x</sub> = 0.0
                  </i>
                  .
                </p>
              </Col>
            </Row>
          </Col>
        );
      }
    }
  )
);

export default HuecosTable;
