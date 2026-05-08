import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import axios from "axios";
import "./Reservation.css";
import WhatsAppButton from "./WhatsAppButton";

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

    const user = JSON.parse(localStorage.getItem("user"));

    // 🔐 user خاصو يكون login
    if (!user) {
      setError("Vous devez vous connecter d'abord");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/inscription",
        {
          ...formData,
          email: user.email // 🔥 مهم
        }
      );

      console.log(res.data);

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

    } catch (err) {
      console.log(err.response);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de l'inscription ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="contact-container">
        <Row className="g-4 align-items-stretch">

          {/* LEFT */}
          <Col md={7} className="fade-up d-flex align-items-stretch">
            <div className="contact-form w-100">

              <h2>Inscription</h2>
              <p className="contact-highlight">
                Inscrivez-vous dès maintenant et commencez votre formation !
              </p>

              {success && <Alert variant="success">✅ Inscription réussie !</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} className="d-flex flex-column h-100">

                <div>

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

                </div>

                {/* BUTTON */}
                <Button type="submit" className="btn-send w-100 mt-4 mt-auto" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Inscription...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>

              </Form>
            </div>
          </Col>

          {/* RIGHT */}
          <Col md={5} className="d-flex align-items-stretch">
            <div className="right-side w-100">

              <div className="info-box fade-up">
                <div className="icon-box"><FaMapMarkerAlt /></div>
                <div className="info-content">
                  <h5>Adresse</h5>
                  <p>123 Avenue Mohammed V</p>
                  <p>Casablanca, Maroc</p>
                </div>
              </div>

              <div className="info-box fade-up">
                <div className="icon-box"><FaPhoneAlt /></div>
                <div className="info-content">
                  <h5>Téléphone</h5>
                  <p>+212 6 61 96 70 48</p>
                  <p>+212 6 63 42 84 39</p>
                </div>
              </div>

              <div className="info-box fade-up">
                <div className="icon-box"><FaEnvelope /></div>
                <div className="info-content">
                  <h5>Email</h5>
                  <p>contact@alkawkab.ma</p>
                </div>
              </div>

              <div className="info-box fade-up">
                <div className="icon-box"><FaClock /></div>
                <div className="info-content">
                  <h5>Horaires</h5>
                  <p>Lun - Ven: 8h00 - 19h00</p>
                  <p>Samedi: 9h00 - 17h00</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>

            </div>
          </Col>

        </Row>
      </Container>

      <WhatsAppButton />
    </>
  );
}

export default Reservation;