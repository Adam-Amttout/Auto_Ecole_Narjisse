import React, { useEffect, useState, useCallback } from "react";
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

  // Dossier Administratif
  const [dossier,       setDossier]       = useState(null);
  const [documents,     setDocuments]     = useState([]);
  const [uploadingDoc,  setUploadingDoc]  = useState(false);
  const [uploadType,    setUploadType]    = useState("cin");

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
      const [seaRes, coursRes, progRes, notifRes, profilRes, examHistRes, examStatsRes, dossierRes] = await Promise.allSettled([
        axios.get(`${API}/seances?client_id=${clientId}`),
        axios.get(`${API}/cours`),
        axios.get(`${API}/progression/by-category?client_id=${clientId}`),
        axios.get(`${API}/notifications?client_id=${clientId}`),
        axios.get(`${API}/clients/${clientId}`),
        axios.get(`${API}/exam/results?client_id=${clientId}`),
        axios.get(`${API}/exam/stats?client_id=${clientId}`),
        axios.get(`${API}/dossiers/${clientId}`),
      ]);
      if (seaRes.status    === "fulfilled") setSeances(seaRes.value.data);
      if (coursRes.status  === "fulfilled") setCours(coursRes.value.data);
      if (progRes.status   === "fulfilled") setProgression(progRes.value.data || []);
      if (notifRes.status  === "fulfilled") setNotifs(notifRes.value.data || []);
      if (profilRes.status === "fulfilled") setProfil(profilRes.value.data);
      if (examHistRes.status  === "fulfilled") setExamHistory(examHistRes.value.data);
      if (examStatsRes.status === "fulfilled") setExamStats(examStatsRes.value.data);
      if (dossierRes.status  === "fulfilled") {
        setDossier(dossierRes.value.data.dossier);
        setDocuments(dossierRes.value.data.documents || []);
      }
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
  
  // Dossier upload handler
  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDoc(true);
    const form = new FormData();
    form.append("fichier", file);
    form.append("type", uploadType);
    try {
      const res = await axios.post(`${API}/dossiers/${clientId}/documents`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocuments(prev => {
        const filtered = prev.filter(d => d.type !== uploadType);
        return [res.data, ...filtered];
      });
    } catch { alert("Erreur lors de l'upload."); }
    setUploadingDoc(false);
    e.target.value = "";
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Supprimer ce document ?")) return;
    try {
      await axios.delete(`${API}/documents/${docId}`);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch { alert("Erreur de suppression."); }
  };

  // TABS: Cleaned up sidebar to avoid navbar duplicates
  const TABS = [
    { key: "accueil", icon: "🏠", label: "Tableau de Bord" },
    { key: "dossier", icon: "📂", label: "Mon Dossier" },
    { key: "exam",    icon: "🚦", label: "Examen Blanc" },
    { key: "stats",   icon: "📊", label: "Statistiques" },
    { key: "notifs",  icon: "🔔", label: "Historique", badge: nbNonLus },
  ];

  if (loading) return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1d3557 0%, #0f2744 100%)",
      animation: "fadeInLoader 0.2s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');

        @keyframes fadeInLoader {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cd-pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.8; }
          50%  { transform: scale(1.08); opacity: 0.4; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }
        @keyframes cd-logo-bounce {
          0%, 100% { transform: translateY(0px); }
          40%       { transform: translateY(-10px); }
          70%       { transform: translateY(-5px); }
        }
        @keyframes cd-progress-fill {
          0%   { width: 0%; }
          20%  { width: 25%; }
          50%  { width: 55%; }
          80%  { width: 80%; }
          100% { width: 95%; }
        }
        @keyframes cd-dots-fade {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes cd-text-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .cd-ldot:nth-child(1) { animation: cd-dots-fade 1.2s ease-in-out 0.0s infinite; }
        .cd-ldot:nth-child(2) { animation: cd-dots-fade 1.2s ease-in-out 0.2s infinite; }
        .cd-ldot:nth-child(3) { animation: cd-dots-fade 1.2s ease-in-out 0.4s infinite; }
      `}</style>

      {/* Pulse rings + Logo */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        <div style={{
          position: "absolute", inset: -18, borderRadius: "50%",
          background: "rgba(230,57,70,0.18)",
          animation: "cd-pulse-ring 1.8s ease-in-out infinite",
        }}/>
        <div style={{
          position: "absolute", inset: -8, borderRadius: "50%",
          background: "rgba(230,57,70,0.1)",
          animation: "cd-pulse-ring 1.8s ease-in-out 0.3s infinite",
        }}/>
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: "linear-gradient(135deg, #e63946, #c1121f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40,
          boxShadow: "0 12px 40px rgba(230,57,70,0.5)",
          animation: "cd-logo-bounce 1.8s ease-in-out infinite",
          position: "relative", zIndex: 2,
        }}>
          🚗
        </div>
      </div>

      {/* Brand name shimmer */}
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 22, fontWeight: 800,
        background: "linear-gradient(90deg, #ffffff 0%, #fca5a5 40%, #ffffff 80%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "cd-text-shimmer 2s linear infinite",
        marginBottom: 4,
      }}>
        Auto École Narjiss
      </div>

      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 11, fontWeight: 500,
        color: "rgba(255,255,255,0.4)",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: 32,
      }}>
        Chargement de votre espace…
      </div>

      {/* Progress bar */}
      <div style={{
        width: 180, height: 3,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 10, overflow: "hidden",
        marginBottom: 20,
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #e63946, #ff6b6b)",
          borderRadius: 10,
          animation: "cd-progress-fill 1.8s ease-in-out infinite",
        }}/>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} className="cd-ldot" style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: "#e63946",
          }}/>
        ))}
      </div>
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
                <p className="cd-welcome-sub">
                  {new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}
                </p>
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <button className="cd-btn-primary" onClick={() => navigate("/cours")}>
                  📚 Continuer les cours
                </button>
                <button className="cd-btn-outline" onClick={() => setTab("exam")}>
                  🚦 Passer un examen
                </button>
              </div>
            </div>

            {/* ── EXAM READINESS METER ── */}
            {(() => {
              const avg = examStats?.avg_score || 0;
              const totalExams = examHistory.length;
              const reussis = examStats?.reussis || 0;
              // Readiness score: weighted avg of score%, success rate, nb of exams
              const scorePct   = (avg / 40) * 100;
              const successPct = totalExams > 0 ? (reussis / totalExams) * 100 : 0;
              const expPct     = Math.min(totalExams * 10, 100);
              const readiness  = Math.round((scorePct * 0.5) + (successPct * 0.3) + (expPct * 0.2));
              const rColor = readiness >= 75 ? "#15803d" : readiness >= 50 ? "#d97706" : "#e63946";
              const rBg    = readiness >= 75 ? "#dcfce7" : readiness >= 50 ? "#fef9c3" : "#fee2e2";
              const rMsg   = readiness >= 75 ? "Excellent ! Tu es prêt pour l'examen 🎉"
                           : readiness >= 50 ? "Bon niveau, continue à t'entraîner 💪"
                           : "Continue d'apprendre, tu progresses ! 📖";
              return (
                <div className="cd-readiness-card" style={{borderLeft:`5px solid ${rColor}`, background: rBg}}>
                  <div className="cd-readiness-left">
                    <div className="cd-readiness-label">🎯 Niveau de préparation à l'examen</div>
                    <div className="cd-readiness-msg" style={{color: rColor}}>{rMsg}</div>
                    <div className="cd-readiness-bar-wrap">
                      <div className="cd-readiness-bar" style={{width:`${readiness}%`, background: rColor}}/>
                    </div>
                  </div>
                  <div className="cd-readiness-pct" style={{color: rColor}}>{readiness}%</div>
                </div>
              );
            })()}

            {/* ── QUICK ACTIONS ── */}
            <div className="cd-quick-actions">
              {[
                { icon:"🚗", label:"Mes Séances", sub:"Voir planning", action:() => navigate("/seances"), color:"#1d4ed8", bg:"#eff6ff" },
                { icon:"📚", label:"Cours",        sub:"Continuer",     action:() => navigate("/cours"),   color:"#7c3aed", bg:"#f5f3ff" },
                { icon:"📝", label:"QCM",          sub:"S'entraîner",   action:() => navigate("/qcm"),     color:"#059669", bg:"#f0fdf4" },
                { icon:"🚦", label:"Examen Blanc", sub:"Me tester",     action:() => setTab("exam"),       color:"#e63946", bg:"#fff1f2" },
                { icon:"👤", label:"Mon Profil",   sub:"Modifier",      action:() => navigate("/profil"),  color:"#d97706", bg:"#fffbeb" },
                { icon:"📊", label:"Statistiques", sub:"Voir tout",     action:() => setTab("stats"),      color:"#0891b2", bg:"#f0f9ff" },
              ].map((a,i) => (
                <button key={i} className="cd-quick-action-btn" onClick={a.action}
                  style={{"--qa-color": a.color, "--qa-bg": a.bg}}>
                  <span className="cd-qa-icon">{a.icon}</span>
                  <span className="cd-qa-label">{a.label}</span>
                  <span className="cd-qa-sub">{a.sub}</span>
                </button>
              ))}
            </div>

            {/* ── 2-COL: Score card + Countdown ── */}
            <div className="cd-widgets-row">
              {/* Score + badges */}
              <div className="cd-widget-card score-card">
                <div className="score-icon">🏆</div>
                <div className="score-info">
                  <span className="score-label">Meilleur Score</span>
                  <span className="score-val">{examStats?.best_score || 0}<small>/40</small></span>
                </div>
                <div className="score-info">
                  <span className="score-label">Moyenne Générale</span>
                  <span className="score-val" style={{color:"#fff"}}>{examStats?.avg_score || 0}</span>
                </div>
                {examHistory.length > 0 && (
                  <div className="cd-last-score-badge">
                    <span>Dernier QCM : </span>
                    <strong style={{color: examHistory[0]?.reussi ? "#4ade80" : "#f87171"}}>
                      {examHistory[0]?.score}/40 {examHistory[0]?.reussi ? "✅" : "❌"}
                    </strong>
                  </div>
                )}
              </div>

              {/* Countdown to next séance */}
              {seancesFutures.length > 0 ? (() => {
                const next = seancesFutures[0];
                const nextDate = new Date(`${next.date}T${next.heure_debut || "00:00"}`);
                const now = new Date();
                const diffMs = nextDate - now;
                const diffDays = Math.floor(diffMs / 86400000);
                const diffHrs  = Math.floor((diffMs % 86400000) / 3600000);
                const diffMins = Math.floor((diffMs % 3600000) / 60000);
                const isToday  = diffDays === 0;
                const isSoon   = diffDays <= 1;
                return (
                  <div className="cd-widget-card countdown-card" style={{background: isSoon ? "linear-gradient(135deg,#0f2744,#1d4ed8)" : "linear-gradient(135deg,#0f2744,#1d3557)"}}>
                    <div className="cd-countdown-icon">{isToday ? "⚡" : "📅"}</div>
                    <div className="cd-countdown-label">Prochaine séance</div>
                    <div className="cd-countdown-date">{nextDate.toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"short"})}</div>
                    <div className="cd-countdown-time">{next.heure_debut} – {next.heure_fin}</div>
                    {diffMs > 0 && (
                      <div className="cd-countdown-units">
                        {diffDays > 0 && <div className="cd-cu"><span className="cd-cu-val">{diffDays}</span><span className="cd-cu-lbl">j</span></div>}
                        <div className="cd-cu"><span className="cd-cu-val">{diffHrs}</span><span className="cd-cu-lbl">h</span></div>
                        <div className="cd-cu"><span className="cd-cu-val">{diffMins}</span><span className="cd-cu-lbl">min</span></div>
                      </div>
                    )}
                    {isSoon && <div className="cd-countdown-alert">Bientôt ! Soyez prêt 🚗</div>}
                  </div>
                );
              })() : (
                <div className="cd-widget-card" style={{background:"linear-gradient(135deg,#0f2744,#1d3557)",alignItems:"center",justifyContent:"center",gap:10}}>
                  <div style={{fontSize:36}}>📅</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,textAlign:"center"}}>Aucune séance planifiée</div>
                  <button className="cd-btn-outline-light" onClick={() => navigate("/reservation")}>Réserver une séance</button>
                </div>
              )}
            </div>

            {/* ── QCM SCORE EVOLUTION CHART ── */}
            {examHistory.length >= 2 && (
              <div className="cd-card">
                <div className="cd-card-head" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>📈 Évolution de mes scores QCM</span>
                  <span style={{fontSize:11,color:"#94a3b8",fontWeight:500}}>Note : 35/40 pour réussir</span>
                </div>
                <div style={{height:200, padding:"10px 10px 0 0"}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...examHistory].reverse().slice(-10).map((ex,i) => ({
                      name: `#${i+1}`,
                      Score: ex.score,
                      Seuil: 35,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#94a3b8"}}/>
                      <YAxis domain={[0,40]} axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#94a3b8"}}/>
                      <Tooltip contentStyle={{borderRadius:10,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}
                               formatter={(v,n) => [v, n === "Score" ? "Votre score" : "Seuil réussite"]}/>
                      <Line type="monotone" dataKey="Score" stroke="#e63946" strokeWidth={2.5}
                            dot={{r:4,fill:"#e63946",strokeWidth:2,stroke:"#fff"}} activeDot={{r:6}}/>
                      <Line type="monotone" dataKey="Seuil" stroke="#22c55e" strokeWidth={1.5}
                            strokeDasharray="5 5" dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── Badges ── */}
            <div className="cd-card">
              <div className="cd-card-head">🎖️ Vos Badges</div>
              <div style={{display:'flex',gap:15,padding:'16px 20px',flexWrap:'wrap'}}>
                {[
                  { icon:"🔥", label:"Assiduité",   desc:"10 QCM passés",    earned: has10Qcm },
                  { icon:"🌟", label:"Excellence",  desc:"Moyenne ≥ 35/40",  earned: hasAvg35 },
                  { icon:"🎯", label:"Spécialiste", desc:"1 catégorie finie", earned: hasFinishedCat },
                  { icon:"🚀", label:"Débutant",    desc:"1er examen passé",  earned: examHistory.length >= 1 },
                  { icon:"💎", label:"Expert",      desc:"Score parfait 40",  earned: examHistory.some(e => e.score === 40) },
                ].map((b,i) => (
                  <div key={i} className={`badge-item ${b.earned ? 'active' : 'locked'}`} title={b.desc}
                    style={{position:'relative'}}>
                    <span className="badge-icon">{b.icon}</span>
                    <span>{b.label}</span>
                    {b.earned && <span className="badge-check">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Progressions per category ── */}
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
                        <div className="cd-prog-fill" style={{width: `${pct}%`, background: pct===100?"#22c55e":cc.color}} />
                      </div>
                      <div className="cd-cat-meta">{cat.completed} / {cat.total} leçons {pct===100 && "✅"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}



        {/* ══ DOSSIER ADMINISTRATIF ══ */}
        {tab === "dossier" && (() => {
          const ETAPES = [
            { key: "visite_medicale",          label: "Visite Médicale",               icon: "🏥", desc: "Passer la visite médicale obligatoire" },
            { key: "dossier_depose",            label: "Dossier Déposé",                icon: "📋", desc: "Dépôt du dossier au centre d'immatriculation" },
            { key: "exam_theorique_programme",  label: "Examen Théorique Programmé",   icon: "📝", desc: "Date d'examen du code fixée" },
            { key: "exam_pratique_programme",   label: "Examen Pratique Programmé",    icon: "🚗", desc: "Date d'examen de conduite fixée" },
            { key: "permis_pret",               label: "Permis Prêt",                  icon: "🎉", desc: "Votre permis de conduire est disponible" },
          ];

          const DOC_TYPES = [
            { key: "cin",                label: "Copie CIN",            icon: "🪪", accept: ".jpg,.jpeg,.png,.pdf" },
            { key: "photo",              label: "Photo d'identité",     icon: "📸", accept: ".jpg,.jpeg,.png" },
            { key: "certificat_medical", label: "Certificat Médical",   icon: "🏥", accept: ".jpg,.jpeg,.png,.pdf" },
            { key: "autre",              label: "Autre document",       icon: "📄", accept: ".jpg,.jpeg,.png,.pdf" },
          ];

          const STATUT_DOC = {
            en_attente: { label: "En attente",  bg: "#fef9c3", color: "#a16207", icon: "⏳" },
            valide:     { label: "Validé",      bg: "#dcfce7", color: "#15803d", icon: "✅" },
            rejete:     { label: "Rejeté",      bg: "#fee2e2", color: "#b91c1c", icon: "❌" },
          };

          const etapesOk = dossier ? ETAPES.filter(e => dossier[e.key]).length : 0;
          const progression = dossier?.progression ?? 0;

          return (
            <div className="cd-section fade-in">

              {/* ── BARRE DE PROGRESSION GLOBALE ── */}
              <div className="cd-dossier-hero">
                <div className="cd-dossier-hero-left">
                  <div className="cd-dossier-hero-icon">📂</div>
                  <div>
                    <div className="cd-dossier-hero-title">Mon Dossier Administratif</div>
                    <div className="cd-dossier-hero-sub">{etapesOk} / {ETAPES.length} étapes complétées</div>
                  </div>
                </div>
                <div className="cd-dossier-hero-right">
                  <div className="cd-dossier-pct" style={{
                    color: progression === 100 ? "#15803d" : progression >= 60 ? "#d97706" : "#e63946"
                  }}>{progression}%</div>
                  <div className="cd-dossier-status-lbl">
                    {progression === 100 ? "🎉 Dossier complet !" : "En cours…"}
                  </div>
                </div>
              </div>

              {/* Global progress bar */}
              <div className="cd-dossier-global-track">
                <div className="cd-dossier-global-fill" style={{
                  width: `${progression}%`,
                  background: progression === 100
                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                    : progression >= 60
                    ? "linear-gradient(90deg,#f59e0b,#d97706)"
                    : "linear-gradient(90deg,#e63946,#dc2626)"
                }}/>
              </div>

              {/* ── ÉTAPES ── */}
              <div className="cd-card">
                <div className="cd-card-head">🗂️ Étapes du dossier</div>
                <div className="cd-dossier-steps">
                  {ETAPES.map((etape, idx) => {
                    const done = dossier ? !!dossier[etape.key] : false;
                    const isNext = !done && ETAPES.slice(0, idx).every(e => dossier?.[e.key]);
                    return (
                      <div key={etape.key} className={`cd-dossier-step ${done ? "done" : isNext ? "next" : "pending"}`}>
                        <div className="cd-step-connector">
                          <div className="cd-step-circle">
                            {done ? "✓" : idx + 1}
                          </div>
                          {idx < ETAPES.length - 1 && <div className="cd-step-line" />}
                        </div>
                        <div className="cd-step-body">
                          <div className="cd-step-header">
                            <span className="cd-step-icon">{etape.icon}</span>
                            <span className="cd-step-label">{etape.label}</span>
                            {done && <span className="cd-step-badge done-badge">Complété ✅</span>}
                            {isNext && !done && <span className="cd-step-badge next-badge">⚡ Prochaine étape</span>}
                          </div>
                          <div className="cd-step-desc">{etape.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {dossier?.notes_admin && (
                  <div className="cd-dossier-notes">
                    <span style={{fontWeight:600}}>💬 Note de l'auto-école :</span> {dossier.notes_admin}
                  </div>
                )}
              </div>

              {/* ── UPLOAD DOCUMENTS ── */}
              <div className="cd-card">
                <div className="cd-card-head">📎 Mes Documents</div>

                {/* Upload form */}
                <div className="cd-doc-upload-zone">
                  <div className="cd-doc-upload-row">
                    <div className="cd-doc-type-select-wrap">
                      <label className="cd-doc-select-label">Type de document</label>
                      <select
                        className="cd-doc-type-select"
                        value={uploadType}
                        onChange={e => setUploadType(e.target.value)}
                      >
                        {DOC_TYPES.map(t => (
                          <option key={t.key} value={t.key}>{t.icon} {t.label}</option>
                        ))}
                      </select>
                    </div>
                    <label className={`cd-upload-btn ${uploadingDoc ? "loading" : ""}`}>
                      {uploadingDoc ? "⏳ Upload en cours…" : "📤 Choisir un fichier"}
                      <input
                        type="file"
                        accept={DOC_TYPES.find(t => t.key === uploadType)?.accept}
                        style={{display:"none"}}
                        onChange={handleUploadDocument}
                        disabled={uploadingDoc}
                      />
                    </label>
                  </div>
                  <div className="cd-doc-upload-hint">JPG, PNG ou PDF — max 5 Mo par fichier</div>
                </div>

                {/* Documents list */}
                <div className="cd-doc-list">
                  {documents.length === 0 ? (
                    <div className="cd-doc-empty">
                      <div style={{fontSize:40,marginBottom:10}}>📁</div>
                      <div>Aucun document uploadé pour l'instant.</div>
                      <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>Commencez par uploader votre copie de CIN.</div>
                    </div>
                  ) : (
                    DOC_TYPES.map(dtype => {
                      const doc = documents.find(d => d.type === dtype.key);
                      if (!doc) return null;
                      const st = STATUT_DOC[doc.statut] || STATUT_DOC.en_attente;
                      const isPdf = doc.nom_fichier?.endsWith(".pdf");
                      return (
                        <div key={doc.id} className="cd-doc-item">
                          <div className="cd-doc-item-left">
                            <div className="cd-doc-item-icon">{dtype.icon}</div>
                            <div className="cd-doc-item-info">
                              <div className="cd-doc-item-name">{dtype.label}</div>
                              <div className="cd-doc-item-file">{doc.nom_fichier}</div>
                              {doc.remarque && (
                                <div className="cd-doc-item-remark">💬 {doc.remarque}</div>
                              )}
                            </div>
                          </div>
                          <div className="cd-doc-item-right">
                            <span className="cd-doc-statut-badge" style={{background: st.bg, color: st.color}}>
                              {st.icon} {st.label}
                            </span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="cd-btn-icon view"
                              title="Voir le fichier"
                            >{isPdf ? "📄" : "👁️"}</a>
                            <button
                              className="cd-btn-icon del"
                              title="Supprimer"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >🗑️</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          );
        })()}

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

            {/* ── PERFORMANCE PAR CATEGORIE ── */}
            {examStats?.category_avg && Object.keys(examStats.category_avg).length > 0 && (() => {
              const catAvg = examStats.category_avg;
              const entries = Object.entries(catAvg).sort((a,b) => b[1] - a[1]);
              const bestCat = entries[0];
              const worstCat = entries[entries.length - 1];
              return (
                <>
                  {/* Best / Worst cards */}
                  <div className="cd-cat-stat-row">
                    <div className="cd-cat-trophy-card best">
                      <div className="cd-cat-trophy-icon">🏆</div>
                      <div className="cd-cat-trophy-info">
                        <div className="cd-cat-trophy-label">Meilleure Catégorie</div>
                        <div className="cd-cat-trophy-name">{CAT_COLORS[bestCat[0]]?.icon || "📌"} {bestCat[0]}</div>
                        <div className="cd-cat-trophy-score">{bestCat[1]}%</div>
                      </div>
                    </div>
                    <div className="cd-cat-trophy-card worst">
                      <div className="cd-cat-trophy-icon">📉</div>
                      <div className="cd-cat-trophy-info">
                        <div className="cd-cat-trophy-label">À améliorer</div>
                        <div className="cd-cat-trophy-name">{CAT_COLORS[worstCat[0]]?.icon || "📌"} {worstCat[0]}</div>
                        <div className="cd-cat-trophy-score">{worstCat[1]}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Per-category bars */}
                  <div className="cd-card">
                    <div className="cd-card-head">📈 Performance par Catégorie (QCM)</div>
                    <div className="cd-cat-bars">
                      {entries.map(([cat, pct]) => {
                        const cc = CAT_COLORS[cat] || CAT_COLORS.autre;
                        const color = pct >= 75 ? "#15803d" : pct >= 50 ? "#d97706" : "#e63946";
                        const bg    = pct >= 75 ? "#dcfce7" : pct >= 50 ? "#fef9c3" : "#fee2e2";
                        return (
                          <div key={cat} className="cd-cat-bar-row">
                            <div className="cd-cat-bar-label">
                              <span className="cd-cat-bar-icon" style={{background: cc.bg, color: cc.color}}>{cc.icon}</span>
                              <span className="cd-cat-bar-name">{cat}</span>
                            </div>
                            <div className="cd-cat-bar-track">
                              <div className="cd-cat-bar-fill" style={{width: `${pct}%`, background: color}} />
                            </div>
                            <span className="cd-cat-bar-pct" style={{background: bg, color: color}}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}

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
