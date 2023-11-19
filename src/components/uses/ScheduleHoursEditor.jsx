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

import React, { useState } from "react";
import { Modal, Button, Col, Container, Row } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import { optionalNumberDisplay } from "../tables/Formatters";
import { getFloatOrOld } from "../tables/utils";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de horario diario (valores horarios)
// Recibe la lista de valores horarios [f32, ...]
export const ScheduleHoursEditor = React.forwardRef(
  ({ onUpdate, value, name }, _ref) => {
    const [show, setShow] = useState(true);
    // Lista de valores horarios
    const hourValues = (value || []).map((p, idx) => ({
      id: idx + 1,
      value: p,
    }));

    const updateData = () => {
      const newHourValues = hourValues.map((p) => p.value);
      onUpdate(newHourValues);
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
          <Modal.Title>Definición de valores horarios ({name})</Modal.Title>
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
  }
);

// Tabla con valores horarios
const ScheduleHoursTable = ({ hours }) => {
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "hora",
      text: "Hora",
      isDummyField: true,
      editable: false,
      align: "center",
      classes: "td-column-computed-readonly",
      formatter: (cell, row) => row.id,
      headerTitle: () => "Hora para la que se define el valor horario. ",
      headerStyle: () => ({ width: "10%" }),
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
    {
      dataField: "value",
      formatter: cell => optionalNumberDisplay(cell, 2),
      text: "valor",
      align: "center",
      headerTitle: (_col, _colIndex) =>
        "Valor que toma el horario en esta hora",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
  ];

  return (
    <Row id="schedule_hours_edit_table">
      <Col>
        <label htmlFor="schedule_hours_edit_table">Horario:</label>
        <BootstrapTable
          data={hours}
          keyField="id"
          striped
          hover
          bordered={false}
          cellEdit={cellEditFactory({
            mode: "dbclick",
            blurToSave: true,
            afterSaveCell: (oldValue, newValue, row, column) => {
              // Convierte a número campos numéricos
              row[column.dataField] = getFloatOrOld(newValue, oldValue);
            },
          })}
          columns={columns}
        />
      </Col>
    </Row>
  );
};
