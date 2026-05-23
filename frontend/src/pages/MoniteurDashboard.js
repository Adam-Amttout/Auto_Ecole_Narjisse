import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MoniteurDashboard.css";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const STATUT = {
  planifiee:  { label: "Planifiée",   bg: "#dbeafe", color: "#1d4ed8", icon: "📅" },
  en_cours:   { label: "En cours",    bg: "#fef9c3", color: "#a16207", icon: "🚗" },
  terminee:   { label: "Terminée",    bg: "#dcfce7", color: "#15803d", icon: "✅" },
  annulee:    { label: "Annulée",     bg: "#fee2e2", color: "#b91c1c", icon: "❌" },
};

function Badge({ text, bg, color }) {
  return (
    <span style={{
      background: bg, color, borderRadius: 20, padding: "3px 12px",
      fontSize: 12, fontWeight: 700, display: "inline-block",
    }}>{text}</span>
  );
}

export default function MoniteurDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [moniteur,  setMoniteur]  = useState(null);
  const [seances,   setSeances]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [filter,    setFilter]    = useState("all"); // all | planifiee | terminee | annulee
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState({ show: false, msg: "", ok: true });

  const showToast = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/connexion");
  };

  useEffect(() => {
    if (!user?.email) { setError("Session invalide."); setLoading(false); return; }
    axios.get(`${API}/seances/moniteur-by-email`, { params: { email: user.email } })
      .then(res => {
        setMoniteur(res.data.moniteur);
        setSeances(res.data.seances);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          // Moniteur account exists in clients but not yet linked in moniteurs table
          setError(
            "Votre compte moniteur n'est pas encore associé à un moniteur dans le système. " +
            "Contactez l'administrateur pour finaliser la configuration."
          );
        } else {
          setError("Impossible de charger vos séances.");
        }
      })
      .finally(() => setLoading(false));
  }, [user?.email]);

  const filtered = useMemo(() => {
    let s = seances;
    if (filter !== "all") s = s.filter(x => x.statut === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter(x =>
        (x.client?.nom + " " + x.client?.prenom).toLowerCase().includes(q) ||
        x.date?.includes(q)
      );
    }
    return s;
  }, [seances, filter, search]);

  // Stats
  const stats = useMemo(() => ({
    total:      seances.length,
    planifiees: seances.filter(s => s.statut === "planifiee").length,
    terminees:  seances.filter(s => s.statut === "terminee").length,
    annulees:   seances.filter(s => s.statut === "annulee").length,
    eleves:     [...new Set(seances.map(s => s.client_id))].length,
  }), [seances]);

  // Next upcoming session
  const prochaine = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return seances
      .filter(s => s.statut === "planifiee" && s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.heure_debut.localeCompare(b.heure_debut))[0] || null;
  }, [seances]);

  return (
    <div className="md-root">
      {/* ── TOAST ── */}
      {toast.show && (
        <div className={`md-toast ${toast.ok ? "ok" : "err"}`}>{toast.msg}</div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="md-sidebar">
        <div className="md-sidebar-brand">
          <div className="md-logo">🧑‍🏫</div>
          <div>
            <div className="md-brand-name">Auto École</div>
            <div className="md-brand-sub">Narjiss</div>
          </div>
        </div>

        <div className="md-profile-card">
          <div className="md-avatar">{user.prenom?.[0]}{user.nom?.[0]}</div>
          <div className="md-profile-info">
            <div className="md-profile-name">{user.prenom} {user.nom}</div>
            <div className="md-profile-role">🧑‍🏫 Moniteur</div>
            {moniteur?.telephone && (
              <div className="md-profile-tel">📞 {moniteur.telephone}</div>
            )}
          </div>
        </div>

        <nav className="md-nav">
          <div className="md-nav-item active">📊 Dashboard</div>
          <div className="md-nav-item" onClick={() => navigate("/profil")} style={{cursor:"pointer"}}>👤 Mon Profil</div>
        </nav>

        <button className="md-logout" onClick={handleLogout}>🚪 Déconnexion</button>
      </aside>

      {/* ── MAIN ── */}
      <main className="md-main">
        <header className="md-header">
          <div>
            <h1 className="md-header-title">Bonjour, {user.prenom} 👋</h1>
            <p className="md-header-sub">📊 Tableau de bord — Vos séances de conduite planifiées</p>
          </div>
        </header>

        {loading ? (
          <div className="md-loading">
            <div className="md-spinner"/>
            <p>Chargement de vos séances…</p>
          </div>
        ) : error ? (
          <div className="md-error-card">
            <div className="md-error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* ── PROCHAINE SÉANCE ── */}
            {prochaine && (
              <div className="md-next-session">
                <div className="md-next-label">🚀 Prochaine séance</div>
                <div className="md-next-info">
                  <span className="md-next-date">
                    📅 {new Date(prochaine.date).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
                  </span>
                  <span className="md-next-time">🕐 {prochaine.heure_debut} – {prochaine.heure_fin}</span>
                  <span className="md-next-student">
                    👤 {prochaine.client?.prenom} {prochaine.client?.nom}
                  </span>
                  {prochaine.vehicule && (
                    <span className="md-next-vehicle">🚗 {prochaine.vehicule.marque} {prochaine.vehicule.modele}</span>
                  )}
                </div>
              </div>
            )}

            {/* ── STATS ── */}
            <div className="md-stats-grid">
              {[
                { label: "Total séances",  val: stats.total,      icon: "📋", color: "#6366f1" },
                { label: "Planifiées",     val: stats.planifiees, icon: "📅", color: "#2563eb" },
                { label: "Terminées",      val: stats.terminees,  icon: "✅", color: "#16a34a" },
                { label: "Élèves uniques", val: stats.eleves,     icon: "👥", color: "#0891b2" },
              ].map(s => (
                <div className="md-stat-card" key={s.label} style={{"--accent": s.color}}>
                  <div className="md-stat-icon">{s.icon}</div>
                  <div className="md-stat-val" style={{ color: s.color }}>{s.val}</div>
                  <div className="md-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── FILTERS & SEARCH ── */}
            <div className="md-toolbar">
              <input
                className="md-search"
                type="text"
                placeholder="🔍 Rechercher un élève ou une date…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="md-filters">
                {["all", "planifiee", "en_cours", "terminee", "annulee"].map(f => (
                  <button
                    key={f}
                    className={`md-filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all" ? "Toutes" : STATUT[f]?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── TABLE ── */}
            <div className="md-table-card">
              {filtered.length === 0 ? (
                <div className="md-empty">
                  <div className="md-empty-icon">📭</div>
                  <p>Aucune séance trouvée</p>
                </div>
              ) : (
                <div className="md-table-wrap">
                  <table className="md-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Horaire</th>
                        <th>Élève</th>
                        <th>Email élève</th>
                        <th>Véhicule</th>
                        <th>Statut</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(s => (
                        <tr key={s.id} className={s.statut === "planifiee" ? "md-row-upcoming" : ""}>
                          <td>
                            <div className="md-date-cell">
                              <span className="md-date-main">
                                {new Date(s.date).toLocaleDateString("fr-FR", { day:"2-digit", month:"short" })}
                              </span>
                              <span className="md-date-year">
                                {new Date(s.date).getFullYear()}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="md-time-cell">
                              <span>{s.heure_debut}</span>
                              <span className="md-time-sep">→</span>
                              <span>{s.heure_fin}</span>
                            </div>
                          </td>
                          <td>
                            <div className="md-student-cell">
                              <div className="md-student-avatar">
                                {s.client?.prenom?.[0]}{s.client?.nom?.[0]}
                              </div>
                              <div>
                                <div className="md-student-name">{s.client?.prenom} {s.client?.nom}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: "#64748b", fontSize: 12 }}>{s.client?.email || "—"}</td>
                          <td>
                            {s.vehicule
                              ? <span style={{ fontSize: 13 }}>🚗 {s.vehicule.marque} {s.vehicule.modele}</span>
                              : <span style={{ color: "#94a3b8" }}>—</span>
                            }
                          </td>
                          <td>
                            <Badge
                              text={`${STATUT[s.statut]?.icon} ${STATUT[s.statut]?.label}`}
                              bg={STATUT[s.statut]?.bg}
                              color={STATUT[s.statut]?.color}
                            />
                          </td>
                          <td>
                            {s.notes
                              ? <span className="md-note" title={s.notes}>{s.notes.substring(0, 30)}{s.notes.length > 30 ? "…" : ""}</span>
                              : <span style={{ color: "#cbd5e1" }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
