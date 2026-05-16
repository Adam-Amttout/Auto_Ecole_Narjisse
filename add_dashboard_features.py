import os

dashboard_path = r"c:\Users\ORIGINAL SHOP\Auto_Ecole_Narjisse\frontend\src\pages\ClientDashboard.js"

content = """import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExamenBlanc from "./ExamenBlanc";
import "./ClientDashboard.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const API = "http://127.0.0.1:8000/api";

const STATUT_SEANCE = {
  planifiee: { label: "Planifiée", bg: "#dbeafe", color: "#1d4ed8", icon: "📅" },
  en_cours:  { label: "En cours",  bg: "#fef9c3", color: "#a16207", icon: "▶️"  },
  terminee:  { label: "Terminée",  bg: "#dcfce7", color: "#15803d", icon: "✅"  },
  annulee:   { label: "Annulée",   bg: "#f1f5f9", color: "#64748b", icon: "❌"  },
};

const CAT_COLORS = {
  danger:       { bg: "#fee2e2", color: "#b91c1c", icon: "⚠️" },
  indication:   { bg: "#dbeafe", color: "#1d4ed8", icon: "ℹ️" },
  interdiction: { bg: "#fff7ed", color: "#c2410c", icon: "🚫" },
  code_route:   { bg: "#f5f3ff", color: "#7c3aed", icon: "📋" },
  conduite:     { bg: "#ecfdf5", color: "#059669", icon: "🚗" },
  autre:        { bg: "#f8fafc", color: "#64748b", icon: "📌" },
};

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const clientId = user?.id;

  const [tab, setTab]         = useState("accueil");
  const [loading, setLoading] = useState(true);

  // Stats & Data
  const [seances,       setSeances]       = useState([]);
  const [cours,         setCours]         = useState([]);
  const [progression,   setProgression]   = useState([]);
  const [notifications, setNotifs]        = useState([]);
  const [profil,        setProfil]        = useState(user);
  
  const [examHistory,   setExamHistory]   = useState([]);
  const [examStats,     setExamStats]     = useState(null);

  // Track visits
  useEffect(() => {
    if (clientId) {
      const key = `visits_${clientId}`;
      const v = parseInt(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, v);
    }
  }, [clientId]);

  const loadAll = useCallback(async () => {
    if (!clientId) { navigate("/connexion"); return; }
    setLoading(true);
    try {
      const [seaRes, coursRes, progRes, notifRes, profilRes, examHistRes, examStatsRes] = await Promise.allSettled([
        axios.get(`${API}/seances?client_id=${clientId}`),
        axios.get(`${API}/cours`),
        axios.get(`${API}/progression/by-category?client_id=${clientId}`),
        axios.get(`${API}/notifications?client_id=${clientId}`),
        axios.get(`${API}/clients/${clientId}`),
        axios.get(`${API}/exam/results?client_id=${clientId}`),
        axios.get(`${API}/exam/stats?client_id=${clientId}`),
      ]);
      if (seaRes.status    === "fulfilled") setSeances(seaRes.value.data);
      if (coursRes.status  === "fulfilled") setCours(coursRes.value.data);
      if (progRes.status   === "fulfilled") setProgression(progRes.value.data || []);
      if (notifRes.status  === "fulfilled") setNotifs(notifRes.value.data || []);
      if (profilRes.status === "fulfilled") setProfil(profilRes.value.data);
      if (examHistRes.status === "fulfilled") setExamHistory(examHistRes.value.data);
      if (examStatsRes.status === "fulfilled") setExamStats(examStatsRes.value.data);
    } catch {}
    setLoading(false);
  }, [clientId, navigate]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Notifications
  const marquerLu = async (id) => {
    try {
      await axios.patch(`${API}/notifications/${id}/lire`);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch {}
  };
  const marquerToutLu = async () => {
    try {
      await axios.patch(`${API}/notifications/lire-tout`, { client_id: clientId });
      setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
    } catch {}
  };
  const supprimerNotif = async (id) => {
    try {
      await axios.delete(`${API}/notifications/${id}`);
      setNotifs(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  // Exam History
  const supprimerExam = async (id) => {
    if (!window.confirm("Supprimer ce résultat ?")) return;
    try {
      await axios.delete(`${API}/exam/results/${id}`);
      setExamHistory(prev => prev.filter(e => e.id !== id));
      loadAll(); // reload stats
    } catch { alert("Erreur de suppression"); }
  };

  // Computed Data
  const nbNonLus  = notifications.filter(n => !n.lu).length;
  const seancesFutures   = seances.filter(s => s.statut === "planifiee");
  const totalCours       = cours.length;
  const coursCompletes   = Array.isArray(progression) ? progression.reduce((a, c) => a + (c.completed || 0), 0) : 0;
  const progPct   = totalCours > 0 ? Math.round((coursCompletes / totalCours) * 100) : 0;

  // Badges logic
  const has10Qcm = examHistory.length >= 10;
  const hasAvg35 = (examStats?.avg_score || 0) >= 35;
  const hasFinishedCat = Array.isArray(progression) && progression.some(c => c.completed === c.total && c.total > 0);
  
  // TABS: Cleaned up sidebar to avoid navbar duplicates
  const TABS = [
    { key: "accueil", icon: "🏠", label: "Tableau de Bord" },
    { key: "exam",    icon: "🚦", label: "Examen Blanc" },
    { key: "stats",   icon: "📊", label: "Statistiques" },
    { key: "notifs",  icon: "🔔", label: "Historique", badge: nbNonLus },
  ];

  if (loading) return (
    <div className="cd-loading">
      <div className="cd-spinner"/>
      <p>Chargement…</p>
    </div>
  );

  const initiales = `${profil?.prenom?.[0]||""}${profil?.nom?.[0]||""}`.toUpperCase();

  return (
    <div className="cd-layout">
      {/* ── SIDEBAR ── */}
      <aside className="cd-sidebar">
        <div className="cd-brand">
          <div className="cd-brand-logo">🚗</div>
          <div>
            <div className="cd-brand-name">Auto École</div>
            <div className="cd-brand-sub">Narjiss</div>
          </div>
        </div>

        <div className="cd-user-card">
          <div className="cd-user-avatar" style={{ padding: profil?.photo_url || profil?.photo_profil ? 0 : undefined, overflow: "hidden" }}>
            {profil?.photo_url || profil?.photo_profil ? (
              <img 
                src={profil.photo_url || `${API.replace('/api','')}/storage/${profil.photo_profil}`} 
                alt="Profil" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} 
              />
            ) : initiales}
          </div>
          <div className="cd-user-info">
            <div className="cd-user-name">{profil?.prenom} {profil?.nom}</div>
            <div className="cd-user-role">🎓 Élève</div>
          </div>
        </div>

        <nav className="cd-nav">
          {TABS.map(t => (
            <button key={t.key} className={`cd-nav-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              <span className="cd-nav-icon">{t.icon}</span>
              <span className="cd-nav-label">{t.label}</span>
              {t.badge > 0 && <span className="cd-nav-badge">{t.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="cd-main">
        {/* ══ ACCUEIL ══ */}
        {tab === "accueil" && (
          <div className="cd-section fade-in">
            <div className="cd-welcome">
              <div>
                <h2 className="cd-welcome-title">Bonjour, {profil?.prenom} 👋</h2>
                <p className="cd-welcome-sub">Prêt pour votre prochaine leçon ?</p>
              </div>
              <button className="cd-btn-primary" onClick={() => navigate("/cours")}>
                Continuer l'apprentissage 🚀
              </button>
            </div>

            {/* Badges & Scores */}
            <div className="cd-widgets-row">
              <div className="cd-widget-card score-card">
                <div className="score-icon">🏆</div>
                <div className="score-info">
                  <span className="score-label">Meilleur Score</span>
                  <span className="score-val">{examStats?.best_score || 0}<small>/40</small></span>
                </div>
                <div className="score-info">
                  <span className="score-label">Moyenne Générale</span>
                  <span className="score-val" style={{color: '#fff'}}>{examStats?.avg_score || 0}</span>
                </div>
              </div>

              <div className="cd-widget-card badges-card">
                <h4 className="badges-title">🎖️ Vos Badges</h4>
                <div className="badges-list">
                  <div className={`badge-item ${has10Qcm ? 'active' : 'locked'}`} title="10 QCM successifs">
                    <span className="badge-icon">🔥</span>
                    <span>Assiduité</span>
                  </div>
                  <div className={`badge-item ${hasAvg35 ? 'active' : 'locked'}`} title="Moyenne +35/40">
                    <span className="badge-icon">🌟</span>
                    <span>Excellence</span>
                  </div>
                  <div className={`badge-item ${hasFinishedCat ? 'active' : 'locked'}`} title="Terminer une catégorie">
                    <span className="badge-icon">🎯</span>
                    <span>Spécialiste</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progressions per category */}
            <div className="cd-card">
              <div className="cd-card-head">📈 Progression par Catégorie</div>
              <div className="cd-prog-cats-grid">
                {Array.isArray(progression) && progression.map((cat, i) => {
                  const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
                  const cc = CAT_COLORS[cat.categorie] || CAT_COLORS.autre;
                  return (
                    <div key={i} className="cd-cat-progress">
                      <div className="cd-cat-info">
                        <span className="cd-cat-icon" style={{background: cc.bg, color: cc.color}}>{cc.icon}</span>
                        <span className="cd-cat-name">{cat.categorie}</span>
                        <span className="cd-cat-pct">{pct}%</span>
                      </div>
                      <div className="cd-prog-track" style={{height: 8}}>
                        <div className="cd-prog-fill" style={{width: `${pct}%`, background: cc.color}} />
                      </div>
                      <div className="cd-cat-meta">{cat.completed} / {cat.total} leçons</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prochaine Séance */}
            {seancesFutures.length > 0 && (
              <div className="cd-card">
                <div className="cd-card-head">📅 Rendez-vous & Séances</div>
                <div className="cd-seances-list">
                  {seancesFutures.slice(0,2).map(s => (
                    <div key={s.id} className="cd-seance-item">
                      <div className="cd-seance-date">
                        <span className="date-icon">📆</span>
                        {new Date(s.date).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"short"})}
                      </div>
                      <div className="cd-seance-time">⏰ {s.heure_debut} - {s.heure_fin}</div>
                      <div className="cd-seance-type">🚗 {s.vehicule ? s.vehicule.marque : "Conduite"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ EXAMEN BLANC ══ */}
        {tab === "exam" && (
          <div className="cd-section fade-in">
            <ExamenBlanc clientId={clientId} onBack={() => setTab("accueil")} />
          </div>
        )}

        {/* ══ STATISTIQUES ══ */}
        {tab === "stats" && (
          <div className="cd-section fade-in">
            <div className="cd-card">
              <div className="cd-card-head">📊 Statistiques d'apprentissage</div>
              <div className="cd-stats-grid-4">
                <div className="stat-box">
                  <div className="stat-val">{coursCompletes}</div>
                  <div className="stat-lbl">Leçons terminées</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{examHistory.length}</div>
                  <div className="stat-lbl">Quiz passés</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val" style={{color: '#15803d'}}>{examStats?.reussis || 0}</div>
                  <div className="stat-lbl">Quiz réussis</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val" style={{color: '#e63946'}}>{(examHistory.length - (examStats?.reussis || 0))}</div>
                  <div className="stat-lbl">Échecs</div>
                </div>
              </div>
            </div>

            <div className="cd-card mt-15">
              <div className="cd-card-head">📝 Derniers Examens (Historique)</div>
              <div className="table-responsive">
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Résultat</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examHistory.length === 0 ? (
                      <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>Aucun QCM passé pour l'instant.</td></tr>
                    ) : (
                      examHistory.slice(0, 10).map(ex => (
                        <tr key={ex.id}>
                          <td>{new Date(ex.created_at).toLocaleDateString("fr-FR", {day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit"})}</td>
                          <td style={{fontWeight: 700}}>{ex.score}/40</td>
                          <td>
                            <span className="cd-status-badge" style={{background: ex.reussi ? "#dcfce7" : "#fee2e2", color: ex.reussi ? "#15803d" : "#b91c1c"}}>
                              {ex.reussi ? "✅ Réussi" : "❌ Échoué"}
                            </span>
                          </td>
                          <td>
                            <button className="cd-btn-icon del" onClick={() => supprimerExam(ex.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ NOTIFICATIONS (Historique) ══ */}
        {tab === "notifs" && (
          <div className="cd-section fade-in">
            <div className="cd-card">
              <div className="cd-card-head" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>🔔 Historique des notifications</span>
                {nbNonLus > 0 && <button className="cd-btn-outline-sm" onClick={marquerToutLu}>Tout marquer comme lu</button>}
              </div>
              
              <div className="cd-notifs-page-list">
                {notifications.length === 0 ? (
                  <div className="cd-empty">Aucune notification.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`cd-notif-row ${!n.lu ? 'unread' : ''}`}>
                      <div className="cd-notif-icon" style={{background: (n.color || "#e63946")+"22", color: n.color || "#e63946"}}>{n.icon || "🔔"}</div>
                      <div className="cd-notif-content">
                        <div className="cd-notif-title">{n.titre}</div>
                        <div className="cd-notif-msg">{n.message}</div>
                        <div className="cd-notif-date">{new Date(n.created_at).toLocaleString("fr-FR")}</div>
                      </div>
                      <div className="cd-notif-actions">
                        {!n.lu && <button className="cd-btn-icon ok" onClick={() => marquerLu(n.id)} title="Marquer comme lu">✔️</button>}
                        <button className="cd-btn-icon del" onClick={() => supprimerNotif(n.id)} title="Supprimer">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
"""

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(content)

print("ClientDashboard.js updated successfully.")
