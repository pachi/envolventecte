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

import React, { useState, useRef } from "react";
import {
  Modal,
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Row,
  ToggleButton,
  ButtonToolbar,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import iconplus from "../img/baseline-add-24px.svg";
import iconless from "../img/baseline-remove-24px.svg";
import iconselectall from "../img/select-rows.svg";
import iconselectnone from "../img/unselect-rows.svg";
import iconduplicate from "../img/outline-file_copy-24px.svg";
import { uuidv4 } from "../../utils";

import {
  AzimuthFmt,
  Float2DigitsFmt,
  getFloatOrOld,
  TiltFmt,
} from "./TableHelpers";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de datos geométricos de opacos
// Recibe la geometría de un opaco {tilt: f32, azimuth: f32, position: null | [f32, f32, f32], polygon: [[f32, f32], ...]}
// No se comprueba la coherencia de la definición geométrica con la superficie
export const GeometryOpaquesEditor = React.forwardRef(
  ({ onUpdate, value }, ref) => {
    const posIsNull = value.position === null || value.position.length === 0;
    let x = 0.0,
      y = 0.0,
      z = 0.0;
    if (!posIsNull) {
      x = value.position[0];
      y = value.position[1];
      z = value.position[2];
    }
    const [isNull, setIsNull] = useState(posIsNull);
    const [show, setShow] = useState(true);
    // Posición
    const [xPos, setXPos] = useState(x);
    const [yPos, setYPos] = useState(y);
    const [zPos, setZPos] = useState(z);
    // Lista de puntos 2D del polígono como objetos
    const [poly, setPoly] = useState(
      (value.polygon || []).map((p) => ({ id: uuidv4(), X: p[0], Y: p[1] }))
    );

    const [azimuth, setAzimuth] = useState(value.azimuth);
    const [tilt, setTilt] = useState(value.tilt);

    const updateData = () => {
      const position = isNull
        ? null
        : [parseFloat(xPos), parseFloat(yPos), parseFloat(zPos)];
      const polygon = poly.map((p) => [p.X, p.Y]);
      return onUpdate({
        azimuth: parseFloat(azimuth),
        tilt: parseFloat(tilt),
        position,
        polygon,
      });
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
        onHide={() => handleCancel()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Definición geométrica de opaco o sombra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <AzimuthTiltEditor
              azimuth={azimuth}
              setAzimuth={setAzimuth}
              tilt={tilt}
              setTilt={setTilt}
            />
            <PositionEditor
              isNull={isNull}
              setIsNull={setIsNull}
              xPos={xPos}
              setXPos={setXPos}
              yPos={yPos}
              setYPos={setYPos}
              zPos={zPos}
              setZPos={setZPos}
            />
            <CoordsTable poly={poly} setPoly={setPoly} />
          </Container>
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

// Editor de Azimuth y Tilt
const AzimuthTiltEditor = ({ azimuth, setAzimuth, tilt, setTilt }) => (
  <>
    <Row>
      <Col>
        <Form.Label htmlFor="azimuth">
          Azimuth, γ [º] [-180,+180] (S=0, E+, W-).
        </Form.Label>
        <Row>
          <Col md={6}>
            <input
              id="azimuth"
              className="form-control editor edit-text"
              type="text"
              size="7"
              title="Azimuth geográfico de la proyección horizontal de la normal a la superficie. Ángulo de desviación de la normal respecto al sur, E+, W+"
              value={azimuth}
              onChange={(ev) => {
                setAzimuth(ev.currentTarget.value.replace(",", "."));
              }}
            />
          </Col>
          <Col style={{ background: "#EEE", color: "gray" }}>
            {AzimuthFmt(azimuth)}
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form.Label htmlFor="tilt">
          Inclinación, β [º] [0-+180] (0=suelo, 180=techo)
        </Form.Label>
        <Row>
          <Col md={6}>
            <input
              id="tilt"
              className="form-control editor edit-text"
              type="text"
              size="7"
              title="Ángulo que forma la normal de la superficie respecto al eje +Z (0 = horizontal hacia arriba, 180 = horizontal hacia abajo)"
              value={tilt}
              onChange={(ev) => {
                setTilt(ev.currentTarget.value.replace(",", "."));
              }}
            />
          </Col>
          <Col style={{ background: "#EEE", color: "gray" }}>
            {TiltFmt(tilt)}
          </Col>
        </Row>
      </Col>
    </Row>
  </>
);

const PositionEditor = ({
  isNull,
  setIsNull,
  xPos,
  setXPos,
  yPos,
  setYPos,
  zPos,
  setZPos,
}) => {
  const inputXRef = useRef(null);
  const inputYRef = useRef(null);
  const inputZRef = useRef(null);
  return (
    <>
      <Row id="position">
        <Col>
          <label htmlFor="position">
            Punto de inserción del elemento (coordenadas globales):
          </label>
          <ButtonGroup toggle className="mb-2 btn-block">
            <ToggleButton
              type="radio"
              variant="secondary"
              name="nullPos"
              checked={isNull}
              onChange={(e) => {
                setIsNull(e.currentTarget.checked);
              }}
              className="col-md-6"
            >
              Sin posición definida
            </ToggleButton>
            <ToggleButton
              type="radio"
              variant="secondary"
              name="validPos"
              checked={!isNull}
              onChange={(e) => setIsNull(!e.currentTarget.checked)}
              className="col-md-6"
            >
              Posición definida por coordenadas
            </ToggleButton>
          </ButtonGroup>
        </Col>
      </Row>
      <Form.Group as={Row} controlId="formControlsPosition">
        <Form.Label as={Col} md={1} htmlFor="xInput" className="mr-3">
          X:
        </Form.Label>
        <Col>
          <Form.Control
            id="xInput"
            ref={inputXRef}
            value={isNull ? "" : xPos}
            readOnly={isNull}
            onChange={(ev) => {
              setXPos(ev.currentTarget.value.replace(",", "."));
            }}
            className="mr-3"
          />
        </Col>
        <Form.Label as={Col} md={1} htmlFor="yInput" className="mr-3">
          Y:
        </Form.Label>
        <Col>
          <Form.Control
            id="yInput"
            ref={inputYRef}
            value={isNull ? "" : yPos}
            readOnly={isNull}
            onChange={(ev) => {
              setYPos(ev.currentTarget.value.replace(",", "."));
            }}
            className="mr-3"
          />
        </Col>
        {zPos === null || zPos === undefined ? null : (
          <>
            <Form.Label as={Col} md={1} htmlFor="zInput" className="mr-3">
              Z:
            </Form.Label>
            <Col>
              <Form.Control
                md="2"
                id="zInput"
                ref={inputZRef}
                value={isNull ? "" : zPos}
                readOnly={isNull}
                onChange={(ev) => {
                  setZPos(ev.currentTarget.value.replace(",", "."));
                }}
                className="mr-3"
              />
            </Col>
          </>
        )}
      </Form.Group>
    </>
  );
};

// Tabla de puentes térmicos del edificio
const CoordsTable = ({ poly, setPoly }) => {
  // Filas de puntos 2D seleccionados
  const [selected, setSelected] = useState([]);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "X",
      formatter: Float2DigitsFmt,
      text: "Coordenada X (coordenadas locales)",
      align: "center",
      headerTitle: (_col, _colIndex) => "Coordenadas locales eje X",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          X
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "Y",
      formatter: Float2DigitsFmt,
      text: "Coordenada Y (coordenadas locales)",
      align: "center",
      headerTitle: (_col, _colIndex) => "Coordenadas locales eje Y",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Y
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <Row id="ctable">
      <Col>
        <label htmlFor="ctable">Polígono:</label>
        <AddRemoveButtonGroup
          poly={poly}
          setPoly={setPoly}
          selected={selected}
          setSelected={setSelected}
        />
        <BootstrapTable
          data={poly}
          keyField="id"
          striped
          hover
          bordered={false}
          cellEdit={cellEditFactory({
            mode: "dbclick",
            blurToSave: true,
            afterSaveCell: (oldValue, newValue, row, column) => {
              // Convierte a número campos numéricos
              if (["X", "Y"].includes(column.dataField)) {
                row[column.dataField] = getFloatOrOld(newValue, oldValue);
              }
            },
          })}
          selectRow={{
            mode: "checkbox",
            clickToSelect: true,
            clickToEdit: true,
            selected: selected,
            onSelect: (row, isSelected, _rowIndex, e) => {
              if (isSelected) {
                setSelected([...selected, row.id]);
              } else {
                setSelected(selected.filter((it) => it !== row.id));
              }
            },
            hideSelectColumn: true,
            bgColor: "lightgray",
          }}
          columns={columns}
        />
      </Col>
    </Row>
  );
};

const AddRemoveButtonGroup = ({ poly, setPoly, selected, setSelected }) => {
  return (
    <ButtonToolbar>
      <ButtonGroup
        className="mr-2"
        aria-label="Barra de modificación de líneas"
      >
        <Button
          variant="primary"
          size="sm"
          title="Añadir una fila al final de la tabla"
          onClick={() => {
            const element = { id: uuidv4(), X: 0.0, Y: 0.0 };
            setPoly([...poly, element]);
            // seleccionamos nuevo elemento recién creado
            setSelected([element.id]);
          }}
        >
          <img src={iconplus} alt="Añadir fila" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Duplicar filas seleccionadas de la tabla"
          onClick={() => {
            const newids = [];
            selected.forEach((id) => {
              const selectedIndex = poly.findIndex((h) => h.id === id);
              if (selectedIndex !== -1) {
                const idx = selectedIndex >= 0 ? selectedIndex : 0;
                const selectedObj = poly[idx];
                const dupObj = {
                  ...selectedObj,
                  id: uuidv4(),
                };
                newids.push(dupObj.id);
                poly.splice(idx + 1, 0, dupObj);
                setPoly(poly);
              }
            });
            // Reseleccionamos lo nuevo
            setSelected(newids);
          }}
        >
          <img src={iconduplicate} alt="Duplicar fila" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Eliminar filas seleccionadas de la tabla"
          onClick={() => {
            if (selected.length > 0) {
              const indices = poly.reduce((acc, cur, idx) => {
                if (selected.includes(cur.id)) {
                  acc.push(idx);
                }
                return acc;
              }, []);
              const minidx = Math.max(0, Math.min(...indices) - 1);
              const newPoly = poly.filter((h) => !selected.includes(h.id));
              // Selecciona el elemento anterior al primero seleccionado salvo que no queden elementos o sea el primero, o nada si no hay elementos
              if (newPoly.length > 0) {
                setSelected([newPoly[minidx].id]);
              } else {
                setSelected([]);
              }
              setPoly(newPoly);
            }
          }}
        >
          <img src={iconless} alt="Eliminar fila" />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Barra de selección y deselección de filas">
        <Button
          variant="primary"
          size="sm"
          title="Seleccionar todas las filas de la tabla"
          onClick={() => {
            setSelected(poly.map((e) => e.id));
          }}
        >
          <img src={iconselectall} alt="Seleccionar todo" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          title="Deseleccionar todas las filas de la tabla"
          onClick={() => {
            setSelected([]);
          }}
        >
          <img src={iconselectnone} alt="Deseleccionar todo" />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};


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
