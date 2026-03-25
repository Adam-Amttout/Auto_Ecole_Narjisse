import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./Home.css";

import About from "../pages/About";
import Services from "../pages/Services";
import Faq from "../pages/Faq";
import Footer from "../pages/Footer";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="home">

      {/* HERO */}
      <section id="home" className="hero">

        {/* 🎥 VIDEO */}
        <video
          className="hero-video"
          src="/video/hero/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 🌑 OVERLAY */}
        <div className="overlay"></div>

        {/* 📝 CONTENT */}
        <Container className="hero-content text-center text-white">
          <h1>Obtenez votre permis en toute confiance </h1>

          <p>
            Formation rapide • Moniteurs experts • Résultat garanti
          </p>

          <Button href="/reservation" className="hero-btn">
            Commencer maintenant
          </Button>
        </Container>

      </section>

      {/* Sections */}
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <section id="faq"><Faq /></section>
      <section id="contact"><Footer /></section>

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