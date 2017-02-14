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
import { Grid, Well } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
// import mobx from 'mobx';
// import DevTools from 'mobx-react-devtools';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';

const JulyRadiationTable = ({ data }) =>
    <table id="components" className="table table-striped table-bordered table-condensed">
      <thead>
        <tr>
          <th className="col-md-1">kWh/m²/mes</th>
          { data.map((d, i) => <th key={ 'hr' + i }>{ d.surfname }</th>) }
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>{ data[0].zc }</b></td>
          {
            data.map((d, i) =>
              <td key={ 'tot_' + i }>{ d.tot[6].toFixed(2) }</td>)
          }
        </tr>
      </tbody>
    </table>;

const Indicators = inject("appstate")(
  observer(class Indicators extends Component {
    render() {
      const { climate, zcdata } = this.props.appstate;
      const climatedata = zcdata.filter(v => v.zc === climate);
      return (
        <div>
          <NavBar route={ this.props.route } />
          <Grid>
            <Well>
              <ClimateSelector />
            </Well>
          </Grid>
          <Grid>
            <h2>Radiación acumulada en el mes de julio (kWh/m²/mes)</h2>
            <JulyRadiationTable data={ climatedata } />
          </Grid>
          {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
        </div>
      );
    }

  })
);

export default Indicators;
