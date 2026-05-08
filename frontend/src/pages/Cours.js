import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cours.css";
import QuizQCM from "./QuizQCM";

const API = "http://127.0.0.1:8000/api";
const isAdmin = () => localStorage.getItem("role") === "admin";
const getUser = () => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } };

const CAT = {
  danger:       { icon:"⚠️",  label:"Danger",       color:"#e63946", bg:"#fff1f2", desc:"Panneaux et situations dangereuses" },
  indication:   { icon:"ℹ️",  label:"Indication",   color:"#2563eb", bg:"#eff6ff", desc:"Panneaux d'indication et direction" },
  interdiction: { icon:"🚫",  label:"Interdiction", color:"#d97706", bg:"#fffbeb", desc:"Règles d'interdiction et limitations" },
  code_route:   { icon:"📋",  label:"Code Route",   color:"#7c3aed", bg:"#f5f3ff", desc:"Règles générales du code de la route" },
  conduite:     { icon:"🚗",  label:"Conduite",     color:"#059669", bg:"#ecfdf5", desc:"Techniques et pratiques de conduite" },
  autre:        { icon:"📖",  label:"Autre",        color:"#475569", bg:"#f8fafc", desc:"Autres ressources pédagogiques" },
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

const TESTIMONIALS = [
  { id:1, name:"Sophie Martin", role:"Permis B obtenu en 20h", text:"Une expérience exceptionnelle ! Les moniteurs sont très professionnels et à l'écoute. J'ai obtenu mon permis du premier coup grâce à leur méthode pédagogique unique.", rating:5, date:"Mars 2024", image:"https://randomuser.me/api/portraits/women/1.jpg" },
  { id:2, name:"Thomas Bernard", role:"Permis B obtenu en 25h", text:"Je recommande vivement cette auto-école. Le suivi personnalisé et les cours pratiques m'ont permis de gagner en confiance rapidement. Un grand merci à toute l'équipe !", rating:5, date:"Février 2024", image:"https://randomuser.me/api/portraits/men/2.jpg" },
  { id:3, name:"Laura Dubois", role:"Permis B obtenu en 18h", text:"Formation de qualité avec des moniteurs patients et compétents. Les supports de cours sont modernes et adaptés. Une réussite grâce à une équipe formidable.", rating:5, date:"Janvier 2024", image:"https://randomuser.me/api/portraits/women/3.jpg" },
  { id:4, name:"Karim Alaoui", role:"Permis B du premier coup", text:"La plateforme de cours en ligne est excellente ! Les vidéos explicatives et les PDF m'ont beaucoup aidé à préparer l'examen théorique. Je recommande à 100%.", rating:5, date:"Décembre 2023", image:"https://randomuser.me/api/portraits/men/4.jpg" },
];

const ytEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&autoplay=1&modestbranding=1` : url;
};

export default function Cours() {
  const navigate = useNavigate();
  const admin = isAdmin();
  const user = getUser();
  const coursesRef = useRef(null);

  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("categories"); // "categories" | "courses"

  /* ── Avis (reviews) state ── */
  const EMPTY_AVIS = { nom: user?.prenom || "", prenom: user?.nom || "", role_label: "", texte: "", note: 5, photo_url: "" };
  const [avisForm, setAvisForm] = useState(EMPTY_AVIS);
  const [avisSubmitting, setAvisSubmitting] = useState(false);
  const [avisSuccess, setAvisSuccess] = useState(false);
  const [avisErr, setAvisErr] = useState("");
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);

  /* ── Progression state ── */
  const [completedIds, setCompletedIds] = useState([]);
  const [progTotal, setProgTotal]       = useState(0);
  const [progPct, setProgPct]           = useState(0);
  const [catProgression, setCatProgression] = useState({}); // { danger: {total,done,completed,pct}, ... }

  const completedCats = Object.values(catProgression).filter(cp => cp.completed).length;
  const totalCats = Object.keys(CAT).length;
  const catPct = totalCats > 0 ? Math.round((completedCats / totalCats) * 100) : 0;

  const submitAvis = async (e) => {
    e.preventDefault();
    if (!avisForm.texte.trim() || !avisForm.nom.trim()) { setAvisErr("Veuillez remplir les champs obligatoires."); return; }
    setAvisSubmitting(true); setAvisErr("");
    try {
      await axios.post(`${API}/avis`, avisForm);
      setAvisSuccess(true);
      setAvisForm(EMPTY_AVIS);
    } catch (err) { 
      const msg = err.response?.data?.message || "Erreur lors de l'envoi. Réessayez.";
      setAvisErr(msg); 
    }
    finally { setAvisSubmitting(false); }
  };
  const [selectedCat, setSelectedCat] = useState("tous");
  const [search, setSearch] = useState("");
  const [filterNiv, setFilterNiv] = useState("tous");
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formTab, setFormTab] = useState("info");
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState({ show:false, msg:"", ok:true });

  const toast_ = (msg, ok=true) => { setToast({show:true,msg,ok}); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { 
    load(); 
    axios.get(`${API}/avis/approved`)
      .then(r => { if (r.data && r.data.length > 0) setDynamicTestimonials(r.data); })
      .catch(() => {});
    if (user?.id) {
      axios.get(`${API}/progression?client_id=${user.id}`)
        .then(r => {
          setCompletedIds(r.data.completed || []);
          setProgTotal(r.data.total || 0);
          setProgPct(r.data.pourcentage || 0);
        })
        .catch(() => {});
      axios.get(`${API}/progression/by-category?client_id=${user.id}`)
        .then(r => setCatProgression(r.data || {}))
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, user?.id]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i+1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const toggleProgression = async (coursId) => {
    if (!user?.id) return;
    try {
      const res = await axios.post(`${API}/progression/toggle`, { client_id: user.id, cours_id: coursId });
      const wasAdded = res.data.status === 'added';
      setCompletedIds(prev =>
        wasAdded ? [...prev, coursId] : prev.filter(id => id !== coursId)
      );
      setProgPct(prev => {
        const newCount = wasAdded
          ? completedIds.length + 1
          : completedIds.length - 1;
        return progTotal > 0 ? Math.round((newCount / progTotal) * 100) : 0;
      });
      // Refresh per-category stats after toggle
      axios.get(`${API}/progression/by-category?client_id=${user.id}`)
        .then(r => setCatProgression(r.data || {}))
        .catch(() => {});
    } catch { /* silent */ }
  };

  const load = async () => {
    setLoading(true); setError("");
    try {
      const url = admin ? `${API}/cours/all` : `${API}/cours`;
      const res = await axios.get(url);
      setCours(res.data);
    } catch { setError("Impossible de charger les cours."); }
    finally { setLoading(false); }
  };

  const selectCategory = (key) => {
    setSelectedCat(key);
    setView("courses");
    setSearch("");
    setFilterNiv("tous");
    setExpandedVideo(null);
    setTimeout(() => coursesRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
  };

  const backToCategories = () => { setView("categories"); setSelectedCat("tous"); setExpandedVideo(null); };

  const filtered = cours.filter(c => {
    const q = search.toLowerCase();
    return (c.titre.toLowerCase().includes(q) || (c.description||"").toLowerCase().includes(q))
      && (selectedCat === "tous" || c.categorie === selectedCat)
      && (filterNiv === "tous" || c.niveau === filterNiv);
  });

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setFormErr(""); setFormTab("info"); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ titre:c.titre, description:c.description||"", categorie:c.categorie, niveau:c.niveau, image:c.image||"", video_url:c.video_url||"", contenu:c.contenu||"", pdf_url:c.pdf_url||"", duree_minutes:c.duree_minutes||30, actif:c.actif }); setFormErr(""); setFormTab("info"); setShowModal(true); };
  const handleSave = async (e) => { e.preventDefault(); if (!form.titre.trim()) { setFormErr("Le titre est obligatoire."); setFormTab("info"); return; } setSaving(true); setFormErr(""); try { if (editing) { await axios.put(`${API}/cours/${editing.id}`, form); toast_("Cours modifié !"); } else { await axios.post(`${API}/cours`, form); toast_("Cours créé !"); } setShowModal(false); load(); } catch(e) { setFormErr(e.response?.data?.message||"Erreur serveur."); } finally { setSaving(false); } };
  const handleDelete = async (id) => { try { await axios.delete(`${API}/cours/${id}`); setConfirmDel(null); toast_("Cours supprimé."); load(); } catch { toast_("Impossible de supprimer.", false); } };

  const downloadPdf = (url, titre) => {
    // Guard: if someone accidentally put a YouTube URL in the PDF field
    if (!url) return;
    const isYoutube = /youtube\.com|youtu\.be/i.test(url);
    if (isYoutube) {
      alert("⚠️ Ce lien est une vidéo YouTube, pas un PDF. Veuillez corriger le lien PDF dans le Dashboard.");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <div className="cp-page">

      {/* HERO */}
      <div className="cp-hero">
        <div className="cp-hero-content">
          <p className="cp-hero-label">Auto École Narjiss</p>
          <h1 className="cp-hero-title">Nos Cours de Formation</h1>
          <p className="cp-hero-sub">Apprenez à votre rythme avec des vidéos, cours illustrés et PDF téléchargeables</p>
          <div className="cp-hero-chips">
            {Object.values(CAT).map((c,i) => (
              <span key={i} className="cp-chip" style={{background:c.bg,color:c.color,border:`1.5px solid ${c.color}33`}}>
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>
        <svg className="cp-hero-wave" viewBox="0 0 1440 55" preserveAspectRatio="none">
          <path d="M0,28 C360,56 1080,0 1440,32 L1440,55 L0,55 Z" fill="#f4f6fa"/>
        </svg>
      </div>

      {/* TOAST */}
      {toast.show && <div className={`cp-toast ${toast.ok?"ok":"err"}`}>{toast.ok?"✅":"❌"} {toast.msg}</div>}

      {/* ── LOGIN GATE (non-authenticated) ── */}
      {!user && (
        <div className="cp-gate">
          <div className="cp-gate-icon">🔐</div>
          <h2>Accès réservé aux membres</h2>
          <p>Connectez-vous ou créez un compte gratuit pour accéder à tous nos cours, vidéos et PDF.</p>
          <div className="cp-gate-btns">
            <button className="cp-gate-login" onClick={() => navigate("/connexion")}>Se connecter</button>
            <button className="cp-gate-register" onClick={() => navigate("/creer_compte")}>Créer un compte</button>
          </div>
          <div className="cp-gate-features">
            <span>✅ Cours vidéo</span>
            <span>✅ PDF téléchargeables</span>
            <span>✅ 6 catégories</span>
          </div>
        </div>
      )}

      {/* ── CATEGORY VIEW ── */}
      {user && view === "categories" && (
        <div className="cp-body">
          <div className="cp-cat-header">
            <span className="cp-cat-tag">Choisissez votre domaine</span>
            <h2>Sélectionnez une <span className="cp-gradient-text">Catégorie</span></h2>
            <p>Cliquez sur une catégorie pour accéder aux cours correspondants</p>
          </div>

          {/* ── PROGRESS SECTION ── */}
          {!admin && (progTotal > 0 || totalCats > 0) && (
            <div className="cp-progress-row">
              <div className="cp-progress-widget">
                <div className="cp-progress-top">
                  <span className="cp-progress-label">🎯 Progression Cours</span>
                  <span className="cp-progress-pct">{progPct}%</span>
                </div>
                <div className="cp-progress-track">
                  <div className="cp-progress-fill" style={{width: `${progPct}%`}} />
                </div>
                <p className="cp-progress-sub">
                  {completedIds.length} cours sur {progTotal} terminés
                </p>
              </div>

              <div className="cp-progress-widget cp-cat-progress-widget">
                <div className="cp-progress-top">
                  <span className="cp-progress-label">🏆 Catégories Validées</span>
                  <span className="cp-progress-pct">{completedCats}/{totalCats}</span>
                </div>
                <div className="cp-progress-track">
                  <div className="cp-progress-fill" style={{width: `${catPct}%`, background: 'linear-gradient(90deg, #059669, #34d399)'}} />
                </div>
                <p className="cp-progress-sub">
                   {completedCats === totalCats ? "Toutes les catégories sont validées ! 🎉" : `${totalCats - completedCats} catégorie(s) restante(s)`}
                </p>
              </div>
            </div>
          )}

          <div className="cp-cat-grid">
            {Object.entries(CAT).map(([key, cat]) => {
              const count = cours.filter(c => c.categorie === key).length;
              const cp = catProgression[key];
              const catDone = cp?.completed || false;
              const catPct  = cp?.pct || 0;
              const catDoneCount = cp?.done || 0;
              return (
                <div key={key} className={`cp-cat-card ${catDone ? 'cp-cat-card--done' : ''}`} style={{"--cat-color": cat.color, "--cat-bg": cat.bg}} onClick={() => selectCategory(key)}>
                  <div className="cp-cat-card-icon">
                    {cat.icon}
                    {catDone && <span className="cp-cat-done-badge">✓</span>}
                  </div>
                  <h3>{cat.label}</h3>
                  <p>{cat.desc}</p>
                  {!admin && cp && count > 0 && (
                    <div className="cp-cat-mini-prog">
                      <div className="cp-cat-mini-track">
                        <div className="cp-cat-mini-fill" style={{width: `${catPct}%`, background: catDone ? '#059669' : cat.color}} />
                      </div>
                      <span className="cp-cat-mini-label" style={{color: catDone ? '#059669' : cat.color}}>
                        {catDone ? '✅ Complété !' : `${catDoneCount}/${count} cours`}
                      </span>
                    </div>
                  )}
                  <div className="cp-cat-card-footer">
                    <span className="cp-cat-count">{loading ? "..." : `${count} cours`}</span>
                    <span className="cp-cat-arrow">{catDone ? 'Revoir →' : 'Voir les cours →'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {admin && (
            <div style={{textAlign:"center", marginTop:24}}>
              <button className="cp-btn-add" onClick={openAdd}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><path d="M12 5v14M5 12h14"/></svg>
                Nouveau cours
              </button>
            </div>
          )}

          <div className="cp-all-btn-wrap">
            <button className="cp-all-btn" onClick={() => { setSelectedCat("tous"); setView("courses"); setTimeout(() => coursesRef.current?.scrollIntoView({ behavior:"smooth" }), 100); }}>
              📚 Voir tous les cours
            </button>
          </div>

          {/* ── REVIEW SUBMISSION FORM ── */}
          <div className="cp-review-section">
            <div className="cp-cat-header" style={{marginBottom:28}}>
              <span className="cp-cat-tag">Votre avis</span>
              <h2>Partagez votre <span className="cp-gradient-text">Expérience</span></h2>
              <p>Votre témoignage aide d'autres élèves à choisir la bonne formation</p>
            </div>

            {avisSuccess ? (
              <div className="cp-avis-success">
                <span>🎉</span>
                <h3>Merci pour votre avis !</h3>
                <p>Votre témoignage est en cours de validation par notre équipe. Il apparaîtra bientôt sur le site.</p>
                <button className="cp-all-btn" onClick={() => setAvisSuccess(false)}>Laisser un autre avis</button>
              </div>
            ) : (
              <form className="cp-avis-form" onSubmit={submitAvis}>
                {avisErr && <div className="cp-avis-err">⚠ {avisErr}</div>}
                <div className="cp-avis-row">
                  <div className="cp-avis-field">
                    <label>Prénom *</label>
                    <input className="cp-fi" value={avisForm.nom} onChange={e => setAvisForm({...avisForm, nom: e.target.value})} placeholder="Votre prénom" required/>
                  </div>
                  <div className="cp-avis-field">
                    <label>Nom</label>
                    <input className="cp-fi" value={avisForm.prenom} onChange={e => setAvisForm({...avisForm, prenom: e.target.value})} placeholder="Votre nom"/>
                  </div>
                </div>
                <div className="cp-avis-field">
                  <label>Votre situation (ex: Permis B obtenu en 20h)</label>
                  <input className="cp-fi" value={avisForm.role_label} onChange={e => setAvisForm({...avisForm, role_label: e.target.value})} placeholder="Ex: Permis B obtenu en 20h"/>
                </div>
                <div className="cp-avis-field">
                  <label>Votre témoignage *</label>
                  <textarea className="cp-fi" rows={4} value={avisForm.texte} onChange={e => setAvisForm({...avisForm, texte: e.target.value})} placeholder="Partagez votre expérience avec Auto École Narjiss..." required/>
                </div>
                <div className="cp-avis-field">
                  <label>Note</label>
                  <div className="cp-avis-stars">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" className={`cp-avis-star ${n <= avisForm.note ? "active" : ""}`} onClick={() => setAvisForm({...avisForm, note: n})}>★</button>
                    ))}
                    <span className="cp-avis-star-label">{avisForm.note}/5</span>
                  </div>
                </div>
                <button type="submit" className="cp-btn-save" disabled={avisSubmitting} style={{width:"100%",padding:"13px",fontSize:"15px"}}>
                  {avisSubmitting ? "⏳ Envoi en cours..." : "✉️ Soumettre mon avis"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── COURSES VIEW ── */}
      {user && view === "courses" && (
        <div className="cp-body" ref={coursesRef}>
          <div className="cp-courses-top">
            <button className="cp-back-btn" onClick={backToCategories}>
              ← Retour aux catégories
            </button>

            {selectedCat !== "tous" && (
              <div className="cp-current-cat" style={{background: CAT[selectedCat]?.bg, color: CAT[selectedCat]?.color, border:`2px solid ${CAT[selectedCat]?.color}33`}}>
                <span>{CAT[selectedCat]?.icon}</span>
                <strong>{CAT[selectedCat]?.label}</strong>
              </div>
            )}
          </div>

          <div className="cp-toolbar">
            <div className="cp-search">
              <span>🔍</span>
              <input placeholder="Rechercher un cours..." value={search} onChange={e=>setSearch(e.target.value)} className="cp-search-inp"/>
              {search && <button className="cp-search-x" onClick={()=>setSearch("")}>×</button>}
            </div>
            <select value={filterNiv} onChange={e=>setFilterNiv(e.target.value)} className="cp-sel">
              <option value="tous">Tous niveaux</option>
              {Object.entries(NIV).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            {admin && <button className="cp-btn-add" onClick={openAdd}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><path d="M12 5v14M5 12h14"/></svg>Nouveau cours</button>}
          </div>

          <p className="cp-count">{loading ? "Chargement..." : `${filtered.length} cours disponibles`}{selectedCat !== "tous" && ` · ${CAT[selectedCat]?.label}`}</p>

          {error && <div className="cp-error">⚠️ {error}<button onClick={load} className="cp-retry">Réessayer</button></div>}
          {loading && <div className="cp-loading"><div className="cp-spinner"/><p>Chargement des cours...</p></div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="cp-empty">
              <div className="cp-empty-ico">📚</div>
              <h3>Aucun cours trouvé</h3>
              <p>{search || filterNiv !== "tous" ? "Essayez d'autres filtres." : "Aucun cours disponible pour l'instant."}</p>
              {admin && <button className="cp-btn-add" onClick={openAdd}>＋ Créer le premier cours</button>}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="cp-grid">
              {filtered.map(c => {
                const cat = CAT[c.categorie] || CAT.autre;
                const niv = NIV[c.niveau] || NIV.debutant;
                const hasVideo = !!c.video_url;
                const hasPdf = !!c.pdf_url;
                const videoOpen = expandedVideo === c.id;
                const embedUrl = ytEmbed(c.video_url);

                return (
                  <div key={c.id} className={`cp-card ${!c.actif?"cp-card-inactive":""}`} style={{"--cc":cat.color,"--cb":cat.bg}}>
                    {/* IMAGE */}
                    <div className="cp-card-img-wrap">
                      {c.image ? <img src={c.image} alt={c.titre} className="cp-card-img" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/> : null}
                      <div className="cp-card-img-ph" style={{display:c.image?"none":"flex",background:cat.bg}}>
                        <span style={{fontSize:48}}>{cat.icon}</span>
                      </div>
                      <div className="cp-card-media-badges">
                        {hasVideo && <span className="cp-media-badge video">▶ Vidéo</span>}
                        {hasPdf   && <span className="cp-media-badge pdf">📄 PDF</span>}
                      </div>
                      <span className="cp-card-cat" style={{background:cat.color}}>{cat.icon} {cat.label}</span>
                      {admin && (
                        <div className="cp-admin-overlay">
                          <button className="cp-admin-btn edit" onClick={e=>{e.stopPropagation();openEdit(c);}}>✏️ Modifier</button>
                          {confirmDel === c.id ? (
                            <div className="cp-confirm-del">
                              <button className="cp-admin-btn yes" onClick={e=>{e.stopPropagation();handleDelete(c.id);}}>Confirmer</button>
                              <button className="cp-admin-btn no" onClick={e=>{e.stopPropagation();setConfirmDel(null);}}>Annuler</button>
                            </div>
                          ) : <button className="cp-admin-btn del" onClick={e=>{e.stopPropagation();setConfirmDel(c.id);}}>🗑️ Supprimer</button>}
                        </div>
                      )}
                    </div>

                    {/* INLINE VIDEO PLAYER */}
                    {videoOpen && embedUrl && (
                      <div className="cp-video-player">
                        <div className="cp-video-header">
                          <span>▶ Lecture en cours</span>
                          <button className="cp-video-close" onClick={()=>setExpandedVideo(null)}>✕ Fermer</button>
                        </div>
                        <iframe
                          src={embedUrl}
                          title={c.titre}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="cp-video-iframe"
                        />
                      </div>
                    )}

                    {/* BODY */}
                    <div className="cp-card-body">
                      <div className="cp-card-meta">
                        <span className="cp-badge-niv" style={{background:niv.bg,color:niv.color}}>{niv.label}</span>
                        {c.duree_minutes && <span className="cp-badge-dur">⏱ {c.duree_minutes} min</span>}
                      </div>
                      <h3 className="cp-card-title">{c.titre}</h3>
                      {c.description && <p className="cp-card-desc">{c.description}</p>}

                      {/* ACTION BUTTONS */}
                      <div className="cp-card-actions">
                        {hasVideo && (
                          <button
                            className={`cp-btn-video ${videoOpen?"active":""}`}
                            onClick={() => setExpandedVideo(videoOpen ? null : c.id)}
                          >
                            {videoOpen ? "⏹ Arrêter la vidéo" : "▶ Voir la vidéo"}
                          </button>
                        )}
                        {hasPdf && (
                          <button className="cp-btn-pdf" onClick={() => downloadPdf(c.pdf_url, c.titre)}>
                            📄 Télécharger PDF
                          </button>
                        )}
                        <button className="cp-btn-voir" style={{background:cat.color}} onClick={()=>navigate(`/cours/${c.id}`)}>
                          Voir le cours
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                        {user && !admin && (
                          <button
                            className={`cp-btn-done ${completedIds.includes(c.id) ? 'completed' : ''}`}
                            onClick={() => toggleProgression(c.id)}
                            title={completedIds.includes(c.id) ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                          >
                            {completedIds.includes(c.id) ? '✅ Terminé' : '⬜ Terminé ?'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── QCM QUIZ (Code de la Route only) ── */}
          {!admin && selectedCat === "code_route" && (
            <div className="cp-qcm-section">
              <div className="cp-cat-header" style={{marginBottom:8}}>
                <span className="cp-cat-tag" style={{background:"rgba(124,58,237,.1)",color:"#7c3aed"}}>Quiz interactif</span>
                <h2>Testez vos <span className="cp-gradient-text">Connaissances</span></h2>
                <p>Répondez à 12 questions aléatoires et obtenez votre score immédiatement</p>
              </div>
              <QuizQCM />
            </div>
          )}
        </div>
      )}

      {/* ── TESTIMONIALS ── */}
      <section className="cp-testimonials-section">
        <div className="cp-testimonials-header">
          <span className="cp-cat-tag">Avis Clients</span>
          <h2>Ce que disent <span className="cp-gradient-text">Nos Élèves</span></h2>
          <p>Des retours authentiques sur notre formation</p>
        </div>
        <div className="cp-testimonials-scroll-container">
          {(dynamicTestimonials.length > 0 ? dynamicTestimonials : TESTIMONIALS).map((t, index) => {
            const isDynamic = dynamicTestimonials.length > 0;
            const name   = isDynamic ? `${t.nom}${t.prenom ? ' ' + t.prenom : ''}` : t.name;
            const role   = isDynamic ? t.role_label : t.role;
            const text   = isDynamic ? t.texte : t.text;
            const rating = isDynamic ? t.note : t.rating;
            const date   = isDynamic
              ? new Date(t.created_at).toLocaleDateString('fr-FR', {month:'long', year:'numeric'})
              : t.date;
            const image  = isDynamic ? t.photo_url : t.image;
            const initials   = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : '?';
            const COLORS = ['#e63946','#2563eb','#7c3aed','#059669','#d97706','#0891b2'];
            const avatarBg   = COLORS[index % COLORS.length];

            return (
              <div key={t.id} className="cp-testimonial-card scrollable">
                <div className="cp-t-header">
                  <div className="cp-t-img">
                    {image
                      ? <img src={image} alt={name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                      : null
                    }
                    <div style={{
                      display: image ? 'none' : 'flex',
                      width:'100%', height:'100%',
                      alignItems:'center', justifyContent:'center',
                      background: avatarBg, color:'white',
                      fontWeight:800, fontSize:18, borderRadius:'50%'
                    }}>{initials}</div>
                  </div>
                  <div className="cp-t-info"><h4>{name}</h4><span>{role}</span></div>
                  <div className="cp-t-quote">"</div>
                </div>
                <div className="cp-t-content">
                  <p>{text}</p>
                  <div className="cp-t-rating">{[...Array(rating)].map((_,i)=><span key={i} className="cp-star">★</span>)}</div>
                  <div className="cp-t-date">{date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL ADMIN */}
      {showModal && (
        <div className="cp-modal-bg" onClick={()=>setShowModal(false)}>
          <div className="cp-modal" onClick={e=>e.stopPropagation()}>
            <div className="cp-modal-head">
              <h4>{editing ? "✏️ Modifier le cours" : "➕ Nouveau cours"}</h4>
              <button className="cp-modal-x" onClick={()=>setShowModal(false)}>×</button>
            </div>
            <div className="cp-modal-tabs">
              {[{k:"info",ico:"📋",label:"Informations"},{k:"media",ico:"🎬",label:"Médias"},{k:"contenu",ico:"📝",label:"Contenu"}].map(t=>(
                <button key={t.k} className={`cp-modal-tab ${formTab===t.k?"active":""}`} onClick={()=>setFormTab(t.k)}>{t.ico} {t.label}</button>
              ))}
            </div>
            <form onSubmit={handleSave} className="cp-modal-form">
              {formErr && <div className="cp-modal-err">⚠ {formErr}</div>}
              {formTab==="info" && (
                <>
                  <div className="cp-fg"><label>Titre *</label><input type="text" className="cp-fi" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})} placeholder="Ex : Panneaux de danger"/></div>
                  <div className="cp-fg"><label>Description</label><textarea className="cp-fi" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Résumé affiché sur la carte..."/></div>
                  <div className="cp-fg-row">
                    <div className="cp-fg"><label>Catégorie *</label><select className="cp-fi" value={form.categorie} onChange={e=>setForm({...form,categorie:e.target.value})}>{Object.entries(CAT).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}</select></div>
                    <div className="cp-fg"><label>Niveau *</label><select className="cp-fi" value={form.niveau} onChange={e=>setForm({...form,niveau:e.target.value})}>{Object.entries(NIV).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
                  </div>
                  <div className="cp-fg-row">
                    <div className="cp-fg"><label>Durée (min)</label><input type="number" className="cp-fi" min={5} max={480} value={form.duree_minutes} onChange={e=>setForm({...form,duree_minutes:parseInt(e.target.value)||30})}/></div>
                    <div className="cp-fg"><label>Statut</label><select className="cp-fi" value={form.actif?"actif":"inactif"} onChange={e=>setForm({...form,actif:e.target.value==="actif"})}><option value="actif">✅ Actif</option><option value="inactif">🔒 Inactif</option></select></div>
                  </div>
                </>
              )}
              {formTab==="media" && (
                <>
                  <div className="cp-fg"><label>🖼️ URL Image</label><input type="text" className="cp-fi" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/>{form.image && <img src={form.image} alt="preview" className="cp-img-prev" onError={e=>e.target.style.display="none"}/>}</div>
                  <div className="cp-fg"><label>🎬 Lien Vidéo YouTube</label><input type="text" className="cp-fi" value={form.video_url} onChange={e=>setForm({...form,video_url:e.target.value})} placeholder="https://www.youtube.com/watch?v=..."/>{form.video_url && ytEmbed(form.video_url) && <div className="cp-yt-prev"><iframe src={ytEmbed(form.video_url).replace("&autoplay=1","")} title="preview" width="100%" height="160" frameBorder="0" allowFullScreen style={{borderRadius:8,marginTop:8,display:"block"}}/></div>}</div>
                  <div className="cp-fg"><label>📄 Lien PDF</label><input type="text" className="cp-fi" value={form.pdf_url} onChange={e=>setForm({...form,pdf_url:e.target.value})} placeholder="https://drive.google.com/..."/><small className="cp-help">Partagez votre PDF sur Google Drive et copiez le lien ici.</small></div>
                </>
              )}
              {formTab==="contenu" && (
                <div className="cp-fg"><label>📝 Contenu écrit</label><textarea className="cp-fi cp-contenu-textarea" rows={14} value={form.contenu} onChange={e=>setForm({...form,contenu:e.target.value})} placeholder="<h3>Introduction</h3>&#10;<p>Les panneaux de danger...</p>"/></div>
              )}
              <div className="cp-modal-foot">
                <button type="button" className="cp-btn-cancel" onClick={()=>setShowModal(false)}>Annuler</button>
                <button type="submit" className="cp-btn-save" disabled={saving}>{saving?"⏳ Enregistrement...":editing?"💾 Modifier":"✅ Créer le cours"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}