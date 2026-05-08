import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // 🔥 scroll vers section (محسّن)
  const scrollToSection = (id) => {

    setExpanded(false);

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80; // height navbar
          const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);

    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // 🔥 detect section active
  useEffect(() => {
    const sections = ["home", "about", "services", "gallery", "faq", "contact"];

    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 120;
          if (window.scrollY >= top) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const handleScrollNavbar = () => {
    const navbar = document.querySelector(".custom-navbar");

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScrollNavbar);

  return () => window.removeEventListener("scroll", handleScrollNavbar);
}, []);

  return (
    <BSNavbar
      expand="md"
      expanded={expanded}
      className="custom-navbar"
    >

      <Container>

        {/* Logo */}
          <BSNavbar.Brand
              as={Link}
              to="/"
              onClick={() => setExpanded(false)}
              className="brand-container"
            >
              <img
                src="/logo.png"
                alt="Auto École Narjiss"
                className="navbar-logo"
              />

              <div className="brand-texts">
                <span className="brand-title">Auto École</span>
                <span className="brand-name">Narjiss</span>
              </div>
            </BSNavbar.Brand>

        {/* Mobile toggle */}
        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <BSNavbar.Collapse id="basic-navbar-nav">

          <Nav className="ms-auto align-items-lg-center">

            {/* Accueil */}
            <Nav.Link
              onClick={() => scrollToSection("home")}
              className={activeSection === "home" ? "nav-link active" : "nav-link"}
            >
              Accueil
            </Nav.Link>

            {/* À propos FIX */}
            <Nav.Link
              onClick={() => scrollToSection("about")}
              className={activeSection === "about" ? "nav-link active" : "nav-link"}
            >
              <span className="no-break">À&nbsp;propos</span>
            </Nav.Link>

            {/* Services */}
            <Nav.Link
              onClick={() => scrollToSection("services")}
              className={activeSection === "services" ? "nav-link active" : "nav-link"}
            >
              Services
            </Nav.Link>
            {/* Gallery */}
            <Nav.Link
            onClick={() => scrollToSection("gallery")}
            className={activeSection === "gallery" ? "nav-link active" : "nav-link"}>
            Galerie
          </Nav.Link>

            {/* Cours */}
            <Nav.Link
              as={Link}
              to="/cours"
              className={location.pathname === "/cours" ? "nav-link active" : "nav-link"}
              onClick={() => setExpanded(false)}
            >
              Cours
            </Nav.Link>

            {/* FAQ */}
            <Nav.Link
              onClick={() => scrollToSection("faq")}
              className={activeSection === "faq" ? "nav-link active" : "nav-link"}
            >
              FAQ
            </Nav.Link>

            {/* Contact */}
            <Nav.Link
              onClick={() => scrollToSection("contact")}
              className={activeSection === "contact" ? "nav-link active" : "nav-link"}
            >
              Contact
            </Nav.Link>

            {/* 🔥 Inscription */}
            <Button
              as={Link}
              to="/reservation"
              className="btn-register ms-lg-3 mt-3 mt-lg-0"
              onClick={() => setExpanded(false)}
            >
              Inscription 
            </Button>

            {/* Connexion */}
            <Button
              as={Link}
              to="/connexion"
              className="btn-login ms-2 mt-3 mt-lg-0"
              onClick={() => setExpanded(false)}
            >
              Connexion
            </Button>

          </Nav>

        </BSNavbar.Collapse>

      </Container>

    </BSNavbar>
  );
}

export default Navbar;