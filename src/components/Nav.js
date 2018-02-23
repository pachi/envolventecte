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

import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Grid, Nav, NavItem, Navbar } from "react-bootstrap";

import ClimateSelector from "./ClimateSelector";
import imglogo from "./logo.svg";

export default class NavBar extends React.Component {
  static defaultProps = { projectName: "Envolvente CTE" };

  render() {
    return (
      <Navbar inverse fixedTop>
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link className="navbar-brand" to="/">
                <img
                  src={imglogo}
                  height="125%"
                  style={{ display: "inline" }}
                  alt="logo"
                />{" "}
                {this.props.projectName}
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/envelope">
                <NavItem
                  eventKey={1}
                  role="presentation"
                >
                  Envolvente
                </NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/climate">
                <NavItem
                  eventKey={2}
                  role="presentation"
                >
                  Clima
                </NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/elements">
                <NavItem
                  eventKey={3}
                  role="presentation"
                >
                  Elementos
                </NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer to="/help">
                <NavItem
                  eventKey={4}
                  role="presentation"
                >
                  <span
                    className="glyphicon glyphicon-question-sign"
                    aria-hidden="true"
                  />{" "}
                  Ayuda
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/about">
                <NavItem
                  eventKey={5}
                  role="presentation"
                >
                  <span
                    className="glyphicon glyphicon-user"
                    aria-hidden="true"
                  />{" "}
                  Créditos
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
