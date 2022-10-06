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

import LoadsView from "./LoadsView";
import { PageWithIndicators } from "../ui/PageWithIndicators";

export const UsesPage = ({ route, activeKey, setActiveKey }) => {
  return (
    <PageWithIndicators route={route}>
      <Row>
        <Col>
          <Tabs
            activeKey={activeKey}
            onSelect={setActiveKey}
            id="building_element_tabs"
          >
            <Tab eventKey="loads" title="Loads" className="pt-3">
              <LoadsView />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </PageWithIndicators>
  );
};
