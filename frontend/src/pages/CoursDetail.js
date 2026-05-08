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

const ytEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : url;
};

export default function CoursDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/cours/${id}`)
      .then(r => setCours(r.data))
      .catch(() => setError("Cours introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPdf = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  if (loading) return (
    <div className="cd-loading">
      <div className="cd-spinner"/>
      <p>Chargement du cours...</p>
    </div>
  );

  if (error || !cours) return (
    <div className="cd-error-page">
      <div className="cd-error-ico">📚</div>
      <h2>Cours introuvable</h2>
      <p>{error}</p>
      <button className="cd-back-btn" onClick={() => navigate("/cours")}>← Retour aux cours</button>
    </div>
  );

  const cat = CAT[cours.categorie] || CAT.autre;
  const niv = NIV[cours.niveau] || NIV.debutant;
  const hasVideo = !!cours.video_url;
  const hasPdf   = !!cours.pdf_url;
  const embedUrl = ytEmbed(cours.video_url);

  return (
    <div className="cd-page">

      {/* HERO */}
      <div className="cd-hero" style={{background:`linear-gradient(135deg, ${cat.color}dd, ${cat.color}99)`}}>
        <div className="cd-hero-inner">
          <button className="cd-back" onClick={() => navigate("/cours")}>
            ← Retour aux cours
          </button>
          <div className="cd-hero-badge" style={{background:"rgba(255,255,255,.2)"}}>
            {cat.icon} {cat.label}
          </div>
          <h1 className="cd-hero-title">{cours.titre}</h1>
          {cours.description && <p className="cd-hero-desc">{cours.description}</p>}
          <div className="cd-hero-meta">
            <span className="cd-meta-pill" style={{background:niv.bg, color:niv.color}}>{niv.label}</span>
            {cours.duree_minutes && <span className="cd-meta-pill cd-meta-dur">⏱ {cours.duree_minutes} min</span>}
            {hasVideo && <span className="cd-meta-pill cd-meta-vid">▶ Vidéo incluse</span>}
            {hasPdf   && <span className="cd-meta-pill cd-meta-pdf">📄 PDF inclus</span>}
          </div>
        </div>
        <svg className="cd-hero-wave" viewBox="0 0 1440 55" preserveAspectRatio="none">
          <path d="M0,28 C360,56 1080,0 1440,32 L1440,55 L0,55 Z" fill="#f4f6fa"/>
        </svg>
      </div>

      <div className="cd-body">

        {/* ACTION BUTTONS */}
        <div className="cd-actions">
          {hasVideo && (
            <button className={`cd-btn-video ${videoOpen?"active":""}`} onClick={() => setVideoOpen(!videoOpen)}>
              {videoOpen ? "⏹ Fermer la vidéo" : "▶ Regarder la vidéo"}
            </button>
          )}
          {hasPdf && (
            <button className="cd-btn-pdf" onClick={() => downloadPdf(cours.pdf_url)}>
              📄 Télécharger le PDF
            </button>
          )}
        </div>

        {/* INLINE VIDEO */}
        {videoOpen && hasVideo && embedUrl && (
          <div className="cd-video-wrap">
            <div className="cd-video-header">
              <span>▶ {cours.titre}</span>
              <button onClick={() => setVideoOpen(false)}>✕ Fermer</button>
            </div>
            <iframe
              src={embedUrl}
              title={cours.titre}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="cd-iframe"
            />
          </div>
        )}

        {/* COVER IMAGE */}
        {cours.image && !videoOpen && (
          <div className="cd-cover">
            <img src={cours.image} alt={cours.titre} onError={e => e.target.style.display="none"}/>
          </div>
        )}

        {/* COURSE CONTENT */}
        {cours.contenu && (
          <div className="cd-content-wrap">
            <h2 className="cd-content-title">📝 Contenu du cours</h2>
            <div
              className="cd-content"
              dangerouslySetInnerHTML={{ __html: cours.contenu }}
            />
          </div>
        )}

        {/* NO CONTENT FALLBACK */}
        {!cours.contenu && !hasVideo && !hasPdf && (
          <div className="cd-no-content">
            <span>📚</span>
            <p>Le contenu de ce cours sera bientôt disponible.</p>
          </div>
        )}

        {/* PDF PREVIEW HINT */}
        {hasPdf && (
          <div className="cd-pdf-banner">
            <div className="cd-pdf-banner-icon">📄</div>
            <div>
              <h4>Support PDF disponible</h4>
              <p>Téléchargez le support de cours en PDF pour étudier à votre rythme.</p>
            </div>
            <button className="cd-btn-pdf" onClick={() => downloadPdf(cours.pdf_url)}>
              Télécharger
            </button>
          </div>
        )}

        {/* BACK */}
        <div className="cd-footer-nav">
          <button className="cd-back-btn" onClick={() => navigate("/cours")}>
            ← Retour à la liste des cours
          </button>
        </div>

      </div>
    </div>
  );
}
