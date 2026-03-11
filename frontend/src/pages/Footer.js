import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour scroller vers une section
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
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
        <Row className="py-4">

          {/* Section logo + description */}
          <Col xs={12} md={4} className="mb-3">
            <h4>Auto École Marrakech</h4>
            <p>Apprenez à conduire en toute sécurité avec nos instructeurs qualifiés et nos programmes personnalisés pour tous les niveaux.</p>
            <p><strong>Slogan :</strong> “Votre confiance sur la route, notre mission !”</p>
            <p><strong>Horaires :</strong> Lun-Ven 8h-19h | Sam 9h-13h</p>
            <p className="mt-3">Formations : Permis B, Permis Moto, Conduite accompagnée, Code en ligne.</p>
          </Col>

          {/* Liens rapides */}
          <Col xs={6} md={2} className="mb-3">
            <h5>Liens rapides</h5>
            <ul className="footer-links">
              <li><span onClick={() => scrollToSection("home")}>Accueil</span></li>
              <li><span onClick={() => scrollToSection("about")}>À propos</span></li>
              <li><span onClick={() => scrollToSection("cours")}>Cours</span></li>
              <li><span onClick={() => scrollToSection("contact")}>Contact</span></li>
              <li onClick={() => navigate("/reservation")}><span>Inscription en ligne</span></li>
              <li><span onClick={() => scrollToSection("faq")}>FAQ</span></li>
            </ul>
          </Col>

          {/* Contact + localisation */}
          <Col xs={6} md={3} className="mb-3">
            <h5>Contact & Localisation</h5>
            <p>Email : <a href="mailto:info@autoecolemarrakech.com">info@autoecolemarrakech.com</a></p>
            <p>Téléphone : <a href="tel:+212600123456">+212 524303811</a></p>
            <p>Adresse : Allal Elfassi,IMM ALHOUBOUSS PORTE 5 APPARTEMENT 3 Marrakech, Maroc</p>
            <p className="mt-2">Vous pouvez nous visiter directement ou nous contacter via téléphone ou WhatsApp.</p>
            <div className="map-container mt-2">
              <iframe
                title="Localisation Auto École Marrakech"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.123456789!2d-7.983456!3d31.629345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdaef2f123456789%3A0xabcdef123456789!2sAllal%20Elfassi%2C%20Marrakech%2C%20Maroc!5e0!3m2!1sfr!2sma!4v1671234567890!5m2!1sfr!2sma"
                width="100%"
                height="150"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </Col>

          {/* Réseaux sociaux */}
          <Col xs={12} md={3} className="mb-3">
            <h5>Suivez-nous</h5>
            <div className="social-icons d-flex flex-column align-items-start">
              <a href="https://www.facebook.com/adam.amttout" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="mb-2"><FaFacebookF /> Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="mb-2"><FaTwitter /> Twitter</a>
              <a href="https://www.instagram.com/adam_amttout" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="mb-2"><FaInstagram /> Instagram</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="mb-2"><FaLinkedinIn /> LinkedIn</a>
              <a href="https://wa.me/212600123456" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="mb-2"><FaWhatsapp /> WhatsApp</a>
            </div>
          </Col>

        </Row>

        <Row>
          <Col className="text-center py-3">
            &copy; {new Date().getFullYear()} Auto École Marrakech. Tous droits réservés.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;