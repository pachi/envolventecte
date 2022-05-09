/* -*- coding: utf-8 -*-

Copyright (c) 2016-2022 Rafael Villar Burke <pachi@rvburke.com>

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
import { Col, Row, Tabs, Tab } from "react-bootstrap";

import WallConsView from "./WallConsView";
import WinConsView from "./WinConsView";
import { PageWithIndicators } from "../ui/PageWithIndicators";
import MaterialsView from "./MaterialsView";
import GlassesView from "./GlassesView";

const ConsPage = ({ route, activeKey, setActiveKey }) => {
  return (
    <PageWithIndicators route={route}>
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
            <Tab eventKey="materials" title="Materiales" className="pt-3">
              <MaterialsView />
            </Tab>
            <Tab eventKey="glasses" title="Vidrios" className="pt-3">
              <GlassesView />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </PageWithIndicators>
  );
};

export default ConsPage;
