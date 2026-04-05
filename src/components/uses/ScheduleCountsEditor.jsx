/* -*- coding: utf-8 -*-

Copyright (c) 2016-2026 Rafael Villar Burke <pachi@rvburke.com>

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
  useRef,
} from "react";
import { Modal, Button, Col, Container, Row } from "react-bootstrap";

import { uuidv4 } from "../../utils";

import { AgTable } from "../tables/AgTable.jsx";
import { optionalNumberFmt } from "../tables/Formatters.jsx";

import { ListEditor } from "../ui/ListEditor";

// Editor de horarios anuales
// Recibe la lista de tuplas de horario mensual y repeticiones [[uuid, f32], ...]
export const ScheduleCountsEditor = memo(
  forwardRef(({value, stopEditing, onValueChange, idMap}, ref) => {
    const [done, setDone] = useState(false);
    useEffect(() => {
      if (done) stopEditing();
    }, [done]);
    
    // Component Editor Lifecycle methods
    const [skipChanges, setSkipChanges] = useState(true);
    useImperativeHandle(ref, () => ({
      isCancelAfterEnd: () => skipChanges
    }));

    // Lista de tuplas de [id_horario, repeticiones]
    const [yearSchedules, setYearSchedules] = useState(
      (value || []).map((p) => ({
        id: uuidv4(),
        schedule_id: p[0],
        count: p[1],
      }))
    );

    const handleClose = () => {
      onValueChange(yearSchedules.map((p) => [p.schedule_id, p.count]));
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
        onHide={handleCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Definición de horario ({value.name})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <ScheduleListTable
              schedule={yearSchedules}
              setSchedule={setYearSchedules}
              idMap={idMap}
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
  })
);

// Tabla con horarios mensuales y repeticiones
const ScheduleListTable = ({ schedule, setSchedule, idMap }) => {
  const gridRef = useRef(null);

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", hide: true },
    {
      headerName: "Horario semanal",
      field: "schedule_id",
      flex: 2,
      cellDataType: "text",
      cellClass: "text-center",
      headerTooltip: "Horario semanal",
      headerClass: "text-light bg-secondary text-center",
      valueFormatter: ({ value }) => idMap[value] ?? "-",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: Object.keys(idMap) },
      refData: idMap,
    },
    {
      headerName: "Repeticiones",
      field: "count",
      cellDataType: "number",
      valueFormatter: (value) => optionalNumberFmt(value, 0),
      cellClass: "text-center",
      headerTooltip: "Número de veces que se repite el horario en la semana",
      headerClass: "text-light bg-secondary text-center",
    },
  ]);

  const newSchedule = () => ({ id: uuidv4(), schedule_id: "", count: 1 });

  return (
    <Row id="sched_edit_table">
      <Col>
        <label htmlFor="sched_edit_table">Horario:</label>
        <ListEditor
          list={schedule}
          setList={setSchedule}
          newElement={newSchedule}
          gridRef={gridRef}
        />
        <AgTable
          rowData={schedule}
          columnDefs={columnDefs}
          gridRef={gridRef}
        />
      </Col>
    </Row>
  );
};
