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
import IndicatorsPanel from "../indicators/IndicatorsPanel";
import NavBar from "../ui/Nav";
import WallConsView from "./WallConsView";
import WinConsView from "./WinConsView";

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
            id="constructions_tabs"
          >
            <Tab eventKey="wallcons" title="Cons. opacos" className="pt-3">
              <WallConsView />
            </Tab>
            <Tab eventKey="windowcons" title="Cons. huecos" className="pt-3">
              <WinConsView />
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
