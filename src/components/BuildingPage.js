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

import React from "react";
import { Col, Container, Row, Tabs, Tab } from "react-bootstrap";
import { observer } from "mobx-react-lite";
// import DevTools from 'mobx-react-devtools';

import Footer from "./Footer";
import HuecosView from "./building/HuecosView";
import IndicatorsPanel from "./building/IndicatorsPanel";
import MetaParams from "./building/MetaParams";
import NavBar from "./Nav";
import OpacosView from "./building/OpacosView";
import PTsView from "./building/PTsView";
import ShadesView from "./building/ShadesView";
import SpacesView from "./building/SpacesView";
import ThreeView from "./three/ThreeView";
import WallConsView from "./building/WallConsView";
import WinConsView from "./building/WinConsView";

const BuildingPage = ({ route }) => (
  <Container fluid>
    <NavBar route={route} />
    <Row>
      <Col>
        <IndicatorsPanel />
      </Col>
    </Row>
    <Row>
      <Col>
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Espacios" className="pt-3">
            <SpacesView />
          </Tab>
          <Tab eventKey={2} title="Opacos" className="pt-3">
            <OpacosView />
          </Tab>
          <Tab eventKey={3} title="Huecos" className="pt-3">
            <HuecosView />
          </Tab>
          <Tab eventKey={4} title="Sombras" className="pt-3">
            <ShadesView />
          </Tab>
          <Tab eventKey={5} title="Puentes Térmicos" className="pt-3">
            <PTsView />
          </Tab>
          <Tab eventKey={6} title="Constr. opacos" className="pt-3">
            <WallConsView />
          </Tab>
          <Tab eventKey={7} title="Constr. huecos" className="pt-3">
            <WinConsView />
          </Tab>
          <Tab eventKey={8} title="Datos generales" className="pt-3">
            <MetaParams />
          </Tab>
          <Tab eventKey={9} title="Vista" className="pt-3">
            <ThreeView />
          </Tab>
        </Tabs>
      </Col>
    </Row>
    {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
    <Footer />
  </Container>
);

export default observer(BuildingPage);
