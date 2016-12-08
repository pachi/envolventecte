import React, { Component } from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import { Grid, Navbar, Jumbotron, Button } from 'react-bootstrap';

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
          <Jumbotron>
            <Grid>
              <h1>Welcome to React + MobX</h1>
              <p>
                <Button
                    bsStyle="success"
                    bsSize="large"
                    href="http://react-bootstrap.github.io/components.html"
                    target="_blank">
                  View React Bootstrap Docs
                </Button>
              </p>
            </Grid>
          </Jumbotron>
          <DevTools position={{ bottom: 0, right: 20 }} />
        </div>
      );
      // return (
      //     <div>Cabecera</div>
      // );
    }
  })
);

export default Home;
