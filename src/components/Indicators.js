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

// import mobx from 'mobx';
// import DevTools from 'mobx-react-devtools';

import { Grid, Well } from 'react-bootstrap';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';

import { ORIENTACIONES,
         monthlyRadiationForSurface } from '../aux.js';


const OrientaTable = ({ metdata, orientaciones }) => {
  let values;
  if (metdata === null) {
    values = <tr><td colSpan="2">Cargando datos...</td></tr>
  }
  else {
    values = orientaciones
      .map((surf, i) => monthlyRadiationForSurface(metdata, surf, [7])[0])
      .map(v => (v.dir + v.dif).toFixed(2));
    values = <tr>
      <td>{ metdata.meta.zc }</td>
      { values.map((val, i) =><td key={ 'tot_' + i }>{ val }</td>) }
    </tr>;
  }

  return (
    <table id="components" className="table table-striped table-bordered table-condensed">
    <thead>
        <tr>
          <th className="col-md-1">Clima</th>
          { orientaciones.map( (surf, i) => <th key={ 'hr' + i }>{ surf.name }</th>) }
        </tr>
      </thead>
      <tbody>
        { values }
      </tbody>
    </table>
  );
};

const Indicators = inject("appstate")(
  observer(class Indicators extends Component {

    componentDidMount() {
      this.props.appstate.setClimate('D3');
    }

    render() {
      const { metdata } = this.props.appstate;

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
            <h2>Radiación total (kWh/m²/mes)</h2>
            <OrientaTable
                metdata={ metdata }
                orientaciones={ orientaciones } />
          </Grid>
          {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
        </div>
      );
    }

  })
);

export default Indicators;
