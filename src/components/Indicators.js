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
import { Grid, Tabs, Tab, Well } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import ReactDataGrid from 'react-data-grid';

import NavBar from './Nav';
import ClimateSelector from './ClimateSelector';

const Float1DigitsFormatter = props =>
  <span>{ Number(props.value).toFixed(1) }</span>;
const Float2DigitsFormatter = props =>
  <span>{ Number(props.value).toFixed(2) }</span>;
const Float3DigitsFormatter = props =>
  <span>{ Number(props.value).toFixed(3) }</span>;

const Indicators = inject("appstate")(
  observer(class Indicators extends Component {

    constructor(props) {
      super(props);

      this.huecosorientaciones = this.props.appstate.orientations;

      this.huecoscolumns = [
        { key: 'A', name: 'Area(m2)', editable: true,
          formatter: Float2DigitsFormatter },
        { key: 'U', name: 'U(W/m2K)', editable: true,
          formatter: Float3DigitsFormatter },
        { key: 'orientacion', name: 'orientacion', editable: true },
        { key: 'Ff', name: 'F_f', editable: true,
          formatter: Float1DigitsFormatter },
        { key: 'ggl', name: 'g_gl', editable: true,
          formatter: Float2DigitsFormatter },
        { key: 'Fshobst', name: 'F_sh,obst', editable: true,
          formatter: Float1DigitsFormatter },
        { key: 'Fshgl', name: 'F_sh,gl', editable: true,
          formatter: Float1DigitsFormatter },
        { key: 'nombre', name: 'Elemento', editable: true }
      ];

      this.opacoscolumns = [
        { key: 'A', name: 'Area(m2)', editable: true,
          formatter: Float2DigitsFormatter },
        { key: 'U', name: 'U(W/m2K)', editable: true,
          formatter: Float3DigitsFormatter },
        { key: 'nombre', name: 'Elemento', editable: true }
      ];

      this.ptcolumns = [
        { key: 'L', name: 'Longitud(m)', editable: true,
          formatter: Float2DigitsFormatter },
        { key: 'psi', name: 'Psi(W/mK)', editable: true,
          formatter: Float2DigitsFormatter },
        { key: 'nombre', name: 'Encuentro', editable: true }
      ];
    }

    render() {
      // climate, radiationdata, climatedata,
      const { envolvente } = this.props.appstate;
      return (
        <div>
          <NavBar route={ this.props.route } />
          <Grid>
            <Well>
              <ClimateSelector />
            </Well>
          </Grid>
          <Grid>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Indicadores">
                <Grid>
                  <h2>Transmitancia térmica global <i>K</i> (W/m²K)</h2>
                  <p>TODO</p>
                </Grid>
                <Grid>
                  <h2>Captación solar <i>Q<sub>sol,jul</sub></i> (kWh/m²/mes)</h2>
                  <p>TODO</p>
                </Grid>
              </Tab>
              <Tab eventKey={2} title="Huecos">
                <Grid>
                  <h2>Huecos de la envolvente térmica</h2>
                  <ReactDataGrid
                      enableCellSelect={ true }
                      columns={ this.huecoscolumns }
                      rowGetter={ i => envolvente.huecos[i] }
                      rowsCount={ envolvente.huecos.length }
                      onRowUpdated={ v => this.handleHuecosRowUpdated(v) }
                      minHeight={ 300 } />
                </Grid>
              </Tab>
              <Tab eventKey={3} title="Opacos">
                <Grid>
                  <h2>Elementos opacos de la envolvente térmica</h2>
                  <ReactDataGrid
                      columns={ this.opacoscolumns }
                      rowGetter={ i => envolvente.opacos[i] }
                      rowsCount={ envolvente.opacos.length }
                      minHeight={ 300 } />
                </Grid>
              </Tab>
              <Tab eventKey={4} title="P. Térmicos">
                <Grid>
                  <h2>Puentes térmicos de la envolvente térmica</h2>
                  <ReactDataGrid
                      columns={ this.ptcolumns }
                      rowGetter={ i => envolvente.pts[i] }
                      rowsCount={ envolvente.pts.length }
                      minHeight={ 300 } />
                </Grid>
              </Tab>
            </Tabs>
          </Grid>
          { <DevTools position={{ bottom: 0, right: 20 }} /> }
        </div>
      );
    }

    handleHuecosRowUpdated({ rowIdx, updated }) {
      // merge updated row with current row and rerender by setting state
      const envolvente = this.props.appstate.envolvente;
      let value = Number(updated);
      value = Number.isNaN(value)? updated: value;
      Object.assign(envolvente.huecos[rowIdx], value);
    }

  })
);

export default Indicators;
