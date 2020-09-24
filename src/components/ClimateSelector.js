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
import { observer, inject } from "mobx-react";
import { Form, Row, Col } from "react-bootstrap";

const ClimateSelector = inject("appstate")(
  observer(
    class ClimateSelector extends Component {
      render() {
        const appstate = this.props.appstate;
        return (
          <Form.Group as={Row} controlId="formControlsClimateZone">
            <Col as={Form.Label} md={4} style={this.props.labelStyle}>
              Zona Climática
            </Col>
            <Col md={4}>
              <Form.Control
                value={appstate.meta.climate || ""}
                onChange={(e) => {
                  appstate.meta.climate = e.target.value;
                }}
                as="select"
                placeholder="select"
              >
                {appstate.zoneslist.map((z) => (
                  <option value={z} key={"zone_" + z}>
                    {z}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
        );
      }
    }
  )
);

export default ClimateSelector;
