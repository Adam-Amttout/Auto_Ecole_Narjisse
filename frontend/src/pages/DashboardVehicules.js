// src/pages/DashboardVehicules.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

const DISPO_BADGE = {
  disponible:      'success',
  en_maintenance:  'warning',
  hors_service:    'danger',
};

const DISPO_LABELS = {
  disponible:      'Disponible',
  en_maintenance:  'Maintenance',
  hors_service:    'Hors service',
};

function DashboardVehicules() {
  const [vehicules, setVehicules]   = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [error, setError]           = useState('');
  const [formData, setFormData]     = useState({
    marque: '', modele: '', immatriculation: '', disponibilite: 'disponible'
  });

  const fetch_ = async () => {
    const res = await axios.get(`${API}/vehicules`);
    setVehicules(res.data);
  };

  useEffect(() => { fetch_(); }, []);

  const save = async () => {
    setError('');
    try {
      if (editing) {
        await axios.put(`${API}/vehicules/${editing.id}`, formData);
      } else {
        await axios.post(`${API}/vehicules`, formData);
      }
      reset(); fetch_();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  const del = async (id) => {
    try {
      await axios.delete(`${API}/vehicules/${id}`);
      fetch_();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer.');
    }
  };

  const edit = (v) => {
    setEditing(v);
    setFormData({
      marque: v.marque, modele: v.modele,
      immatriculation: v.immatriculation, disponibilite: v.disponibilite
    });
    setShowModal(true);
  };

  const reset = () => {
    setShowModal(false); setEditing(null);
    setFormData({ marque: '', modele: '', immatriculation: '', disponibilite: 'disponible' });
  };

  return (
    <>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <h5>Véhicules ({vehicules.length})</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>+ Ajouter</Button>
      </div>

      <Table hover size="sm">
        <thead className="table-dark">
          <tr>
            <th>Marque / Modèle</th><th>Immatriculation</th><th>Disponibilité</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicules.map(v => (
            <tr key={v.id}>
              <td><strong>{v.marque}</strong> {v.modele}</td>
              <td><code>{v.immatriculation}</code></td>
              <td>
                <Badge bg={DISPO_BADGE[v.disponibilite] || 'secondary'}>
                  {DISPO_LABELS[v.disponibilite] || v.disponibilite}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-1" onClick={() => edit(v)}>✏️</Button>
                <Button size="sm" variant="outline-danger" onClick={() => del(v.id)}>🗑</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={reset}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Modifier véhicule' : 'Ajouter véhicule'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Control className="mb-2" placeholder="Marque" value={formData.marque}
              onChange={e => setFormData({...formData, marque: e.target.value})}/>
            <Form.Control className="mb-2" placeholder="Modèle" value={formData.modele}
              onChange={e => setFormData({...formData, modele: e.target.value})}/>
            <Form.Control className="mb-2" placeholder="Immatriculation" value={formData.immatriculation}
              onChange={e => setFormData({...formData, immatriculation: e.target.value})}/>
            <Form.Select value={formData.disponibilite}
              onChange={e => setFormData({...formData, disponibilite: e.target.value})}>
              <option value="disponible">Disponible</option>
              <option value="en_maintenance">En maintenance</option>
              <option value="hors_service">Hors service</option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={save}>Enregistrer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DashboardVehicules;