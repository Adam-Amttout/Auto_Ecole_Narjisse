// src/api/seancesService.js
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

// ── Moniteurs ──
export const getMoniteurs = () =>
  axios.get(`${API}/moniteurs`).then(r => r.data);

// ── Véhicules ──
export const getVehicules = () =>
  axios.get(`${API}/vehicules`, { params: { disponibilite: 'disponible' } })
       .then(r => r.data);

// ── Séances ──
export const getSeances = (params = {}) =>
  axios.get(`${API}/seances`, { params }).then(r => r.data);

export const createSeance = (data) =>
  axios.post(`${API}/seances`, data).then(r => r.data);

export const updateSeance = (id, data) =>
  axios.put(`${API}/seances/${id}`, data).then(r => r.data);

export const deleteSeance = (id) =>
  axios.delete(`${API}/seances/${id}`).then(r => r.data);

export const annulerSeance = (id) =>
  axios.patch(`${API}/seances/${id}/annuler`).then(r => r.data);