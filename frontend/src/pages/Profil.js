import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Profil.css";

const API = "http://127.0.0.1:8000/api";

export default function Profil() {
  const navigate   = useNavigate();
  const { id }     = useParams();           // admin → /profil/42, user → /profil
  const moi        = JSON.parse(localStorage.getItem("user"));
  const isAdmin    = localStorage.getItem("role") === "admin";
  const targetId   = id || moi?.id;
  const isOwnProfil = !id || String(id) === String(moi?.id);

  // ── données ──
  const [profil,   setProfil]   = useState(null);
  const [seances,  setSeances]  = useState([]);
  const [cours,    setCours]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [onglet,   setOnglet]   = useState("infos");

  // ── édition infos ──
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ nom: "", prenom: "", email: "" });
  const [editErr,  setEditErr]  = useState("");
  const [editOk,   setEditOk]   = useState(false);

  // ── mot de passe ──
  const [pw,     setPw]     = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwErr,  setPwErr]  = useState("");
  const [pwOk,   setPwOk]   = useState(false);

  // ── photo ──
  const [photoUploading, setPhotoUploading] = useState(false);

  // ════════════════════════
  useEffect(() => {
    if (!targetId) { navigate("/connexion"); return; }
    loadAll();
  }, [id]);

  const loadAll = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const [pRes, sRes, cRes] = await Promise.allSettled([
        axios.get(`${API}/clients/${targetId}`),
        axios.get(`${API}/seances?client_id=${targetId}`),
        axios.get(`${API}/cours`),
      ]);
      if (pRes.status === "fulfilled") {
        setProfil(pRes.value.data);
        setEditData({ nom: pRes.value.data.nom, prenom: pRes.value.data.prenom, email: pRes.value.data.email });
      } else {
        setNotFound(true);
      }
      if (sRes.status === "fulfilled") setSeances(sRes.value.data);
      if (cRes.status === "fulfilled") setCours(cRes.value.data.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  // ── Sauvegarder infos ──
  const saveInfos = async (e) => {
    e.preventDefault();
    setEditErr(""); setEditOk(false);
    try {
      await axios.put(`${API}/clients/${profil.id}`, editData);
      if (isOwnProfil) localStorage.setItem("user", JSON.stringify({ ...moi, ...editData }));
      setProfil(p => ({ ...p, ...editData }));
      setEditMode(false); setEditOk(true);
      setTimeout(() => setEditOk(false), 3000);
    } catch (e) {
      setEditErr(e.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  // ── Changer mot de passe ──
  const changePw = async (e) => {
    e.preventDefault();
    setPwErr(""); setPwOk(false);
    if (pw.password.length < 6)           { setPwErr("Minimum 6 caractères."); return; }
    if (pw.password !== pw.confirm)       { setPwErr("Les mots de passe ne correspondent pas."); return; }
    try {
      await axios.put(`${API}/clients/${profil.id}`, { password: pw.password });
      setPw({ password: "", confirm: "" });
      setPwOk(true);
      setTimeout(() => setPwOk(false), 3000);
    } catch (e) {
      setPwErr(e.response?.data?.message || "Erreur.");
    }
  };

  const pwStrength = () => {
    if (pw.password.length >= 10 && /[A-Z]/.test(pw.password) && /\d/.test(pw.password)) return "fort";
    if (pw.password.length >= 6) return "moyen";
    return "faible";
  };

  // ── Changer Photo ──
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API}/clients/${profil.id}/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const newProfil = { ...profil, photo_profil: res.data.photo_profil, photo_url: res.data.photo_url };
      setProfil(newProfil);
      
      if (isOwnProfil) {
        localStorage.setItem("user", JSON.stringify({ ...moi, photo_profil: res.data.photo_profil, photo_url: res.data.photo_url }));
        // Dispatch custom event so Navbar can update if needed (or just reload)
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      alert("Erreur lors de l'upload de la photo. Vérifiez la taille (max 2MB).");
    } finally {
      setPhotoUploading(false);
    }
  };

  // ════════════════════════
  const STATUT = {
    planifiee: { bg: "#dbeafe", color: "#1d4ed8", label: "Planifiée" },
    en_cours:  { bg: "#fef9c3", color: "#a16207", label: "En cours"  },
    terminee:  { bg: "#dcfce7", color: "#15803d", label: "Terminée"  },
    annulee:   { bg: "#f1f5f9", color: "#64748b", label: "Annulée"   },
  };

  if (loading) return (
    <div className="profil-page">
      <div className="profil-center">
        <div className="profil-spinner"/>
        <p>Chargement du profil...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="profil-page">
      <div className="profil-center">
        <div style={{fontSize:52,marginBottom:12}}>😕</div>
        <h3>Profil introuvable</h3>
        <button className="profil-btn-back" onClick={() => navigate(-1)}>← Retour</button>
      </div>
    </div>
  );

  return (
    <div className="profil-page">

      {/* Bouton retour admin */}
      {isAdmin && !isOwnProfil && (
        <div className="profil-back-wrap">
          <button className="profil-btn-back" onClick={() => navigate("/dashboard")}>
            ← Retour au dashboard
          </button>
        </div>
      )}

      <div className="profil-container">

        {/* ══ HEADER ══ */}
        <div className="profil-header">
          <div className="profil-header-banner"/>
          <div className="profil-header-row">
            <div className="profil-avatar-wrap">
              <label htmlFor="photo-upload" className={`profil-avatar ${isOwnProfil ? 'editable' : ''}`}>
                {profil.photo_profil || profil.photo_url ? (
                  <img 
                    src={profil.photo_url || `http://127.0.0.1:8000/storage/${profil.photo_profil}`} 
                    alt="Profil" 
                    className="profil-avatar-img" 
                  />
                ) : (
                  <>{profil.prenom?.charAt(0).toUpperCase()}{profil.nom?.charAt(0).toUpperCase()}</>
                )}
                {isOwnProfil && (
                  <div className="profil-avatar-overlay">
                    {photoUploading ? <span className="profil-spinner-small"/> : "📷"}
                  </div>
                )}
              </label>
              {isOwnProfil && (
                <input 
                  type="file" 
                  id="photo-upload" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={handlePhotoChange} 
                />
              )}
              <span className={`profil-role-dot ${profil.role}`}/>
            </div>
            <div className="profil-header-info">
              <h2 className="profil-name">{profil.prenom} {profil.nom}</h2>
              <p className="profil-email">✉ {profil.email}</p>
              <div className="profil-chips">
                <span className={`profil-chip ${profil.role}`}>
                  {profil.role === "admin" ? "🛡️ Administrateur" : "🎓 Élève"}
                </span>
                <span className="profil-chip grey">
                  📅 Membre depuis {new Date(profil.created_at).toLocaleDateString("fr-FR", {month:"long",year:"numeric"})}
                </span>
                <span className="profil-chip grey">🚗 {seances.length} séance{seances.length>1?"s":""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ ONGLETS ══ */}
        <div className="profil-tabs">
          {[
            { k: "infos",    ico: "👤", label: "Informations" },
            { k: "securite", ico: "🔒", label: "Sécurité" },
            { k: "seances",  ico: "🚗", label: `Séances (${seances.length})` },
            { k: "cours",    ico: "📚", label: "Cours" },
          ].map(t => (
            <button key={t.k} className={`profil-tab ${onglet === t.k ? "active" : ""}`}
              onClick={() => setOnglet(t.k)}>
              {t.ico} {t.label}
            </button>
          ))}
        </div>

        {/* ══ CONTENU ══ */}
        <div className="profil-card">

          {/* ── INFOS ── */}
          {onglet === "infos" && (
            <>
              <div className="profil-card-head">
                <h5>👤 Informations personnelles</h5>
                {(isOwnProfil || isAdmin) && !editMode && (
                  <button className="profil-btn-sm" onClick={() => setEditMode(true)}>✏️ Modifier</button>
                )}
              </div>
              {editOk && <div className="profil-msg ok">✅ Profil mis à jour !</div>}

              {editMode ? (
                <form onSubmit={saveInfos} className="profil-form">
                  {editErr && <div className="profil-msg err">⚠ {editErr}</div>}
                  <div className="profil-form-row">
                    <div className="profil-fg">
                      <label>Nom</label>
                      <input className="profil-input" value={editData.nom}
                        onChange={e => setEditData({...editData, nom: e.target.value})} />
                    </div>
                    <div className="profil-fg">
                      <label>Prénom</label>
                      <input className="profil-input" value={editData.prenom}
                        onChange={e => setEditData({...editData, prenom: e.target.value})} />
                    </div>
                  </div>
                  <div className="profil-fg">
                    <label>Email</label>
                    <input type="email" className="profil-input" value={editData.email}
                      onChange={e => setEditData({...editData, email: e.target.value})} />
                  </div>
                  <div className="profil-form-actions">
                    <button type="button" className="profil-btn-cancel"
                      onClick={() => { setEditMode(false); setEditErr(""); }}>✕ Annuler</button>
                    <button type="submit" className="profil-btn-save">✔ Enregistrer</button>
                  </div>
                </form>
              ) : (
                <div className="profil-info-table">
                  {[
                    { l: "Nom",           v: profil.nom },
                    { l: "Prénom",        v: profil.prenom },
                    { l: "Email",         v: profil.email },
                    { l: "Rôle",          v: <span className={`profil-chip ${profil.role}`}>{profil.role}</span> },
                    { l: "Membre depuis", v: new Date(profil.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}) },
                  ].map((r,i) => (
                    <div key={i} className="profil-info-row">
                      <span className="profil-info-l">{r.l}</span>
                      <span className="profil-info-v">{r.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── SÉCURITÉ ── */}
          {onglet === "securite" && (
            <>
              <div className="profil-card-head">
                <h5>🔒 Changer le mot de passe</h5>
              </div>
              {!isOwnProfil ? (
                <p className="profil-note">La modification du mot de passe n'est possible que par le titulaire du compte.</p>
              ) : (
                <form onSubmit={changePw} className="profil-form">
                  {pwErr && <div className="profil-msg err">⚠ {pwErr}</div>}
                  {pwOk  && <div className="profil-msg ok">✅ Mot de passe modifié !</div>}

                  <div className="profil-fg">
                    <label>Nouveau mot de passe</label>
                    <div className="profil-pw-wrap">
                      <input type={showPw ? "text" : "password"} className="profil-input"
                        placeholder="Minimum 6 caractères"
                        value={pw.password}
                        onChange={e => setPw({...pw, password: e.target.value})} />
                      <button type="button" className="profil-pw-eye" onClick={() => setShowPw(!showPw)}>
                        {showPw ? "🙈" : "👁️"}
                      </button>
                    </div>
                    {pw.password && (
                      <div className="profil-pw-strength">
                        <div className={`profil-pw-bar ${pwStrength()}`}/>
                        <span className={`profil-pw-label ${pwStrength()}`}>
                          {pwStrength() === "fort" ? "🟢 Fort" : pwStrength() === "moyen" ? "🟡 Moyen" : "🔴 Faible"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="profil-fg">
                    <label>Confirmer le mot de passe</label>
                    <input type={showPw ? "text" : "password"} className="profil-input"
                      placeholder="Répéter le mot de passe"
                      value={pw.confirm}
                      onChange={e => setPw({...pw, confirm: e.target.value})} />
                    {pw.confirm && (
                      <small style={{fontSize:12, color: pw.password===pw.confirm&&pw.password.length>=6 ? "#15803d" : "#e63946"}}>
                        {pw.password===pw.confirm&&pw.password.length>=6 ? "✔ Identiques" : "✖ Ne correspondent pas"}
                      </small>
                    )}
                  </div>

                  <div className="profil-form-actions">
                    <button type="submit" className="profil-btn-save">🔒 Changer le mot de passe</button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ── SÉANCES ── */}
          {onglet === "seances" && (
            <>
              <div className="profil-card-head">
                <h5>🚗 Séances de conduite</h5>
                {isOwnProfil && (
                  <button className="profil-btn-sm" onClick={() => navigate("/seances")}>Voir tout →</button>
                )}
              </div>
              {seances.length === 0 ? (
                <div className="profil-empty">
                  <div style={{fontSize:44,marginBottom:10}}>🚗</div>
                  <p>Aucune séance pour ce client.</p>
                  {isOwnProfil && (
                    <button className="profil-btn-save" onClick={() => navigate("/seances")}>
                      Planifier une séance
                    </button>
                  )}
                </div>
              ) : (
                <div className="profil-seances">
                  {seances.map(s => {
                    const st = STATUT[s.statut] || STATUT.annulee;
                    return (
                      <div key={s.id} className="profil-seance-row">
                        <div className="profil-seance-left">
                          <div className="profil-seance-date">
                            📅 {new Date(s.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}
                            <span style={{color:"#94a3b8",marginLeft:8}}>⏰ {s.heure_debut} – {s.heure_fin}</span>
                          </div>
                          <div className="profil-seance-detail">
                            {s.moniteur && <span>👨‍🏫 {s.moniteur.prenom} {s.moniteur.nom}</span>}
                            {s.vehicule  && <span>🚗 {s.vehicule.marque} {s.vehicule.modele}</span>}
                          </div>
                        </div>
                        <span className="profil-seance-badge" style={{background:st.bg,color:st.color}}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── COURS ── */}
          {onglet === "cours" && (
            <>
              <div className="profil-card-head">
                <h5>📚 Cours disponibles</h5>
                <button className="profil-btn-sm" onClick={() => navigate("/cours")}>Tous les cours →</button>
              </div>
              {cours.length === 0 ? (
                <div className="profil-empty"><p>Aucun cours disponible.</p></div>
              ) : (
                <div className="profil-cours-list">
                  {cours.map(c => (
                    <div key={c.id} className="profil-cours-row" onClick={() => navigate("/cours")}>
                      <div className="profil-cours-dot"/>
                      <div>
                        <div className="profil-cours-titre">{c.titre}</div>
                        <div className="profil-cours-cat">{c.categorie} · {c.niveau}</div>
                      </div>
                      <span className="profil-cours-arrow">→</span>
                    </div>
                  ))}
                  <button className="profil-btn-save" style={{marginTop:14}} onClick={() => navigate("/cours")}>
                    📚 Accéder à tous les cours
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}