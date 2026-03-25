import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import axios from "axios";
import "./Reservation.css";

function Reservation() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.message) {
      return "Veuillez remplir tous les champs obligatoires.";
    }
    if (!formData.email.includes("@")) {
      return "Email invalide.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:8000/api/contact", formData)

      setSuccess(true);

      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        sujet: "",
        message: ""
      });

      setTimeout(() => setSuccess(false), 4000);

    }
    catch (err) {
  console.log("ERROR FULL:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);
  console.log("STATUS:", err.response?.status);
  setError("Erreur lors de l'envoi ❌");
}

finally {
      setLoading(false);
    }
  };

  return (
    <Container className="contact-container">
      <Row className="g-4">

        {/* LEFT */}
        <Col md={7} className="fade-up">
          <div className="contact-form">

            <h2>Envoyez-nous un message</h2>
            <p>Nous vous répondrons dans les 24 heures.</p>

            {success && <Alert variant="success">✅ Message envoyé avec succès !</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>

              <Row>
                <Col md={6}>
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control name="prenom" value={formData.prenom} onChange={handleChange}/>
                </Col>

                <Col md={6}>
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control name="nom" value={formData.nom} onChange={handleChange}/>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control name="email" value={formData.email} onChange={handleChange}/>
                </Col>

                <Col md={6}>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control name="telephone" value={formData.telephone} onChange={handleChange}/>
                </Col>
              </Row>

              <Form.Label>Sujet</Form.Label>
              <Form.Select name="sujet" value={formData.sujet} onChange={handleChange} className="select-style">
                <option value="">Sélectionnez un sujet</option>
                <option>Inscription</option>
                <option>Information</option>
                <option>Tarifs</option>
                <option>Cours de code</option>
                <option>Cours de conduite</option>
              </Form.Select>

              <Form.Label className="mt-3">Message *</Form.Label>
              <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange}/>

              <Button type="submit" className="btn-send w-100 mt-4" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Envoi...
                  </>
                ) : (
                  "Envoyer le message"
                )}
              </Button>

            </Form>
          </div>
        </Col>

        {/* RIGHT */}
        <Col md={5} className="right-side">

          <div className="info-box fade-up">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h5>Adresse</h5>
              <p>123 Avenue Mohammed V</p>
              <p>Casablanca, Maroc</p>
            </div>
          </div>

          <div className="info-box fade-up">
            <FaPhoneAlt className="icon" />
            <div>
              <h5>Téléphone</h5>
              <p>+212 6 61 96 70 48</p>
              <p>+212 6 63 42 84 39</p>
            </div>
          </div>

          <div className="info-box fade-up">
            <FaEnvelope className="icon" />
            <div>
              <h5>Email</h5>
              <p>contact@alkawkab.ma</p>
            </div>
          </div>

          <div className="info-box fade-up">
            <FaClock className="icon" />
            <div>
              <h5>Horaires</h5>
              <p>Lun - Ven: 8h00 - 19h00</p>
              <p>Samedi: 9h00 - 17h00</p>
              <p>Dimanche: Fermé</p>
            </div>
          </div>

        </Col>

      </Row>
    </Container>
  );
}

export default Reservation;