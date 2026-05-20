import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

export default function Footer({ className = "" }) {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { sectionId: id } });
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 64, behavior: "smooth" });
    }
  };

  return (
    <footer className={`ft ${className}`.trim()}>
      <div className="ft-inner">

        {/* Logo + slogan */}
        <div className="ft-brand">
          <img src="/logo.png" alt="Narjiss" className="ft-logo" />
          <div>
            <div className="ft-brand-name">Auto École Narjiss</div>
            <div className="ft-brand-tag">Votre réussite est notre priorité 🚗</div>
          </div>
        </div>

        {/* Contact rapide */}
        <div className="ft-contact">
          <a href="tel:+212524303811" className="ft-contact-item">
            <FaPhoneAlt /> +212 524 303 811
          </a>
          <a href="mailto:contact@autoecole-narjiss.ma" className="ft-contact-item">
            <FaEnvelope /> contact@autoecole-narjiss.ma
          </a>
          <span className="ft-contact-item">
            <FaMapMarkerAlt /> Allal Elfassi, Marrakech
          </span>
        </div>

        {/* Navigation rapide */}
        <div className="ft-nav">
          {[
            { label:"Accueil",    id:"home"      },
            { label:"Services",   id:"services"  },
            { label:"Formation",  id:"formation" },
            { label:"Contact",    id:"contact"   },
          ].map(l => (
            <button key={l.id} className="ft-nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
          ))}
        </div>

        {/* Réseaux sociaux */}
        <div className="ft-social">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="ft-social-btn">
            <FaFacebookF />
          </a>
          <a href="https://wa.me/212698837698" target="_blank" rel="noreferrer" className="ft-social-btn wa">
            <FaWhatsapp />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="ft-social-btn ig">
            <FaInstagram />
          </a>
        </div>
      </div>

      <div className="ft-copy">
        © {new Date().getFullYear()} Auto École Narjiss — Marrakech, Maroc · Tous droits réservés
      </div>
    </footer>
  );
}