// src/pages/PlanifierSeance.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Form, Button,
  Alert, Spinner, Card, Badge
} from 'react-bootstrap';
import { getMoniteurs, getVehicules, createSeance, updateSeance, getCreneaux } from '../api/seancesService';
import './PlanifierSeance.css';

/**
 * Props :
 *   seanceAModifier  — objet séance pour la modification (null = création)
 *   onSuccess        — callback après succès
 *   onCancel         — callback pour annuler
 *   standalone       — true = page autonome, false = utilisé dans Dashboard
 */
function PlanifierSeance({ seanceAModifier = null, onSuccess, onCancel, standalone = true }) {

  const isEditing = Boolean(seanceAModifier?.moniteur_id);
  const clientConnecte = JSON.parse(localStorage.getItem('user'));

  // ✅ heure_fin n'est plus dans le form — calculé automatiquement
  const [formData, setFormData] = useState({
    client_id:   seanceAModifier?.client_id   || clientConnecte?.id || '',
    moniteur_id: seanceAModifier?.moniteur_id || '',
    vehicule_id: seanceAModifier?.vehicule_id || '',
    date:        seanceAModifier?.date        || '',
    heure_debut: seanceAModifier?.heure_debut || '',
    notes:       seanceAModifier?.notes       || '',
  });

  const [moniteurs,    setMoniteurs]    = useState([]);
  const [vehicules,    setVehicules]    = useState([]);
  const [creneaux,     setCreneaux]     = useState([]);  // créneaux disponibles depuis l'API
  const [loadingData,  setLoadingData]  = useState(true);
  const [loadingDispo, setLoadingDispo] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});
  const [apiError,     setApiError]     = useState('');
  const [success,      setSuccess]      = useState('');

  /** Calcule heure_fin = heure_debut + 30 min */
  const heureFinAttendue = (heureDebut) => {
    if (!heureDebut) return '';
    const [h, m] = heureDebut.split(':').map(Number);
    const total = h * 60 + m + 30;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };

  // Chargement moniteurs + véhicules
  useEffect(() => {
    Promise.all([getMoniteurs(), getVehicules()])
      .then(([m, v]) => { setMoniteurs(m); setVehicules(v); })
      .catch(() => setApiError('Impossible de charger les données.'))
      .finally(() => setLoadingData(false));
  }, []);

  // ✅ Chargement des créneaux disponibles dès que moniteur + véhicule + date sont renseignés
  useEffect(() => {
    if (!formData.moniteur_id || !formData.vehicule_id || !formData.date) {
      setCreneaux([]);
      return;
    }

    const fetchCreneaux = async () => {
      setLoadingDispo(true);
      try {
        const data = await getCreneaux({
          date:        formData.date,
          moniteur_id: formData.moniteur_id,
          vehicule_id: formData.vehicule_id,
          client_id:   formData.client_id || undefined,
        });
        setCreneaux(data);
        // Si le créneau sélectionné est devenu indisponible, on le réinitialise
        if (formData.heure_debut) {
          const creneauActuel = data.find(c => c.heure_debut === formData.heure_debut);
          if (creneauActuel && !creneauActuel.disponible) {
            setFormData(prev => ({ ...prev, heure_debut: '' }));
          }
        }
      } catch {
        setCreneaux([]);
      } finally {
        setLoadingDispo(false);
      }
    };

    fetchCreneaux();
  }, [formData.moniteur_id, formData.vehicule_id, formData.date]);

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
    if (!formData.heure_debut) e.heure_debut = 'Choisissez un créneau.';

    const today = new Date().toISOString().split('T')[0];
    if (formData.date && formData.date < today) {
      e.date = 'La date ne peut pas être dans le passé.';
    }

    // ✅ Vérifier que le créneau sélectionné est bien disponible
    if (formData.heure_debut && creneaux.length > 0) {
      const creneau = creneaux.find(c => c.heure_debut === formData.heure_debut);
      if (creneau && !creneau.disponible) {
        e.heure_debut = `Ce créneau est déjà pris. ${creneau.raison || ''}`;
      }
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
      // ✅ On n'envoie plus heure_fin — le backend la calcule automatiquement
      const payload = { ...formData };
      delete payload.heure_fin;

      const result = isEditing
        ? await updateSeance(seanceAModifier.id, payload)
        : await createSeance(payload);

      setSuccess(result.message || 'Séance enregistrée avec succès !');
      setTimeout(() => onSuccess && onSuccess(result.data), 1500);

    } catch (err) {
      if (err.response?.status === 422) {
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
  const creneauSelectionne = creneaux.find(c => c.heure_debut === formData.heure_debut);

  const content = (
    <Card className="shadow-sm planifier-card">
      <Card.Header className="planifier-header">
        <h5 className="mb-0">
          🚗 {isEditing ? 'Modifier la séance' : 'Planifier une séance de conduite'}
        </h5>
        <small className="text-muted">Durée : 30 minutes · Un seul élève par créneau</small>
      </Card.Header>

      <Card.Body>
        {loadingData ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Chargement…</p>
          </div>
        ) : (
          <>
            {success  && <Alert variant="success">✅ {success}</Alert>}
            {apiError && <Alert variant="danger">❌ {apiError}</Alert>}

            {/* Info règle métier */}
            <Alert variant="info" className="py-2 mb-3">
              ℹ️ Chaque séance dure <strong>30 minutes</strong>. L'heure de fin est calculée automatiquement.
              Un seul élève peut réserver un créneau à une date précise.
            </Alert>

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
                      {moniteurs.filter(m => m.actif).map(m => (
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

                {/* ✅ Créneau de 30 min — Select avec créneaux disponibles */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Créneau (30 min) *{' '}
                      {loadingDispo && <Spinner size="sm" animation="border" />}
                    </Form.Label>
                    <Form.Select
                      name="heure_debut"
                      value={formData.heure_debut}
                      onChange={handleChange}
                      isInvalid={!!errors.heure_debut}
                      disabled={!formData.moniteur_id || !formData.vehicule_id || !formData.date || loadingDispo}
                    >
                      <option value="">-- Choisir un créneau --</option>
                      {creneaux.map(c => (
                        <option
                          key={c.heure_debut}
                          value={c.heure_debut}
                          disabled={!c.disponible}
                        >
                          {c.heure_debut} – {c.heure_fin}
                          {c.disponible ? ' ✓' : ' ✗ Réservé'}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.heure_debut}
                    </Form.Control.Feedback>
                    {(!formData.moniteur_id || !formData.vehicule_id || !formData.date) && (
                      <Form.Text className="text-muted">
                        Sélectionnez d'abord moniteur, véhicule et date.
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                {/* ✅ Heure fin — calculée automatiquement, lecture seule */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Heure de fin (auto)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.heure_debut ? heureFinAttendue(formData.heure_debut) : '—'}
                      readOnly
                      style={{ background: '#f8f9fa', color: '#6c757d' }}
                    />
                    <Form.Text className="text-muted">Calculée automatiquement (+30 min)</Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {/* Indicateur disponibilité du créneau sélectionné */}
              {creneauSelectionne && (
                <Alert variant={creneauSelectionne.disponible ? 'success' : 'danger'} className="py-2 mb-3">
                  {creneauSelectionne.disponible
                    ? `✅ Créneau ${creneauSelectionne.heure_debut}–${creneauSelectionne.heure_fin} disponible !`
                    : `❌ Ce créneau est déjà pris. ${creneauSelectionne.raison || ''}`
                  }
                </Alert>
              )}

              {/* Notes */}
              <Form.Group className="mb-4">
                <Form.Label>Notes (optionnel)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Instructions, objectifs de la séance…"
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  className="btn-planifier"
                  disabled={loading || (creneauSelectionne && !creneauSelectionne.disponible)}
                >
                  {loading
                    ? <><Spinner size="sm" animation="border" className="me-2" />Enregistrement…</>
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