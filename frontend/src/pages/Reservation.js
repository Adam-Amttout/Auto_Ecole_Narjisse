import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Reservation.css";

function Reservation() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    cin: "",
    telephone: "",
    dateNaissance: "",
    sexe: "",
    typePermis: "",
    langues: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let newLangues = [...formData.langues];
      if (checked) {
        newLangues.push(value);
      } else {
        newLangues = newLangues.filter((lang) => lang !== value);
      }
      setFormData({ ...formData, langues: newLangues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises:", formData);
    alert("Inscription réussie !");
  };

  return (
    <Container className="inscription-container my-5">
      <h2 className="text-center mb-4">Formulaire de réservation </h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>CIN</Form.Label>
              <Form.Control
                type="text"
                name="cin"
                placeholder="Votre CIN"
                value={formData.cin}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="tel"
                name="telephone"
                placeholder="+212 6XX-XXXXXX"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Sexe</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Homme"
                  name="sexe"
                  type="radio"
                  value="Homme"
                  onChange={handleChange}
                  required
                />
                <Form.Check
                  inline
                  label="Femme"
                  name="sexe"
                  type="radio"
                  value="Femme"
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Type de permis</Form.Label>
              <Form.Select
                name="typePermis"
                value={formData.typePermis}
                onChange={handleChange}
                required
              >
                <option value="">Choisir un type</option>
                <option value="Voiture">Voiture</option>
                <option value="Moto">Moto</option>
                <option value="Bus">Bus</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Langues </Form.Label>
          <div>
            <Form.Check
              inline
              type="checkbox"
              label="Français"
              value="Français"
              name="langues"
              onChange={handleChange}
            />
            <Form.Check
              inline
              type="checkbox"
              label="Arabe"
              value="Arabe"
              name="langues"
              onChange={handleChange}
            />
            <Form.Check
              inline
              type="checkbox"
              label="Anglais"
              value="Anglais"
              name="langues"
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        <Button variant="warning" type="submit" className="mt-3 w-100">
          Réserver
        </Button>
      </Form>
    </Container>
  );
}

export default Reservation;