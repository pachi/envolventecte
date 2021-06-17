/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

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
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { PositionEditor } from "./GeometryOpaquesEditor";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de datos geométricos de huecos
// Recibe la geometría de un hueco {position: [f32, f32], height: f32, width: f32, setback: f32}
// No se comprueba la coherencia de la definición geométrica con la superficie
export const GeometryWindowEditor = React.forwardRef(
  ({ onUpdate, value, ...rest }, ref) => {
    const posIsNull = value.position === null || value.position.length === 0;
    let x = 0.0,
      y = 0.0;
    if (!posIsNull) {
      x = value.position[0];
      y = value.position[1];
    }
    const [isNull, setIsNull] = useState(posIsNull);
    const [show, setShow] = useState(true);
    // Posición
    const [xPos, setXPos] = useState(x);
    const [yPos, setYPos] = useState(y);

    // Propiedades del hueco
    const [width, setWidth] = useState(value.width);
    const [height, setHeight] = useState(value.height);
    const [setback, setSetback] = useState(value.setback);

    const updateData = () => {
      if (isNull) {
        return onUpdate({
          width: parseFloat(width),
          height: parseFloat(height),
          setback: parseFloat(setback),
          position: null,
        });
      } else {
        return onUpdate({
          width: parseFloat(width),
          height: parseFloat(height),
          setback: parseFloat(setback),
          position: [parseFloat(xPos), parseFloat(yPos)],
        });
      }
    };

    const handleClose = () => {
      setShow(false);
      updateData();
    };

    const handleCancel = () => {
      setShow(false);
      return onUpdate(value);
    };

    return (
      <Modal
        role="dialog"
        show={show}
        centered
        size="lg"
        onHide={() => handleCancel()} // Evitar enviar acciones a la tabla posterior
      >
        <Modal.Header closeButton>
          <Modal.Title>Definición geométrica del hueco</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WidthHeightSetbackEditor
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            setback={setback}
            setSetback={setSetback}
          />
          <PositionEditor
            isNull={isNull}
            setIsNull={setIsNull}
            xPos={xPos}
            setXPos={setXPos}
            yPos={yPos}
            setYPos={setYPos}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

const WidthHeightSetbackEditor = ({
  width,
  setWidth,
  height,
  setHeight,
  setback,
  setSetback,
}) => {
  return (
    <>
      <Row>
        <Form.Label as={Col} htmlFor="width">
          Ancho [m]:
        </Form.Label>
        <Col>
          <input
            id="width"
            className="form-control editor edit-text"
            type="text"
            size="7"
            value={width}
            onChange={(ev) => {
              setWidth(ev.currentTarget.value.replace(",", "."));
            }}
          />
        </Col>
      </Row>
      <Row>
        <Form.Label as={Col} htmlFor="height">
          Alto [m]:
        </Form.Label>
        <Col>
          <input
            id="height"
            className="form-control editor edit-text"
            type="text"
            size="7"
            value={height}
            onChange={(ev) => {
              setHeight(ev.currentTarget.value.replace(",", "."));
            }}
          />
        </Col>
      </Row>
      <Row>
        <Form.Label as={Col} htmlFor="setback">
          Retranqueo [m]:
        </Form.Label>
        <Col>
          <input
            id="setback"
            className="form-control editor edit-text"
            type="text"
            size="7"
            value={setback}
            onChange={(ev) => {
              setSetback(ev.currentTarget.value.replace(",", "."));
            }}
          />
        </Col>
      </Row>
    </>
  );
};
