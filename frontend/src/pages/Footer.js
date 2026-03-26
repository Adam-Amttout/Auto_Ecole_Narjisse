import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="py-5">

          {/* Logo + description */}
          <Col md={4} className="mb-4">
            <h4>Auto École Marrakech</h4>
            <p>
              Votre partenaire pour une formation de qualité en conduite et sécurité routière.
            </p>
          </Col>

          {/* Liens rapides */}
          <Col md={2} className="mb-4">
            <h5>Liens rapides</h5>
            <ul className="footer-links">
              <li><span onClick={() => scrollToSection("home")}>Accueil</span></li>
              <li><span onClick={() => scrollToSection("about")}>À propos</span></li>
              <li><span onClick={() => scrollToSection("contact")}>Contact</span></li>
            </ul>
          </Col>

          {/* Contact + localisation */}
          <Col md={3} className="mb-4">
            <h5>Contact & Localisation</h5>

            <p><FaEnvelope /> 
              <a href="mailto:info@autoecolemarrakech.com"> info@autoecolemarrakech.com</a>
            </p>

            <p><FaPhone /> 
              <a href="tel:+212524303811"> +212 524303811</a>
            </p>

            <p>
              Adresse : Allal Elfassi, IMM ALHOUBOUSS PORTE 5 APP 3, Marrakech
            </p>

            <div className="map-container mt-2">
              <iframe
                title="Localisation Auto École Marrakech"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.123456789!2d-7.983456!3d31.629345!2m3!1f0!2f0!3f0"
                width="100%"
                height="150"
                style={{ border: 0, borderRadius: "8px" }}
                loading="lazy"
              ></iframe>
            </div>
          </Col>

          {/* Social */}
          <Col md={3} className="mb-4">
            <h5>Suivez-nous</h5>
            <div className="social-icons d-flex gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            </div>
          </Col>

        </Row>

        <hr />

        <Row>
          <Col className="text-center py-3">
            © {new Date().getFullYear()} Tous droits réservés à Auto École Marrakech
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;