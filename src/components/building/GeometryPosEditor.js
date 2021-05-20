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

import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, ButtonGroup, ToggleButton } from "react-bootstrap";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de datos geométricos de elementos opacos y sombras
// Recibe la posición de un elemento geometry {azimuth: f32, tilt: f32, position: [f32, f32, f32], polygon: [[f32, f32], ...]}
// Puede devolver una lista de coordenadas [x, y, z] o undefined
// El valor de undefined tiene que corregirse a posteriori para usar null
// No podemos devolver null porque es el valor que usan los editores para marcar que se cancela la edición
export const GeometryPosEditor = React.forwardRef(
  ({ onUpdate, value, ...rest }, ref) => {
    const posIsNull = value == null || value.length === 0;
    let x = 0.0,
      y = 0.0,
      z = 0.0;
    if (!posIsNull) {
      x = value[0];
      y = value[1];
      z = value[2];
    }
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isNull, setIsNull] = useState(posIsNull);
    const [show, setShow] = useState(true);
    const [xPos, setXPos] = useState(x);
    const [yPos, setYPos] = useState(y);
    const [zPos, setZPos] = useState(z);
    const inputXRef = useRef(null);
    const inputYRef = useRef(null);
    const inputZRef = useRef(null);

    useEffect(() => {
      if (isFirstRender) {
        inputXRef.current.focus();
        setIsFirstRender(false);
      }
    }, [isFirstRender]);

    const updateData = () => {
      if (isNull) {
        // NOTE: al acabar de editar es necesario convertir el valor dado aquí por null en afterSaveCell
        // NOTE: no podemos usar null directamente porque se usa para indicar la cancelación de la edición
        return onUpdate(undefined);
      } else {
        return onUpdate([parseFloat(xPos), parseFloat(yPos), parseFloat(zPos)]);
      }
    };

    const handleClose = () => {
      setShow(false);
      updateData();
    };

    return (
      <Modal role="dialog" show={show} centered onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Posición del elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ButtonGroup toggle className="mb-2">
            <ToggleButton
              type="radio"
              variant="secondary"
              name="nullPos"
              value="isNull"
              checked={isNull}
              onChange={(e) => setIsNull(e.currentTarget.checked)}
            >
              Sin posición definida
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="secondary"
              name="validPos"
              value="notNull"
              checked={!isNull}
              onChange={(e) => setIsNull(!e.currentTarget.checked)}
            >
              Posición definida por coordenadas
            </ToggleButton>
          </ButtonGroup>
          <div hidden={isNull}>
            <label htmlFor="xInput">X:</label>
            <input
              ref={inputXRef}
              id="xInput"
              className={
                (rest.editorClass || "") + " form-control editor edit-text"
              }
              type="text"
              size="7"
              value={xPos}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputYRef.current.focus();
                } else {
                  rest.onKeyDown(e);
                }
              }}
              onChange={(ev) => {
                setXPos(ev.currentTarget.value.replace(",", "."));
              }}
            />
            <label htmlFor="yInput">Y:</label>
            <input
              ref={inputYRef}
              id="yInput"
              className={
                (rest.editorClass || "") + " form-control editor edit-text"
              }
              type="text"
              size="7"
              value={yPos}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputZRef.current.focus();
                } else {
                  rest.onKeyDown(e);
                }
              }}
              onChange={(ev) => {
                setYPos(ev.currentTarget.value.replace(",", "."));
              }}
            />
            <label htmlFor="zInput">Z:</label>
            <input
              ref={inputZRef}
              id="zInput"
              className={
                (rest.editorClass || "") + " form-control editor edit-text"
              }
              type="text"
              size="7"
              value={zPos}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateData();
                } else {
                  rest.onKeyDown(e);
                }
              }}
              onChange={(ev) => {
                setZPos(ev.currentTarget.value.replace(",", "."));
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateData}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
);
