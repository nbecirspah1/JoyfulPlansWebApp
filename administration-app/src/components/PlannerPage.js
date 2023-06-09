import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Nav, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';
import 'moment/locale/bs'; // Uvoz lokalizacije za bosanski jezik
import CreateTaskForm from './CreateTaskForm';
import './PlannerPage.css';
import { logout} from '../services/authService';
import { useNavigate } from 'react-router-dom';
function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentDate, setCurrentDate] = useState('');
  const [importantTasks, setImportantTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [showSubtasksModal, setShowSubtasksModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
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

  const addTask = (task) => {
    setTasks([...tasks, task]);
    if (task.important) {
      setImportantTasks([...importantTasks, task]);
    }
    const today = moment().startOf('day');
    const selectedDate = moment(task.date);
    if (selectedDate.isSame(today, 'day')) {
      setTodayTasks([...todayTasks, task]);
    }

    closeCreateForm();
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    const updatedImportantTasks = importantTasks.filter((task) => task.id !== taskId);
    setImportantTasks(updatedImportantTasks);
    const updatedTodayTasks = todayTasks.filter((task) => task.id !== taskId);
    setTodayTasks(updatedTodayTasks);
  };

  const toggleCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);

    const updatedImportantTasks = importantTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setImportantTasks(updatedImportantTasks);
    const updatedTodayTasks = todayTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTodayTasks(updatedTodayTasks);
  };

  const showSubtasks = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setShowSubtasksModal(true);
  };

  const closeSubtasksModal = () => {
    setSelectedTask(null);
    setShowSubtasksModal(false);
  };

  const filterTasks = (status) => {
    setActiveTab(status);
  };

  const filteredTasks = () => {
    switch (activeTab) {
      case 'today':
        return todayTasks;
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
  const handleLogout = async () => {
		logout().then(res => {
			localStorage.removeItem('token');
			localStorage.removeItem('userId');
			localStorage.clear();
			navigate('/login');
		});
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
          <Button variant="primary" onClick={openCreateForm}>
            KREIRAJ ZADATAK
          </Button>
        </Col>
        <Col className="text-end">
          <Button variant="danger" onClick={handleLogout} >
            Odjavi se
          </Button>
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
              {filteredTasks().map((task) => (
                <li key={task.id} className="taskItem">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <strong>Naslov zadatka:</strong> {task.title}
                      </Card.Title>
                      <Card.Text>
                        <strong>Opis zadatka:</strong> {task.description}
                      </Card.Text>
                      <Card.Text>
                        <strong>Rok za izradu:</strong> (godina, mjesec, dan): {task.date}
                      </Card.Text>
                      <Card.Text>
                        <strong>Kategorija:</strong> {task.category}
                      </Card.Text>
                      <div className="task-image-container">
                        {task.image && (
                          <>
                            <Card.Subtitle>
                              <strong>Slika zadatka:</strong>
                            </Card.Subtitle>
                            <Card.Img src={URL.createObjectURL(task.image)} alt="Slika zadatka" className="task-image" />
                          </>
                        )}
                      </div>
                      <Button
                        variant={task.completed ? 'success' : 'primary'}
                        onClick={() => toggleCompletion(task.id)}
                      >
                        {task.completed ? 'Urađen' : 'Nije Urađen'}
                      </Button>{' '}
                      <Button variant="secondary" onClick={() => showSubtasks(task.id)}>
                        Vidi podzadatke
                        </Button>{' '}
                      <Button variant="danger" onClick={() => deleteTask(task.id)}>
                        Obriši zadatak
                      </Button>{' '}
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

      <Modal show={showSubtasksModal} onHide={closeSubtasksModal}>
        <Modal.Header closeButton>
          <Modal.Title>Podzadaci za {selectedTask && selectedTask.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask &&
            selectedTask.subtasks.map((subtask) => (
              <li key={subtask.id}>
               <Card className='subtaskItem'>
                <Card.Body>
                  <Card.Title>{subtask.title}</Card.Title>
                  <Card.Text>{subtask.description}</Card.Text>
                  <Button
                  variant={subtask.completed ? 'success' : 'danger'}
                  title={subtask.completed ? 'Podzadatak je urađen' : 'Podzadatak nije urađen'}
                 >
               {subtask.completed ? <span>&#x2714;</span> : <span>&#x2716;</span>}
</Button>

                  </Card.Body>
               </Card>
               </li>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeSubtasksModal}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
      <CreateTaskForm showModal={showCreateForm} closeModal={closeCreateForm} addTask={addTask} importantTasks={importantTasks} />
    </Container>
  );
}

export default PlannerPage;
