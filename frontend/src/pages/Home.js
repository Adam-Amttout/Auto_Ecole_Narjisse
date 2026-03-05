import React from "react";
import { Container, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import "./Home.css";
import bgHome from "../assets/images/Home/bg_home.png";

function Home() {
  return (
    <div className="home">
      <section
        className="hero"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="overlay"></div>

        <Container className="hero-content text-center text-white">
          <h1>Bienvenue chez Auto École Narjisse</h1>
          <p>
            Maîtrisez le code et la conduite pour obtenir votre permis
            rapidement et en toute confiance.
          </p>
          <Button href="/reservation" variant="warning" size="lg">
            Réserver maintenant
          </Button>
        </Container>
      </section>
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