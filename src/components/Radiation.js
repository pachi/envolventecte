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

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import zcdata from '../zcraddata.json';

// import mobx from 'mobx';
// import DevTools from 'mobx-react-devtools';

import { Grid, Well } from 'react-bootstrap';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';

import { ORIENTACIONES, MESES, monthlyRadiationForSurface } from '../aux.js';

const LoadingTable = props => <tbody><tr><td colSpan="14">Cargando datos...</td></tr></tbody>;

const OrientaSubTable = ({ surf, metdata }) => {
  if (surf.name === null) {
    return <LoadingTable />;
  } else {
    const vals = monthlyRadiationForSurface(metdata, surf, MESES);
    const dir = vals.map(v => v.dir.toFixed(2));
    const dif = vals.map(v => v.dif.toFixed(2));
    const tot = vals.map(v => (v.dir + v.dif).toFixed(2));
    return (
      <tbody style={{ textAlign:'right' }}>
        <tr key={ 'dir_' + surf.name }>
          <td rowSpan="3"><b>{ surf.name }</b></td><td>Dir.</td>
          { dir.map((v, i) => <td key={ 'dir_' + i }>{ v }</td>) }
        </tr>
        <tr key={ 'dif_' + surf.name }>
          <td>Dif.</td>
          { dif.map((v, i) => <td key={ 'dif_' + i }>{ v }</td>) }
        </tr>
        <tr key={ 'tot_' + surf.name } style={ { fontWeight: 'bold' } }>
          <td>Tot.</td>
          { tot.map((v, i) => <td key={ 'tot_' + i }>{ v }</td>) }
        </tr>
      </tbody>);
  }
};


const OrientaSubTable2 = ({ orientadata }) => {
      return (
        <tbody style={{ textAlign:'right' }}>
          <tr key={ 'dir_' + orientadata.surfname }>
            <td rowSpan="3"><b>{ orientadata.surfname }</b></td><td>Dir.</td>
            { orientadata.dir.map((v, i) => <td key={ 'dir_' + i }>{ v }</td>) }
          </tr>
          <tr key={ 'dif_' + orientadata.surfname }>
            <td>Dif.</td>
            { orientadata.dif.map((v, i) => <td key={ 'dif_' + i }>{ v }</td>) }
          </tr>
          <tr key={ 'tot_' + orientadata.surfname } style={ { fontWeight: 'bold' } }>
            <td>Tot.</td>
            { orientadata.tot.map((v, i) => <td key={ 'tot_' + i }>{ v }</td>) }
          </tr>
        </tbody>);
    };

const Radiation = inject("appstate")(
  observer(class Radiation extends Component {

    componentDidMount() {
      this.props.appstate.setClimate('D3');
    }

    render() {
      const { metdata, climate } = this.props.appstate;

      let orientaciones;
      if (metdata == null) {
        orientaciones = [{ name: null }];
      } else {
        orientaciones = ORIENTACIONES;
      }

      return (
        <div>
          <NavBar route={ this.props.route } />
          <Grid>
            <h1>Radiación solar en superficies orientadas</h1>
          </Grid>
          <Grid>
            <Well>
              <ClimateSelector />
            </Well>
          </Grid>
          <Grid>
            <table id="components" className="table table-striped table-bordered table-condensed">
              <thead>
                <tr>
                  <th className="col-md-1">Superficie</th>
                  <th className="col-md-1">Irradiación</th>
                  <th>ENE</th><th>FEB</th><th>MAR</th><th>ABR</th>
                  <th>MAY</th><th>JUN</th><th>JUL</th><th>AGO</th>
                  <th>SET</th><th>OCT</th><th>NOV</th><th>DIC</th>
                </tr>
              </thead>
              { orientaciones.map(
                  (surf, i) => <OrientaSubTable
                                   surf={ surf }
                                   metdata={ metdata }
                                   key={ i } />
                ) }
              { zcdata
                .filter(d => d.zc === climate)
                .map(d => <OrientaSubTable2 orientadata={ d } />)
              }
            </table>
            <p>Valores de irradiación mensual en kWh/m²/mes.</p>
          </Grid>
          {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
        </div>
      );
    }

    handleClimateChange(event) {
      const climate = event.target.value;
      this.props.appstate.setClimate(climate);
    }

  })
);

export default Radiation;
