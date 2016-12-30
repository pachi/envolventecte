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
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';

import DevTools from 'mobx-react-devtools';
import mobx from 'mobx';

import { Button, ControlLabel,
         Form, FormControl, FormGroup,
         Grid, Navbar } from 'react-bootstrap';

import { ZONESLIST, ORIENTACIONES,
         monthlyRadiationForSurface } from '../aux.js';

const RESULTS = [
  { imes: 1, dir: 7.0, dif: 2.9 },
  { imes: 2, dir: 8.2, dif: 3.1 },
  { imes: 3, dir: 9.3, dif: 3.3 }
];

const Home = inject("appstate")(
  observer(class Home extends Component {
    componentDidMount() {
      this.props.appstate.setClimate('D3');
    }

    render() {
      const { climate, metdata } = this.props.appstate;
      let results = RESULTS;
      let surf = ORIENTACIONES[0];
      if (surf !== null && metdata !== null) {
        console.log('Hay datos');
        results = monthlyRadiationForSurface(metdata, surf);
        /*         console.log('Resultados:', mobx.toJS(results));*/
        /*         console.log(mobx.toJS(metdata.meta));*/
      }

      return (
        <div>
          <Navbar inverse fixedTop>
            <Grid>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">React App</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
            </Grid>
          </Navbar>
          <Grid>
            <h1>Radiación solar en superficies orientadas</h1>
            <p>
              <Button
                  bsStyle="success"
                  bsSize="small"
                  href="http://www.codigotecnico.org/images/stories/pdf/ahorroEnergia/CTEdatosMET_20140418.zip"
                  target="_blank">
                Descargar climas de referencia de codigotecnico.org
              </Button>
            </p>
          </Grid>
          <Grid>
            <Form inline>
              <FormGroup controlId="formControlsClimateZone">
                <ControlLabel>Zona Climática</ControlLabel>{' '}
                <FormControl value={ climate || '' }
                             onChange={ e => this.handleClimateChange(e) }
                             componentClass="select"
                             placeholder="select">
                  { ZONESLIST.map(z => <option value={ z }
                                               key={ 'zone_' + z }>{ z }</option>) }
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsOrientation">
                <ControlLabel>Orientación</ControlLabel>{' '}
                <FormControl componentClass="select" placeholder="select">
                  { ORIENTACIONES.map(vv => <option value={ vv.name } key={ vv.name }>{ vv.name }</option>) }
                </FormControl>
              </FormGroup>
            </Form>
            <table id="components" className="table table-striped table-bordered table-condensed">
              <thead>
                <tr>
                  <th className="col-md-3">Mes</th>
                  <th className="col-md-3">I.Dir</th>
                  <th className="col-md-3">I.Dif</th>
                  <th className="col-md-3">I.Tot</th>
                </tr>
              </thead>
              <tbody>
                { results.map(
                    (result, i) => {
                      const { imes, dir, dif } = result;
                      return (
                        <tr key={i}>
                          <td>{ imes }</td>
                          <td>{ dir.toFixed(2) }</td>
                          <td>{ dif.toFixed(2) }</td>
                         <td>{ (dir + dif).toFixed(2) }</td>
                        </tr>
                      );
                    }
                  )
                }
              </tbody>
            </table>
            <p>Valores de irradiación mensual en kWh/m²/mes.</p>
            <p>Metdata: { climate || 'nada' }</p>
          </Grid>
          <DevTools position={{ bottom: 0, right: 20 }} />
        </div>
      );
    }

    handleClimateChange(event) {
      const climate = event.target.value;
      this.props.appstate.setClimate(climate);
    }

  })
);

export default Home;
