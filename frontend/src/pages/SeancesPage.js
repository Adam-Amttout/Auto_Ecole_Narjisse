// src/pages/SeancesPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeancesPage.css";

const API = "http://127.0.0.1:8000/api";

const STATUT = {
  planifiee: { label: "Planifiée",  bg: "#dbeafe", color: "#1d4ed8" },
  en_cours:  { label: "En cours",   bg: "#fef9c3", color: "#a16207" },
  terminee:  { label: "Terminée",   bg: "#dcfce7", color: "#15803d" },
  annulee:   { label: "Annulée",    bg: "#f1f5f9", color: "#64748b" },
};

const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MOIS  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

/** Calcule heure_fin = heure_debut + 30 minutes */
function calcHeureFinAuto(heureDebut) {
  if (!heureDebut) return "";
  const [h, m] = heureDebut.split(":").map(Number);
  const total  = h * 60 + m + 30;
  if (total > 24 * 60) return ""; // dépasse minuit
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export default function SeancesPage() {
  const navigate = useNavigate();
  const client   = JSON.parse(localStorage.getItem("user"));
  const isAdmin  = localStorage.getItem("role") === "admin";
  const today    = new Date().toISOString().split("T")[0];

  /* ── données ── */
  const [seances,   setSeances]   = useState([]);
  const [moniteurs, setMoniteurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading,   setLoading]   = useState(true);

  /* ── vue ── */
  const [vue,     setVue]     = useState("liste");
  const [calDate, setCalDate] = useState(new Date());

  /* ── formulaire ── */
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({
    moniteur_id: "",
    vehicule_id: "",
    date:        "",
    heure_debut: "",
    notes:       "",
  });
  const [formErr, setFormErr] = useState("");
  const [saving,  setSaving]  = useState(false);

  /* ── disponibilité ── */
  const [dispoResult, setDispoResult] = useState(null);

  /* ── détail ── */
  const [detail, setDetail] = useState(null);

  /* ── toast ── */
  const [toast, setToast] = useState({ show: false, msg: "", ok: true });
  const showToast = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  /* ════════ CHARGEMENT ════════ */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = isAdmin ? {} : { client_id: client?.id };
      const [sRes, mRes, vRes] = await Promise.all([
        axios.get(`${API}/seances`, { params }),
        axios.get(`${API}/moniteurs`),
        axios.get(`${API}/vehicules`, { params: { disponibilite: "disponible" } }),
      ]);
      setSeances(sRes.data);
      setMoniteurs(mRes.data);
      setVehicules(vRes.data);
    } catch {
      showToast("Erreur de chargement.", false);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, client?.id]);

  useEffect(() => { load(); }, [load]);

  /* heure_fin calculée automatiquement à chaque changement de heure_debut */
  const heureFin = calcHeureFinAuto(form.heure_debut);

  /* ════════ VÉRIFICATION DISPONIBILITÉ ════════ */
  const checkDisponibilite = () => {
    if (!form.moniteur_id || !form.vehicule_id || !form.date || !form.heure_debut) {
      setDispoResult({ ok: false, msg: "Remplissez tous les champs pour vérifier." });
      return;
    }
    if (!heureFin) {
      setDispoResult({ ok: false, msg: "L'heure de début est trop tardive (fin dépasserait minuit)." });
      return;
    }

    // Vérifier le moniteur
    const conflitMoniteur = seances.find(s =>
      String(s.moniteur_id) === String(form.moniteur_id) &&
      (s.date?.split("T")[0] || s.date) === form.date &&
      s.statut !== "annulee" &&
      s.heure_debut < heureFin &&
      s.heure_fin   > form.heure_debut &&
      (!editing || s.id !== editing.id)
    );
    if (conflitMoniteur) {
      setDispoResult({ ok: false, msg: `❌ Le moniteur est déjà réservé de ${conflitMoniteur.heure_debut} à ${conflitMoniteur.heure_fin}.` });
      return;
    }

    // Vérifier le véhicule
    const conflitVehicule = seances.find(s =>
      String(s.vehicule_id) === String(form.vehicule_id) &&
      (s.date?.split("T")[0] || s.date) === form.date &&
      s.statut !== "annulee" &&
      s.heure_debut < heureFin &&
      s.heure_fin   > form.heure_debut &&
      (!editing || s.id !== editing.id)
    );
    if (conflitVehicule) {
      setDispoResult({ ok: false, msg: `❌ Ce véhicule est déjà réservé de ${conflitVehicule.heure_debut} à ${conflitVehicule.heure_fin}.` });
      return;
    }

    // Vérifier que le créneau n'est pas déjà pris (1 seul élève par créneau)
    const conflitCreneau = seances.find(s =>
      (s.date?.split("T")[0] || s.date) === form.date &&
      s.heure_debut === form.heure_debut &&
      s.statut !== "annulee" &&
      (!editing || s.id !== editing.id)
    );
    if (conflitCreneau) {
      setDispoResult({ ok: false, msg: "❌ Ce créneau est déjà pris. Un seul élève par créneau." });
      return;
    }

    // Vérifier que l'élève n'a pas déjà une séance ce créneau
    if (!isAdmin) {
      const conflitEleve = seances.find(s =>
        String(s.client_id) === String(client?.id) &&
        (s.date?.split("T")[0] || s.date) === form.date &&
        s.statut !== "annulee" &&
        s.heure_debut < heureFin &&
        s.heure_fin   > form.heure_debut &&
        (!editing || s.id !== editing.id)
      );
      if (conflitEleve) {
        setDispoResult({ ok: false, msg: "❌ Vous avez déjà une séance sur ce créneau." });
        return;
      }
    }

    setDispoResult({ ok: true, msg: `✅ Créneau ${form.heure_debut}–${heureFin} disponible !` });
  };

  /* ════════ SAUVEGARDER ════════ */
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.moniteur_id || !form.vehicule_id || !form.date || !form.heure_debut) {
      setFormErr("Veuillez remplir tous les champs obligatoires."); return;
    }
    if (form.date < today) {
      setFormErr("La date ne peut pas être dans le passé."); return;
    }
    if (!heureFin) {
      setFormErr("L'heure de début est trop tardive."); return;
    }
    if (dispoResult && !dispoResult.ok) {
      setFormErr("Ce créneau n'est pas disponible."); return;
    }

    setSaving(true);
    setFormErr("");

    try {
      const payload = {
        moniteur_id: form.moniteur_id,
        vehicule_id: form.vehicule_id,
        date:        form.date,
        heure_debut: form.heure_debut,
        heure_fin:   heureFin,          // calculée automatiquement
        notes:       form.notes,
        client_id:   isAdmin ? form.client_id : client?.id,
      };

      if (editing) {
        await axios.put(`${API}/seances/${editing.id}`, payload);
        showToast("Séance modifiée !");
      } else {
        await axios.post(`${API}/seances`, payload);
        showToast("Séance planifiée !");
      }

      setShowForm(false);
      setEditing(null);
      setDispoResult(null);
      await load();
    } catch (err) {
      setFormErr(err.response?.data?.message || "Erreur serveur.");
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ moniteur_id: "", vehicule_id: "", date: "", heure_debut: "", notes: "" });
    setFormErr("");
    setDispoResult(null);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      moniteur_id: s.moniteur_id,
      vehicule_id: s.vehicule_id,
      date:        s.date?.split("T")[0] || s.date,
      heure_debut: s.heure_debut,
      notes:       s.notes || "",
      client_id:   s.client_id,
    });
    setFormErr("");
    setDispoResult(null);
    setShowForm(true);
  };

  const annuler = async (id) => {
    if (!window.confirm("Confirmer l'annulation ?")) return;
    try {
      await axios.patch(`${API}/seances/${id}/annuler`);
      showToast("Séance annulée.");
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur.", false);
    }
  };

  /* ════════ CALENDRIER ════════ */
  const renderCalendrier = () => {
    const y = calDate.getFullYear(), m = calDate.getMonth();
    const premier = new Date(y, m, 1).getDay();
    const jours   = new Date(y, m + 1, 0).getDate();
    const offset  = premier === 0 ? 6 : premier - 1;

    const seancesParJour = {};
    seances.forEach(s => {
      const d = (s.date || "").split("T")[0];
      if (!seancesParJour[d]) seancesParJour[d] = [];
      seancesParJour[d].push(s);
    });

    const cells = Array(offset).fill(null);
    for (let d = 1; d <= jours; d++) cells.push(d);

    return (
      <div className="sp-cal">
        <div className="sp-cal-nav">
          <button onClick={() => setCalDate(new Date(y, m - 1))} className="sp-cal-arrow">‹</button>
          <strong>{MOIS[m]} {y}</strong>
          <button onClick={() => setCalDate(new Date(y, m + 1))} className="sp-cal-arrow">›</button>
        </div>
        <div className="sp-cal-grid">
          {JOURS.map(j => <div key={j} className="sp-cal-head">{j}</div>)}
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="sp-cal-cell empty" />;
            const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const ss  = seancesParJour[key];
            const isToday = key === today;
            return (
              <div key={i} className={`sp-cal-cell ${ss ? "has" : ""} ${isToday ? "today" : ""}`}
                onClick={() => ss && setDetail(ss[0])}>
                <span className="sp-cal-day">{d}</span>
                {ss && ss.slice(0, 2).map((s, si) => (
                  <div key={si} className="sp-cal-dot"
                    style={{ background: STATUT[s.statut]?.color || "#94a3b8" }}>
                    {s.heure_debut?.slice(0, 5)}
                  </div>
                ))}
                {ss && ss.length > 2 && <div className="sp-cal-more">+{ss.length - 2}</div>}
              </div>
            );
          })}
        </div>
        <div className="sp-cal-legend">
          {Object.entries(STATUT).map(([k, v]) => (
            <span key={k} className="sp-cal-leg-item">
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: v.color, display: "inline-block" }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  /* ════════ RENDER ════════ */
  if (!client) { navigate("/connexion"); return null; }

  return (
    <div className="sp-page">

      {/* HERO */}
      <div className="sp-hero">
        <div className="sp-hero-content">
          <h1 className="sp-hero-title">🚗 Séances de conduite</h1>
          <p className="sp-hero-sub">Choisissez votre heure · Séance de 30 min · Un seul élève par créneau</p>
        </div>
        <svg className="sp-hero-wave" viewBox="0 0 1440 50" preserveAspectRatio="none">
          <path d="M0,25 C360,55 1080,0 1440,30 L1440,50 L0,50 Z" fill="#f4f6fa" />
        </svg>
      </div>

      <div className="sp-body">

        {/* TOAST */}
        {toast.show && (
          <div className={`sp-toast ${toast.ok ? "ok" : "err"}`}>{toast.ok ? "✅" : "❌"} {toast.msg}</div>
        )}

        {/* TOOLBAR */}
        <div className="sp-toolbar">
          <div className="sp-stats">
            {[
              { label: "Total",      val: seances.length,                                       c: "#1d3557" },
              { label: "Planifiées", val: seances.filter(s => s.statut === "planifiee").length,  c: "#2563eb" },
              { label: "Terminées",  val: seances.filter(s => s.statut === "terminee").length,   c: "#15803d" },
              { label: "Annulées",   val: seances.filter(s => s.statut === "annulee").length,    c: "#64748b" },
            ].map((st, i) => (
              <div key={i} className="sp-stat">
                <span className="sp-stat-val" style={{ color: st.c }}>{st.val}</span>
                <span className="sp-stat-label">{st.label}</span>
              </div>
            ))}
          </div>

          <div className="sp-toolbar-right">
            <div className="sp-vue-toggle">
              <button className={`sp-vue-btn ${vue === "liste" ? "active" : ""}`} onClick={() => setVue("liste")}>☰ Liste</button>
              <button className={`sp-vue-btn ${vue === "calendrier" ? "active" : ""}`} onClick={() => setVue("calendrier")}>📅 Calendrier</button>
            </div>
            <button className="sp-btn-plan" onClick={openAdd}>+ Planifier une séance</button>
          </div>
        </div>

        {/* ════ FORMULAIRE ════ */}
        {showForm && (
          <div className="sp-form-card">
            <div className="sp-form-head">
              <h5>{editing ? "✏️ Modifier la séance" : "📅 Planifier une séance de conduite"}</h5>
              <button className="sp-form-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={handleSave} className="sp-form-body">
              {formErr && <div className="sp-alert err">⚠ {formErr}</div>}

              <div className="sp-form-grid">

                {/* Moniteur */}
                <div className="sp-fg">
                  <label>Moniteur *</label>
                  <select className="sp-fi" value={form.moniteur_id}
                    onChange={e => { setForm({ ...form, moniteur_id: e.target.value }); setDispoResult(null); }}>
                    <option value="">-- Choisir un moniteur --</option>
                    {moniteurs.filter(m => m.actif).map(m => (
                      <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Véhicule */}
                <div className="sp-fg">
                  <label>Véhicule *</label>
                  <select className="sp-fi" value={form.vehicule_id}
                    onChange={e => { setForm({ ...form, vehicule_id: e.target.value }); setDispoResult(null); }}>
                    <option value="">-- Choisir un véhicule --</option>
                    {vehicules.map(v => (
                      <option key={v.id} value={v.id}>{v.marque} {v.modele} · {v.immatriculation}</option>
                    ))}
                  </select>
                  {vehicules.length === 0 && (
                    <small className="sp-warn">⚠ Aucun véhicule disponible.</small>
                  )}
                </div>

                {/* Date */}
                <div className="sp-fg">
                  <label>Date *</label>
                  <input type="date" className="sp-fi" min={today} value={form.date}
                    onChange={e => { setForm({ ...form, date: e.target.value }); setDispoResult(null); }} />
                </div>

                {/* Heure début — le client choisit librement */}
                <div className="sp-fg">
                  <label>Heure de début *</label>
                  <input type="time" className="sp-fi" value={form.heure_debut}
                    onChange={e => { setForm({ ...form, heure_debut: e.target.value }); setDispoResult(null); }} />
                </div>

                {/* Heure fin — calculée automatiquement, lecture seule */}
                <div className="sp-fg">
                  <label>Heure de fin <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none" }}>(auto +30 min)</span></label>
                  <input
                    type="time"
                    className="sp-fi"
                    value={heureFin}
                    readOnly
                    style={{ background: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }}
                  />
                </div>

                {/* Notes */}
                <div className="sp-fg sp-fg-full">
                  <label>Notes <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none" }}>(optionnel)</span></label>
                  <textarea className="sp-fi" rows={2} value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Instructions particulières…" />
                </div>
              </div>

              {/* VÉRIFICATION DISPONIBILITÉ */}
              <div className="sp-dispo-section">
                <button type="button" className="sp-btn-check" onClick={checkDisponibilite}>
                  🔍 Vérifier la disponibilité
                </button>
                {dispoResult && (
                  <div className={`sp-dispo-result ${dispoResult.ok ? "ok" : "err"}`}>
                    {dispoResult.msg}
                  </div>
                )}
              </div>

              <div className="sp-form-actions">
                <button type="button" className="sp-btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="sp-btn-save"
                  disabled={saving || (dispoResult !== null && !dispoResult.ok)}>
                  {saving ? "⏳ Enregistrement…" : editing ? "💾 Modifier" : "✅ Confirmer la réservation"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="sp-loading"><div className="sp-spinner" /><p>Chargement…</p></div>
        )}

        {/* VUE LISTE */}
        {!loading && vue === "liste" && (
          seances.length === 0 ? (
            <div className="sp-empty">
              <div className="sp-empty-icon">📅</div>
              <h3>Aucune séance planifiée</h3>
              <p>Cliquez sur "Planifier une séance" pour commencer.</p>
            </div>
          ) : (
            <div className="sp-list">
              {seances.map(s => {
                const st = STATUT[s.statut] || STATUT.annulee;
                return (
                  <div key={s.id} className="sp-card" onClick={() => setDetail(s)}>
                    <div className="sp-card-left" style={{ borderLeftColor: st.color }}>
                      <div className="sp-card-date">
                        📅 {new Date(s.date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div className="sp-card-time">⏰ {s.heure_debut} – {s.heure_fin} <span style={{ fontSize: "11px", color: "#94a3b8" }}>(30 min)</span></div>
                      <div className="sp-card-meta">
                        {isAdmin && s.client && <span>👤 {s.client.prenom} {s.client.nom} · </span>}
                        <span>🧑‍🏫 {s.moniteur?.prenom} {s.moniteur?.nom}</span>
                        <span> · 🚗 {s.vehicule?.marque} {s.vehicule?.modele}</span>
                      </div>
                      {s.notes && <div className="sp-card-notes">💬 {s.notes}</div>}
                    </div>
                    <div className="sp-card-right" onClick={e => e.stopPropagation()}>
                      <span className="sp-badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      <div className="sp-card-btns">
                        {s.statut === "planifiee" && (
                          <>
                            <button className="sp-btn-icon edit" onClick={() => openEdit(s)} title="Modifier">✏️</button>
                            <button className="sp-btn-icon warn" onClick={() => annuler(s.id)} title="Annuler">✕</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* VUE CALENDRIER */}
        {!loading && vue === "calendrier" && renderCalendrier()}
      </div>

      {/* MODAL DÉTAIL */}
      {detail && (
        <div className="sp-modal-bg" onClick={() => setDetail(null)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h5>📋 Détail de la séance</h5>
              <button onClick={() => setDetail(null)} className="sp-modal-x">×</button>
            </div>
            <div className="sp-modal-body">
              <table className="sp-detail-table">
                <tbody>
                  {detail.client && <tr><th>Élève</th><td>{detail.client.prenom} {detail.client.nom}</td></tr>}
                  <tr><th>Moniteur</th><td>{detail.moniteur?.prenom} {detail.moniteur?.nom}</td></tr>
                  <tr><th>Véhicule</th><td>{detail.vehicule?.marque} {detail.vehicule?.modele} ({detail.vehicule?.immatriculation})</td></tr>
                  <tr><th>Date</th><td>{new Date(detail.date).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</td></tr>
                  <tr><th>Horaire</th><td>{detail.heure_debut} – {detail.heure_fin} <strong>(30 min)</strong></td></tr>
                  <tr><th>Statut</th><td>
                    <span className="sp-badge" style={{ background: STATUT[detail.statut]?.bg, color: STATUT[detail.statut]?.color }}>
                      {STATUT[detail.statut]?.label}
                    </span>
                  </td></tr>
                  {detail.notes && <tr><th>Notes</th><td>{detail.notes}</td></tr>}
                </tbody>
              </table>
              {detail.statut === "planifiee" && (
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button className="sp-btn-save" onClick={() => { openEdit(detail); setDetail(null); }}>✏️ Modifier</button>
                  <button className="sp-btn-cancel" onClick={() => { annuler(detail.id); setDetail(null); }}>✕ Annuler</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}