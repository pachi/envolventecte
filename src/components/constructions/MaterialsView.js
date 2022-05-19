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

import React, { useState, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { observer } from "mobx-react";

import AppState from "../../stores/AppState";

import AddRemoveButtonGroup from "../ui/AddRemoveButtonGroup";
import MaterialsTable from "./MaterialsTable";

// Vista de construcciones de opacos del edificio
const MaterialsView = observer(() => {
  const appstate = useContext(AppState);
  const [selected, setSelected] = useState([]);

  return (
    <Col>
      <Row>
        <Col>
          <h4>
            Materiales de opacos{" "}
            <small className="text-muted">({appstate.cons.materials.length})</small>
          </h4>
        </Col>
        <Col md="auto">
          <AddRemoveButtonGroup
            elementType="materials"
            selectedIds={selected}
            setSelectedIds={setSelected}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <MaterialsTable selectedIds={selected} setSelectedIds={setSelected} />
        </Col>
      </Row>
    </Col>
  );
});

export default MaterialsView;
