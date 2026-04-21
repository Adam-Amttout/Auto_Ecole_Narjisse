import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cours.css";
import dangerImg       from "../assets/images/cours/danger.png";
import indicationImg   from "../assets/images/cours/indication.png";
import interdictionImg from "../assets/images/cours/interdiction.png";

const API = "http://127.0.0.1:8000/api";

const CAT = {
  danger:       { color: "#e63946", light: "#fff1f2", img: dangerImg,       route: "/cours/danger" },
  indication:   { color: "#2563eb", light: "#eff6ff", img: indicationImg,   route: "/indication"   },
  interdiction: { color: "#d97706", light: "#fffbeb", img: interdictionImg, route: "/interdiction" },
  autre:        { color: "#16a34a", light: "#f0fdf4", img: null,            route: null            },
};

const NIV = {
  debutant:      { label: "Débutant",      bg: "#dcfce7", color: "#15803d" },
  intermediaire: { label: "Intermédiaire", bg: "#fef9c3", color: "#a16207" },
  avance:        { label: "Avancé",        bg: "#fee2e2", color: "#b91c1c" },
};

const EMPTY = { titre: "", description: "", categorie: "danger", image: "", niveau: "debutant" };

export default function Cours() {
  const navigate = useNavigate();
  const isAdmin  = localStorage.getItem("role") === "admin";

  const [cours,      setCours]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [apiErr,     setApiErr]     = useState("");
  const [search,     setSearch]     = useState("");
  const [filterCat,  setFilterCat]  = useState("tous");
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [formErr,    setFormErr]    = useState("");
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast,      setToast]      = useState({ show: false, msg: "", ok: true });

  const showToast = (msg, ok = true) => {
    setToast({ show: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  useEffect(() => { loadCours(); }, []);

  const loadCours = async () => {
    setLoading(true);
    setApiErr("");
    try {
      const res = await axios.get(`${API}/cours`);
      setCours(res.data);
    } catch {
      setApiErr("Impossible de charger les cours. Vérifiez que le serveur Laravel est démarré sur le port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setFormErr(""); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ titre: c.titre, description: c.description || "", categorie: c.categorie, image: c.image || "", niveau: c.niveau });
    setFormErr("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.titre.trim()) { setFormErr("Le titre est obligatoire."); return; }
    setSaving(true); setFormErr("");
    try {
      if (editing) {
        await axios.put(`${API}/cours/${editing.id}`, form);
        showToast("Cours modifié !");
      } else {
        await axios.post(`${API}/cours`, form);
        showToast("Cours créé !");
      }
      setShowModal(false);
      loadCours();
    } catch (e) {
      setFormErr(e.response?.data?.message || "Erreur serveur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/cours/${id}`);
      setConfirmDel(null);
      showToast("Cours supprimé.");
      loadCours();
    } catch {
      showToast("Impossible de supprimer.", false);
    }
  };

  const goDetail = (c) => {
    const r = CAT[c.categorie]?.route;
    if (r) navigate(r);
  };

  const filtered = cours.filter(c => {
    const q = search.toLowerCase();
    return (c.titre.toLowerCase().includes(q) || (c.description||"").toLowerCase().includes(q))
        && (filterCat === "tous" || c.categorie === filterCat);
  });

  return (
    <div className="cours-page">

      {/* HERO */}
      <div className="cours-hero">
        <div className="cours-hero-inner">
          <span className="cours-hero-badge">Auto École Narjiss</span>
          <h1 className="cours-hero-title">Cours de Code de la Route</h1>
          <p className="cours-hero-sub">Maîtrisez les panneaux et règles pour réussir votre permis</p>
        </div>
        <svg className="cours-hero-wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C480,65 960,0 1440,35 L1440,60 L0,60 Z" fill="#f4f6fa"/>
        </svg>
      </div>

      <div className="cours-body">

        {/* TOAST */}
        {toast.show && (
          <div className={`cours-toast ${toast.ok ? "cours-toast-ok" : "cours-toast-err"}`}>
            {toast.ok ? "✅" : "❌"} {toast.msg}
          </div>
        )}

        {/* ERREUR API */}
        {apiErr && (
          <div className="cours-api-err">
            ⚠️ {apiErr}
            <button onClick={loadCours} className="cours-retry-btn">Réessayer</button>
          </div>
        )}

        {/* TOOLBAR */}
        <div className="cours-toolbar">
          <div className="cours-search-wrap">
            <span className="cours-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cours-search-input"
            />
            {search && <button className="cours-search-clear" onClick={() => setSearch("")}>×</button>}
          </div>

          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="cours-select-cat">
            <option value="tous">Toutes catégories</option>
            <option value="danger">Danger</option>
            <option value="indication">Indication</option>
            <option value="interdiction">Interdiction</option>
            <option value="autre">Autre</option>
          </select>

          {isAdmin && (
            <button className="cours-btn-add" onClick={openAdd}>
              ＋ Ajouter un cours
            </button>
          )}
        </div>

        {/* COMPTEUR */}
        {!loading && !apiErr && (
          <p className="cours-counter">
            <b>{filtered.length}</b> cours {filterCat !== "tous" ? `· ${filterCat}` : "disponibles"}
            {search && ` · recherche "${search}"`}
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <div className="cours-loading">
            <div className="cours-spinner" />
            <p>Chargement des cours depuis l'API...</p>
          </div>
        )}

        {/* VIDE */}
        {!loading && !apiErr && filtered.length === 0 && (
          <div className="cours-empty">
            <div className="cours-empty-icon">📚</div>
            <h3>Aucun cours trouvé</h3>
            <p>
              {search || filterCat !== "tous"
                ? "Modifiez vos filtres de recherche."
                : "Aucun cours n'a encore été créé."}
            </p>
            {isAdmin && !search && filterCat === "tous" && (
              <button className="cours-btn-add" onClick={openAdd}>＋ Créer le premier cours</button>
            )}
          </div>
        )}

        {/* GRILLE */}
        {!loading && !apiErr && filtered.length > 0 && (
          <div className="cours-grid">
            {filtered.map(c => {
              const cat = CAT[c.categorie] || CAT.autre;
              const niv = NIV[c.niveau]    || NIV.debutant;
              const img = c.image || cat.img;

              return (
                <div key={c.id} className="cours-card" style={{ "--c": cat.color, "--cl": cat.light }}>

                  {/* Image */}
                  <div className="cours-card-top">
                    {img
                      ? <img src={img} alt={c.titre} className="cours-card-img"
                          onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
                      : null
                    }
                    <div className="cours-card-img-ph" style={{ display: img ? "none" : "flex", background: cat.light }}>
                      <span style={{ fontSize: 42 }}>📖</span>
                    </div>

                    {/* Badge catégorie */}
                    <span className="cours-badge-cat" style={{ background: cat.color }}>
                      {c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1)}
                    </span>

                    {/* Boutons admin */}
                    {isAdmin && (
                      <div className="cours-card-admin">
                        <button className="cca-btn edit" title="Modifier"
                          onClick={e => { e.stopPropagation(); openEdit(c); }}>✏️</button>
                        {confirmDel === c.id ? (
                          <>
                            <button className="cca-btn yes" onClick={e => { e.stopPropagation(); handleDelete(c.id); }}>Oui</button>
                            <button className="cca-btn no"  onClick={e => { e.stopPropagation(); setConfirmDel(null); }}>Non</button>
                          </>
                        ) : (
                          <button className="cca-btn del" title="Supprimer"
                            onClick={e => { e.stopPropagation(); setConfirmDel(c.id); }}>🗑️</button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Corps */}
                  <div className="cours-card-body">
                    <span className="cours-badge-niv" style={{ background: niv.bg, color: niv.color }}>
                      {niv.label}
                    </span>
                    <h3 className="cours-card-title">{c.titre}</h3>
                    {c.description && <p className="cours-card-desc">{c.description}</p>}
                    <button className="cours-btn-voir" style={{ background: cat.color }} onClick={() => goDetail(c)}>
                      Voir le cours →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="cours-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cours-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cours-modal-header">
              <h4>{editing ? "✏️ Modifier le cours" : "➕ Nouveau cours"}</h4>
              <button className="cours-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="cours-modal-body">
              {formErr && <div className="cours-form-error">⚠ {formErr}</div>}

              <div className="cours-field">
                <label>Titre *</label>
                <input type="text" value={form.titre} className="cours-input"
                  placeholder="Ex : Panneaux de danger"
                  onChange={e => setForm({...form, titre: e.target.value})} />
              </div>

              <div className="cours-field">
                <label>Description</label>
                <textarea rows={3} value={form.description} className="cours-input"
                  placeholder="Décrivez le contenu du cours..."
                  onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div className="cours-field-row">
                <div className="cours-field">
                  <label>Catégorie *</label>
                  <select value={form.categorie} className="cours-input"
                    onChange={e => setForm({...form, categorie: e.target.value})}>
                    <option value="danger">Danger</option>
                    <option value="indication">Indication</option>
                    <option value="interdiction">Interdiction</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="cours-field">
                  <label>Niveau *</label>
                  <select value={form.niveau} className="cours-input"
                    onChange={e => setForm({...form, niveau: e.target.value})}>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                  </select>
                </div>
              </div>

              <div className="cours-field">
                <label>URL Image <small style={{color:"#94a3b8"}}>(optionnel)</small></label>
                <input type="text" value={form.image} className="cours-input"
                  placeholder="https://exemple.com/image.jpg"
                  onChange={e => setForm({...form, image: e.target.value})} />
                {form.image && (
                  <img src={form.image} alt="preview" className="cours-img-preview"
                    onError={e => e.target.style.display="none"} />
                )}
              </div>

              <div className="cours-modal-footer">
                <button type="button" className="cours-btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="cours-btn-save" disabled={saving}>
                  {saving ? "Enregistrement..." : editing ? "💾 Modifier" : "✅ Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}