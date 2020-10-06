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
import { Nav, Navbar } from "react-bootstrap";

import imglogo from "./img/logo.svg";
import iconhelp from "./img/outline-live_help-24px.svg";
import iconinfo from "./img/outline-info-24px.svg";

const NavBar = ({ projectName = "Envolvente CTE" }) => (
  <Navbar bg="dark" variant="dark" fixed="top">
    <Navbar.Brand>
      <Link className="navbar-brand" to="/">
        <img src={imglogo} height="40px" className="mr-2" alt="logo" />{" "}
        {projectName}
      </Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav>
        <LinkContainer to="/meta" eventKey={1}>
          <Nav.Link>Datos generales</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/building" eventKey={2}>
          <Nav.Link>Edificio</Nav.Link>
        </LinkContainer>
        <span
          style={{ borderLeft: "1px solid gray", margin: "0px 25px" }}
        ></span>
        <LinkContainer to="/climate" eventKey={3}>
          <Nav.Link>Clima</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/elements" eventKey={4}>
          <Nav.Link>Elementos</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav className="ml-auto pr-3">
        <LinkContainer to="/help" eventKey={5}>
          <Nav.Link>
            <img src={iconhelp} alt="Ayuda" /> Ayuda
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/about" eventKey={6}>
          <Nav.Link>
            <Nav.Item>
              <img src={iconinfo} alt="Créditos" /> Créditos
            </Nav.Item>
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
