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

import React from 'react';
import { Grid, Row, Tabs, Tab } from 'react-bootstrap';

import { observer, inject } from 'mobx-react';
// import mobx from 'mobx';
// import DevTools from 'mobx-react-devtools';

import NavBar from './Nav';

const JulyRadiationTable = ({ data }) =>
  <table id="julyradiationtable" className="table table-striped table-bordered table-condensed">
    <thead>
      <tr>
        <th className="col-md-1">kWh/m²/mes</th>
        {data.map((d, i) => <th key={'hr' + i}>{d.surfname}</th>)}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>{data[0].zc}</b></td>
        {
          data.map((d, i) =>
            <td key={'tot_' + i}>{d.tot[6].toFixed(2)}</td>)
        }
      </tr>
    </tbody>
  </table>;


const RadiationTable = ({ data }) =>
  <table id="radiationtable"
    className="table table-striped table-bordered table-condensed">
    <thead>
      <tr style={{ borderBottom: '3px solid darkgray' }}>
        <th className="col-md-1">Superficie</th>
        <th className="col-md-1">Irradiación</th>
        <th>ENE</th><th>FEB</th><th>MAR</th><th>ABR</th>
        <th>MAY</th><th>JUN</th><th>JUL</th><th>AGO</th>
        <th>SET</th><th>OCT</th><th>NOV</th><th>DIC</th>
      </tr>
    </thead>
    { data.map((d, idx) => {
      return (
        <tbody style={{ textAlign: 'right' }} key={'table' + idx}>
          <tr key={'dir_' + d.surfname}>
            <td rowSpan="3"><b>{d.surfname}</b></td>
            <td>Dir.</td>
            {d.dir.map((v, i) => <td key={'dir_' + i}>{v.toFixed(2)}</td>)}
          </tr>
          <tr key={'dif_' + d.surfname}>
            <td>Dif.</td>
            {d.dif.map((v, i) => <td key={'dif_' + i}>{v.toFixed(2)}</td>)}
          </tr>
          <tr key={'tot_' + d.surfname} style={{ fontWeight: 'bold', borderBottom: '3px solid darkgray' }}>
            <td>Tot.</td>
            {d.tot.map((v, i) => <td key={'tot_' + i}>{v.toFixed(2)}</td>)}
          </tr>
        </tbody>);
    })
    }
  </table>;


const ShadingFactorsTable = ({ data }) =>
  <table id="shadingfactorstable"
    className="table table-striped table-bordered table-condensed">
    <thead>
      <tr style={{ borderBottom: '3px solid darkgray' }}>
        <th className="col-md-1">Superficie</th>
        <th className="col-md-1">f<sub>sh;with</sub></th>
        <th>ENE</th><th>FEB</th><th>MAR</th><th>ABR</th>
        <th>MAY</th><th>JUN</th><th>JUL</th><th>AGO</th>
        <th>SET</th><th>OCT</th><th>NOV</th><th>DIC</th>
      </tr>
    </thead>
    { data.map((d, idx) => {
      return (
        <tbody style={{ textAlign: 'right' }} key={'table' + idx}>
          <tr key={'f_shwith200_' + d.surfname}>
            <td rowSpan="3"><b>{d.surfname}</b></td>
            <td>f<sub>sh;with,I>200</sub></td>
            {d.f_shwith200.map((v, i) => <td key={'fshwith200_' + i}>{v.toFixed(2)}</td>)}
          </tr>
          <tr key={'f_shwith300_' + d.surfname} style={{ fontWeight: 'bold' }}>
            <td>f<sub>sh;with,I>300</sub></td>
            {d.f_shwith300.map((v, i) => <td key={'f_shwith300_' + i}>{v.toFixed(2)}</td>)}
          </tr>
          <tr key={'f_shwith500_' + d.surfname} style={{ borderBottom: '3px solid darkgray' }}>
            <td>f<sub>sh;with,I>500</sub></td>
            {d.f_shwith500.map((v, i) => <td key={'f_shwith500_' + i}>{v.toFixed(2)}</td>)}
          </tr>
        </tbody>);
    })
    }
  </table>;

const Radiation = inject("radstate")(observer(
  ({ radstate, route }) => {
    const { climatedata } = radstate;
    return (
      <Grid>
        <NavBar route={ route } />
        <Row>
          <Tabs>
            <Tab eventKey={1} title="Radiación acumulada en julio (H_sol;jul)">
              <Row>
                <h2>Irradiación solar (acumulada) en el mes de julio <i>H<sub>sol;jul</sub></i> (kWh/m²/mes)</h2>
                <JulyRadiationTable data={climatedata} />
              </Row>
            </Tab>
            <Tab eventKey={2} title="Radiación acumulada mensual (H_sol;m)">
              <Row>
                <h2>Irradiación solar (acumulada) mensual (kWh/m²/mes)</h2>
                <RadiationTable data={climatedata} />
                <p>La tabla anterior recoge la radiación mensual acumulada para una superficie
                horizontal y superficies verticales con la orientación indicada.</p>
              </Row>
            </Tab>
            <Tab eventKey={3} title="Factores de reducción por sombras móviles (f_sh;with)">
              <Row>
                <h2>Factores mensuales de reducción para sombreamientos solares móviles</h2>
                <ShadingFactorsTable data={climatedata} />
                <p>La tabla anterior recoge la fracción del tiempo (mensual) que el dispositivo
                de sombra móvil está conectado.</p>
                <p>Estos valores pueden resultar útiles para obtener los valores del factor solar del hueco
                teniendo en cuenta los dispositivos móviles, pudiendo promediar los valores mensuales al
                aplicarlos a un periodo de tiempo superior (p.e. verano e invierno).</p>
                <p>Se puede considerar que el dispositivo está conectado cuando la radiación (total) incidente
                supera el valor indicado (<i>I > 200 W/m<sup>2</sup></i>, <i>I > 300 W/m<sup>2</sup></i>, <i>I > 500 W/m<sup>2</sup></i>)
                y desconectado cuando se encuentra por debajo de ese valor.</p>
                <p>Usos indicados:
                  <ul>
                  <li><i>I > 300 W/m<sup>2</sup></i>: dispositivos de sombra con accionamiento y control manual;</li>
                  <li><i>I > 200 W/m<sup>2</sup></i>: dispositivos de sombra con control y accionamiento automatizado;</li>
                  <li><i>I > 500 W/m<sup>2</sup></i>: dispositivos de sombra en modo de calefacción (evita cargas extremas).</li>
                  </ul>
                </p>
              </Row>
            </Tab>
          </Tabs>
        </Row>
        {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
      </Grid>
    );
  }
));

export default Radiation;
