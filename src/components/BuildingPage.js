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

import React, { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Tabs,
  Tab,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
// import DevTools from 'mobx-react-devtools';

import DownloadUpload from "./DownloadUpload";
import Footer from "./Footer";
import HuecosTable from "./HuecosTable";
import WinConsTable from "./WinConsTable";
import WallConsTable from "./WallConsTable";
import IndicatorsPanel from "./IndicatorsPanel";
import NavBar from "./Nav";
import OpacosTable from "./OpacosTable";
import PTsTable from "./PTsTable";
import SpacesTable from "./SpacesTable";
import MetaParams from "./MetaParams";

const AvisosDisplay = observer(({ appstate }) => {
  const errors = appstate.errors;
  const numavisos = errors.length;
  const [show, setShow] = useState(false);

  return (
    <>
      <Alert show={show} variant="info">
        <Alert.Heading>Avisos</Alert.Heading>
        {errors.map((e, idx) => (
          <Alert variant={e.type.toLowerCase()} key={`AlertId${idx}`}>
            {e.msg}
          </Alert>
        ))}
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => errors.clear()} variant="outline-info">
            Limpiar avisos
          </Button>
          <Button onClick={() => setShow(false)} variant="outline-info">
            Ocultar avisos
          </Button>
        </div>
      </Alert>

      {!show && (
        <div className="d-flex justify-content-end">
          <Button variant="light" onClick={() => setShow(true)}>
            Avisos{" "}
            <Badge variant="primary">
              {numavisos !== 0 ? <span>({numavisos})</span> : null}
            </Badge>
          </Button>
        </div>
      )}
    </>
  );
});

const BuildingPage = ({ appstate, route }) => {
  return (
    <Container fluid>
      <NavBar route={route} />
      <Row>
        <Col>
          <IndicatorsPanel appstate={appstate} />
        </Col>
      </Row>
      <Row>
        <Col>
          <AvisosDisplay appstate={appstate} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Espacios" className="pt-3">
              <SpacesTable appstate={appstate} />
            </Tab>
            <Tab eventKey={2} title="Opacos" className="pt-3">
              <OpacosTable appstate={appstate} />
            </Tab>
            <Tab eventKey={3} title="Huecos" className="pt-3">
              <HuecosTable appstate={appstate} />
            </Tab>
            <Tab eventKey={4} title="Puentes Térmicos" className="pt-3">
              <PTsTable appstate={appstate} />
            </Tab>
            <Tab eventKey={5} title="Construcciones de opacos" className="pt-3">
              <WallConsTable appstate={appstate} />
            </Tab>
            <Tab eventKey={6} title="Construcciones de huecos" className="pt-3">
              <WinConsTable appstate={appstate} />
            </Tab>
            <Tab eventKey={7} title="Datos generales" className="pt-3">
              <MetaParams appstate={appstate} />
            </Tab>
            <Tab
              eventKey={8}
              title="Carga / descarga de datos"
              className="pt-3"
            >
              <DownloadUpload appstate={appstate} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
      {/* {<DevTools position={{ bottom: 0, right: 20 }} />} */}
      <Footer />
    </Container>
  );
};

export default BuildingPage;
