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

import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Modal, Button, Col, Container, Row } from "react-bootstrap";

import { AgTable } from "../tables/AgTable.jsx";
import { optionalNumberFmt } from "../tables/Formatters.jsx";

// Editor de horario diario (valores horarios)
// Recibe la lista de valores horarios [f32, ...]
export const ScheduleHoursEditor = memo(
  forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value);

    // Editing state
    const [skipChanges, setSkipChanges] = useState(true);
    const [done, setDone] = useState(false);
    useEffect(() => {
      if (done) props.stopEditing();
    }, [done]);
    // Component Editor Lifecycle methods
    useImperativeHandle(ref, () => ({
      getValue: () => value,
      isCancelAfterEnd: () => {
        return skipChanges ? true : false;
      },
    }));

    // Lista de valores horarios
    const hourValues = (value || []).map((p, idx) => ({
      id: idx + 1,
      value: p,
    }));

    const handleClose = () => {
      setValue(hourValues.map((p) => p.value));
      setSkipChanges(false);
      setDone(true);
    };

    const handleCancel = () => {
      setSkipChanges(true);
      setDone(true);
    };

    return (
      <Modal
        role="dialog"
        show={!done}
        centered
        size="lg"
        onHide={() => handleCancel()}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Definición de valores horarios ({props.value.name})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <ScheduleHoursTable hours={hourValues} />
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
  })
);

// Tabla con valores horarios
const ScheduleHoursTable = ({ hours }) => {
  const columnDefs = [
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Hora",
      field: "hora",
      cellDataType: "text",
      // isDummyField: true,
      editable: false,
      cellClass: "column-computed-readonly text-center",
      valueFormatter: ({ data }) => data.id,
      headerTooltip: "Hora para la que se define el valor horario.",
      headerClass: "text-light bg-secondary text-center",
    },
    {
      headerName: "valor",
      field: "value",
      cellDataType: "number",
      valueFormatter: optionalNumberFmt,
      cellClass: "text-center",
      headerTooltip: "Valor que toma el horario en esta hora",
      headerClass: "text-light bg-secondary text-center",
    },
  ];

  return (
    <Row id="schedule_hours_edit_table">
      <Col>
        <label htmlFor="schedule_hours_edit_table">Horario:</label>
        <AgTable
          rowData={hours}
          columnDefs={columnDefs}
          // selectedIds={selectedIds}
          // setSelectedIds={setSelectedIds}
        />
      </Col>
    </Row>
  );
};
