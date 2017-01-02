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
// import mobx from 'mobx';

import { Button, ControlLabel,
         Form, FormControl, FormGroup,
         Grid, Navbar } from 'react-bootstrap';

import { ZONESLIST, ORIENTACIONES,
         monthlyRadiationForSurface } from '../aux.js';

const OrientaTable = ({ orientacion }) => {
  const oo = orientacion;
  if (oo.name === null) {
    return <tbody><tr><td colSpan="14">Cargando datos...</td></tr></tbody>;
  } else {
    return (
      <tbody>
        <tr key={ 'dir_' + oo.name }><td rowSpan="3">{ oo.name }</td><td>Dir.</td>
          { oo.dir.map((v, i) => <td key={ 'dir_' + i }>{ v }</td>) }
        </tr>
        <tr key={ 'dif_' + oo.name }><td>Dif.</td>
          { oo.dif.map((v, i) => <td key={ 'dif_' + i }>{ v }</td>) }
        </tr>
        <tr key={ 'tot_' + oo.name }><td>Tot.</td>
          { oo.tot.map((v, i) => <td key={ 'tot_' + i }>{ v }</td>) }
        </tr>
      </tbody>);
  }
};


const Home = inject("appstate")(
  observer(class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        results: [],
        isLoading: true
      };
    }

    componentDidMount() {
      const appstate = this.props.appstate;
      appstate.surf = ORIENTACIONES[0];
      appstate.setClimate('D3')
              .then(() => this.updateResults());
    }

    render() {
      const { climate, surf, metdata } = this.props.appstate;

      let values;
      if (this.state.isLoading) {
        values = [{ name: null }];
      } else {
        values = ORIENTACIONES.map(
          srf => {
            const vals = monthlyRadiationForSurface(metdata, srf);
            return {
              name: srf.name,
              dir: vals.map(v => v.dir.toFixed(2)),
              dif: vals.map(v => v.dif.toFixed(2)),
              tot: vals.map(v => (v.dir + v.dif).toFixed(2))
            }
          }
        );
      }

      return (
        <div>
          <Navbar inverse fixedTop>
            <Grid>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">Solar-CTE</Link>
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
                <FormControl value={ surf ? surf.name: '' }
                             onChange={ e => this.handleSurfaceChange(e) }
                             componentClass="select"
                             placeholder="select">
                  { ORIENTACIONES.map(vv => <option value={ vv.name } key={ vv.name }>{ vv.name }</option>) }
                </FormControl>
              </FormGroup>
            </Form>
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
              { values.map((vv, i) => <OrientaTable orientacion={ vv } key={ i } />) }
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
      this.updateResults();
    }

    handleSurfaceChange(event) {
      const surfname = event.target.value;
      this.props.appstate.surf = ORIENTACIONES.find(s => s.name === surfname);
      this.updateResults();
    }

    updateResults() {
      const { metdata, surf } = this.props.appstate;
      this.setState({
        isLoading: false,
        results: { [surf.name]: monthlyRadiationForSurface(metdata, surf) }
      });
    }

  })
);

export default Home;
