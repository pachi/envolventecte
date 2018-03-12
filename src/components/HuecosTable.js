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
import {
  Button,
  ButtonGroup,
  Col,
  Glyphicon,
  Grid,
  Row
} from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import AddRemoveButtonGroup from "./AddRemoveButtonGroup";

import { uuidv4 } from "../utils.js";

export default class HuecosTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { selectedId: [] };
    this.orientacionesList = [
      "Horiz.",
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW"
    ];
  }

  newHueco = () => ({
    id: uuidv4(),
    nombre: "Hueco nuevo",
    orientacion: "N",
    A: 1.0,
    U: 1.0,
    Ff: 0.2,
    gglshwi: 0.67,
    Fshobst: 1.0
  });

  Float2DigitsFormatter = (cell, _row) => (
    <span>{Number(cell).toFixed(2)}</span>
  );

  Float3DigitsFormatter = (cell, _row) => (
    <span>{Number(cell).toFixed(3)}</span>
  );

  render() {
    let { huecos, huecosA, huecosAU } = this.props;
    return (
      <Grid>
        <h2>
          Huecos de la envolvente térmica
          <AddRemoveButtonGroup
            objects={huecos}
            newObj={this.newHueco}
            selectedId={this.state.selectedId}
          />
        </h2>
        <BootstrapTable
          data={huecos}
          striped
          hover
          bordered={false}
          cellEdit={{ mode: "dbclick", blurToSave: true }}
          selectRow={{
            mode: "radio",
            clickToSelectAndEditCell: true,
            selected: this.state.selectedId,
            onSelect: (row, isSelected) =>
              this.setState({
                selectedId: isSelected ? [row.id] : []
              }),
            hideSelectColumn: true,
            bgColor: "lightgray"
          }}
        >
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="orientacion"
            editable={{
              type: "select",
              options: { values: this.orientacionesList }
            }}
            headerText="Orientación del hueco"
          >
            Orientación
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="A"
            dataFormat={this.Float2DigitsFormatter}
            headerText="Área del hueco (m2)"
          >
            A<sub>w,p</sub> (m<sup>2</sup>)
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="U"
            dataFormat={this.Float3DigitsFormatter}
            headerText="Transmitancia térmica del hueco (W/m²K)"
          >
            U (W/m<sup>2</sup>K)
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="Ff"
            dataFormat={this.Float2DigitsFormatter}
            headerText="Fracción de marco del hueco (fracción)"
          >
            F<sub>F</sub> (-)
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="gglshwi"
            dataFormat={this.Float2DigitsFormatter}
            headerText="Transmitancia total de energía solar del acristalamiento con el dispositivo de sombra móvil activado (fracción)"
          >
            g<sub>gl;sh;wi</sub> (-)
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="Fshobst"
            dataFormat={this.Float2DigitsFormatter}
            headerText="Factor reductor por sombreamiento por obstáculos externos (comprende todos los elementos exteriores al hueco como voladizos, aletas laterales, retranqueos, obstáculos remotos, etc.), para el mes de julio (fracción)"
          >
            F<sub>sh;obst</sub> (-)
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="nombre"
            headerText="Descripción identificativa del hueco"
            width="40%"
          >
            Descripción
          </TableHeaderColumn>
        </BootstrapTable>
        <Row>
          <Col md={6}>&sum;A = {huecosA.toFixed(2)} m²</Col>
          <Col md={6} className="text-right">
            &sum;A·U = {huecosAU.toFixed(2)} W/K
          </Col>
        </Row>
        <Row className="top20">
          <Col md={12}>
            <ButtonGroup className="pull-right">
              <Button
                bsStyle="default"
                bsSize="xs"
                title="Agrupar huecos de igual orientación, fracción de marco, transmitancia y factor de transmisión solar con protecciones solares activadas. Suma las áreas y calcula el factor equivalente de sombras remotas."
                onClick={() => huecos.replace(this.agrupaHuecos(huecos))}
              >
                <Glyphicon glyph="compressed" /> Agrupar huecos
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row className="text-info small top20">
          <Col md={12}>
            <p>Donde:</p>
            <ul>
              <li>
                <b>
                  A<sub>w,p</sub>
                </b>: área (proyectada) del hueco (m²)
              </li>
              <li>
                <b>Orientación</b>: orientación del hueco (N, NE, NW, E, W, SE,
                SW, S, Horiz.)
              </li>
              <li>
                <b>U</b>: transmitancia térmica del hueco (W/m²K). Se obtiene a
                partir de valores de proyecto, y el Documento de Apoyo{" "}
                <i>DA DB-HE/1</i> recoge el cálculo a partir de las
                transmitancias de los componentes del hueco.
              </li>
              <li>
                <b>
                  F<sub>F</sub>
                </b>: fracción de marco del hueco (fracción). A falta de otros
                datos puede tomarse F_F = 0.25 (25%)
              </li>
              <li>
                <b>
                  g<sub>gl;sh;wi</sub>
                </b>: transmitancia total de energía solar del acristalamiento
                con el dispositivo de sombra móvil activado (f_sh;with = 1),
                para el mes de julio (fracción).
                <br />Este valor puede obtenerse a partir del factor solar del
                vidrio a incidencia normal (g<sub>gl;n</sub>), el factor de
                dispersión del vidrio (F<sub>w</sub>~=0.9) y la definición del
                elemento de sombreamiento. El Documento de Apoyo{" "}
                <i>DA DB-HE/1</i> recoge valores de{" "}
                <i>
                  g<sub>gl;sh;wi</sub>
                </i>{" "}
                para diversos tipos de vidrio y protecciones solares. A la hora
                de introducir este valor en las aplicaciones de cálculo, debe
                tenerse en cuenta que estas emplean de manera predefinida un
                dispositivo de sombra que incide con un factor igual 0.7 (de
                acuerdo con el Documento de Condiciones Técnicas para la
                Evaluación de la Eficiencia Energética de Edificios), de modo
                que el valor introducido en los programas debe descontar dicho
                efecto.
              </li>
              <li>
                <b>
                  F<sub>sh;obst</sub>
                </b>: factor reductor por sombreamiento por obstáculos externos
                (comprende todos los elementos exteriores al hueco como
                voladizos, aletas laterales, retranqueos, obstáculos remotos,
                etc.), para el mes de julio (fracción).
                <br />Este valor puede asimilarse al factor de sombra del hueco
                (<i>
                  F<sub>S</sub>
                </i>). El Documento de Apoyo <i>DA DB-HE/1</i> recoge valores
                del factor de sombra{" "}
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
              </i>, de modo que solo deben incluirse aquellos pertenecientes a
              elementos con un factor de ajuste distinto de cero. Es decir,
              deben excluirse aquellos huecos situados en elementos en contacto
              con edificios o espacios adyacentes, cuyo{" "}
              <i>
                b<sub>tr,x</sub> = 0.0
              </i>.
            </p>
          </Col>
        </Row>
      </Grid>
    );
  }

  // Agrupa superficie de huecos por tipos
  agrupaHuecos(huecos) {
    const isequal = (h1, h2) =>
      h1.orientacion === h2.orientacion &&
      Number(h1.Ff) === Number(h2.Ff) &&
      Number(h1.U) === Number(h2.U) &&
      Number(h1.gglshwi) === Number(h2.gglshwi);
    const huecosagrupados = [];
    for (let hueco of huecos) {
      const h = huecosagrupados.find(e => isequal(hueco, e));
      if (h) {
        h.Fshobst = 1.0 *
          (h.Fshobst * h.A + hueco.Fshobst * hueco.A) / (h.A + hueco.A);
        h.A = 0.0 + h.A + hueco.A;
        h.id = uuidv4();
        h.nombre = h.nombre + ", " + hueco.nombre;
      } else {
        huecosagrupados.push(hueco);
      }
    }
    return huecosagrupados;
  }
}
