import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cours.css";

const API = "http://127.0.0.1:8000/api";
const isAdmin = () => localStorage.getItem("role") === "admin";

/* ── Config par catégorie ── */
const CAT = {
  danger:       { icon:"⚠️",  label:"Danger",       color:"#e63946", bg:"#fff1f2" },
  indication:   { icon:"ℹ️",  label:"Indication",   color:"#2563eb", bg:"#eff6ff" },
  interdiction: { icon:"🚫",  label:"Interdiction", color:"#d97706", bg:"#fffbeb" },
  code_route:   { icon:"📋",  label:"Code Route",   color:"#7c3aed", bg:"#f5f3ff" },
  conduite:     { icon:"🚗",  label:"Conduite",     color:"#059669", bg:"#ecfdf5" },
  autre:        { icon:"📖",  label:"Autre",        color:"#475569", bg:"#f8fafc" },
};

const NIV = {
  debutant:      { label:"Débutant",      color:"#15803d", bg:"#dcfce7" },
  intermediaire: { label:"Intermédiaire", color:"#a16207", bg:"#fef9c3" },
  avance:        { label:"Avancé",        color:"#b91c1c", bg:"#fee2e2" },
};

const EMPTY_FORM = {
  titre:"", description:"", categorie:"code_route", niveau:"debutant",
  image:"", video_url:"", contenu:"", pdf_url:"", duree_minutes:30, actif:true
};

