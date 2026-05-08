import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/connexion");
  };

  const scrollToSection = (id) => {
    setExpanded(false);

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
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

  useEffect(() => {
    const sections = ["home", "about", "services", "gallery", "formation", "faq"];

    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const el = document.getElementById(id);

        if (el) {
          const rect = el.getBoundingClientRect();

          if (rect.top <= 120 && rect.bottom >= 120) {
            current = id;
          }
        }
      });

      const scrollBottom = window.innerHeight + window.scrollY;
      const pageHeight = document.body.scrollHeight;

      if (scrollBottom >= pageHeight - 50) {
        current = "contact";
      }

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
    <BSNavbar expand="lg" expanded={expanded} className="custom-navbar">

      <Container>

        {/* LOGO */}
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

        {/* TOGGLE */}
        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <BSNavbar.Collapse id="basic-navbar-nav">

          {/* LINKS */}
          <Nav className="align-items-lg-center">

            <Nav.Link
              onClick={() => scrollToSection("home")}
              className={activeSection === "home" ? "nav-link active" : "nav-link"}
            >
              Accueil
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollToSection("about")}
              className={activeSection === "about" ? "nav-link active" : "nav-link"}
            >
              À propos
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollToSection("services")}
              className={activeSection === "services" ? "nav-link active" : "nav-link"}
            >
              Services
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollToSection("gallery")}
              className={activeSection === "gallery" ? "nav-link active" : "nav-link"}
            >
              Galerie
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollToSection("formation")}
              className={activeSection === "formation" ? "nav-link active" : "nav-link"}
            >
              Formation
            </Nav.Link>

            {/* COURS */}
            <Nav.Link
              onClick={() => {
                if (!user) {
                  navigate("/connexion");
                } else {
                  navigate("/cours");
                }
                setExpanded(false);
              }}
              className={location.pathname === "/cours" ? "nav-link active" : "nav-link"}
            >
              Cours
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollToSection("faq")}
              className={activeSection === "faq" ? "nav-link active" : "nav-link"}
            >
              FAQ
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollToSection("contact")}
              className={activeSection === "contact" ? "nav-link active" : "nav-link"}
            >
              Contact
            </Nav.Link>

            {/* 🔥 DASHBOARD (admin only) */}
            {user && role === "admin" && (
              <Nav.Link
                onClick={() => {
                  navigate("/dashboard");
                  setExpanded(false);
                }}
                className={location.pathname === "/dashboard" ? "nav-link active" : "nav-link"}
              >
                Dashboard
              </Nav.Link>
            )}

          </Nav>

          {/* BUTTONS */}
          <div className="nav-buttons">

            <Button
              as={Link}
              to="/reservation"
              className="btn-register"
              onClick={() => setExpanded(false)}
            >
              Inscription
            </Button>

            {!user && (
              <Button
                as={Link}
                to="/connexion"
                className="btn-login"
                onClick={() => setExpanded(false)}
              >
                Connexion
              </Button>
            )}

            {user && (
              <Button
                onClick={logout}
                className="btn-login"
              >
                Logout
              </Button>
            )}

          </div>

        </BSNavbar.Collapse>

      </Container>

    </BSNavbar>
  );
}

export default Navbar;