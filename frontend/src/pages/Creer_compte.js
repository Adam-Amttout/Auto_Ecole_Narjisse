import React, { useState } from "react";
import { Container, Form, Button, Row, Col, InputGroup } from "react-bootstrap";

function CreerCompte() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    cin: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  // Met à jour l'état pour chaque champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification côté client du mot de passe
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          cin: formData.cin,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Compte créé avec succès !");
        // Réinitialiser le formulaire
        setFormData({ nom: "", prenom: "", email: "", cin: "", password: "", confirmPassword: "" });
      } else {
        // Afficher les erreurs venant du backend
        let errors = "";
        if (data.errors) {
          errors = Object.values(data.errors).flat().join("\n");
        } else {
          errors = data.message || "Erreur lors de l'enregistrement.";
        }
        alert(errors);
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur serveur ou connexion au backend impossible.");
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Créer un compte</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>CIN</Form.Label>
          <Form.Control
            type="text"
            name="cin"
            value={formData.cin}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? "Cacher" : "Afficher"}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirmer mot de passe</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" variant="warning">
          Créer votre compte
        </Button>
      </Form>
    </Container>
  );
}

export default CreerCompte;