import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Contact.css";

const API = "http://127.0.0.1:8000/api";

const INFOS = [
  { icon:"📍", title:"Adresse",  lines:["Allal Elfassi, Marrakech", "Maroc"] },
  { icon:"📞", title:"Téléphone", lines:["+212 524 303 811","+212 698 837 698"] },
  { icon:"✉️", title:"Email",    lines:["contact@autoecole-narjiss.ma"] },
  { icon:"🕐", title:"Horaires", lines:["Lun – Ven : 08h – 19h","Sam : 09h – 13h","Dim : Fermé"] },
];

export default function Contact() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    nom: user?.nom || "", prenom: user?.prenom || "",
    email: user?.email || "", telephone: "",
    sujet: "", message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  /* ── Lazy-load Google Maps iframe ── */
  const mapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowMap(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires."); return;
    }
    if (!form.email.includes("@")) { setError("Email invalide."); return; }

    setLoading(true); setError("");
    try {
      await axios.post(`${API}/contact`, { ...form, email: user?.email || form.email });
      setSuccess(true);
      setForm(f => ({ ...f, telephone:"", sujet:"", message:"" }));
      setTimeout(() => setSuccess(false), 5000);
    } catch(e) {
      setError(e.response?.data?.message || "Erreur lors de l'envoi. Réessayez.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ct-page">

      {/* HERO */}
      <div className="ct-hero">
        <div className="ct-hero-inner">
          <span className="ct-hero-badge">Auto École Narjiss</span>
          <h1 className="ct-hero-title">Contactez-nous</h1>
          <p className="ct-hero-sub">Nous sommes là pour répondre à toutes vos questions sur nos formations</p>
        </div>
        <svg className="ct-hero-wave" viewBox="0 0 1440 55" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,35 L1440,55 L0,55 Z" fill="#f4f6fa"/>
        </svg>
      </div>

      <div className="ct-body">
        <div className="ct-grid">

          {/* ── INFOS + CARTE ── */}
          <div className="ct-left">

            {/* Infos */}
            <div className="ct-info-card">
              <h3 className="ct-section-title">Nos informations</h3>
              <div className="ct-infos">
                {INFOS.map((info, i) => (
                  <div key={i} className="ct-info-row">
                    <div className="ct-info-icon">{info.icon}</div>
                    <div>
                      <div className="ct-info-title">{info.title}</div>
                      {info.lines.map((l, j) => <div key={j} className="ct-info-line">{l}</div>)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Réseaux sociaux */}
              <div className="ct-social">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="ct-social-btn fb">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  Facebook
                </a>
                <a href="https://wa.me/212698837698" target="_blank" rel="noreferrer" className="ct-social-btn wa">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  WhatsApp
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="ct-social-btn ig">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>

            {/* CARTE GOOGLE MAPS */}
            <div className="ct-map-card" ref={mapRef}>
              <h3 className="ct-section-title">Notre localisation</h3>
              <div className="ct-map-wrap">
                {showMap ? (
                  <iframe
                    title="Auto École Narjiss - Marrakech"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.7987349!2d-7.9811!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM3JzQ2LjIiTiA3wrA1OCc1Mi4wIlc!5e0!3m2!1sfr!2sma!4v1234567890"
                    width="100%" height="220"
                    style={{ border:0, borderRadius:12 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div style={{ width: "100%", height: 220, borderRadius: 12, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                    📍 Chargement de la carte…
                  </div>
                )}
              </div>
              <a
                href="https://maps.google.com/?q=Marrakech,Maroc"
                target="_blank" rel="noreferrer"
                className="ct-map-link">
                📍 Ouvrir dans Google Maps →
              </a>
            </div>
          </div>

          {/* ── FORMULAIRE ── */}
          <div className="ct-right">
            <div className="ct-form-card">
              <h3 className="ct-section-title">Envoyez-nous un message</h3>
              <p className="ct-form-sub">Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.</p>

              {success && (
                <div className="ct-alert ok">
                  ✅ Message envoyé avec succès ! Nous vous contacterons bientôt.
                </div>
              )}
              {error && <div className="ct-alert err">⚠ {error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <div className="ct-fg">
                    <label>Prénom *</label>
                    <input className="ct-fi" type="text" value={form.prenom}
                      onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Votre prénom"/>
                  </div>
                  <div className="ct-fg">
                    <label>Nom *</label>
                    <input className="ct-fi" type="text" value={form.nom}
                      onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Votre nom"/>
                  </div>
                </div>

                <div className="ct-form-row">
                  <div className="ct-fg">
                    <label>Email *</label>
                    <input className="ct-fi" type="email" value={form.email}
                      onChange={e=>setForm({...form,email:e.target.value})} placeholder="votre@email.com"/>
                  </div>
                  <div className="ct-fg">
                    <label>Téléphone</label>
                    <input className="ct-fi" type="tel" value={form.telephone}
                      onChange={e=>setForm({...form,telephone:e.target.value})} placeholder="+212 6XX XXX XXX"/>
                  </div>
                </div>

                <div className="ct-fg">
                  <label>Sujet</label>
                  <select className="ct-fi" value={form.sujet}
                    onChange={e=>setForm({...form,sujet:e.target.value})}>
                    <option value="">-- Sélectionnez un sujet --</option>
                    <option>Inscription</option>
                    <option>Information sur les formations</option>
                    <option>Tarifs</option>
                    <option>Cours de code</option>
                    <option>Cours de conduite</option>
                    <option>Planification de séance</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="ct-fg">
                  <label>Message *</label>
                  <textarea className="ct-fi" rows={5} value={form.message}
                    onChange={e=>setForm({...form,message:e.target.value})}
                    placeholder="Décrivez votre demande en détail..."/>
                </div>

                <button type="submit" className="ct-btn-send" disabled={loading}>
                  {loading ? (
                    <><span className="ct-spinner"/>Envoi en cours...</>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="17" height="17">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* HORAIRES DÉTAILLÉS */}
        <div className="ct-hours-band">
          <div className="ct-hours-grid">
            {[
              { j:"Lundi",    h:"08h00 – 19h00", open:true  },
              { j:"Mardi",    h:"08h00 – 19h00", open:true  },
              { j:"Mercredi", h:"08h00 – 19h00", open:true  },
              { j:"Jeudi",    h:"08h00 – 19h00", open:true  },
              { j:"Vendredi", h:"08h00 – 19h00", open:true  },
              { j:"Samedi",   h:"09h00 – 13h00", open:true  },
              { j:"Dimanche", h:"Fermé",          open:false },
            ].map((d,i) => (
              <div key={i} className={`ct-hours-row ${d.open?"open":"closed"}`}>
                <span className="ct-hours-jour">{d.j}</span>
                <span className="ct-hours-h">{d.h}</span>
                <span className={`ct-hours-dot ${d.open?"":"off"}`}/>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}