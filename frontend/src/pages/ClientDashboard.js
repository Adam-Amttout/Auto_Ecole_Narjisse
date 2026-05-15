import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClientDashboard.css";

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

// Types qui génèrent des notifs privées (client_id non null)
const TYPES_PRIVES = ["seance", "avis", "message", "bienvenue"];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const clientId = user?.id;

  const [tab, setTab]         = useState("accueil");
  const [loading, setLoading] = useState(true);

  const [seances,       setSeances]       = useState([]);
  const [cours,         setCours]         = useState([]);
  const [progression,   setProgression]   = useState([]);
  const [notifications, setNotifs]        = useState([]);
  const [profil,        setProfil]        = useState(user);

  /* ── fetch ── */
  const loadAll = useCallback(async () => {
    if (!clientId) { navigate("/connexion"); return; }
    setLoading(true);
    try {
      const [seaRes, coursRes, progRes, notifRes, profilRes] = await Promise.allSettled([
        axios.get(`${API}/seances?client_id=${clientId}`),
        axios.get(`${API}/cours`),
        axios.get(`${API}/progression/by-category?client_id=${clientId}`),
        axios.get(`${API}/notifications?client_id=${clientId}`),
        axios.get(`${API}/clients/${clientId}`),
      ]);
      if (seaRes.status    === "fulfilled") setSeances(seaRes.value.data);
      if (coursRes.status  === "fulfilled") setCours(coursRes.value.data);
      if (progRes.status   === "fulfilled") setProgression(progRes.value.data || []);
      if (notifRes.status  === "fulfilled") setNotifs(notifRes.value.data || []);
      if (profilRes.status === "fulfilled") setProfil(profilRes.value.data);
    } catch {}
    setLoading(false);
  }, [clientId, navigate]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── marquer comme lu ── */
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

  /* ── computed ── */
  const isPrivee         = (n) => n.client_id !== null;
  const seancesFutures   = seances.filter(s => s.statut === "planifiee");
  const seancesTerminees = seances.filter(s => s.statut === "terminee");
  const totalCours       = cours.length;
  const coursCompletes   = Array.isArray(progression)
    ? progression.reduce((a, c) => a + (c.completed || 0), 0) : 0;
  const progPct   = totalCours > 0 ? Math.round((coursCompletes / totalCours) * 100) : 0;
  const nbNonLus  = notifications.filter(n => !n.lu).length;

  const TABS = [
    { key: "accueil", icon: "🏠", label: "Accueil" },
    { key: "seances", icon: "🚗", label: "Mes Séances" },
    { key: "cours",   icon: "📚", label: "Mes Cours" },
    { key: "quiz",    icon: "📝", label: "Quiz QCM" },
    { key: "notifs",  icon: "🔔", label: "Notifications", badge: nbNonLus },
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
          <div className="cd-user-avatar">{initiales}</div>
          <div className="cd-user-info">
            <div className="cd-user-name">{profil?.prenom} {profil?.nom}</div>
            <div className="cd-user-role">🎓 Élève</div>
          </div>
        </div>

        <nav className="cd-nav">
          {TABS.map(t => (
            <button key={t.key}
              className={`cd-nav-btn ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}>
              <span className="cd-nav-icon">{t.icon}</span>
              <span className="cd-nav-label">{t.label}</span>
              {t.badge > 0 && <span className="cd-nav-badge">{t.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="cd-sidebar-footer">
          <button className="cd-nav-btn" onClick={() => navigate("/profil")}>
            <span className="cd-nav-icon">👤</span>
            <span className="cd-nav-label">Mon Profil</span>
          </button>
          <button className="cd-nav-btn" onClick={() => navigate("/")}>
            <span className="cd-nav-icon">🏠</span>
            <span className="cd-nav-label">Accueil site</span>
          </button>
          <button className="cd-nav-btn logout" onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            navigate("/connexion");
          }}>
            <span className="cd-nav-icon">🚪</span>
            <span className="cd-nav-label">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="cd-main">

        {/* ══ ACCUEIL ══ */}
        {tab === "accueil" && (
          <div className="cd-section">
            <div className="cd-welcome">
              <div>
                <h2 className="cd-welcome-title">Bonjour, {profil?.prenom} 👋</h2>
                <p className="cd-welcome-sub">Voici votre espace personnel Auto École Narjiss</p>
              </div>
              <div className="cd-welcome-date">
                {new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long"})}
              </div>
            </div>

            {/* Stats */}
            <div className="cd-stats-grid">
              {[
                { icon:"🚗", label:"Séances planifiées",  val:seancesFutures.length,  color:"#2563eb", bg:"#eff6ff" },
                { icon:"✅", label:"Séances terminées",   val:seancesTerminees.length, color:"#15803d", bg:"#f0fdf4" },
                { icon:"📚", label:"Cours complétés",     val:coursCompletes,          color:"#7c3aed", bg:"#f5f3ff" },
                { icon:"🎯", label:"Progression globale", val:`${progPct}%`,           color:"#e63946", bg:"#fff1f2" },
              ].map((s,i) => (
                <div key={i} className="cd-stat-card" style={{"--cc":s.color,"--cb":s.bg}}>
                  <div className="cd-stat-top">
                    <span className="cd-stat-icon">{s.icon}</span>
                    <span className="cd-stat-val">{s.val}</span>
                  </div>
                  <div className="cd-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progression */}
            <div className="cd-card cd-prog-card">
              <div className="cd-card-head">📊 Progression globale des cours</div>
              <div className="cd-prog-body">
                <div className="cd-prog-info">
                  <span>{coursCompletes} cours sur {totalCours} complétés</span>
                  <span className="cd-prog-pct" style={{color:progPct>=70?"#15803d":progPct>=40?"#a16207":"#e63946"}}>{progPct}%</span>
                </div>
                <div className="cd-prog-track">
                  <div className="cd-prog-fill" style={{
                    width:`${progPct}%`,
                    background:progPct>=70?"linear-gradient(90deg,#22c55e,#15803d)":progPct>=40?"linear-gradient(90deg,#fbbf24,#d97706)":"linear-gradient(90deg,#f87171,#e63946)"
                  }}/>
                </div>
              </div>
              {Array.isArray(progression) && progression.length > 0 && (
                <div className="cd-prog-cats">
                  {progression.map((cat,i) => {
                    const pct = cat.total > 0 ? Math.round((cat.completed/cat.total)*100) : 0;
                    const cc  = CAT_COLORS[cat.categorie] || CAT_COLORS.autre;
                    return (
                      <div key={i} className="cd-prog-cat">
                        <div className="cd-prog-cat-head">
                          <span style={{background:cc.bg,color:cc.color,padding:"2px 8px",borderRadius:20,fontSize:12,fontWeight:700}}>{cc.icon} {cat.categorie}</span>
                          <span style={{fontSize:12,color:"#64748b"}}>{cat.completed}/{cat.total}</span>
                        </div>
                        <div className="cd-prog-track" style={{height:6}}>
                          <div className="cd-prog-fill" style={{width:`${pct}%`,background:cc.color}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prochaine séance */}
            {seancesFutures.length > 0 && (
              <div className="cd-card">
                <div className="cd-card-head">📅 Prochaine séance</div>
                <div className="cd-next-seance">
                  <div className="cd-next-icon">🚗</div>
                  <div className="cd-next-info">
                    <div className="cd-next-date">
                      {new Date(seancesFutures[0].date).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}
                    </div>
                    <div className="cd-next-detail">
                      ⏰ {seancesFutures[0].heure_debut} – {seancesFutures[0].heure_fin}
                      {seancesFutures[0].moniteur && <> &nbsp;·&nbsp; 👨‍🏫 {seancesFutures[0].moniteur.prenom} {seancesFutures[0].moniteur.nom}</>}
                    </div>
                  </div>
                  <div className="cd-next-badge" style={{background:"#dbeafe",color:"#1d4ed8"}}>Planifiée</div>
                </div>
              </div>
            )}

            {/* Dernières notifs non lues */}
            {nbNonLus > 0 && (
              <div className="cd-card">
                <div className="cd-card-head" style={{justifyContent:"space-between"}}>
                  <span>🔔 Nouvelles notifications ({nbNonLus})</span>
                  <button className="cd-btn-sm" onClick={() => setTab("notifs")}>Voir tout →</button>
                </div>
                <div style={{padding:"8px 0"}}>
                  {notifications.filter(n=>!n.lu).slice(0,3).map(n => (
                    <div key={n.id} className={`cd-notif-item unread ${isPrivee(n)?"privee":""}`}
                      style={{margin:"8px 16px",borderRadius:12,cursor:"pointer"}}
                      onClick={() => { marquerLu(n.id); setTab("notifs"); }}>
                      <div className="cd-notif-icon">{n.icon || "🔔"}</div>
                      <div className="cd-notif-body">
                        <div className="cd-notif-title">{n.titre}</div>
                        <div className="cd-notif-msg" style={{fontSize:11.5,color:"#64748b"}}>{n.message?.slice(0,70)}…</div>
                      </div>
                      {isPrivee(n) && <span className="cd-badge-prive">Pour toi</span>}
                      <div className="cd-notif-dot"/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="cd-quick-links">
              {[
                { icon:"📚", label:"Voir les cours",   action: () => navigate("/cours") },
                { icon:"🚗", label:"Planifier séance", action: () => navigate("/seances") },
                { icon:"📝", label:"Passer le quiz",   action: () => setTab("quiz") },
                { icon:"👤", label:"Mon profil",       action: () => navigate("/profil") },
              ].map((l,i) => (
                <button key={i} className="cd-quick-btn" onClick={l.action}>
                  <span>{l.icon}</span>{l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ SÉANCES ══ */}
        {tab === "seances" && (
          <div className="cd-section">
            <div className="cd-section-head">
              <h3 className="cd-title">🚗 Mes Séances de Conduite</h3>
              <button className="cd-btn-primary" onClick={() => navigate("/seances")}>+ Planifier</button>
            </div>
            <div className="cd-sea-stats">
              {Object.entries(STATUT_SEANCE).map(([key,val]) => {
                const cnt = seances.filter(s => s.statut === key).length;
                return (
                  <div key={key} className="cd-sea-stat" style={{background:val.bg,color:val.color}}>
                    <span className="cd-sea-stat-icon">{val.icon}</span>
                    <span className="cd-sea-stat-val">{cnt}</span>
                    <span className="cd-sea-stat-lbl">{val.label}</span>
                  </div>
                );
              })}
            </div>
            {seances.length === 0 ? (
              <div className="cd-empty">
                <div>🚗</div>
                <p>Aucune séance pour l'instant.</p>
                <button className="cd-btn-primary" onClick={() => navigate("/seances")}>Planifier une séance</button>
              </div>
            ) : (
              <div className="cd-sea-list">
                {seances.map(s => {
                  const st = STATUT_SEANCE[s.statut] || STATUT_SEANCE.annulee;
                  return (
                    <div key={s.id} className="cd-sea-item">
                      <div className="cd-sea-icon" style={{background:st.bg,color:st.color}}>{st.icon}</div>
                      <div className="cd-sea-body">
                        <div className="cd-sea-date">
                          📅 {new Date(s.date).toLocaleDateString("fr-FR",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}
                          <span style={{color:"#94a3b8",marginLeft:10}}>⏰ {s.heure_debut} – {s.heure_fin}</span>
                        </div>
                        <div className="cd-sea-meta">
                          {s.moniteur && <span>👨‍🏫 {s.moniteur.prenom} {s.moniteur.nom}</span>}
                          {s.vehicule  && <span>🚗 {s.vehicule.marque} {s.vehicule.modele}</span>}
                        </div>
                        {s.notes && <div className="cd-sea-notes">📝 {s.notes}</div>}
                      </div>
                      <div className="cd-sea-badge" style={{background:st.bg,color:st.color}}>{st.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ COURS ══ */}
        {tab === "cours" && (
          <div className="cd-section">
            <div className="cd-section-head">
              <h3 className="cd-title">📚 Mes Cours</h3>
              <button className="cd-btn-primary" onClick={() => navigate("/cours")}>Voir tout →</button>
            </div>
            <div className="cd-card cd-prog-card" style={{marginBottom:24}}>
              <div className="cd-card-head">🎯 Progression globale</div>
              <div className="cd-prog-body">
                <div className="cd-prog-info">
                  <span>{coursCompletes} / {totalCours} cours complétés</span>
                  <span className="cd-prog-pct">{progPct}%</span>
                </div>
                <div className="cd-prog-track">
                  <div className="cd-prog-fill" style={{width:`${progPct}%`,background:"linear-gradient(90deg,#e63946,#c1121f)"}}/>
                </div>
              </div>
            </div>
            {cours.length === 0 ? (
              <div className="cd-empty"><div>📚</div><p>Aucun cours disponible.</p></div>
            ) : (
              <div className="cd-cours-grid">
                {cours.map(c => {
                  const catCols   = CAT_COLORS[c.categorie] || CAT_COLORS.autre;
                  const isComplete = Array.isArray(progression)
                    ? progression.some(p => p.categorie === c.categorie && p.completed > 0) : false;
                  return (
                    <div key={c.id} className={`cd-cours-card ${isComplete?"completed":""}`}
                      onClick={() => navigate(`/cours/${c.id}`)}>
                      {c.image && (
                        <div className="cd-cours-img" style={{backgroundImage:`url(${c.image})`}}>
                          <div className="cd-cours-img-overlay"/>
                        </div>
                      )}
                      <div className="cd-cours-body">
                        <div className="cd-cours-cat" style={{background:catCols.bg,color:catCols.color}}>{catCols.icon} {c.categorie}</div>
                        <h4 className="cd-cours-titre">{c.titre}</h4>
                        <p className="cd-cours-desc">{c.description?.slice(0,80)}{c.description?.length>80?"…":""}</p>
                        <div className="cd-cours-foot">
                          <span className="cd-cours-niveau">{c.niveau}</span>
                          {isComplete && <span className="cd-cours-done">✅ Complété</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ QUIZ ══ */}
        {tab === "quiz" && (
          <div className="cd-section">
            <div className="cd-section-head"><h3 className="cd-title">📝 Quiz QCM</h3></div>
            <div className="cd-quiz-grid">
              {[
                { key:"danger",       label:"Danger",       icon:"⚠️", color:"#e63946", bg:"#fee2e2", desc:"Panneaux de danger" },
                { key:"indication",   label:"Indication",   icon:"ℹ️", color:"#2563eb", bg:"#dbeafe", desc:"Panneaux d'indication" },
                { key:"interdiction", label:"Interdiction",  icon:"🚫", color:"#c2410c", bg:"#fff7ed", desc:"Panneaux d'interdiction" },
                { key:"code_route",   label:"Code Route",   icon:"📋", color:"#7c3aed", bg:"#f5f3ff", desc:"Règles du code de la route" },
                { key:"conduite",     label:"Conduite",     icon:"🚗", color:"#059669", bg:"#ecfdf5", desc:"Techniques de conduite" },
                { key:"autre",        label:"Autre",        icon:"📌", color:"#64748b", bg:"#f8fafc", desc:"Questions diverses" },
              ].map(cat => (
                <div key={cat.key} className="cd-quiz-card" style={{"--qc":cat.color,"--qb":cat.bg}}
                  onClick={() => navigate(`/quiz?categorie=${cat.key}`)}>
                  <div className="cd-quiz-icon">{cat.icon}</div>
                  <div className="cd-quiz-label">{cat.label}</div>
                  <div className="cd-quiz-desc">{cat.desc}</div>
                  <div className="cd-quiz-arrow">→</div>
                </div>
              ))}
            </div>
            <div className="cd-quiz-hint">
              💡 Entraînez-vous sur chaque catégorie pour préparer votre examen du code de la route !
            </div>
          </div>
        )}

        {/* ══ NOTIFICATIONS ══ */}
        {tab === "notifs" && (
          <div className="cd-section">
            <div className="cd-section-head">
              <h3 className="cd-title">🔔 Notifications
                {nbNonLus > 0 && <span className="cd-notif-count">{nbNonLus} non lu{nbNonLus>1?"es":""}</span>}
              </h3>
              {nbNonLus > 0 && (
                <button className="cd-btn-sm" onClick={marquerToutLu}>✓ Tout marquer comme lu</button>
              )}
            </div>

            {/* légende */}
            <div className="cd-notif-legende">
              <span className="cd-badge-prive" style={{fontSize:11}}>Pour toi</span>
              <span style={{fontSize:12,color:"#64748b"}}>= Notification personnelle</span>
              <span style={{fontSize:12,color:"#94a3b8",marginLeft:16}}>| Sans badge = Notification générale</span>
            </div>

            {notifications.length === 0 ? (
              <div className="cd-empty">
                <div>🔔</div>
                <p>Aucune notification pour l'instant.</p>
              </div>
            ) : (
              <div className="cd-notif-list">
                {notifications.map(n => {
                  const prive = isPrivee(n);
                  return (
                    <div key={n.id}
                      className={`cd-notif-item ${!n.lu?"unread":""} ${prive?"privee":""}`}
                      onClick={() => !n.lu && marquerLu(n.id)}
                      style={{cursor: !n.lu ? "pointer" : "default"}}>

                      <div className="cd-notif-icon-wrap">
                        <div className="cd-notif-icon">{n.icon || "🔔"}</div>
                      </div>

                      <div className="cd-notif-body">
                        <div className="cd-notif-header">
                          <span className="cd-notif-title">{n.titre}</span>
                          <div className="cd-notif-badges">
                            {prive && <span className="cd-badge-prive">Pour toi</span>}
                            {!n.lu  && <span className="cd-badge-new">Nouveau</span>}
                          </div>
                        </div>
                        <div className="cd-notif-msg">{n.message}</div>
                        <div className="cd-notif-date">
                          {new Date(n.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                        </div>
                      </div>

                      {!n.lu && <div className="cd-notif-dot"/>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
