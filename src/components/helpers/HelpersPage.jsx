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

import React, { useContext } from "react";
import { Col, Row, Tabs, Tab } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import { Page } from "../ui/Page";
import { HuecosParams } from "./WindowProperties";
import MonthlyRadiationTable from "./MonthlyRadiationTable";
import ShadingFactorsTable from "./ShadingFactorsTable";
import { OrientacionesSprite } from "./IconsOrientaciones";
import { FshwithSprite } from "./IconsFshwith";
import {BoundaryWallResistance} from "./BoundaryWall";

const HelpersPage = observer(({ route, activeKey, setActiveKey }) => {
  const appstate = useContext(AppState);
  return (
    <Page route={route}>
      <OrientacionesSprite />
      <FshwithSprite />
      <Row>
        <Col>
          <Tabs activeKey={activeKey} onSelect={setActiveKey} id="helpers_tab">
            <Tab eventKey="winproperties" title="Medianeras" className="pt-3">
              <BoundaryWallResistance />
            </Tab>
            <Tab eventKey="boundarywallresistance" title="Huecos" className="pt-3">
              <HuecosParams />
            </Tab>
            <Tab
              eventKey="radiation"
              title="Radiación acumulada"
              className="pt-3"
            >
              <MonthlyRadiationTable
                data={appstate.climatedata}
                climatezone={appstate.meta.climate}
              />
            </Tab>
            <Tab
              eventKey="fshwith"
              title="Factores de reducción por sombras"
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
    </Page>
  );
});

export default HelpersPage;
