// src/pages/PlanifierSeance.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Form, Button,
  Alert, Spinner, Card
} from 'react-bootstrap';
import { getMoniteurs, getVehicules, createSeance, updateSeance } from '../api/seancesService';
import './PlanifierSeance.css';

/**
 * Props :
 *   seanceAModifier  — objet séance pour la modification (null = création)
 *   onSuccess        — callback après succès
 *   onCancel         — callback pour annuler
 *   standalone       — true = page autonome, false = utilisé dans Dashboard
 */
function PlanifierSeance({ seanceAModifier = null, onSuccess, onCancel, standalone = true }) {

  const isEditing = Boolean(seanceAModifier?.moniteur_id); // vrai objet séance

  // Récupère le client connecté depuis localStorage (votre convention)
  const clientConnecte = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    client_id:   seanceAModifier?.client_id   || clientConnecte?.id || '',
    moniteur_id: seanceAModifier?.moniteur_id || '',
    vehicule_id: seanceAModifier?.vehicule_id || '',
    date:        seanceAModifier?.date        || '',
    heure_debut: seanceAModifier?.heure_debut || '',
    heure_fin:   seanceAModifier?.heure_fin   || '',
    notes:       seanceAModifier?.notes       || '',
  });

  const [moniteurs, setMoniteurs]     = useState([]);
  const [vehicules, setVehicules]     = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [apiError, setApiError]       = useState('');
  const [success, setSuccess]         = useState('');

  // Chargement des listes
  useEffect(() => {
    Promise.all([getMoniteurs(), getVehicules()])
      .then(([m, v]) => { setMoniteurs(m); setVehicules(v); })
      .catch(() => setApiError('Impossible de charger les données.'))
      .finally(() => setLoadingData(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  // Validation côté client
  const validate = () => {
    const e = {};
    if (!formData.moniteur_id) e.moniteur_id = 'Choisissez un moniteur.';
    if (!formData.vehicule_id) e.vehicule_id = 'Choisissez un véhicule.';
    if (!formData.date)        e.date        = 'La date est obligatoire.';
    if (!formData.heure_debut) e.heure_debut = 'L\'heure de début est obligatoire.';
    if (!formData.heure_fin)   e.heure_fin   = 'L\'heure de fin est obligatoire.';

    if (formData.heure_debut && formData.heure_fin && formData.heure_fin <= formData.heure_debut) {
      e.heure_fin = 'L\'heure de fin doit être après l\'heure de début.';
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.date && formData.date < today) {
      e.date = 'La date ne peut pas être dans le passé.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    setSuccess('');

    try {
      const result = isEditing
        ? await updateSeance(seanceAModifier.id, formData)
        : await createSeance(formData);

      setSuccess(result.message || 'Séance enregistrée avec succès !');
      setTimeout(() => onSuccess && onSuccess(result.data), 1500);

    } catch (err) {
      if (err.response?.status === 422) {
        // Erreurs Laravel (validation ou logique métier)
        const laravelErrors = err.response.data.errors || {};
        const flat = Object.fromEntries(
          Object.entries(laravelErrors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
        );
        setErrors(flat);
        if (err.response.data.message) setApiError(err.response.data.message);
      } else {
        setApiError(err.response?.data?.message || 'Erreur serveur. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const content = (
    <Card className="shadow-sm planifier-card">
      <Card.Header className="planifier-header">
        <h5 className="mb-0">
          🚗 {isEditing ? 'Modifier la séance' : 'Planifier une séance de conduite'}
        </h5>
      </Card.Header>

      <Card.Body>
        {loadingData ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Chargement...</p>
          </div>
        ) : (
          <>
            {success   && <Alert variant="success">✅ {success}</Alert>}
            {apiError  && <Alert variant="danger">❌ {apiError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                {/* Moniteur */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Moniteur *</Form.Label>
                    <Form.Select
                      name="moniteur_id"
                      value={formData.moniteur_id}
                      onChange={handleChange}
                      isInvalid={!!errors.moniteur_id}
                    >
                      <option value="">-- Choisir un moniteur --</option>
                      {moniteurs.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nom_complet || `${m.prenom} ${m.nom}`}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.moniteur_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Véhicule */}
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Véhicule *</Form.Label>
                    <Form.Select
                      name="vehicule_id"
                      value={formData.vehicule_id}
                      onChange={handleChange}
                      isInvalid={!!errors.vehicule_id}
                    >
                      <option value="">-- Choisir un véhicule --</option>
                      {vehicules.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.libelle || `${v.marque} ${v.modele} (${v.immatriculation})`}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.vehicule_id}
                    </Form.Control.Feedback>
                    {vehicules.length === 0 && (
                      <Form.Text className="text-warning">
                        Aucun véhicule disponible actuellement.
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                {/* Date */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      isInvalid={!!errors.date}
                    />
                    <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Heure début */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Heure de début *</Form.Label>
                    <Form.Control
                      type="time"
                      name="heure_debut"
                      value={formData.heure_debut}
                      onChange={handleChange}
                      isInvalid={!!errors.heure_debut}
                    />
                    <Form.Control.Feedback type="invalid">{errors.heure_debut}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Heure fin */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Heure de fin *</Form.Label>
                    <Form.Control
                      type="time"
                      name="heure_fin"
                      value={formData.heure_fin}
                      onChange={handleChange}
                      isInvalid={!!errors.heure_fin}
                    />
                    <Form.Control.Feedback type="invalid">{errors.heure_fin}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Notes */}
              <Form.Group className="mb-4">
                <Form.Label>Notes (optionnel)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Instructions, objectifs de la séance..."
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" className="btn-planifier" disabled={loading}>
                  {loading
                    ? <><Spinner size="sm" animation="border" className="me-2" />Enregistrement...</>
                    : isEditing ? '✏️ Modifier la séance' : '📅 Planifier la séance'
                  }
                </Button>

                {onCancel && (
                  <Button variant="outline-secondary" onClick={onCancel} disabled={loading}>
                    Annuler
                  </Button>
                )}
              </div>
            </Form>
          </>
        )}
      </Card.Body>
    </Card>
  );

  return standalone ? <Container className="py-4">{content}</Container> : content;
}

export default PlanifierSeance;