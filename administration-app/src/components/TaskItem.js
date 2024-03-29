import React, { useState } from 'react';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import './TaskItem.css';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TaskItem({ addSubtask, closeModal, openSubtaskModal }) {
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDescription, setSubtaskDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [subtaskCount, setSubtaskCount] = useState(0);
  const [subTaskId, setSubTaskId] = useState(567);

  const handleSubtaskTitleChange = (e) => {
    setSubtaskTitle(e.target.value);
  };

  const handleSubtaskDescriptionChange = (e) => {
    setSubtaskDescription(e.target.value);
  };

  const handleAddSubtask = () => {
    if (subtaskTitle.trim() === '') {
      toast.error('Unesite naslov podzadatka',{
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (subtaskDescription.trim() === '') {
      toast.error('Unesite opis podzadatka',{
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const newSubtask = {
     subtask_id: subTaskId,
      name: subtaskTitle,
      description: subtaskDescription,
      done:false 
    };

    addSubtask(newSubtask);
    resetForm();
    closeModal();
    setShowSuccessMessage(true);
    setSubtaskCount(subtaskCount + 1);
    setSubTaskId(subTaskId + 1);
  };

  const resetForm = () => {
    setSubtaskTitle('');
    setSubtaskDescription('');
  };

  const handleModalHide = () => {
    resetForm();
    setShowModal(false);
    closeModal();
  };

  return (
    <div className="task-item">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Dodaj podzadatke
      </Button>
      <Modal show={showModal} onHide={handleModalHide} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="custom-modal-title">Dodaj podzadatak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="subtaskTitle">
              <Form.Label className="custom-label">Naslov podzadatka</Form.Label>
              <Form.Control type="text" value={subtaskTitle} onChange={handleSubtaskTitleChange} />
            </Form.Group>
            <Form.Group controlId="subtaskDescription">
              <Form.Label className="custom-label">Opis podzadatka</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={subtaskDescription}
                onChange={handleSubtaskDescriptionChange}
              />
            </Form.Group>
            {showSuccessMessage && (
              <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
                Uspješno ste kreirali korak {subtaskCount}
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalHide}>
           Završi sa krerianjem
          </Button>
          <Button variant="primary" onClick={handleAddSubtask}>
            Dodaj podzadatak
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TaskItem;
