import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./Home.css";

import About from "../pages/About";
import Services from "../pages/Services";
import Gallery from "./Gallery";
import Faq from "../pages/Faq";

function Home() {
  const location = useLocation();

  // 🔥 scroll من Navbar / Footer
  useEffect(() => {
    if (location.state?.sectionId) {
      const el = document.getElementById(location.state.sectionId);

      if (el) {
        const offset = 80;

        setTimeout(() => {
          const y =
            el.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="home">

      {/* HERO */}
      <section id="home" className="hero">
        <video
          className="hero-video"
          src="/video/hero/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="overlay"></div>

        <Container className="hero-content text-center text-white">
          <h1>Obtenez votre permis en toute confiance</h1>
          <p>Formation rapide • Moniteurs experts • Résultat garanti</p>

          <Button href="/reservation" className="hero-btn">
            Commencer maintenant
          </Button>
        </Container>
      </section>

      {/* Sections */}
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <section id="gallery"><Gallery /></section>
      <section id="faq"><Faq /></section>

      {/* 🔥 contact section (ماشي footer) */}
      <section id="contact" style={{ padding: "100px 0", textAlign: "center" }}>
        
      </section>

      {/* WhatsApp */}
      <a
        href="https://wa.me/212698837698"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="whatsapp-icon" />
        <span className="whatsapp-text">Discutez avec nous</span>
      </a>

    </div>
  );
}

export default Home;