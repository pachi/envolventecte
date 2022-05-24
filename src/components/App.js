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
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap-theme.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import AboutPage from "./about/AboutPage";
import { BuildingPage } from "./building/BuildingPage";
import ConsPage from "./constructions/ConsPage";
import ThreeDPage from "./three/ThreeDPage";
import HelpersPage from "./helpers/HelpersPage";
import HelpPage from "./help/HelpPage";
import MainPage from "./main/MainPage";
import ReportsPage from "./reports/ReportsPage";
import { ProjectPage } from "./project/ProjectPage";

export const App = () => {
  const [buildingActiveKey, setBuildingActiveKey] = useState("spaces");
  const [consActiveKey, setConsActiveKey] = useState("wallcons");
  const [reportActiveKey, setReportActiveKey] = useState("he1");

  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route exact path="/project" element={<ProjectPage />} />
        <Route
          exact
          path="/elements"
          element={
            <BuildingPage
              activeKey={buildingActiveKey}
              setActiveKey={setBuildingActiveKey}
            />
          }
        />
        <Route
          exact
          path="/constructions"
          element={
            <ConsPage
              activeKey={consActiveKey}
              setActiveKey={setConsActiveKey}
            />
          }
        />
        <Route exact path="/3d" element={<ThreeDPage />} />
        <Route
          exact
          path="/reports"
          element={
            <ReportsPage
              activeKey={reportActiveKey}
              setActiveKey={setReportActiveKey}
            />
          }
        />
        <Route exact path="/helpers" element={<HelpersPage />} />
        <Route exact path="/help" element={<HelpPage />} />
        <Route exact path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
