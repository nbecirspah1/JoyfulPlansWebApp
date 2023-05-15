import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function DeleteConfirmationModal({ show, onClose, onConfirm,  task}) {
    if (!show) {
        return null;
      }
    const handleConfirm = () => {
       confirmDelete(); // Pozovi funkciju za potvrdu brisanja
      };
      const confirmDelete = () => {
        onConfirm(task); // Prenesi task koji treba izbrisati
      };
      
  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Potvrda brisanja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Da li ste sigurni da želite izbrisati ovaj zadatak?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Ne
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Da
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmationModal;
