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
import { observer } from "mobx-react";

import { PageWithIndicators } from "../ui/PageWithIndicators";
import { ProjectData } from "./ProjectData";
import { HulcImport } from "./HulcImport";
import { EmptyModel } from "./EmptyModel";
import { LoadData } from "./LoadData";

export const ProjectPage = observer(({ route, activeKey, setActiveKey }) => {
  return (
    <PageWithIndicators route={route}>
      <Row className="well">
        <Col>
          <Tabs activeKey={activeKey} onSelect={setActiveKey} id="project_tabs">
            <Tab eventKey="metadata" title="Datos generales" className="pt-3">
              <ProjectData />
            </Tab>
            <Tab eventKey="load" title="Cargar datos" className="pt-3">
              <LoadData />
            </Tab>
            <Tab
              eventKey="hulc_import"
              title="Importar desde HULC"
              className="pt-3"
            >
              <HulcImport />
            </Tab>
            <Tab eventKey="clear" title="Vaciar modelo" className="pt-3">
              <EmptyModel />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </PageWithIndicators>
  );
});
