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
import { Col, Container, Row, Tabs, Tab } from "react-bootstrap";

import { observer } from "mobx-react-lite";
// import DevTools from 'mobx-react-devtools';

import AppState from "../../stores/AppState";

import Footer from "../ui/Footer";
import NavBar from "../ui/Nav";
import MonthlyRadiationTable from "./MonthlyRadiationTable";
import ShadingFactorsTable from "./ShadingFactorsTable";
import { OrientacionesSprite } from "./IconsOrientaciones";
import { FshwithSprite } from "./IconsFshwith";

const ClimatePage = observer(({ route }) => {
  const appstate = useContext(AppState);
  return (
    <Container fluid>
      <NavBar route={route} />
      <OrientacionesSprite />
      <FshwithSprite />
      <Row>
        <Col>
          <Tabs defaultActiveKey={1} id="tabla-de-valores-radiacion">
            <Tab
              eventKey={1}
              title="Radiación acumulada (H_sol;m)"
              className="pt-3"
            >
              <MonthlyRadiationTable
                data={appstate.climatedata}
                climatezone={appstate.meta.climate}
              />
            </Tab>
            <Tab
              eventKey={2}
              title="Factores de reducción por sombras móviles (f_sh;with)"
              className="pt-3"
            >
              <ShadingFactorsTable
                data={appstate.climatedata}
                climatezone={appstate.meta.climate}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
      {/* <DevTools position={{ bottom: 0, right: 20 }} /> */}
      <Footer />
    </Container>
  );
});

export default ClimatePage;
