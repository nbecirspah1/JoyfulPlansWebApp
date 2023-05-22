import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function SubtaskForm({ addSubtask }) {
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const handleSubtaskTitleChange = (e) => {
    setSubtaskTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subtaskTitle.trim() === '') {
      alert('Unesite naslov podzadatka');
      return;
    }

    const newSubtask = {
      title: subtaskTitle,
      completed: false,
    };

    addSubtask(newSubtask);
    setSubtaskTitle('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="subtaskTitle">
        <Form.Label>Naslov podzadatka</Form.Label>
        <Form.Control type="text" value={subtaskTitle} onChange={handleSubtaskTitleChange} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Dodaj podzadatak
      </Button>
    </Form>
  );
}

export default SubtaskForm;
