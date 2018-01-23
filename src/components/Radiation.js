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
  Checkbox,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Grid,
  Row,
  Tabs,
  Tab
} from "react-bootstrap";

import { observer, inject } from "mobx-react";
// import mobx from 'mobx';
// import DevTools from 'mobx-react-devtools';

import Footer from "./Footer";
import NavBar from "./Nav";
import { OrientacionesSprite, OrientaIcon } from "./IconsOrientaciones";
import { FshwithSprite, FshwithIcon } from "./IconsFshwith";

const JulyRadiationTable = ({ data }) => (
  <table
    id="julyradiationtable"
    className="table table-striped table-bordered table-condensed"
  >
    <thead>
      <tr>
        <th className="col-md-1">kWh/m²/mes</th>
        {data.map((d, i) => (
          <th key={"hr" + i}>
            {d.surfname} <OrientaIcon dir={d.surfname} />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <b className="pull-left">{data[0].zc}</b>
        </td>
        {data.map((d, i) => <td key={"tot_" + i}>{d.tot[6].toFixed(2)}</td>)}
      </tr>
    </tbody>
  </table>
);

class RadiationTable extends Component {
  constructor(...args) {
    super(...args);
    this.MESES = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SET,OCT,NOV,DIC".split(",");
    this.state = { showDetail: false };
  }

  render() {
    const { data } = this.props;
    const showDetail = this.state.showDetail;
    return (
      <Grid>
        <Row>
          <Form inline>
            <FormGroup controlId="formControlsShowDetail">
              <ControlLabel>
                ¿Mostrar detalle de irradiación directa y difusa?
              </ControlLabel>{" "}
              <FormControl
                value={showDetail}
                onChange={e => this.setState({ showDetail: !showDetail })}
                componentClass="checkbox"
                placeholder="checkbox"
              >
                <Checkbox />
              </FormControl>
            </FormGroup>
          </Form>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <table
            id="radiationtable"
            className="table table-striped table-bordered table-condensed"
          >
            <thead>
              <tr style={{ borderBottom: "3px solid darkgray" }}>
                <th className="col-md-1">Superficie</th>
                <th className="col-md-1">Irradiación</th>
                {this.MESES.map(m => <th key={m}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map(d => {
                return (
                  <React.Fragment>
                    <tr
                      key={"tot_" + d.surfname}
                      style={
                        showDetail
                          ? {
                              fontWeight: "bold",
                              borderTop: "3px solid darkgray"
                            }
                          : null
                      }
                    >
                      <td rowSpan={showDetail ? "3" : null}>
                        <b className="pull-left">{d.surfname}</b>
                        <OrientaIcon dir={d.surfname} />
                      </td>
                      <td>Dir. + Dif.</td>
                      {d.tot.map((v, i) => (
                        <td key={"tot_" + i}>{v.toFixed(2)}</td>
                      ))}
                    </tr>
                    {showDetail ? (
                      <tr key={"dir_" + d.surfname}>
                        <td>Dir.</td>
                        {d.dir.map((v, i) => (
                          <td key={"dir_" + i}>{v.toFixed(2)}</td>
                        ))}
                      </tr>
                    ) : null}
                    {showDetail ? (
                      <tr key={"dif_" + d.surfname}>
                        <td>Dif.</td>
                        {d.dif.map((v, i) => (
                          <td key={"dif_" + i}>{v.toFixed(2)}</td>
                        ))}
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Grid>
    );
  }
}

class ShadingFactorsTable extends Component {
  constructor(...args) {
    super(...args);
    this.levels = ["200", "300", "500"];
    this.MESES = "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SET,OCT,NOV,DIC".split(",");
    this.state = { showlevel: "300" };
  }

  render() {
    const { data } = this.props;
    return (
      <Grid>
        <Row>
          <Form inline>
            <FormGroup controlId="formControlsIrradiationLevel">
              <ControlLabel>
                Nivel de irradiación de activación / desactivación del
                sombreamiento solar móvil (W/m²):
              </ControlLabel>{" "}
              <FormControl
                value={this.state.showlevel}
                onChange={e => this.setState({ showlevel: e.target.value })}
                componentClass="select"
                placeholder="select"
              >
                {this.levels.map(z => (
                  <option value={z} key={"f_shwith" + z}>
                    {z}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
          </Form>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <table
            id="shadingfactorstable"
            className="table table-striped table-bordered table-condensed"
          >
            <thead>
              <tr style={{ borderBottom: "3px solid darkgray" }}>
                <th className="col-md-1">Superficie</th>
                <th className="col-md-1">
                  f<sub>sh;with</sub>
                </th>
                {this.MESES.map(m => <th key={m}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map(d => {
                const level = this.state.showlevel;
                return (
                  <tr key={"f_shwith200_" + d.surfname}>
                    <td>
                      <b className="pull-left">{d.surfname}</b>
                      <OrientaIcon dir={d.surfname} />
                    </td>
                    <td style={{ textAlign: "center" }}>I > {level}</td>
                    {d[`f_shwith${level}`].map((v, i) => (
                      <td key={`fshwith${level}_${i}`}>
                        {v.toFixed(2)} <FshwithIcon fsh={v} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Grid>
    );
  }
}

const Radiation = inject("radstate")(
  observer(({ radstate, route }) => {
    const { climatedata } = radstate;
    return (
      <Grid>
        <NavBar route={route} />
        <OrientacionesSprite />
        <FshwithSprite />
        <Row>
          <Tabs defaultActiveKey={1} id="tabla-de-valores-radiacion">
            <Tab eventKey={1} title="Radiación acumulada (H_sol;m)">
              <Row>
                <h2>
                  Irradiación solar (acumulada) en el mes de julio{" "}
                  <i>
                    H<sub>sol;jul</sub>
                  </i>{" "}
                  (kWh/m²/mes)
                </h2>
                <JulyRadiationTable data={climatedata} />
                <p className="text-info">
                  Los valores de por la tabla anterior se utilizan en el cálculo
                  del parámetro de control solar (<b>
                    q<sub>sol;jul</sub>
                  </b>).
                </p>
              </Row>
              <Row>
                <h2>Irradiación solar (acumulada) mensual (kWh/m²/mes)</h2>
                <RadiationTable data={climatedata} />
                <p className="text-info">
                  La tabla anterior recoge la radiación mensual acumulada para
                  una superficie horizontal y superficies verticales con la
                  orientación indicada.
                </p>
              </Row>
            </Tab>
            <Tab
              eventKey={2}
              title="Factores de reducción por sombras móviles (f_sh;with)"
            >
              <Row>
                <h2>
                  Factores mensuales de reducción para sombreamientos solares
                  móviles
                </h2>
                <ShadingFactorsTable data={climatedata} />
                <div className="text-info">
                  <p>
                    La tabla anterior recoge la fracción del tiempo (mensual)
                    que el dispositivo de sombra móvil está conectado.
                  </p>
                  <p>
                    Estos valores pueden resultar útiles para obtener el factor
                    solar del hueco considerando los dispositivos de sombra
                    móviles (<i>
                      g<sub>gl;sh;wi</sub>
                    </i>). Para obtener valores estacionales se pueden promediar
                    los valores mensuales correspondientes a la estación (p.e.
                    verano e invierno).
                  </p>
                  <p>
                    Se puede considerar que el dispositivo está conectado cuando
                    la radiación (total) incidente supera el valor indicado (<i>
                      I > 200 W/m<sup>2</sup>
                    </i>,{" "}
                    <i>
                      I > 300 W/m<sup>2</sup>
                    </i>,{" "}
                    <i>
                      I > 500 W/m<sup>2</sup>
                    </i>) y desconectado cuando se encuentra por debajo de ese
                    valor. Es decir, un valor de{" "}
                    <i>
                      f<sub>sh;with</sub> = 1
                    </i>{" "}
                    significa que el dispositivo de sombra móvil está
                    completamente conectado o activado (p.e. un toldo extendido
                    o una persiana bajada) y un valor de{" "}
                    <i>
                      f<sub>sh;with</sub> = 1
                    </i>{" "}
                    significa que el dispositivo de sombra móvil está
                    completamente desconectado o desactivado (p.e. un toldo
                    recogido o una persiana subida).
                  </p>
                  <p>
                    Se han calculados los factores de reducción para los
                    siguientes valores de la irradiación sobre el hueco, para
                    los que se indican sus usos recomendados:
                  </p>
                  <ul>
                    <li>
                      <i>
                        I > 300 W/m<sup>2</sup>
                      </i>: dispositivos de sombra con accionamiento y control
                      manual;
                    </li>
                    <li>
                      <i>
                        I > 200 W/m<sup>2</sup>
                      </i>: dispositivos de sombra con control y accionamiento
                      automático;
                    </li>
                    <li>
                      <i>
                        I > 500 W/m<sup>2</sup>
                      </i>: dispositivos de sombra en modo de calefacción (evita
                      cargas extremas).
                    </li>
                  </ul>
                  <p>
                    NOTA: Debe tenerse en cuenta que los valores de la tabla se
                    han obtenido sin considerar el efecto de los obstáculos
                    remotos sobre el hueco.
                  </p>
                </div>
              </Row>
            </Tab>
          </Tabs>
        </Row>
        {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
        <Footer />
      </Grid>
    );
  })
);

export default Radiation;
