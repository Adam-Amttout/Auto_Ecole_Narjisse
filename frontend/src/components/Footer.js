import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="custom-footer">
      <Container>
        <Row className="py-4">

          {/* Section logo + description */}
          <Col xs={12} md={4} className="mb-3">
            <h4>Auto École Narjiss</h4>
            <p>Maîtrisez la route avec confiance grâce à nos instructeurs expérimentés et nos programmes adaptés à tous les niveaux.</p>
            <p><strong>Slogan :</strong> “Votre sécurité, notre priorité !”</p>
            <p><strong>Horaires :</strong> Lun-Ven 9h-18h | Sam 10h-14h</p>
            
            <p className="mt-3">Formations disponibles : Permis B, Permis Moto, Code en ligne, Conduite accompagnée.</p>
          </Col>

          {/* Liens rapides */}
          <Col xs={6} md={2} className="mb-3">
            <h5>Liens rapides</h5>
            <ul className="footer-links">
              <li><a href="/">Accueil</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/cours">Cours</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/reservation">Inscription en ligne</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={6} md={3} className="mb-3">
            <h5>Contact</h5>
            <p>Email : <a href="mailto:contact@autoecolenarjiss.com">contact@autoecolenarjiss.com</a></p>
            <p>Téléphone : <a href="tel:+212698837698">+212 698-837698</a></p>
            <p>Adresse : Casablanca, Maroc</p>
            <p className="mt-2">Pour toute information ou réservation, n’hésitez pas à nous contacter par téléphone ou via WhatsApp.</p>
          </Col>

          {/* Réseaux sociaux */}
          <Col xs={12} md={3} className="mb-3">
            <h5>Suivez-nous</h5>
            <div className="social-icons d-flex flex-column align-items-start">
              <a href="https://www.facebook.com/adam.amttout" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="mb-2">
                <FaFacebookF /> Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="mb-2">
                <FaTwitter /> Twitter
              </a>
              <a href="https://www.instagram.com/adam_amttout?igsh=MWNmeWw4dGF0YWd1aA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="mb-2">
                <FaInstagram /> Instagram
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="mb-2">
                <FaLinkedinIn /> LinkedIn
              </a>
              <a href="https://wa.me/212698837698" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="mb-2">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </Col>

        </Row>

        <Row>
          <Col className="text-center py-3">
            &copy; {new Date().getFullYear()} Auto Ecole Narjisse. Tous droits réservés.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;