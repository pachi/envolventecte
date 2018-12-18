/* -*- coding: utf-8 -*-

Copyright (c) 2016-2017 Rafael Villar Burke <pachi@rvburke.com>

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

import React, { Component } from "react";
import { Col, Container, Row, Tabs, Tab } from "react-bootstrap";
// import DevTools from 'mobx-react-devtools';

import DownloadUpload from "./DownloadUpload";
import Footer from "./Footer";
import HuecosTable from "./HuecosTable";
import IndicatorsPanel from "./IndicatorsPanel";
import NavBar from "./Nav";
import OpacosTable from "./OpacosTable";
import PTsTable from "./PTsTable";

class EnvelopePage extends Component {
  render() {
    return (
      <Container fluid>
        <NavBar route={this.props.route} />
        <Row>
          <Col>
          <IndicatorsPanel />
          </Col>
        </Row>
        <Row>
          <Col>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Huecos" className="pt-3">
              <HuecosTable />
            </Tab>
            <Tab eventKey={2} title="Opacos" className="pt-3">
              <OpacosTable />
            </Tab>
            <Tab eventKey={3} title="Puentes Térmicos" className="pt-3">
              <PTsTable />
            </Tab>
            <Tab
              eventKey={4}
              title="Carga / descarga de datos"
              className="pt-3"
            >
              <DownloadUpload />
            </Tab>
          </Tabs>
          </Col>
        </Row>
        {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
        <Footer />
      </Container>
    );
  }
}

export default EnvelopePage;
