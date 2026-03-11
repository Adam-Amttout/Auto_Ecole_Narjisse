
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useState } from "react";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Fonction pour scroller vers une section
  const scrollToSection = (id) => {

    // ferme le menu mobile
    setExpanded(false);

    if (location.pathname !== "/") {
      // Si on n'est pas sur Home, naviguer vers Home d'abord
      navigate("/", { replace: false });

      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);

    } else {

      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });

    }
  };

  return (
    <BSNavbar
      expand="md"
      expanded={expanded}
      className="custom-navbar"
      sticky="top"
    >

      <Container>

        {/* Logo */}
        <BSNavbar.Brand
          as={Link}
          to="/"
          onClick={() => setExpanded(false)}
        >
          <img
            src="/Logo.png"
            alt="Auto Ecole Narjisse"
            className="navbar-logo"
          />
        </BSNavbar.Brand>

        {/* Icon menu mobile */}
        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        />

        <BSNavbar.Collapse id="basic-navbar-nav">

          <Nav className="ms-auto align-items-lg-center">

            {/* Sections scrollables */}
            <Nav.Link onClick={() => scrollToSection("home")}>
              Accueil
            </Nav.Link>

            <Nav.Link onClick={() => scrollToSection("about")}>
              À propos
            </Nav.Link>

            <Nav.Link onClick={() => scrollToSection("services")}>
              Services
            </Nav.Link>

             <Nav.Link
              as={Link}
              to="/dashboard"
              onClick={() => setExpanded(false)}
            >
            Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/reservation"
              onClick={() => setExpanded(false)}
            >
              Inscription
            </Nav.Link>
             <Nav.Link
              as={Link}
              to="/cours"
              onClick={() => setExpanded(false)}
            >
              Cours
            </Nav.Link>

           

            <Nav.Link onClick={() => scrollToSection("faq")}>
              FAQ
            </Nav.Link>
            <Nav.Link onClick={() => scrollToSection("contact")}>
              Contact
            </Nav.Link>

            {/* Bouton Connexion */}
            <div className="btn-login">
              <Button
                as={Link}
                to="/connexion"
                className="btn-login w-100 w-lg-auto mt-3 mt-lg-0"
                onClick={() => setExpanded(false)}
              >
                Connexion
              </Button>
            </div>

          </Nav>

        </BSNavbar.Collapse>

      </Container>

    </BSNavbar>
  );
}

export default Navbar;
