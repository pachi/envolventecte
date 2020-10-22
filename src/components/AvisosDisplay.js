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

import React, { useState, useContext } from "react";
import { Alert, Badge, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
// import DevTools from 'mobx-react-devtools';

import AppState from "../stores/AppState";

const AvisosDisplay = () => {
  const appstate = useContext(AppState);
  const [show, setShow] = useState(false);

  const errors = appstate.errors
    .slice()
    .concat(appstate.he1_indicators.warnings);
  const numavisos = errors.length;

  return (
    <>
      <Alert show={show} variant="info">
        <Alert.Heading>Avisos</Alert.Heading>
        {errors.map((e, idx) => (
          <Alert variant={e.level.toLowerCase()} key={`AlertId${idx}`}>
            {e.msg}
          </Alert>
        ))}
        <hr />
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => appstate.errors.clear()}
            variant="outline-info"
          >
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
};

export default observer(AvisosDisplay);
