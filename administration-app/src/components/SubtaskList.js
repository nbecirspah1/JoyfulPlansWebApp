import React from 'react';
import { Button } from 'react-bootstrap';

function SubtaskList({ subtasks, toggleSubtaskCompletion, deleteSubtask }) {
  return (
    <ul>
      {subtasks.map((subtask, index) => (
        <li key={index}>
          {subtask.title}
          <Button
            variant={subtask.completed ? 'success' : 'primary'}
            onClick={() => toggleSubtaskCompletion(index)}
          >
            {subtask.completed ? 'Urađen' : 'Nije urađen'}
          </Button>{' '}
          <Button variant="danger" onClick={() => deleteSubtask(index)}>
            Obriši podzadatak
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default SubtaskList;
