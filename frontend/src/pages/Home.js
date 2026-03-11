



import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./Home.css";
import bgHome from "../assets/images/Home/bg_home.png";

import About from "../pages/About";
import Services from "../pages/Services";
// import Offers from "../pages/Offers";
// import Cours from "../pages/Cours";
// import Test from "../pages/Test";
import Faq from "../pages/Faq";
import Footer from "../pages/Footer";


function Home() {
  const location = useLocation();

  // Scroll automatique si URL contient un hash (#about, #faq, etc.)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="home">

      {/* HERO */}
      <section id="home" className="hero" style={{ backgroundImage: `url(${bgHome})` }}>
        <div className="overlay"></div>
        <Container className="hero-content text-center text-white">
          <h1>Bienvenue chez Auto École Narjisse</h1>
          <p>Maîtrisez le code et la conduite pour obtenir votre permis rapidement et en toutg confiance.</p>
          <Button href="/reservation" variant="warning" size="lg">
           Inscrire maintenant
          </Button>
        </Container>
      </section>

      {/* Sections */}
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      {/* <section id="offers"><Offers /></section> */}
      {/* <section id="cours"><Cours /></section>
      <section id="test"><Test /></section> */}
      <section id="faq"><Faq /></section>
      <section id="contact"><Footer /></section>
      

      {/* WhatsApp floating */}
      <a
        href="https://wa.me/212698837698"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>

    </div>
  );
}

export default Home;