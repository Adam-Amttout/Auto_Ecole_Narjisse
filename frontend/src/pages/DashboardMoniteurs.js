// src/pages/DashboardMoniteurs.js
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Alert, Badge
} from 'react-bootstrap';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

function DashboardMoniteurs() {
  const [moniteurs, setMoniteurs]   = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [error, setError]           = useState('');
  const [formData, setFormData]     = useState({
    nom: '', prenom: '', telephone: '', email: '', actif: true
  });

  const fetch_ = async () => {
    const res = await axios.get(`${API}/moniteurs`);
    setMoniteurs(res.data);
  };

  useEffect(() => { fetch_(); }, []);

  const save = async () => {
    setError('');
    try {
      if (editing) {
        await axios.put(`${API}/moniteurs/${editing.id}`, formData);
      } else {
        await axios.post(`${API}/moniteurs`, formData);
      }
      reset(); fetch_();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    }
  };

  const del = async (id) => {
    try {
      await axios.delete(`${API}/moniteurs/${id}`);
      fetch_();
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer.');
    }
  };

  const edit = (m) => {
    setEditing(m);
    setFormData({ nom: m.nom, prenom: m.prenom, telephone: m.telephone, email: m.email, actif: m.actif });
    setShowModal(true);
  };

  const reset = () => {
    setShowModal(false); setEditing(null);
    setFormData({ nom: '', prenom: '', telephone: '', email: '', actif: true });
  };

  return (
    <>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <h5>Moniteurs ({moniteurs.length})</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>+ Ajouter</Button>
      </div>

      <Table hover size="sm">
        <thead className="table-dark">
          <tr>
            <th>Nom</th><th>Téléphone</th><th>Email</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {moniteurs.map(m => (
            <tr key={m.id}>
              <td>{m.prenom} {m.nom}</td>
              <td>{m.telephone}</td>
              <td>{m.email}</td>
              <td>
                <Badge bg={m.actif ? 'success' : 'secondary'}>
                  {m.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-1" onClick={() => edit(m)}>✏️</Button>
                <Button size="sm" variant="outline-danger" onClick={() => del(m.id)}>🗑</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={reset}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Modifier moniteur' : 'Ajouter moniteur'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Control className="mb-2" placeholder="Nom" value={formData.nom}
              onChange={e => setFormData({...formData, nom: e.target.value})}/>
            <Form.Control className="mb-2" placeholder="Prénom" value={formData.prenom}
              onChange={e => setFormData({...formData, prenom: e.target.value})}/>
            <Form.Control className="mb-2" placeholder="Téléphone" value={formData.telephone}
              onChange={e => setFormData({...formData, telephone: e.target.value})}/>
            <Form.Control className="mb-2" placeholder="Email" value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}/>
            <Form.Check label="Actif" checked={formData.actif}
              onChange={e => setFormData({...formData, actif: e.target.checked})}/>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={save}>Enregistrer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DashboardMoniteurs;