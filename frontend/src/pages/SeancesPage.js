import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeancesPage.css";
import PageTransition from "../components/PageTransition";

const API = "http://127.0.0.1:8000/api";

const STATUT = {
  planifiee: { label: "Planifiée",  bg: "#dbeafe", color: "#1d4ed8" },
  en_cours:  { label: "En cours",   bg: "#fef9c3", color: "#a16207" },
  terminee:  { label: "Terminée",   bg: "#dcfce7", color: "#15803d" },
  annulee:   { label: "Annulée",    bg: "#f1f5f9", color: "#64748b" },
};

const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MOIS  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

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
  const [vue,       setVue]       = useState("liste"); // liste | calendrier
  const [calDate,   setCalDate]   = useState(new Date());

  /* ── formulaire ── */
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState({ moniteur_id:"", vehicule_id:"", date:"", heure_debut:"", heure_fin:"", notes:"" });
  const [formErr,   setFormErr]   = useState("");
  const [saving,    setSaving]    = useState(false);

  /* ── disponibilité ── */
  const [checking,  setChecking]  = useState(false);
  const [dispoResult, setDispoResult] = useState(null); // null | {ok, msg}

  /* ── détail ── */
  const [detail, setDetail] = useState(null);

  /* ── toast ── */
  const [toast, setToast] = useState({ show:false, msg:"", ok:true });
  const showToast = (msg, ok=true) => { setToast({show:true,msg,ok}); setTimeout(()=>setToast(t=>({...t,show:false})),3500); };

  /* ════════════ CHARGEMENT ════════════ */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = isAdmin ? {} : { client_id: client?.id };
      const [sRes, mRes, vRes] = await Promise.all([
        axios.get(`${API}/seances`, { params }),
        axios.get(`${API}/moniteurs`),
        axios.get(`${API}/vehicules`, { params:{ disponibilite:"disponible" } }),
      ]);
      setSeances(sRes.data);
      setMoniteurs(mRes.data);
      setVehicules(vRes.data);
    } catch { showToast("Erreur de chargement.", false); }
    finally  { setLoading(false); }
  }, [isAdmin, client?.id]);

  useEffect(() => { load(); }, [load]);

  /* ════════════ VÉRIFICATION DISPONIBILITÉ ════════════ */
  const checkDisponibilite = async () => {
    if (!form.moniteur_id || !form.vehicule_id || !form.date || !form.heure_debut || !form.heure_fin) {
      setDispoResult({ ok: false, msg: "Remplissez tous les champs pour vérifier la disponibilité." });
      return;
    }
    if (form.heure_fin <= form.heure_debut) {
      setDispoResult({ ok: false, msg: "L'heure de fin doit être après l'heure de début." });
      return;
    }

    setChecking(true);
    setDispoResult(null);

    try {
      /* Vérifier le moniteur */
      const monConflits = seances.filter(s =>
        String(s.moniteur_id) === String(form.moniteur_id) &&
        s.date?.split("T")[0] === form.date &&
        s.statut !== "annulee" &&
        s.heure_debut < form.heure_fin &&
        s.heure_fin   > form.heure_debut &&
        (!editing || s.id !== editing.id)
      );

      if (monConflits.length > 0) {
        const c = monConflits[0];
        setDispoResult({ ok: false, msg: `❌ Le moniteur est déjà réservé ce jour de ${c.heure_debut} à ${c.heure_fin}.` });
        setChecking(false); return;
      }

      /* Vérifier le véhicule */
      const vehConflits = seances.filter(s =>
        String(s.vehicule_id) === String(form.vehicule_id) &&
        s.date?.split("T")[0] === form.date &&
        s.statut !== "annulee" &&
        s.heure_debut < form.heure_fin &&
        s.heure_fin   > form.heure_debut &&
        (!editing || s.id !== editing.id)
      );

      if (vehConflits.length > 0) {
        const c = vehConflits[0];
        setDispoResult({ ok: false, msg: `❌ Ce véhicule est déjà réservé ce jour de ${c.heure_debut} à ${c.heure_fin}.` });
        setChecking(false); return;
      }

      /* Vérifier l'élève */
      if (!isAdmin) {
        const eleveConflits = seances.filter(s =>
          String(s.client_id) === String(client?.id) &&
          s.date?.split("T")[0] === form.date &&
          s.statut !== "annulee" &&
          s.heure_debut < form.heure_fin &&
          s.heure_fin   > form.heure_debut &&
          (!editing || s.id !== editing.id)
        );
        if (eleveConflits.length > 0) {
          setDispoResult({ ok: false, msg: "❌ Vous avez déjà une séance planifiée sur ce créneau." });
          setChecking(false); return;
        }
      }

      setDispoResult({ ok: true, msg: "✅ Créneau disponible ! Vous pouvez confirmer la réservation." });
    } catch {
      setDispoResult({ ok: false, msg: "Erreur lors de la vérification." });
    } finally {
      setChecking(false);
    }
  };

  /* ════════════ SAUVEGARDER ════════════ */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.moniteur_id || !form.vehicule_id || !form.date || !form.heure_debut || !form.heure_fin) {
      setFormErr("Veuillez remplir tous les champs obligatoires."); return;
    }
    if (form.date < today) { setFormErr("La date ne peut pas être dans le passé."); return; }
    if (form.heure_fin <= form.heure_debut) { setFormErr("L'heure de fin doit être après l'heure de début."); return; }

    setSaving(true); setFormErr("");
    try {
      const payload = { ...form, client_id: isAdmin ? form.client_id : client?.id };
      if (editing) { await axios.put(`${API}/seances/${editing.id}`, payload); showToast("Séance modifiée !"); }
      else         { await axios.post(`${API}/seances`, payload);              showToast("Séance planifiée !"); }
      setShowForm(false); setEditing(null); setDispoResult(null);
      await load();
    } catch(e) {
      setFormErr(e.response?.data?.message || "Erreur serveur — conflit d'horaire détecté.");
    } finally { setSaving(false); }
  };

  const openAdd  = ()  => { setEditing(null); setForm({ moniteur_id:"", vehicule_id:"", date:"", heure_debut:"", heure_fin:"", notes:"" }); setFormErr(""); setDispoResult(null); setShowForm(true); };
  const openEdit = (s) => { setEditing(s); setForm({ moniteur_id:s.moniteur_id, vehicule_id:s.vehicule_id, date:s.date?.split("T")[0]||s.date, heure_debut:s.heure_debut, heure_fin:s.heure_fin, notes:s.notes||"", client_id:s.client_id }); setFormErr(""); setDispoResult(null); setShowForm(true); };

  const annuler = async (id) => {
    try { await axios.patch(`${API}/seances/${id}/annuler`); showToast("Séance annulée."); await load(); }
    catch(e) { showToast(e.response?.data?.message||"Erreur.", false); }
  };

  /* ════════════ CALENDRIER ════════════ */
  const renderCalendrier = () => {
    const y = calDate.getFullYear(), m = calDate.getMonth();
    const premier = new Date(y, m, 1).getDay(); // 0=dim
    const jours   = new Date(y, m+1, 0).getDate();
    const offset  = premier === 0 ? 6 : premier - 1; // commence lundi

    const seancesParJour = {};
    seances.forEach(s => {
      const d = (s.date||"").split("T")[0];
      if (!seancesParJour[d]) seancesParJour[d] = [];
      seancesParJour[d].push(s);
    });

    const cells = Array(offset).fill(null);
    for (let d = 1; d <= jours; d++) cells.push(d);

    return (
      <div className="sp-cal">
        <div className="sp-cal-nav">
          <button onClick={() => setCalDate(new Date(y, m-1))} className="sp-cal-arrow">‹</button>
          <strong>{MOIS[m]} {y}</strong>
          <button onClick={() => setCalDate(new Date(y, m+1))} className="sp-cal-arrow">›</button>
        </div>
        <div className="sp-cal-grid">
          {JOURS.map(j => <div key={j} className="sp-cal-head">{j}</div>)}
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="sp-cal-cell empty"/>;
            const key = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            const ss  = seancesParJour[key];
            const isToday = key === today;
            return (
              <div key={i} className={`sp-cal-cell ${ss?"has":""}  ${isToday?"today":""}`}
                onClick={() => ss && setDetail(ss[0])}>
                <span className="sp-cal-day">{d}</span>
                {ss && ss.slice(0,2).map((s,si) => (
                  <div key={si} className="sp-cal-dot"
                    style={{ background: STATUT[s.statut]?.color||"#94a3b8" }}>
                    {s.heure_debut?.slice(0,5)}
                  </div>
                ))}
                {ss && ss.length > 2 && <div className="sp-cal-more">+{ss.length-2}</div>}
              </div>
            );
          })}
        </div>
        <div className="sp-cal-legend">
          {Object.entries(STATUT).map(([k,v]) => (
            <span key={k} className="sp-cal-leg-item">
              <span style={{width:10,height:10,borderRadius:"50%",background:v.color,display:"inline-block"}}/>
              {v.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  /* ════════════ RENDER ════════════ */
  if (!client) { navigate("/connexion"); return null; }

  return (
    <PageTransition>
    <div className="sp-page">

      {/* HERO */}
      <div className="sp-hero">
        <div className="sp-hero-content">
          <h1 className="sp-hero-title">🚗 Séances de conduite</h1>
          <p className="sp-hero-sub">Planifiez vos séances, vérifiez les disponibilités en temps réel</p>
        </div>
        <svg className="sp-hero-wave" viewBox="0 0 1440 50" preserveAspectRatio="none">
          <path d="M0,25 C360,55 1080,0 1440,30 L1440,50 L0,50 Z" fill="#f4f6fa"/>
        </svg>
      </div>

      <div className="sp-body">

        {/* TOAST */}
        {toast.show && (
          <div className={`sp-toast ${toast.ok?"ok":"err"}`}>{toast.ok?"✅":"❌"} {toast.msg}</div>
        )}

        {/* TOOLBAR */}
        <div className="sp-toolbar">
          <div className="sp-stats">
            {[
              { label:"Total",     val: seances.length,                             c:"#1d3557" },
              { label:"Planifiées",val: seances.filter(s=>s.statut==="planifiee").length, c:"#2563eb" },
              { label:"Terminées", val: seances.filter(s=>s.statut==="terminee").length,  c:"#15803d" },
              { label:"Annulées",  val: seances.filter(s=>s.statut==="annulee").length,   c:"#64748b" },
            ].map((st,i) => (
              <div key={i} className="sp-stat">
                <span className="sp-stat-val" style={{color:st.c}}>{st.val}</span>
                <span className="sp-stat-label">{st.label}</span>
              </div>
            ))}
          </div>

          <div className="sp-toolbar-right">
            <div className="sp-vue-toggle">
              <button className={`sp-vue-btn ${vue==="liste"?"active":""}`} onClick={()=>setVue("liste")}>☰ Liste</button>
              <button className={`sp-vue-btn ${vue==="calendrier"?"active":""}`} onClick={()=>setVue("calendrier")}>📅 Calendrier</button>
            </div>
            <button className="sp-btn-plan" onClick={openAdd}>
              + Planifier une séance
            </button>
          </div>
        </div>

        {/* FORMULAIRE */}
        {showForm && (
          <div className="sp-form-card">
            <div className="sp-form-head">
              <h5>{editing ? "✏️ Modifier la séance" : "📅 Planifier une séance de conduite"}</h5>
              <button className="sp-form-close" onClick={()=>setShowForm(false)}>×</button>
            </div>

            <form onSubmit={handleSave} className="sp-form-body">
              {formErr && <div className="sp-alert err">⚠ {formErr}</div>}

              <div className="sp-form-grid">
                {/* Moniteur */}
                <div className="sp-fg">
                  <label>Moniteur *</label>
                  <select className="sp-fi" value={form.moniteur_id}
                    onChange={e=>{ setForm({...form,moniteur_id:e.target.value}); setDispoResult(null); }}>
                    <option value="">-- Choisir un moniteur --</option>
                    {moniteurs.filter(m=>m.actif).map(m=>(
                      <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Véhicule */}
                <div className="sp-fg">
                  <label>Véhicule *</label>
                  <select className="sp-fi" value={form.vehicule_id}
                    onChange={e=>{ setForm({...form,vehicule_id:e.target.value}); setDispoResult(null); }}>
                    <option value="">-- Choisir un véhicule --</option>
                    {vehicules.map(v=>(
                      <option key={v.id} value={v.id}>{v.marque} {v.modele} · {v.immatriculation}</option>
                    ))}
                  </select>
                  {vehicules.length === 0 && (
                    <small className="sp-warn">⚠ Aucun véhicule disponible actuellement.</small>
                  )}
                </div>

                {/* Date */}
                <div className="sp-fg">
                  <label>Date *</label>
                  <input type="date" className="sp-fi" min={today} value={form.date}
                    onChange={e=>{ setForm({...form,date:e.target.value}); setDispoResult(null); }}/>
                </div>

                {/* Heure début */}
                <div className="sp-fg">
                  <label>Heure de début *</label>
                  <input type="time" className="sp-fi" value={form.heure_debut}
                    onChange={e=>{ setForm({...form,heure_debut:e.target.value}); setDispoResult(null); }}/>
                </div>

                {/* Heure fin */}
                <div className="sp-fg">
                  <label>Heure de fin *</label>
                  <input type="time" className="sp-fi" value={form.heure_fin}
                    onChange={e=>{ setForm({...form,heure_fin:e.target.value}); setDispoResult(null); }}/>
                </div>

                {/* Notes */}
                <div className="sp-fg sp-fg-full">
                  <label>Notes <small style={{color:"#94a3b8"}}>(optionnel)</small></label>
                  <textarea className="sp-fi" rows={2} value={form.notes}
                    onChange={e=>setForm({...form,notes:e.target.value})}
                    placeholder="Instructions particulières..."/>
                </div>
              </div>

              {/* VÉRIFICATION DISPONIBILITÉ */}
              <div className="sp-dispo-section">
                <button type="button" className="sp-btn-check" onClick={checkDisponibilite} disabled={checking}>
                  {checking ? "⏳ Vérification..." : "🔍 Vérifier la disponibilité"}
                </button>
                {dispoResult && (
                  <div className={`sp-dispo-result ${dispoResult.ok?"ok":"err"}`}>
                    {dispoResult.msg}
                  </div>
                )}
              </div>

              <div className="sp-form-actions">
                <button type="button" className="sp-btn-cancel" onClick={()=>setShowForm(false)}>Annuler</button>
                <button type="submit" className="sp-btn-save" disabled={saving || (dispoResult && !dispoResult.ok)}>
                  {saving ? "⏳ Enregistrement..." : editing ? "💾 Modifier" : "✅ Confirmer la réservation"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="sp-loading"><div className="sp-spinner"/><p>Chargement...</p></div>
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
                  <div key={s.id} className="sp-card" onClick={()=>setDetail(s)}>
                    <div className="sp-card-left" style={{borderLeftColor:st.color}}>
                      <div className="sp-card-date">
                        📅 {new Date(s.date).toLocaleDateString("fr-FR",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}
                      </div>
                      <div className="sp-card-time">⏰ {s.heure_debut} – {s.heure_fin}</div>
                      <div className="sp-card-meta">
                        {isAdmin && s.client && <span>👤 {s.client.prenom} {s.client.nom} · </span>}
                        <span>🧑‍🏫 {s.moniteur?.prenom} {s.moniteur?.nom}</span>
                        <span> · 🚗 {s.vehicule?.marque} {s.vehicule?.modele}</span>
                      </div>
                      {s.notes && <div className="sp-card-notes">💬 {s.notes}</div>}
                    </div>
                    <div className="sp-card-right" onClick={e=>e.stopPropagation()}>
                      <span className="sp-badge" style={{background:st.bg,color:st.color}}>{st.label}</span>
                      <div className="sp-card-btns">
                        {s.statut === "planifiee" && (
                          <>
                            <button className="sp-btn-icon edit" onClick={()=>openEdit(s)} title="Modifier">✏️</button>
                            <button className="sp-btn-icon warn" onClick={()=>annuler(s.id)} title="Annuler">✕</button>
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
        <div className="sp-modal-bg" onClick={()=>setDetail(null)}>
          <div className="sp-modal" onClick={e=>e.stopPropagation()}>
            <div className="sp-modal-head">
              <h5>📋 Détail de la séance</h5>
              <button onClick={()=>setDetail(null)} className="sp-modal-x">×</button>
            </div>
            <div className="sp-modal-body">
              <table className="sp-detail-table">
                <tbody>
                  {detail.client && <tr><th>Élève</th><td>{detail.client.prenom} {detail.client.nom}</td></tr>}
                  <tr><th>Moniteur</th><td>{detail.moniteur?.prenom} {detail.moniteur?.nom}</td></tr>
                  <tr><th>Véhicule</th><td>{detail.vehicule?.marque} {detail.vehicule?.modele} ({detail.vehicule?.immatriculation})</td></tr>
                  <tr><th>Date</th><td>{new Date(detail.date).toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</td></tr>
                  <tr><th>Horaire</th><td>{detail.heure_debut} – {detail.heure_fin}</td></tr>
                  <tr><th>Statut</th><td>
                    <span className="sp-badge" style={{background:STATUT[detail.statut]?.bg,color:STATUT[detail.statut]?.color}}>
                      {STATUT[detail.statut]?.label}
                    </span>
                  </td></tr>
                  {detail.notes && <tr><th>Notes</th><td>{detail.notes}</td></tr>}
                </tbody>
              </table>
              {detail.statut === "planifiee" && (
                <div style={{marginTop:16,display:"flex",gap:10}}>
                  <button className="sp-btn-save" onClick={()=>{ openEdit(detail); setDetail(null); }}>✏️ Modifier</button>
                  <button className="sp-btn-cancel" onClick={()=>{ annuler(detail.id); setDetail(null); }}>✕ Annuler</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
}