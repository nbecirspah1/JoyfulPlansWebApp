// CreateTaskForm.js
import React, { useState } from 'react';
import { Button, Form, Modal, Container } from 'react-bootstrap';
import moment from 'moment';
import TaskItem from './TaskItem';
import { addT,addSub, uploadTask } from '../services/authService';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateTaskForm({ showModal, closeModal, addTask, importantTasks }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [important, setImportant] = useState(false);
  const [taskImage, setTaskImage] = useState(null); // new
  const [taskId, setTaskId] = useState(564); // new
  const [subtasks, setSubtasks] = useState([]);
  const[subtasksData,setSubtasksData]=useState([]);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [taskCategory, setTaskCategory] = useState('');
  const handleTaskCategoryChange = (e) => {
    setTaskCategory(e.target.value);
  };
  
  const closeSubtaskModal = () => {
    setShowSubtaskModal(false);
  };
  
  
  const addSubtask = (subtask) => {
    if (subtasks.length >= 10) {
      alert('Dostigli ste maksimalan broj podzadataka za ovaj glavni zadatak.');
      return;
    }
  
    setSubtasks((prevSubtasks) => [...prevSubtasks, subtask]);
    let taskData={
      task_name: subtask.name,
      description:subtask.description,
      done: subtask.done
    };
    setSubtasksData((prevSubtasks)=>[...prevSubtasks, taskData]);
  };
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
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

  const handleSubmit =async () => {
    if (taskTitle.trim() === '') {
     toast.error('Unesite naslov zadatka',
     {
      position: toast.POSITION.TOP_CENTER,
    });
      return;
    }

    if (taskDescription.trim() === '') {
     toast.error('Unesite opis zadatka',
     {
      position: toast.POSITION.TOP_CENTER,
    });
      return;
    }

    const today = moment().startOf('day');
    const selectedDate = moment(taskDate);
    if (!selectedDate.isValid()) {
      toast.error('Unesite ispravan datum',{
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (selectedDate.isBefore(today)) {
      toast.error('Unesite datum koji nije prošao',{
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (taskCategory === '') {
      toast.error('Odaberite kategoriju zadatka',{
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    const newTask = {
      id: taskId,
      title: taskTitle,
      date: taskDate,
      description: taskDescription,
      image: taskImage,
      completed: false,
      important: important,
      category: taskCategory, // Dodajemo kategoriju zadatka
      subtasks: subtasks,
    };
    console.log('Novi zadatak:', newTask);
    console.log( subtasksData);
    try {
      const task={
        task_name: newTask.title,
        description: newTask.description,
        deadline: newTask.date,
        category:newTask.category,
        important:newTask.important,
        audio_duration:0
      };
      const response = await addT(task);
      console.log('Odgovor sa servera:', response.data);
      if (taskImage) {
        const responseImage = await uploadTask(response.data.task_id, taskImage);
        console.log('Odgovor sa servera za sliku:', responseImage.data);
      }
      const response1=await addSub(response.data.task_id,subtasksData);
     console.log('Odgovor sa servera:', response1.data);
    } catch (error) {
      console.error('Greška prilikom dodavanja zadatka:', error);
      // Ovdje možete dodati logiku za obradu greške
    }
    addTask(newTask);
    resetForm();
    closeModal();
    setTaskId(taskId + 1);
    setSubtasks([]);
    setTaskCategory('');

  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDate('');
    setTaskDescription('');
    setImportant(false);
    setTaskImage(null);
    setSubtasks([]);
    setTaskCategory('');
  };

  const handleModalHide = () => {
    resetForm();
    closeModal();
  };

  return (
    <Container>
    <Modal show={showModal} onHide={handleModalHide}>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj novi zadatak</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="taskTitle">
            <Form.Label>Naslov zadatka</Form.Label>
            <Form.Control type="text" value={taskTitle} onChange={handleTaskTitleChange} />
          </Form.Group>
          <Form.Group controlId="taskDate">
            <Form.Label>Rok za izradu zadatka</Form.Label>
            <Form.Control type="date" value={taskDate} onChange={handleTaskDateChange} />
          </Form.Group>
          <Form.Group controlId="taskDescription">
            <Form.Label>Opis zadatka</Form.Label>
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
          <Form.Group controlId="taskCategory">
  <Form.Label>Kategorija zadatka</Form.Label>
  <Form.Select value={taskCategory} onChange={handleTaskCategoryChange}>
    <option value="">Odaberi kategoriju</option>
    <option value="Kuća">Kuća</option>
    <option value="Škola">Škola</option>
    <option value="Higijena">Higijena</option>
  </Form.Select>
</Form.Group>
          <Form.Group controlId="important">
            <Form.Check
              type="checkbox"
              label="Označi kao bitan zadatak"
              checked={important}
              onChange={handleImportantChange}
            />
          </Form.Group>
          <Form.Group controlId='subtask'>
           <TaskItem addSubtask={addSubtask} closeModal={closeSubtaskModal} openSubtaskModal={showSubtaskModal} />
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
    </Container>
  );
}

export default CreateTaskForm;