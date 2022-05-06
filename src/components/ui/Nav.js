/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Form, Nav, Navbar, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { hash } from "../../utils.js";

import AppState from "../../stores/AppState";

import imglogo from "../img/logo.svg";
import iconhelp from "../img/outline-live_help-24px.svg";
import iconinfo from "../img/outline-info-24px.svg";
import icondownload from "../img/baseline-archive-24px.svg";

const NavBar = observer(({ projectName = "Envolvente CTE" }) => {
  const appstate = useContext(AppState);

  const handleDownload = (_e) => {
    const contents = appstate.asJSON;
    const contenthash = hash(contents).toString(16);
    const filename = `EnvolventeCTE-${contenthash}.json`;
    const blob = new Blob([contents], { type: "application/json" });
    const uri = URL.createObjectURL(blob);
    // from http://stackoverflow.com/questions/283956/
    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      // Firefox requires the link to be in the body
      document.body.appendChild(link);
      // Simulate click
      link.click();
      // Remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Navbar.Brand>
        <Link
          className="navbar-brand"
          to="/"
          title="EnvolventeCTE. Aplicación para el cálculo de indicadores de calidad y parámetros descriptivos de la envolvente térmica de los edificios para su evaluación energética y para la aplicación del CTE DB-HE (2019)"
        >
          <img src={imglogo} height="40px" className="mr-2" alt="logo" />{" "}
          {projectName}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <LinkContainer to="/building" eventKey={1}>
            <Nav.Link title="Visualización, introducción y edición de los componentes de la envolvente térmica del edificio.">
              Edificio
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/constructions" eventKey={2}>
            <Nav.Link title="Visualización, introducción y edición de las constucciones del edificio.">
              Construcción
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/3d" eventKey={3}>
            <Nav.Link title="Visualización tridimensional del modelo del edificio.">
              Vista3D
            </Nav.Link>
          </LinkContainer>
          <span style={{ borderLeft: "1px solid gray", margin: "0px 25px" }} />
          <LinkContainer to="/climate" eventKey={4}>
            <Nav.Link title="Visualización y obtención de parámetros relacionados con el clima exterior del edificio.">
              Clima
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/helpers" eventKey={5}>
            <Nav.Link title="Ayudas para el cálculo de parámetros descriptivos de algunos elementos de la envolvente térmica del edificio.">
              Cálculos
            </Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className="ml-auto pr-3">
          <Nav.Link
            md={6}
            title="Zona climática, de acuerdo al DB-HE 2019, en la que se sitúa el edificio."
          >
            <Form.Row>
              <Form.Label htmlFor="climateselector" className="mr-2">
                Zona Climática
              </Form.Label>
              <Col>
                <Form.Control
                  id="climateselector"
                  size="sm"
                  value={appstate?.meta?.climate || ""}
                  onChange={(e) => {
                    appstate.meta.climate = e.target.value;
                  }}
                  as="select"
                  placeholder="Zona climática"
                  custom
                >
                  {appstate.zoneslist.map((z) => (
                    <option value={z} key={"zone_" + z}>
                      {z}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Row>
          </Nav.Link>
          <span style={{ borderLeft: "1px solid gray", margin: "0px 25px" }} />
          <Nav.Link
            title="Descarga del archivo de datos con la información del modelo actual."
            onClick={(e) => handleDownload(e)}
          >
            <img src={icondownload} alt="Descargar datos de envolvente" />{" "}
            Descarga
          </Nav.Link>
          <LinkContainer to="/help" eventKey={7}>
            <Nav.Link title="Ayuda de la aplicación">
              <img src={iconhelp} alt="Ayuda" /> Ayuda
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about" eventKey={8}>
            <Nav.Link>
              <Nav.Item title="Infomración sobre autoría, licencia, etc de la aplicación">
                <img src={iconinfo} alt="Créditos" /> Créditos
              </Nav.Item>
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
});

export default NavBar;
