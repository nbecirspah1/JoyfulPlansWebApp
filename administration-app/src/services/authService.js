import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

// Funkcija za registraciju korisnika
export function signup(data) {
    return axios(`${API_URL}/signup`, {
      method: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  export function login(data) {
    return axios(`${API_URL}/login`, {
      method: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  export function logout() {
    return axios(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function getUser() {
    return axios(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function addT(data) {
    return axios(`${API_URL}/addTask`, {
      method: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function getTasks() {
    return axios(`${API_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function addSub(taskId, subtasks) {
    return axios(`${API_URL}/addSubtasks/${taskId}`, {
      method: 'POST',
      data: subtasks,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function getSub(taskId) {
    return axios(`${API_URL}/subtasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function uploadTask(taskId, image) {
    const formData = new FormData();
    formData.append('task', image);
  
    return axios.post(`${API_URL}/uploadTaskImage/${taskId}`, formData, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function getToken() {
    return axios(`${API_URL}/childToken`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }
  export function deleteT(taskId) {
  
    return axios.delete(`${API_URL}/deleteTask/${taskId}`,  {
      method: 'DELETE',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }