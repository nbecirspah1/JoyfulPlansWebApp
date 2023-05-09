import React from 'react';
import { Card, Button } from 'react-bootstrap';

const TaskItem = ({ task, toggleCompletion, deleteTask }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <Card.Text>Date: {task.date}</Card.Text>
        <Button
          variant={task.completed ? 'success' : 'primary'}
          onClick={toggleCompletion}
        >
          {task.completed ? 'Completed' : 'Uncompleted'}
        </Button>{' '}
        <Button variant="danger" onClick={deleteTask}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TaskItem;
