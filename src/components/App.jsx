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

import React, { useCallback, useContext, useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react";

import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap-theme.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import GuiState from "../stores/GuiState";

import AboutPage from "./about/AboutPage";
import { BuildingPage } from "./building/BuildingPage";
import { UsesPage } from "./uses/UsesPage";
import ConsPage from "./constructions/ConsPage";
import ThreeDPage from "./three/ThreeDPage";
import HelpersPage from "./helpers/HelpersPage";
import HelpPage from "./help/HelpPage";
import MainPage from "./main/MainPage";
import ReportsPage from "./reports/ReportsPage";
import { ProjectPage } from "./project/ProjectPage";
import JsonDetail from "./JsonDetail";

const App = () => {
  const [projectActiveKey, setProjectActiveKey] = useState("metadata");
  const [buildingActiveKey, setBuildingActiveKey] = useState("spaces");
  const [consActiveKey, setConsActiveKey] = useState("wallcons");
  const [usesActiveKey, setUsesActiveKey] = useState("loads");
  const [reportActiveKey, setReportActiveKey] = useState("he1");
  const [helpersActiveKey, setHelpersActiveKey] = useState("winproperties");

  const guiState = useContext(GuiState);

  // Manejador de teclado para mostrar pestañas con JSON
  // https://stackoverflow.com/questions/55565444/how-to-register-event-with-useeffect-hooks
  const handleUserKeyPress = useCallback((e) => {
    if (e.ctrlKey && e.altKey && e.key === "h") {
      guiState.toggleShowJsonTab();
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route
          exact
          path="/project"
          element={
            <ProjectPage
              activeKey={projectActiveKey}
              setActiveKey={setProjectActiveKey}
            />
          }
        />
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
        <Route
          exact
          path="/uses"
          element={
            <UsesPage
              activeKey={usesActiveKey}
              setActiveKey={setUsesActiveKey}
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
        <Route
          exact
          path="/helpers"
          element={
            <HelpersPage
              activeKey={helpersActiveKey}
              setActiveKey={setHelpersActiveKey}
            />
          }
        />
        {guiState.showJsonTab && (
          <Route exact path="/detail" element={<JsonDetail />} />
        )}
        <Route exact path="/help" element={<HelpPage />} />
        <Route exact path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default observer(App);
