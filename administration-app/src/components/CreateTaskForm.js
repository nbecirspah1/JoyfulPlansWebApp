import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import moment from 'moment';

function CreateTaskForm({ showModal, closeModal, addTask,importantTasks }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [important, setImportant] = useState(false);
  const [taskImage, setTaskImage] = useState(null); // novo


  
  const handleImageChange = (event) => {
    const file = event.target.files[0];          // novo
    setTaskImage(file);
  };
  const handleTaskTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleTaskDateChange = (e) => {
    setTaskDate(e.target.value);
  };

  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleImportantChange = () => {
    setImportant(!important);
  };


  const handleSubmit = () => {
     // Provjera unosa naslova zadatka
  if (taskTitle.trim() === '') {
    alert('Unesite naslov zadatka');
    return;
  }
   // Provjera unosa opisa zadatka
   if (taskDescription.trim() === '') {
    alert('Unesite opis zadatka');
    return;
  }
  const today = moment().startOf('day');
  const selectedDate = moment(taskDate);
  if (!selectedDate.isValid()) {
    alert('Unesite ispravan datum');
    return;
  }

  if (selectedDate.isBefore(today)) {
    alert('Unesite datum koji nije prošao');
    return;
  }
    const newTask = {
      title: taskTitle,
      date: taskDate,
      description: taskDescription,
      image:taskImage
    };

    addTask(newTask, important,importantTasks);
    resetForm();
    closeModal();
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDate('');
    setTaskDescription('');
    setImportant(false);
    setTaskImage(null);
  };

  const handleModalHide = () => {
    resetForm();
    closeModal();
  };

  return (
    <Modal show={showModal} onHide={handleModalHide}>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj novi zadatak</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="taskTitle">
            <Form.Label>Naslov zadatka </Form.Label>
            <Form.Control type="text" value={taskTitle} onChange={handleTaskTitleChange} />
          </Form.Group>
          <Form.Group controlId="taskDate">
            <Form.Label>Rok za izradu zadatka </Form.Label>
            <Form.Control type="date" value={taskDate} onChange={handleTaskDateChange} />
          </Form.Group>
          <Form.Group controlId="taskDescription">
            <Form.Label>Opis zadatka </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={taskDescription}
              onChange={handleTaskDescriptionChange}
            />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Slika</Form.Label>            
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
               </Form.Group>

          <Form.Group controlId="important">
            <Form.Check
              type="checkbox"
              label="Označi kao bitan zadatak"
              checked={important}
              onChange={handleImportantChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalHide}>
          Nazad
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Dodaj zadatak
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateTaskForm;
