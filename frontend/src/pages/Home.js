import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

import About    from "../pages/About";
import Services from "../pages/Services";
import Gallery  from "./Gallery";
import Faq      from "../pages/Faq";
import Formation from "../pages/formation";
import Contact   from "../pages/Contact";  // ← NOUVEAU

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.sectionId) {
      const el = document.getElementById(location.state.sectionId);
      if (el) {
        setTimeout(() => {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 64, behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="home">

      {/* HERO */}
      <section id="home" className="hero">
        <video className="hero-video" src="/video/hero/Hero.mp4" autoPlay loop muted playsInline preload="none"/>
        <div className="overlay"/>
        <Container className="hero-content text-center text-white">
          <div className="hero-badge">Auto École Narjiss — Marrakech</div>
          <h1>Votre Permis <span className="hero-accent">En Toute Confiance</span></h1>
          <p>Formation professionnelle, accompagnement personnalisé et taux de réussite exceptionnel de 98%</p>
          <div className="hero-btns">
            <Button href="/reservation" className="hero-btn-primary">
              S'inscrire maintenant
            </Button>
            <button className="hero-btn-secondary" onClick={() => navigate("/cours")}>
              Explorer les cours
            </button>
          </div>

          {/* Compteurs */}
          <div className="hero-stats">
            {[
              { val:"95%",  label:"Taux de réussite" },
              { val:"500+", label:"Élèves formés" },
              { val:"10+",  label:"Années d'expérience" },
              { val:"8",    label:"Moniteurs qualifiés" },
            ].map((s,i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-val">{s.val}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
        <div className="hero-scroll-hint">
          <div className="hero-scroll-dot"/>
        </div>
      </section>

      {/* Sections */}
      <section id="about"><About/></section>
      <section id="services"><Services/></section>
      <section id="gallery"><Gallery/></section>
      {/* <section id="formation"><Formation/></section> */}
      <section id="faq"><Faq/></section>

      {/* CONTACT COMPLET */}
      <section id="contact"><Contact/></section>

      {/* WhatsApp flotant */}
      <a href="https://wa.me/212698837698" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp className="whatsapp-icon"/>
        <span className="whatsapp-text">Discutez avec nous</span>
      </a>
    </div>
  );
}

export default Home;