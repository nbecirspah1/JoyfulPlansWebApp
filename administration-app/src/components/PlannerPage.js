import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card,Modal, Nav  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';
import 'moment/locale/bs'; // Uvoz lokalizacije za bosanski jezik
import CreateTaskForm from './CreateTaskForm';
import './PlannerPage.css';
import TaskItem from './TaskItem';


function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentDate, setCurrentDate] = useState('');
  const [importantTasks, setImportantTasks] = useState([]);

  useEffect(() => {
    const today = moment().locale('bs');
    const formattedDate = today.format('LL, dddd');
    setCurrentDate(formattedDate);
  }, []);


  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
  };

  const addTask = (task,important) => {
    setTasks([...tasks, task]);
  if (important) {
    setImportantTasks([...importantTasks, task]);
  }
  closeCreateForm();
  };
  const deleteTaskFromLists = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  
    const updatedImportantTasks = importantTasks.filter(
      (task, i) => i !== index
    );
    setImportantTasks(updatedImportantTasks);
  };
  
  const deleteTask = (index) => {
    deleteTaskFromLists(index);
  };

  const filterTasks = (status) => {
    setActiveTab(status);
  };

  const filteredTasks = () => {
    switch (activeTab) {
      case 'today':
        return tasks.filter((task) => task.status === 'today');
      case 'important':
        return [...importantTasks, ...tasks.filter((task) => task.status === 'important')];
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'uncompleted':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  
  };
  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    if (tasks[index].important) {
      const updatedImportantTasks = [...importantTasks];
      updatedImportantTasks[index].completed = !updatedImportantTasks[index].completed;
      setImportantTasks(updatedImportantTasks);
    }
  };
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h3>RODITELJSKI PLANER</h3>
        </Col>
        <Col className="text-end">
          <h4>{currentDate}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={openCreateForm}>KREIRAJ ZADATAK</Button>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <Nav fill variant="tabs" activeKey={activeTab} onSelect={filterTasks}>
            <Nav.Item>
              <Nav.Link eventKey="all">Svi zadaci</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="today">Današnji zadaci</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="important">Bitni zadaci</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="completed">Urađeni zadaci</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="uncompleted">Neurađeni zadaci</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          {filteredTasks().length > 0 ? (
            <ul className="list-group">
               <div style={{ marginTop: '10px' }}></div>
              {filteredTasks().map((task, index) => (
                 <li key={index} className="taskItem">
                 <Card key={index}>
                 <Card.Body>
                   <Card.Title>{task.title}</Card.Title>
                   <Card.Text>{task.description}</Card.Text>
                   <Card.Text>Date: {task.date}</Card.Text>
                   <Button
                     variant={task.completed ? 'success' : 'primary'}
                     onClick={() => toggleCompletion(index)}
                   >
                     {task.completed ? 'Urađen' : 'Nije Urađen'}
                   </Button>{' '}
                   <Button variant="danger" onClick={() => deleteTask(index)}>
                     Obriši zadatak 
                   </Button>
                 </Card.Body>
               </Card>
               </li>
              ))}
            </ul>
          ) : (
            <p>Nema zadataka za prikaz.</p>
          )}
        </Col>
      </Row>

      <CreateTaskForm showModal={showCreateForm} closeModal={closeCreateForm} addTask={addTask} />
    </Container>
  );
}

export default PlannerPage;

