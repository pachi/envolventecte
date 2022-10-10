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
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { uuidv4 } from "../../utils";

import {
  Float0DigitsFmt,
  getFloatOrOld,
  NameFromIdFmt,
} from "../building/TableHelpers";
import { ListEditor } from "../ui/ListEditor";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
// Editor de horarios anuales
// Recibe la lista de tuplas de horario mensual y repeticiones [[uuid, f32], ...]
export const ScheduleCountsEditor = React.forwardRef(
  ({ onUpdate, value, name, idMap, scheduleOpts }, _ref) => {
    const [show, setShow] = useState(true);
    // Lista de tuplas de [id_horario, repeticiones]
    const [yearSchedules, setYearSchedules] = useState(
      (value || []).map((p) => ({
        id: uuidv4(),
        schedule_id: p[0],
        count: p[1],
      }))
    );

    const updateData = () =>
      onUpdate(yearSchedules.map((p) => [p.schedule_id, p.count]));

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
          <Modal.Title>Definición de horario ({name})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <ScheduleListTable
              schedule={yearSchedules}
              setSchedule={setYearSchedules}
              idMap={idMap}
              scheduleOpts={scheduleOpts}
            />
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

// Tabla con horarios mensuales y repeticiones
const ScheduleListTable = ({ schedule, setSchedule, idMap, scheduleOpts }) => {
  // Filas seleccionadas
  const [selected, setSelected] = useState([]);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "schedule_id",
      text: "Horario semanal",
      align: "center",
      headerTitle: (_col, _colIndex) => "Horario semanal",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      formatter: NameFromIdFmt,
      formatExtraData: idMap,
      editor: {
        type: Type.SELECT,
        options: scheduleOpts,
      },
    },
    {
      dataField: "count",
      formatter: Float0DigitsFmt,
      text: "Repeticiones",
      align: "center",
      headerTitle: (_col, _colIndex) =>
        "Número de veces que se repite el horario en la semana",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
    },
  ];

  const newSchedule = () => ({ id: uuidv4(), schedule_id: "", count: 1 });

  return (
    <Row id="sched_edit_table">
      <Col>
        <label htmlFor="sched_edit_table">Horario:</label>
        <ListEditor
          list={schedule}
          setList={setSchedule}
          newElement={newSchedule}
          selectedIds={selected}
          setSelectedIds={setSelected}
        />
        <BootstrapTable
          data={schedule}
          keyField="id"
          striped
          hover
          bordered={false}
          cellEdit={cellEditFactory({
            mode: "dbclick",
            blurToSave: true,
            afterSaveCell: (oldValue, newValue, row, column) => {
              // Convierte a número campos numéricos
              if (["count"].includes(column.dataField)) {
                row[column.dataField] = getFloatOrOld(newValue, oldValue);
              }
            },
          })}
          selectRow={{
            mode: "checkbox",
            clickToSelect: true,
            clickToEdit: true,
            selected: selected,
            onSelect: (row, isSelected, _rowIndex, _e) => {
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
