import React, { Component } from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import { Grid, Navbar, Jumbotron, Button } from 'react-bootstrap';

import 'soljs';

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
