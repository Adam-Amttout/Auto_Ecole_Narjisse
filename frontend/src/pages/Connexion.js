import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // pour redirection vers inscription
import "./Connexion.css";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Comptes existants simulés
  const users = [
    { email: "adam@mail.com", password: "123456" },
    { email: "test@mail.com", password: "abcdef" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      alert("Connexion réussie !");
      localStorage.setItem("isLogged", "true"); // simuler session
    } else {
      alert("Email ou mot de passe incorrect ! Si vous n’avez pas de compte, créez-en un.");
    }
  };

  return (
    <Container className="connexion-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Connexion</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Boutons centrés */}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button variant="warning" type="submit">
                Se connecter
              </Button>
              <Button
                variant="warning"
                onClick={() => navigate("/creer_compte")}
              >
                Créer un compte
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Connexion;