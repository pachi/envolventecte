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

import { observer } from "mobx-react";
import React, { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import AppState from "../stores/AppState.js";

import { Page } from "./ui/Page.jsx";

const JsonDetail = () => {
  const appstate = useContext(AppState);

  return (
    <Page>
      <Row>
        <Col md={6}>
          <h3>Modelo:</h3>
          <pre>{JSON.stringify(appstate.getModel(), undefined, 2)}</pre>
        </Col>
        <Col md={6}>
          <h3>Indicadores energéticos:</h3>
          <pre>{JSON.stringify(appstate.energy_indicators, undefined, 2)}</pre>
        </Col>
      </Row>
    </Page>
  );
};

export default observer(JsonDetail);
