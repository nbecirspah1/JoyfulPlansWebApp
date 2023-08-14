import React, { useState, useEffect} from 'react';
import { Container, Row, Col, Button, Card, Nav, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';
import 'moment/locale/bs'; // Uvoz lokalizacije za bosanski jezik
import CreateTaskForm from './CreateTaskForm';
import './PlannerPage.css';
import { logout, getUser,  getTasks,getSub, getToken, deleteT} from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PlannerPage() {
  useEffect(()=>{
    fetchTasks();
  },[]);
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // Dodano stanje za praćenje dovršenosti asinkronih poziva
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentDate, setCurrentDate] = useState('');
  const [importantTasks, setImportantTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [showSubtasksModal, setShowSubtasksModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal]=useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [username, setUsername] = useState('');
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false); /////////////
   // Stanje za praćenje autentifikacije djeteta
   const [isChildLoggedIn, setIsChildLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const today = moment().locale('bs');
    const formattedDate = today.format('LL, dddd');
    setCurrentDate(formattedDate);
  }, []);
  useEffect(() => {
    getUser()
      .then((response) => {
        setUsername(response.data.name);
      })
      .catch((error) => {
        console.error('Error fetching username:', error);
        // Handle the error
      });
      console.log("Poziva se jednom");
  }, []);
 // useEffect za praćenje stanja autentifikacije djeteta
 useEffect(() => {
  getToken()
    .then((response) => {
      const token = response.data;
      if (token) {
        setIsChildLoggedIn(true);
        toast.success('Dijete je uspješno prijavljeno na aplikaciju!', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        setIsChildLoggedIn(false);
        toast.info('Dijete trenutno ne koristi aplikaciju.', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    })
    .catch((error) => {
      console.error('Error fetching token:', error);
      setShowSessionExpiredModal(true);
    });
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

  const deleteTask = async (taskId) => {
    try{
        const response =await deleteT(taskId);
        console.log( response.data);
    }
    catch(error){
      console.log("Error deleting Task", error);
    }
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    const updatedImportantTasks = importantTasks.filter((task) => task.id !== taskId);
    setImportantTasks(updatedImportantTasks);
    const updatedTodayTasks = todayTasks.filter((task) => task.id !== taskId);
    setTodayTasks(updatedTodayTasks);
    setShowDeleteModal(false);
  };

  /* const toggleCompletion = (taskId) => {
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
*/
  const showSubtasks = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setShowSubtasksModal(true);
  };
  const showDeletetask=(taskId)=>{
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setShowDeleteModal(true);
  }

  const closeSubtasksModal = () => {
    setSelectedTask(null);
    setShowSubtasksModal(false);
  };
 const closeDeleteModal=()=>{
  setShowDeleteModal(false);
 }
  const filterTasks = (status) => {
    setActiveTab(status);
  };

  const filteredTasks = () => {
    if (isFetching) {
      return []; // Ako su asinkroni pozivi još uvijek u tijeku, vraćamo prazan niz
    }
    switch (activeTab) {
      case 'today':
        return todayTasks;
      case 'important':
        return [...importantTasks, ...tasks.filter((task) => task.status === 'important')];
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'uncompleted':
        return tasks.filter((task) => !task.completed);
        case 'all':
        return tasks;
      default:
        return tasks;
    }
    
  };
  const fetchSubtasks = async (task) => {
    try {
      const response = await getSub(task.id);
      const subtasksData = response.data.sort((a, b) => a.subtask_id - b.subtask_id);;
      for (let i = 0; i < subtasksData.length; i++) {
        task.subtasks.push(subtasksData[i]);
      }
      let allDone = true;
      for (let i = 0; i < task.subtasks.length; i++) {
        if (task.subtasks[i].done === false) {
          allDone = false;
          break;
        }
      }
      if (allDone) {
        task.completed = true;
      }
      if (task.subtasks.length === 0) {
        task.completed = false;
      }
    
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      return false;
    }
  };
  
  const fetchTasks = async () => {
    try {
      setIsFetching(true);// Postavljamo isFetching na true prije početka asinkronih poziva
      const response = await getTasks();
      const tasksData = response.data;
      const fetchedTasks = []; // Koristimo privremeni niz za pohranu dohvaćenih zadataka
      console.log(tasksData);
      for (let i = 0; i < tasksData.length; i++) {
        var deadline = moment(tasksData[i].deadline).format('YYYY-MM-DD');
        var task = {
          id: tasksData[i].task_id,
          title: tasksData[i].task_name,
          description: tasksData[i].description,
        image:undefined,
          date: deadline,
          category: tasksData[i].category,
          important: tasksData[i].important,
          completed: false,
          subtasks: []
        };
        if(tasksData[i].task_image){
          const base64WithoutPrefix= tasksData[i].task_image.substring(
            tasksData[i].task_image.indexOf(",") + 1
          );
          task.image= `https://drive.google.com/uc?export=view&id=${base64WithoutPrefix}`;
        }
        
        console.log(task);
        await fetchSubtasks(task); // Pričekaj da se dovrši asinkroni poziv
        console.log(task.subtasks.length);
        tasks.push(task);
        fetchedTasks.push(task);// Dodajemo task u privremeni niz
        if (task.important) {
          importantTasks.push(task);
        }
        const today = moment().startOf('day');
        const selectedDate = moment(task.date);
        if (selectedDate.isSame(today, 'day')) {
          todayTasks.push(task);
        }
        console.log(task.completed);
      }
      console.log(tasks);
      setTasks(fetchedTasks); // Postavljamo sve dohvaćene zadatke u stanje
      setIsFetching(false); // Postavljamo isFetching na false nakon što su asinkroni pozivi dovršeni
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
 
  const handleLogout = async () => {
		try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Ako dobijemo 401 Unauthorized, otvaramo prozor "Your session has expired"
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.clear();
        setShowSessionExpiredModal(true);
      } else {
        console.error('Logout error:', error);
        // Obrada drugih grešaka koje nisu vezane za istek sesije
      }
    }
	};
  function isLocalURL(url) {
    if(url instanceof File) return true;
    else 
    return false;
  }
  
  
  return (
    <Container>
      <Row className="my-4">
        <Col>
        <h3>{`Zdravo, ${username}`}</h3>
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
                            <Card.Body>
                            {isLocalURL(task.image) ? (
        <Card.Img src={URL.createObjectURL(task.image)} alt="Slika zadatka" className="task-image" />
      ) : (
        <Card.Img src={task.image} alt="Slika zadatka" className="task-image" />
      )}
                            </Card.Body>
                          </>
                        )}
                      </div>
                      <Button
                        variant={task.completed ? 'success' : 'primary'}
                      //  onClick={() => toggleCompletion(task.id)}
                      >
                        {task.completed ? 'Urađen' : 'Nije Urađen'}
                      </Button>{' '}
                      <Button variant="secondary" onClick={() => showSubtasks(task.id)}>
                        Vidi podzadatke
                        </Button>{' '}
                      <Button variant="danger" onClick={() => showDeletetask(task.id)}>
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
              <li key={subtask.subtask_id}>
               <Card className='subtaskItem'>
                <Card.Body>
                  <Card.Title>{subtask.name}</Card.Title>
                  <Card.Text>{subtask.description}</Card.Text>
                  <Button
                  variant={subtask.done ? 'success' : 'danger'}
                  title={subtask.done ? 'Podzadatak je urađen' : 'Podzadatak nije urađen'}
                 >
               {subtask.done ? <span>&#x2714;</span> : <span>&#x2716;</span>}
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
      <Modal show={showDeleteModal} onHide={closeDeleteModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Potvrda brisanja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Da li ste sigurni da želite izbrisati ovaj zadatak?
        Ovaj zadatak će biti trajno izbrisan iz vašeg planera 
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeDeleteModal}>
         Nazad
        </Button>
        {selectedTask ? (
    <Button variant="danger" onClick={() => deleteTask(selectedTask.id)}>
      Obriši
    </Button>
  ) : null}
      </Modal.Footer>
    </Modal>
      <CreateTaskForm showModal={showCreateForm} closeModal={closeCreateForm} addTask={addTask} importantTasks={importantTasks} />
      <ToastContainer autoClose={false}/>
      <Modal show={showSessionExpiredModal} >
      <Modal.Header closeButton>
        <Modal.Title>Vaša sesija je istekla</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Vaša sesija je istekla. Molimo vas da se prijavite ponovo.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Logiraj se ponovo
        </Button>
      </Modal.Footer>
    </Modal>
    </Container>
    
  );
  
}

export default PlannerPage;
