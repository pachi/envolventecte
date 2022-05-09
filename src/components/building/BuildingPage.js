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
import { observer } from "mobx-react";
// import DevTools from 'mobx-react-devtools';

import Footer from "../ui/Footer";
import NavBar from "../ui/Nav";
import IndicatorsPanel from "../indicators/IndicatorsPanel";
import HuecosView from "./HuecosView";
import MetaParams from "./MetaParams";
import OpacosView from "./OpacosView";
import PTsView from "./PTsView";
import ShadesView from "./ShadesView";
import SpacesView from "./SpacesView";

const BuildingPage = ({ route, activeKey, setActiveKey }) => {
  return (
    <Container fluid>
      <NavBar route={route} />
      <Row>
        <Col>
          <IndicatorsPanel />
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            activeKey={activeKey}
            onSelect={setActiveKey}
            id="building_element_tabs"
          >
            <Tab eventKey="spaces" title="Espacios" className="pt-3">
              <SpacesView />
            </Tab>
            <Tab eventKey="walls" title="Opacos" className="pt-3">
              <OpacosView />
            </Tab>
            <Tab eventKey="windows" title="Huecos" className="pt-3">
              <HuecosView />
            </Tab>
            <Tab eventKey="shadows" title="Sombras" className="pt-3">
              <ShadesView />
            </Tab>
            <Tab
              eventKey="thermal_bridges"
              title="Puentes Térmicos"
              className="pt-3"
            >
              <PTsView />
            </Tab>
            <Tab eventKey="metadata" title="Datos generales" className="pt-3">
              <MetaParams />
            </Tab>
          </Tabs>
        </Col>
      </Row>
      {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
      <Footer />
    </Container>
  );
};

export default observer(BuildingPage);