export default function Cours() {
  const navigate  = useNavigate();
  const admin     = isAdmin();

  const [cours,      setCours]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [filterCat,  setFilterCat]  = useState("tous");
  const [filterNiv,  setFilterNiv]  = useState("tous");

  /* modal */
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formTab,    setFormTab]    = useState("info"); // info | media | contenu
  const [formErr,    setFormErr]    = useState("");
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const [toast, setToast] = useState({ show:false, msg:"", ok:true });
  const toast_ = (msg, ok=true) => { setToast({show:true,msg,ok}); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };

  /* ── Charger les cours ── */
  useEffect(() => { load(); }, [admin]);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const url = admin ? `${API}/cours/all` : `${API}/cours`;
      const res = await axios.get(url);
      setCours(res.data);
    } catch { setError("Impossible de charger les cours. Vérifiez que le serveur Laravel est démarré."); }
    finally  { setLoading(false); }
  };

  /* ── CRUD ── */
  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setFormErr(""); setFormTab("info"); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      titre: c.titre, description: c.description||"",
      categorie: c.categorie, niveau: c.niveau,
      image: c.image||"", video_url: c.video_url||"",
      contenu: c.contenu||"", pdf_url: c.pdf_url||"",
      duree_minutes: c.duree_minutes||30, actif: c.actif,
    });
    setFormErr(""); setFormTab("info"); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.titre.trim()) { setFormErr("Le titre est obligatoire."); setFormTab("info"); return; }
    setSaving(true); setFormErr("");
    try {
      if (editing) { await axios.put(`${API}/cours/${editing.id}`, form); toast_("Cours modifié !"); }
      else         { await axios.post(`${API}/cours`, form); toast_("Cours créé !"); }
      setShowModal(false);
      load();
    } catch(e) { setFormErr(e.response?.data?.message || "Erreur serveur."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/cours/${id}`); setConfirmDel(null); toast_("Cours supprimé."); load(); }
    catch { toast_("Impossible de supprimer.", false); }
  };

  /* ── Filtrage ── */
  const filtered = cours.filter(c => {
    const q = search.toLowerCase();
    return (c.titre.toLowerCase().includes(q) || (c.description||"").toLowerCase().includes(q))
        && (filterCat === "tous" || c.categorie === filterCat)
        && (filterNiv === "tous" || c.niveau    === filterNiv);
  });

  /* ── Helper embed YouTube ── */
  const ytEmbed = (url) => {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : null;
  };

  /* ══════════════════════════════════
     RENDER
     ══════════════════════════════════ */
  return (
    <div className="cp-page">

      {/* ── HERO ── */}
      <div className="cp-hero">
        <div className="cp-hero-content">
          <p className="cp-hero-label">Auto École Narjiss</p>
          <h1 className="cp-hero-title">Cours de Code de la Route</h1>
          <p className="cp-hero-sub">Apprenez à votre rythme avec des cours illustrés, vidéos et PDF</p>
          <div className="cp-hero-chips">
            {Object.values(CAT).map((c,i) => (
              <span key={i} className="cp-chip" style={{background:c.bg,color:c.color,border:`1.5px solid ${c.color}22`}}>
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>
        <svg className="cp-hero-wave" viewBox="0 0 1440 55" preserveAspectRatio="none">
          <path d="M0,28 C360,56 1080,0 1440,32 L1440,55 L0,55 Z" fill="#f4f6fa"/>
        </svg>
      </div>

      <div className="cp-body">

        {/* TOAST */}
        {toast.show && (
          <div className={`cp-toast ${toast.ok?"ok":"err"}`}>
            {toast.ok?"✅":"❌"} {toast.msg}
          </div>
        )}

        {/* TOOLBAR */}
        <div className="cp-toolbar">
          <div className="cp-search">
            <span>🔍</span>
            <input placeholder="Rechercher un cours..."
              value={search} onChange={e=>setSearch(e.target.value)} className="cp-search-inp"/>
            {search && <button className="cp-search-x" onClick={()=>setSearch("")}>×</button>}
          </div>

          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="cp-sel">
            <option value="tous">Toutes catégories</option>
            {Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>

          <select value={filterNiv} onChange={e=>setFilterNiv(e.target.value)} className="cp-sel">
            <option value="tous">Tous niveaux</option>
            {Object.entries(NIV).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>

          {admin && (
            <button className="cp-btn-add" onClick={openAdd}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><path d="M12 5v14M5 12h14"/></svg>
              Nouveau cours
            </button>
          )}
        </div>

        <p className="cp-count">
          {loading ? "Chargement..." : `${filtered.length} cours disponibles`}
          {filterCat !== "tous" && ` · ${CAT[filterCat]?.label}`}
        </p>

        {/* ERREUR */}
        {error && (
          <div className="cp-error">
            ⚠️ {error}
            <button onClick={load} className="cp-retry">Réessayer</button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="cp-loading">
            <div className="cp-spinner"/>
            <p>Chargement des cours...</p>
          </div>
        )}

        {/* VIDE */}
        {!loading && !error && filtered.length === 0 && (
          <div className="cp-empty">
            <div className="cp-empty-ico">📚</div>
            <h3>Aucun cours trouvé</h3>
            <p>{search || filterCat !== "tous" ? "Essayez d'autres filtres." : "Aucun cours disponible pour l'instant."}</p>
            {admin && <button className="cp-btn-add" onClick={openAdd}>＋ Créer le premier cours</button>}
          </div>
        )}

        {/* GRILLE */}
        {!loading && !error && filtered.length > 0 && (
          <div className="cp-grid">
            {filtered.map(c => {
              const cat = CAT[c.categorie] || CAT.autre;
              const niv = NIV[c.niveau]    || NIV.debutant;
              const hasVideo = !!c.video_url;
              const hasPdf   = !!c.pdf_url;
              const hasText  = !!c.contenu;

              return (
                <div key={c.id} className={`cp-card ${!c.actif?"cp-card-inactive":""}`}
                  style={{"--cc":cat.color,"--cb":cat.bg}}>

                  {/* IMAGE */}
                  <div className="cp-card-img-wrap">
                    {c.image
                      ? <img src={c.image} alt={c.titre} className="cp-card-img"
                          onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
                      : null
                    }
                    <div className="cp-card-img-ph" style={{display:c.image?"none":"flex",background:cat.bg}}>
                      <span style={{fontSize:48}}>{cat.icon}</span>
                    </div>

                    {/* Badges médias */}
                    <div className="cp-card-media-badges">
                      {hasVideo && <span className="cp-media-badge video">▶ Vidéo</span>}
                      {hasPdf   && <span className="cp-media-badge pdf">📄 PDF</span>}
                      {hasText  && <span className="cp-media-badge text">📝 Cours</span>}
                    </div>

                    {/* Badge catégorie */}
                    <span className="cp-card-cat" style={{background:cat.color}}>{cat.icon} {cat.label}</span>

                    {/* Admin overlay */}
                    {admin && (
                      <div className="cp-admin-overlay">
                        <button className="cp-admin-btn edit" onClick={e=>{e.stopPropagation();openEdit(c);}}>
                          ✏️ Modifier
                        </button>
                        {confirmDel === c.id ? (
                          <div className="cp-confirm-del">
                            <button className="cp-admin-btn yes" onClick={e=>{e.stopPropagation();handleDelete(c.id);}}>Confirmer</button>
                            <button className="cp-admin-btn no"  onClick={e=>{e.stopPropagation();setConfirmDel(null);}}>Annuler</button>
                          </div>
                        ) : (
                          <button className="cp-admin-btn del" onClick={e=>{e.stopPropagation();setConfirmDel(c.id);}}>
                            🗑️ Supprimer
                          </button>
                        )}
                        {!c.actif && <span className="cp-inactive-tag">Inactif</span>}
                      </div>
                    )}
                  </div>

                  {/* CORPS */}
                  <div className="cp-card-body">
                    {/* Méta */}
                    <div className="cp-card-meta">
                      <span className="cp-badge-niv" style={{background:niv.bg,color:niv.color}}>{niv.label}</span>
                      {c.duree_minutes && (
                        <span className="cp-badge-dur">⏱ {c.duree_minutes} min</span>
                      )}
                    </div>

                    <h3 className="cp-card-title">{c.titre}</h3>

                    {c.description && (
                      <p className="cp-card-desc">{c.description}</p>
                    )}

                    {/* Indicateurs contenu */}
                    <div className="cp-card-indicators">
                      {hasVideo && <span className="cp-indicator">▶ Vidéo explicative</span>}
                      {hasPdf   && <span className="cp-indicator">📄 PDF téléchargeable</span>}
                      {hasText  && <span className="cp-indicator">📝 Cours écrit</span>}
                    </div>

                    {/* BOUTON VOIR */}
                    <button
                      className="cp-btn-voir"
                      style={{background:cat.color}}
                      onClick={() => navigate(`/cours/${c.id}`)}
                    >
                      Voir le cours
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════
          MODAL ADMIN — FORMULAIRE
          ══════════════════════════════ */}
      {showModal && (
        <div className="cp-modal-bg" onClick={()=>setShowModal(false)}>
          <div className="cp-modal" onClick={e=>e.stopPropagation()}>

            <div className="cp-modal-head">
              <h4>{editing ? "✏️ Modifier le cours" : "➕ Nouveau cours"}</h4>
              <button className="cp-modal-x" onClick={()=>setShowModal(false)}>×</button>
            </div>

            {/* ONGLETS FORMULAIRE */}
            <div className="cp-modal-tabs">
              {[
                { k:"info",   ico:"📋", label:"Informations" },
                { k:"media",  ico:"🎬", label:"Médias"       },
                { k:"contenu",ico:"📝", label:"Contenu"      },
              ].map(t => (
                <button key={t.k} className={`cp-modal-tab ${formTab===t.k?"active":""}`}
                  onClick={()=>setFormTab(t.k)}>
                  {t.ico} {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="cp-modal-form">
              {formErr && <div className="cp-modal-err">⚠ {formErr}</div>}

              {/* ── ONGLET INFO ── */}
              {formTab === "info" && (
                <>
                  <div className="cp-fg">
                    <label>Titre *</label>
                    <input type="text" className="cp-fi" value={form.titre}
                      onChange={e=>setForm({...form,titre:e.target.value})}
                      placeholder="Ex : Panneaux de danger — Triangle rouge"/>
                  </div>

                  <div className="cp-fg">
                    <label>Description courte</label>
                    <textarea className="cp-fi" rows={3} value={form.description}
                      onChange={e=>setForm({...form,description:e.target.value})}
                      placeholder="Résumé affiché sur la carte du cours..."/>
                  </div>

                  <div className="cp-fg-row">
                    <div className="cp-fg">
                      <label>Catégorie *</label>
                      <select className="cp-fi" value={form.categorie}
                        onChange={e=>setForm({...form,categorie:e.target.value})}>
                        {Object.entries(CAT).map(([k,v])=>(
                          <option key={k} value={k}>{v.icon} {v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="cp-fg">
                      <label>Niveau *</label>
                      <select className="cp-fi" value={form.niveau}
                        onChange={e=>setForm({...form,niveau:e.target.value})}>
                        {Object.entries(NIV).map(([k,v])=>(
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="cp-fg-row">
                    <div className="cp-fg">
                      <label>Durée estimée (minutes)</label>
                      <input type="number" className="cp-fi" min={5} max={480} value={form.duree_minutes}
                        onChange={e=>setForm({...form,duree_minutes:parseInt(e.target.value)||30})}/>
                    </div>
                    <div className="cp-fg">
                      <label>Statut</label>
                      <select className="cp-fi" value={form.actif?"actif":"inactif"}
                        onChange={e=>setForm({...form,actif:e.target.value==="actif"})}>
                        <option value="actif">✅ Actif (visible)</option>
                        <option value="inactif">🔒 Inactif (masqué)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* ── ONGLET MÉDIAS ── */}
              {formTab === "media" && (
                <>
                  <div className="cp-fg">
                    <label>🖼️ URL Image de couverture</label>
                    <input type="text" className="cp-fi" value={form.image}
                      onChange={e=>setForm({...form,image:e.target.value})}
                      placeholder="https://exemple.com/image.jpg"/>
                    {form.image && (
                      <img src={form.image} alt="preview" className="cp-img-prev"
                        onError={e=>e.target.style.display="none"}/>
                    )}
                  </div>

                  <div className="cp-fg">
                    <label>🎬 Lien Vidéo YouTube</label>
                    <input type="text" className="cp-fi" value={form.video_url}
                      onChange={e=>setForm({...form,video_url:e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."/>
                    {form.video_url && ytEmbed(form.video_url) && (
                      <div className="cp-yt-prev">
                        <iframe src={ytEmbed(form.video_url)} title="preview"
                          width="100%" height="160" frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media" allowFullScreen
                          style={{borderRadius:8,marginTop:8,display:"block"}}/>
                      </div>
                    )}
                    {form.video_url && !ytEmbed(form.video_url) && (
                      <small style={{color:"#e63946"}}>⚠ Lien YouTube invalide</small>
                    )}
                  </div>

                  <div className="cp-fg">
                    <label>📄 Lien PDF (Google Drive, Dropbox...)</label>
                    <input type="text" className="cp-fi" value={form.pdf_url}
                      onChange={e=>setForm({...form,pdf_url:e.target.value})}
                      placeholder="https://drive.google.com/file/d/.../view"/>
                    <small className="cp-help">Partagez votre PDF sur Google Drive et copiez le lien ici.</small>
                  </div>
                </>
              )}

              {/* ── ONGLET CONTENU ── */}
              {formTab === "contenu" && (
                <div className="cp-fg">
                  <label>📝 Contenu écrit du cours</label>
                  <p className="cp-help" style={{marginBottom:8}}>
                    Vous pouvez écrire le cours directement ici. HTML simple supporté
                    (ex: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;).
                  </p>
                  <textarea className="cp-fi cp-contenu-textarea" rows={14} value={form.contenu}
                    onChange={e=>setForm({...form,contenu:e.target.value})}
                    placeholder="<h3>Introduction</h3>&#10;<p>Les panneaux de danger...</p>&#10;<ul>&#10;  <li>Triangle rouge...</li>&#10;</ul>"/>
                </div>
              )}

              <div className="cp-modal-foot">
                <button type="button" className="cp-btn-cancel" onClick={()=>setShowModal(false)}>Annuler</button>
                <button type="submit" className="cp-btn-save" disabled={saving}>
                  {saving ? "⏳ Enregistrement..." : editing ? "💾 Modifier" : "✅ Créer le cours"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}