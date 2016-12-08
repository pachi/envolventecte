import React, { Component } from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import { Button, ControlLabel,
         Form, FormControl, FormGroup,
         Grid, Navbar } from 'react-bootstrap';

import 'soljs';

const ZONESLIST = ['A1c', 'A2c', 'A3c', 'A4c',
                   'Alfa1c', 'Alfa2c', 'Alfa3c', 'Alfa4c',
                   'B1c', 'B2c', 'B3c', 'B4c', 'C1c', 'C2c', 'C3c', 'C4c',
                   'D1c', 'D2c', 'D3c', 'E1c',
                   'A3', 'A4', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4',
                   'D1', 'D2', 'D3', 'E1'];

// Orientaciones
const ORIENTACIONES = [
  // Area, slope, azimuth, name
  { beta: 0, gamma: 0, name: 'Horiz.' },
  { beta: 90, gamma: -135, name: 'NE' },
  { beta: 90, gamma: -90, name: 'E' },
  { beta: 90, gamma: -45, name: 'SE' },
  { beta: 90, gamma: 0, name: 'S' },
  { beta: 90, gamma: 45, name: 'SW' },
  { beta: 90, gamma: 90, name: 'W' },
  { beta: 90, gamma: 135, name: 'NW' },
  { beta: 90, gamma: 180, name: 'N' }
];

const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const components = [
  {
    active: true,
    carrier: 'ELECTRICIDAD',
    ctype: 'CONSUMO',
    originoruse: 'EPB',
    values: [9.67, 7.74, 4.84, 4.35, 2.42, 2.90, 3.87, 3.39, 2.42, 3.87, 5.80, 7.74],
    comment: 'Linea 1 de ejemplo3PVBdC.csv'
  }
];

const Home = inject("appstate")(
  observer(class Home extends Component {
    render() {
      console.log(this.props.appstate);
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
                <FormControl componentClass="select" placeholder="select">
        { ZONESLIST.map(z => <option value={ z } key={ 'zone_' + z }>{ z }</option>) }
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsOrientation">
                <ControlLabel>Orientación</ControlLabel>{' '}
                <FormControl componentClass="select" placeholder="select">
                  { ORIENTACIONES.map((vv, idx) => <option value={ vv.name } key={ vv.name }>{ vv.name }</option>) }
                </FormControl>
              </FormGroup>
            </Form>
            <table id="components" className="table table-striped table-bordered table-condensed">
              <thead>
                <tr>
                  <th></th>
                  <th>Tipo</th>
                  <th className="col-md-1">Origen/Uso</th>
                  <th className="col-md-3">Vector energético</th>
                  <th className="col-md-1">kWh/año</th>
                  <th className="col-md-1">kWh/año·m²</th>
                  <th className="col-md-1">Valores</th>
                  <th className="col-md-4">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {components.map(
                   (component, i) => {
                     const { active, ctype, originoruse, carrier, values, comment } = component;
                     const sumvalues = values.reduce((a, b)=> a + b, 0);
                     return (
                       <tr key={i}
                           onClick={ e => this.handleClick(i) }>
                         <td><input type="checkbox" defaultChecked={active}
                                    onClick={ e => this.handleChange(i) } /></td>
                         <td>{ ctype }</td>
                         <td>{ originoruse }</td><td>{ carrier }</td>
                         <td>{ sumvalues.toFixed(2) }</td>
                         <td>{ (sumvalues).toFixed(2) }</td>
                         <td>-</td>
                         <td>{ comment }</td>
                       </tr>
                     );
                   }
                 )
                }
              </tbody>
            </table>

          </Grid>
          <DevTools position={{ bottom: 0, right: 20 }} />
        </div>
      );
    }
  })
);

export default Home;
