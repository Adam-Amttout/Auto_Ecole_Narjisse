import { Link } from "react-router-dom";
import "./Navbar.css";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";

function Navbar() {

  

  return (
    <BSNavbar expand="lg" className="custom-navbar" sticky="top">
      <Container>

        {/* Logo */}
        <BSNavbar.Brand as={Link} to="/">
          <img
            src="/Logo.png"
            alt="Auto Ecole Narjisse"
            className="navbar-logo"
          />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">

            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/about">À propos</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/offers">Offres</Nav.Link>
            <Nav.Link as={Link} to="/cours">Cours</Nav.Link>
            <Nav.Link as={Link} to="/test">Test</Nav.Link>
            <Nav.Link as={Link} to="/reservation">Reservation</Nav.Link>
            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

            {/* Bouton Connexion */}
            <div className="btn-login">
              <Button
                as={Link}
                to="/connexion"
                className="btn-login w-100 w-lg-auto mt-3 mt-lg-0"
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