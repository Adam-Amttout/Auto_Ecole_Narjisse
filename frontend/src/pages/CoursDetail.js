import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CoursDetail.css";

const API = "http://127.0.0.1:8000/api";

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

function ytEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : null;
}

export default function CoursDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [cours,   setCours]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [activeTab, setActiveTab] = useState(""); // sera défini après chargement

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/cours/${id}`);
        const c   = res.data;
        setCours(c);
        // Définit l'onglet par défaut selon les médias disponibles
        if (c.video_url) setActiveTab("video");
        else if (c.contenu) setActiveTab("contenu");
        else if (c.pdf_url) setActiveTab("pdf");
        else setActiveTab("info");
      } catch { setError("Cours introuvable."); }
      finally  { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="cd-page">
      <div className="cd-center">
        <div className="cd-spinner"/>
        <p>Chargement du cours...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="cd-page">
      <div className="cd-center">
        <div style={{fontSize:52,marginBottom:12}}>😕</div>
        <h3>{error}</h3>
        <button className="cd-btn-back" onClick={()=>navigate("/cours")}>← Retour aux cours</button>
      </div>
    </div>
  );

  const cat  = CAT[cours.categorie] || CAT.autre;
  const niv  = NIV[cours.niveau]    || NIV.debutant;
  const embed = ytEmbed(cours.video_url);

  const TABS = [
    ...(cours.video_url                          ? [{ k:"video",   ico:"▶️",  label:"Vidéo"   }] : []),
    ...(cours.contenu && cours.contenu.length>10 ? [{ k:"contenu", ico:"📝",  label:"Cours"   }] : []),
    ...(cours.pdf_url                            ? [{ k:"pdf",     ico:"📄",  label:"PDF"     }] : []),
    { k:"info", ico:"ℹ️", label:"À propos" },
  ];

  return (
    <div className="cd-page">

      {/* ── HERO COURS ── */}
      <div className="cd-hero" style={{background:`linear-gradient(135deg, ${cat.color}22, ${cat.color}08)`}}>
        <div className="cd-hero-inner">
          <button className="cd-btn-back" onClick={()=>navigate("/cours")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Retour aux cours
          </button>

          <div className="cd-hero-meta">
            <span className="cd-badge-cat" style={{background:cat.color}}>{cat.icon} {cat.label}</span>
            <span className="cd-badge-niv" style={{background:niv.bg,color:niv.color}}>{niv.label}</span>
            {cours.duree_minutes && (
              <span className="cd-badge-dur">⏱ {cours.duree_minutes} min</span>
            )}
          </div>

          <h1 className="cd-hero-title">{cours.titre}</h1>

          {cours.description && (
            <p className="cd-hero-desc">{cours.description}</p>
          )}

          {/* Indicateurs de contenu */}
          <div className="cd-hero-media">
            {cours.video_url && <div className="cd-media-chip video">▶ Vidéo disponible</div>}
            {cours.contenu   && <div className="cd-media-chip text">📝 Cours écrit</div>}
            {cours.pdf_url   && <div className="cd-media-chip pdf">📄 PDF téléchargeable</div>}
          </div>
        </div>

        {/* Image de fond si disponible */}
        {cours.image && (
          <div className="cd-hero-img-wrap">
            <img src={cours.image} alt={cours.titre} className="cd-hero-img"/>
          </div>
        )}
      </div>

      {/* ── CONTENU ── */}
      <div className="cd-container">

        {/* ONGLETS */}
        {TABS.length > 1 && (
          <div className="cd-tabs">
            {TABS.map(t => (
              <button key={t.k} className={`cd-tab ${activeTab===t.k?"active":""}`}
                onClick={()=>setActiveTab(t.k)}>
                {t.ico} {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="cd-content">

          {/* ── VIDÉO ── */}
          {activeTab === "video" && embed && (
            <div className="cd-section">
              <h2 className="cd-section-title">🎬 Vidéo du cours</h2>
              <div className="cd-video-wrap">
                <iframe
                  src={embed}
                  title={cours.titre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="cd-video"
                />
              </div>
              <p className="cd-video-hint">
                💡 Regardez cette vidéo explicative pour mieux comprendre le cours.
              </p>
            </div>
          )}

          {activeTab === "video" && !embed && (
            <div className="cd-section">
              <div className="cd-no-content">
                <div style={{fontSize:48,marginBottom:12}}>🎬</div>
                <p>Vidéo non disponible pour le moment.</p>
              </div>
            </div>
          )}

          {/* ── CONTENU ÉCRIT ── */}
          {activeTab === "contenu" && (
            <div className="cd-section">
              <h2 className="cd-section-title">📝 Contenu du cours</h2>
              {cours.contenu ? (
                <div
                  className="cd-written-content"
                  dangerouslySetInnerHTML={{ __html: cours.contenu }}
                />
              ) : (
                <div className="cd-no-content">
                  <div style={{fontSize:48,marginBottom:12}}>📝</div>
                  <p>Contenu écrit non disponible.</p>
                </div>
              )}
            </div>
          )}

          {/* ── PDF ── */}
          {activeTab === "pdf" && (
            <div className="cd-section">
              <h2 className="cd-section-title">📄 Document PDF</h2>
              {cours.pdf_url ? (
                <div className="cd-pdf-zone">
                  <div className="cd-pdf-card">
                    <div className="cd-pdf-icon">📄</div>
                    <div className="cd-pdf-info">
                      <div className="cd-pdf-name">{cours.titre}.pdf</div>
                      <div className="cd-pdf-sub">Document de cours — format PDF</div>
                    </div>
                    <a href={cours.pdf_url} target="_blank" rel="noreferrer" className="cd-pdf-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Télécharger
                    </a>
                  </div>

                  {/* Aperçu inline si lien direct */}
                  <div className="cd-pdf-preview">
                    <iframe
                      src={cours.pdf_url.includes("drive.google.com")
                        ? cours.pdf_url.replace("/view", "/preview")
                        : `https://docs.google.com/viewer?url=${encodeURIComponent(cours.pdf_url)}&embedded=true`
                      }
                      title="PDF Preview"
                      className="cd-pdf-frame"
                    />
                  </div>
                </div>
              ) : (
                <div className="cd-no-content">
                  <div style={{fontSize:48,marginBottom:12}}>📄</div>
                  <p>PDF non disponible.</p>
                </div>
              )}
            </div>
          )}

          {/* ── INFO ── */}
          {activeTab === "info" && (
            <div className="cd-section">
              <h2 className="cd-section-title">ℹ️ À propos de ce cours</h2>
              <div className="cd-info-grid">
                <div className="cd-info-card">
                  <div className="cd-info-icon">{cat.icon}</div>
                  <div className="cd-info-label">Catégorie</div>
                  <div className="cd-info-val" style={{color:cat.color}}>{cat.label}</div>
                </div>
                <div className="cd-info-card">
                  <div className="cd-info-icon">📊</div>
                  <div className="cd-info-label">Niveau</div>
                  <div className="cd-info-val" style={{color:niv.color}}>{niv.label}</div>
                </div>
                <div className="cd-info-card">
                  <div className="cd-info-icon">⏱</div>
                  <div className="cd-info-label">Durée</div>
                  <div className="cd-info-val">{cours.duree_minutes || "—"} min</div>
                </div>
                <div className="cd-info-card">
                  <div className="cd-info-icon">🎬</div>
                  <div className="cd-info-label">Vidéo</div>
                  <div className="cd-info-val">{cours.video_url ? "✅ Disponible" : "—"}</div>
                </div>
                <div className="cd-info-card">
                  <div className="cd-info-icon">📄</div>
                  <div className="cd-info-label">PDF</div>
                  <div className="cd-info-val">{cours.pdf_url ? "✅ Disponible" : "—"}</div>
                </div>
                <div className="cd-info-card">
                  <div className="cd-info-icon">📝</div>
                  <div className="cd-info-label">Cours écrit</div>
                  <div className="cd-info-val">{cours.contenu ? "✅ Disponible" : "—"}</div>
                </div>
              </div>

              {cours.description && (
                <div className="cd-desc-block">
                  <h3>Description</h3>
                  <p>{cours.description}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Navigation entre cours */}
        <div className="cd-nav-bottom">
          <button className="cd-btn-back" onClick={()=>navigate("/cours")}>
            ← Tous les cours
          </button>
          <button className="cd-btn-seance" onClick={()=>navigate("/seances")}>
            🚗 Planifier une séance →
          </button>
        </div>
      </div>
    </div>
  );
}