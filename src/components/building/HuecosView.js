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

import React, { useState, useContext } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import AddRemoveButtonGroup from "../ui/AddRemoveButtonGroup";
import HuecosTable from "./HuecosTable";
import icongroup from "../img/outline-add_comment-24px.svg";
// import { update_fshobst } from "wasm-envolventecte";

// Vista de huecos del edificio
const HuecosView = observer(() => {
  const appstate = useContext(AppState);
  const [selected, setSelected] = useState([]);

  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Huecos del edificio{" "}
            <small className="text-muted">({appstate.windows.length})</small>
          </h4>
        </Col>
        <Col md="auto">
          <ButtonGroup>
            {/* TODO: Esta operación de actualizar los Fshobst lleva mucho tiempo deberíamos usar algo que indique que se está procesando */}
            {/* <Button
              variant="default"
              size="sm"
              title="Recalcular F_sh;obst"
              onClick={(_) =>
                appstate.loadModel(update_fshobst(appstate.getModel()))
              }
            >
              Calcula F<sub>sh;obst</sub>
            </Button> */}
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
            elements="windows"
            newobj="newHueco"
            selected={selected}
            setSelected={setSelected}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <HuecosTable selected={selected} setSelected={setSelected} />
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

export default HuecosView;
