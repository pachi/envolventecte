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
import { Col, Image, Grid, Row, Well } from 'react-bootstrap';

import { observer } from 'mobx-react';
// import mobx from 'mobx';
// import DevTools from 'mobx-react-devtools';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';
import orientaciones from './orientaciones.svg';

const RadiationTable = ({ data }) =>
  <table id="components"
    className="table table-striped table-bordered table-condensed">
    <thead>
      <tr>
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
            {d.dir.map((v, i) => <td key={'dir_' + i}>{v}</td>)}
          </tr>
          <tr key={'dif_' + d.surfname}>
            <td>Dif.</td>
            {d.dif.map((v, i) => <td key={'dif_' + i}>{v}</td>)}
          </tr>
          <tr key={'tot_' + d.surfname}
            style={{ fontWeight: 'bold' }}>
            <td>Tot.</td>
            {d.tot.map((v, i) => <td key={'tot_' + i}>{v}</td>)}
          </tr>
        </tbody>);
    })
    }
  </table>;


const JulyRadiationTable = ({ data }) =>
  <table id="components" className="table table-striped table-bordered table-condensed">
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


const Radiation = observer(["radstate"],
  ({ radstate, route }) => {
    const { climatedata } = radstate;
    return (
      <Grid>
        <NavBar route={ route } />
        <Row>
          <Well>
            <ClimateSelector />
          </Well>
        </Row>
        <Row>
          <h2>Radiación acumulada en el mes de julio (kWh/m²/mes)</h2>
          <JulyRadiationTable data={climatedata} />
          <h2>Irradiación solar en superficies orientadas e inclinadas (kWh/m²/mes)</h2>
          <RadiationTable data={climatedata} />
          <p>La tabla anterior recoge la radiación mensual acumulada para una superficie
             horizontal y superficies verticales con la orientación indicada.</p>
        </Row>
        <Row>
          <h2>Orientaciones</h2>
          <Col md={8} mdOffset={2}>
            <Image responsive alt="Roseta de orientaciones" src={orientaciones} />
          </Col>
        </Row>
        {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
      </Grid>
    );
  }
);

export default Radiation;
