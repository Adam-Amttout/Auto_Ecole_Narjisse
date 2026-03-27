import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCar,
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    navigate("/", { state: { sectionId: id } });
  };

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="py-5">

          {/* LOGO + DESCRIPTION */}
          <Col md={4} className="mb-4">
            <h4 className="footer-title">
              Auto École Narjisse
            </h4>

            <p>
              Apprenez à conduire en toute sécurité avec des moniteurs qualifiés
              et une formation adaptée à votre rythme.
            </p>

            <p className="footer-highlight">
              🚗 Votre réussite est notre priorité !
            </p>

            <p><FaCar /> Permis B | Moto | Conduite accompagnée</p>
          </Col>

          {/* NAVIGATION */}
          <Col md={3} className="mb-4">
            <h5 className="footer-title">Navigation</h5>

            <ul className="footer-links">
              <li onClick={() => scrollToSection("home")}>Accueil</li>
              <li onClick={() => scrollToSection("about")}>À propos</li>
              <li onClick={() => scrollToSection("services")}>Services</li>
              <li onClick={() => scrollToSection("faq")}>FAQ</li>
              <li onClick={() => scrollToSection("contact")}>Contact</li>
            </ul>
          </Col>

          {/* CONTACT */}
          <Col md={5} className="mb-4">
            <h5 className="footer-title">Contact & Infos</h5>

            <p><FaMapMarkerAlt /> Allal Elfassi, Marrakech, Maroc</p>
            <p><FaPhoneAlt /> +212 524303811</p>
            <p><FaEnvelope /> info@autoecole.com</p>

            <p>
              <FaClock /> Lun - Ven: 08h - 19h <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sam: 09h - 13h
            </p>

            {/* SOCIAL */}
            <div className="social-icons-vertical mt-3">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <FaFacebookF /> Facebook
              </a>

              <a href="https://wa.me/212698837698" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </Col>

        </Row>

        <hr />

        <div className="text-center copy">
          © {new Date().getFullYear()} Smit'ha Auto École Narjisse — Tous droits réservés
        </div>

      </Container>
    </footer>
  );
}

export default Footer;