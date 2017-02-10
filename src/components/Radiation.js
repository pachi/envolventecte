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

const Radiation = inject("appstate")(
  observer(class Radiation extends Component {

    componentDidMount() {
      this.props.appstate.setClimate('D3');
    }

    render() {
      const { climate } = this.props.appstate;
      const monthdata = zcdata.filter(d => d.zc === climate);

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
              { monthdata
                .map((orientadata, idx) => {
                  return (
                    <tbody style={{ textAlign:'right' }} key={ 'table' + idx }>
                      <tr key={ 'dir_' + orientadata.surfname }>
                        <td rowSpan="3">
                          <b>{ orientadata.surfname }</b>
                        </td>
                        <td>Dir.</td>
                        {
                          orientadata.dir.map((v, i) =>
                            <td key={ 'dir_' + i }>{ v }</td>)
                        }
                      </tr>
                      <tr key={ 'dif_' + orientadata.surfname }>
                        <td>Dif.</td>
                        {
                          orientadata.dif.map((v, i) =>
                          <td key={ 'dif_' + i }>{ v }</td>)
                        }
                      </tr>
                      <tr key={ 'tot_' + orientadata.surfname }
                          style={ { fontWeight: 'bold' } }>
                        <td>Tot.</td>
                        {
                          orientadata.tot.map((v, i) =>
                            <td key={ 'tot_' + i }>{ v }</td>)
                        }
                      </tr>
                    </tbody>);
                })
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
