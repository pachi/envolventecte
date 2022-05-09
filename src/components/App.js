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

import React, { useState } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap-theme.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import AboutPage from "./about/AboutPage";
import BuildingPage from "./building/BuildingPage";
import ConsPage from "./constructions/ConsPage";
import ThreeDPage from "./three/ThreeDPage";
import ClimatePage from "./climate/ClimatePage";
import HelpersPage from "./helpers/HelpersPage";
import HelpPage from "./help/HelpPage";
import MainPage from "./main/MainPage";
import ReportsPage from "./reports/ReportsPage";
import { ProjectPage } from "./project/ProjectPage";

const App = () => {
  const [buildingActiveKey, setBuildingActiveKey] = useState("spaces");
  const [consActiveKey, setConsActiveKey] = useState("wallcons");
  const [reportActiveKey, setReportActiveKey] = useState("he1");

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={(props) => <MainPage {...props} />} />
        <Route exact path="/project" component={ProjectPage} />
        <Route
          exact
          path="/elements"
          render={(props) => (
            <BuildingPage
              {...props}
              activeKey={buildingActiveKey}
              setActiveKey={setBuildingActiveKey}
            />
          )}
        />
        <Route
          exact
          path="/constructions"
          render={(props) => (
            <ConsPage
              {...props}
              activeKey={consActiveKey}
              setActiveKey={setConsActiveKey}
            />
          )}
        />
        <Route exact path="/3d" component={ThreeDPage} />
        <Route
          exact
          path="/reports"
          render={(props) => (
            <ReportsPage
              {...props}
              activeKey={reportActiveKey}
              setActiveKey={setReportActiveKey}
            />
          )}
        />
        <Route exact path="/climate" component={ClimatePage} />
        <Route exact path="/helpers" component={HelpersPage} />
        <Route exact path="/help" render={(props) => <HelpPage {...props} />} />
        <Route exact path="/about" component={AboutPage} />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </HashRouter>
  );
};

export default App;
