// src/pages/SeancesConduite.js
// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Table,
  Button, Badge, Modal, Alert, Spinner, Nav
} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin   from '@fullcalendar/daygrid';
import timeGridPlugin  from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { getSeances, annulerSeance, deleteSeance } from '../api/seancesService';
import PlanifierSeance from './PlanifierSeance';
import './SeancesConduite.css';

const STATUT_COULEURS = {
  planifiee: 'primary',
  en_cours:  'warning',
  terminee:  'success',
  annulee:   'secondary',
};

const CALENDAR_COLORS = {
  planifiee: '#0d6efd',
  en_cours:  '#fd7e14',
  terminee:  '#198754',
  annulee:   '#6c757d',
};

const STATUT_LABELS = {
  planifiee: 'Planifiée',
  en_cours:  'En cours',
  terminee:  'Terminée',
  annulee:   'Annulée',
};

function SeancesConduite() {
  const client = JSON.parse(localStorage.getItem('user'));
  const role   = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  const [onglet, setOnglet]         = useState('liste');
  const [seances, setSeances]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [seanceEditer, setSeanceEditer] = useState(null);
  const [seanceDetail, setSeanceDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [actionId, setActionId]     = useState(null);
  const [confirmId, setConfirmId]   = useState(null);

  const chargerSeances = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Admin voit tout, élève voit seulement les siennes
      const params = isAdmin ? {} : { client_id: client?.id };
      const data = await getSeances(params);
      setSeances(data);
    } catch {
      setError('Impossible de charger les séances.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, client?.id]);

  useEffect(() => { chargerSeances(); }, [chargerSeances]);

  const handleAnnuler = async (id) => {
    setActionId(id);
    try {
      await annulerSeance(id);
      await chargerSeances();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation.');
    } finally {
      setActionId(null);
    }
  };

  const handleSupprimer = async (id) => {
    setActionId(id);
    try {
      await deleteSeance(id);
      setConfirmId(null);
      await chargerSeances();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setActionId(null);
    }
  };

  const handleSucces = () => {
    setShowForm(false);
    setSeanceEditer(null);
    chargerSeances();
  };

  // Convertit séances en événements FullCalendar
  const calendarEvents = seances.map(s => ({
    id:    String(s.id),
    title: isAdmin
      ? `${s.client?.nom} ${s.client?.prenom} — ${s.moniteur?.prenom}`
      : `${s.moniteur?.prenom} ${s.moniteur?.nom}`,
    start: `${s.date.split('T')[0]}T${s.heure_debut}`,
    end:   `${s.date.split('T')[0]}T${s.heure_fin}`,
    backgroundColor: CALENDAR_COLORS[s.statut] || '#6c757d',
    borderColor:     CALENDAR_COLORS[s.statut] || '#6c757d',
    extendedProps: { seance: s },
  }));

  return (
    <Container className="py-4">

      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="seances-title">🚗 Mes séances de conduite</h4>
        <Button className="btn-planifier" onClick={() => { setShowForm(true); setSeanceEditer(null); }}>
          + Planifier une séance
        </Button>
      </div>

      {/* Formulaire (toggle) */}
      {showForm && !seanceEditer && (
        <div className="mb-4">
          <PlanifierSeance
            standalone={false}
            onSuccess={handleSucces}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Formulaire d'édition */}
      {seanceEditer && (
        <div className="mb-4">
          <PlanifierSeance
            standalone={false}
            seanceAModifier={seanceEditer}
            onSuccess={handleSucces}
            onCancel={() => setSeanceEditer(null)}
          />
        </div>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>❌ {error}</Alert>
      )}

      {/* Onglets Liste / Calendrier */}
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active={onglet === 'liste'} onClick={() => setOnglet('liste')}>
            📋 Liste
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={onglet === 'calendrier'} onClick={() => setOnglet('calendrier')}>
            📅 Calendrier
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* ── VUE LISTE ── */}
      {onglet === 'liste' && (
        loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : seances.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p style={{ fontSize: '3rem' }}>📅</p>
            <p>Aucune séance planifiée pour l'instant.</p>
          </div>
        ) : (
          <Card className="shadow-sm">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    {isAdmin && <th>Élève</th>}
                    <th>Moniteur</th>
                    <th>Véhicule</th>
                    <th>Date</th>
                    <th>Horaire</th>
                    <th>Statut</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seances.map(s => (
                    <tr key={s.id}>
                      {isAdmin && (
                        <td><strong>{s.client?.nom} {s.client?.prenom}</strong></td>
                      )}
                      <td>{s.moniteur?.prenom} {s.moniteur?.nom}</td>
                      <td>
                        {s.vehicule?.marque} {s.vehicule?.modele}
                        <br/><small className="text-muted">{s.vehicule?.immatriculation}</small>
                      </td>
                      <td>
                        {new Date(s.date).toLocaleDateString('fr-FR', {
                          weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td>⏰ {s.heure_debut} – {s.heure_fin}</td>
                      <td>
                        <Badge bg={STATUT_COULEURS[s.statut] || 'secondary'}>
                          {STATUT_LABELS[s.statut] || s.statut}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          {/* Détail */}
                          <Button
                            size="sm" variant="outline-info"
                            onClick={() => { setSeanceDetail(s); setShowDetail(true); }}
                          >👁</Button>

                          {/* Modifier — planifiée seulement */}
                          {s.statut === 'planifiee' && (
                            <Button
                              size="sm" variant="outline-primary"
                              onClick={() => { setSeanceEditer(s); setShowForm(false); }}
                            >✏️</Button>
                          )}

                          {/* Annuler — planifiée seulement */}
                          {s.statut === 'planifiee' && (
                            <Button
                              size="sm" variant="outline-warning"
                              disabled={actionId === s.id}
                              onClick={() => handleAnnuler(s.id)}
                            >
                              {actionId === s.id
                                ? <Spinner size="sm" animation="border"/>
                                : '✕'}
                            </Button>
                          )}

                          {/* Supprimer — annulée seulement (admin) */}
                          {isAdmin && s.statut === 'annulee' && (
                            confirmId === s.id ? (
                              <>
                                <Button
                                  size="sm" variant="danger"
                                  disabled={actionId === s.id}
                                  onClick={() => handleSupprimer(s.id)}
                                >
                                  {actionId === s.id
                                    ? <Spinner size="sm" animation="border"/>
                                    : 'Confirmer'}
                                </Button>
                                <Button
                                  size="sm" variant="outline-secondary"
                                  onClick={() => setConfirmId(null)}
                                >Non</Button>
                              </>
                            ) : (
                              <Button
                                size="sm" variant="outline-danger"
                                onClick={() => setConfirmId(s.id)}
                              >🗑</Button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )
      )}

      {/* ── VUE CALENDRIER ── */}
      {onglet === 'calendrier' && (
        <Card className="shadow-sm p-3">
          {/* Légende */}
          <div className="d-flex gap-3 mb-3 flex-wrap">
            {Object.entries(CALENDAR_COLORS).map(([s, c]) => (
              <span key={s} className="d-flex align-items-center gap-1 small">
                <span style={{
                  width: 12, height: 12, borderRadius: 3,
                  backgroundColor: c, display: 'inline-block'
                }}/>
                {STATUT_LABELS[s]}
              </span>
            ))}
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={frLocale}
            headerToolbar={{
              left:   'prev,next today',
              center: 'title',
              right:  'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={calendarEvents}
            eventClick={({ event }) => {
              setSeanceDetail(event.extendedProps.seance);
              setShowDetail(true);
            }}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            height="auto"
            eventDisplay="block"
          />
        </Card>
      )}

      {/* ── MODAL DÉTAIL ── */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📋 Détail de la séance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {seanceDetail && (
            <Table bordered size="sm">
              <tbody>
                {seanceDetail.client && (
                  <tr>
                    <th>Élève</th>
                    <td>{seanceDetail.client.nom} {seanceDetail.client.prenom}</td>
                  </tr>
                )}
                <tr>
                  <th>Moniteur</th>
                  <td>{seanceDetail.moniteur?.prenom} {seanceDetail.moniteur?.nom}</td>
                </tr>
                <tr>
                  <th>Véhicule</th>
                  <td>
                    {seanceDetail.vehicule?.marque} {seanceDetail.vehicule?.modele}
                    {' '}({seanceDetail.vehicule?.immatriculation})
                  </td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{new Date(seanceDetail.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}</td>
                </tr>
                <tr>
                  <th>Horaire</th>
                  <td>{seanceDetail.heure_debut} – {seanceDetail.heure_fin}</td>
                </tr>
                <tr>
                  <th>Statut</th>
                  <td>
                    <Badge bg={STATUT_COULEURS[seanceDetail.statut]}>
                      {STATUT_LABELS[seanceDetail.statut]}
                    </Badge>
                  </td>
                </tr>
                {seanceDetail.notes && (
                  <tr>
                    <th>Notes</th>
                    <td>{seanceDetail.notes}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default SeancesConduite;