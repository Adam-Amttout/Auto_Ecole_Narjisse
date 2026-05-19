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

/**
 * ✅ Récupère les créneaux de 30 minutes avec leur disponibilité en temps réel.
 *
 * Paramètres attendus :
 *   - date        : string 'YYYY-MM-DD' (obligatoire)
 *   - moniteur_id : number (optionnel)
 *   - vehicule_id : number (optionnel)
 *   - client_id   : number (optionnel) — pour vérifier les conflits élève
 *
 * Retourne un tableau de créneaux :
 *   [{ heure_debut, heure_fin, disponible, raison, places }]
 */
export const getCreneaux = (params = {}) =>
  axios.get(`${API}/seances/creneaux`, { params }).then(r => r.data);