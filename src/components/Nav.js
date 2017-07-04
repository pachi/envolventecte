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

import React from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Nav, NavItem, Navbar } from 'react-bootstrap';

import ClimateSelector from './ClimateSelector';

export default class NavBar extends React.Component {

  static defaultProps = { projectName: 'Solar CTE' }

  render() {
    const currpath = this.props.route.path;
    const activeIfCurrent = path => currpath === path ? 'active' : '';

    return (
      <Navbar inverse fixedTop>
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link className="navbar-brand" to="/">
                <span className="glyphicon glyphicon-home" aria-hidden="true" /> { this.props.projectName }
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/">
                <NavItem className={ activeIfCurrent('/') }
                         eventKey={1}
                         role="presentation">Indicadores
                </NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/rad">
                <NavItem className={ activeIfCurrent('/rad') }
                         eventKey={2}
                         role="presentation">Radiación
                </NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer to="/about">
                <NavItem className={ activeIfCurrent('/about') }
                         eventKey={3}
                         role="presentation">
                  <span className="glyphicon glyphicon-question-sign"
                        aria-hidden="true" /> Créditos
                </NavItem>
              </LinkContainer>
            </Nav>
            <Navbar.Form pullRight>
              <ClimateSelector />
            </Navbar.Form>
          </Navbar.Collapse>
        </Grid>
      </Navbar>
    );
  }
}
