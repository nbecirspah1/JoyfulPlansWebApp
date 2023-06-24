import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Promenite URL prema adresi vašeg backend servera

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
  