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
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isNull, setIsNull] = useState(posIsNull);
    const [show, setShow] = useState(true);
    const [xPos, setXPos] = useState(x);
    const [yPos, setYPos] = useState(y);
    const inputXRef = useRef(null);
    const inputYRef = useRef(null);

    const [width, setWidth] = useState(value.width);
    const [height, setHeight] = useState(value.height);
    const [setback, setSetback] = useState(value.setback);

    useEffect(() => {
      if (isFirstRender) {
        inputXRef.current.focus();
        setIsFirstRender(false);
      }
    }, [isFirstRender]);

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

    return (
      <Modal
        role="dialog"
        show={show}
        centered
        onHide={() => handleClose()} // Evitar enviar acciones a la tabla posterior
      >
        <Modal.Header closeButton>
          <Modal.Title>Definición geométrica del hueco</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor="width">Ancho [m]:</label>
            <input
              id="width"
              className={
                (rest.editorClass || "") + " form-control editor edit-text"
              }
              type="text"
              size="7"
              value={width}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateData();
                } else {
                  rest.onKeyDown(e);
                }
              }}
              onChange={(ev) => {
                setWidth(ev.currentTarget.value.replace(",", "."));
              }}
            />
            <label htmlFor="height">Alto [m]:</label>
            <input
              id="height"
              className={
                (rest.editorClass || "") + " form-control editor edit-text"
              }
              type="text"
              size="7"
              value={height}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateData();
                } else {
                  rest.onKeyDown(e);
                }
              }}
              onChange={(ev) => {
                setHeight(ev.currentTarget.value.replace(",", "."));
              }}
            />
            <label htmlFor="setback">Retranqueo [m]:</label>
            <input
              id="width"
              className={
                (rest.editorClass || "") + " form-control editor edit-text"
              }
              type="text"
              size="7"
              value={setback}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateData();
                } else {
                  rest.onKeyDown(e);
                }
              }}
              onChange={(ev) => {
                setSetback(ev.currentTarget.value.replace(",", "."));
              }}
            />
          </div>
          <div id="position">
            <label htmlFor="position">
              Punto de inserción del hueco (coordenadas de muro):
            </label>
            <ButtonGroup toggle className="mb-2">
              <ToggleButton
                type="radio"
                variant="secondary"
                name="nullPos"
                value="isNull"
                checked={isNull}
                onChange={(e) => {
                  console.log("Pulsado botón de nulo");
                  setIsNull(e.currentTarget.checked);
                }}
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
                    updateData();
                  } else {
                    rest.onKeyDown(e);
                  }
                }}
                onChange={(ev) => {
                  setYPos(ev.currentTarget.value.replace(",", "."));
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateData}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
);
