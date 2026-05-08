import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./CreerCompte.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import WhatsAppButton from "./WhatsAppButton";

function CreerCompte() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email" && !value.includes("@")) {
      setErrors({ ...errors, email: "Email invalide" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (p.length > 8 && /[A-Z]/.test(p) && /\d/.test(p)) return "strong";
    if (p.length > 5) return "medium";
    return "weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CLICKED"); // ✅ debug
    alert("Button clicked"); // ✅ باش تشوف واش خدام

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/register-user", {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });

      console.log(res.data); // ✅ debug

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.log(error); // ✅ مهم بزاف
      alert("Error from server"); // 👈 باش يبان ليك

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
    <div className="form-bg">

      {/* ✅ FIX VIDEO CLICK */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
        style={{ pointerEvents: "none" }} // 🔥 هذا هو الحل
      >
        <source src="/video/cree_un_compte/Cree_un_compte.mp4" type="video/mp4" />
      </video>

      <Container className="form-container">
        <div className="form-box">

          <h2 className="form-title">Créer un compte</h2>
          <p className="form-subtitle">Rejoignez-nous dès maintenant</p>

          {success && (
            <div className="success-box">
              ✔ Compte créé avec succès !
            </div>
          )}

          <Form onSubmit={handleSubmit}>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </Form.Group>

            <Form.Group className="mb-2 position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                required
              />
              <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>

            <div className={`strength-bar ${getPasswordStrength()}`}></div>

            <p className={`strength-text ${getPasswordStrength()}`}>
              {getPasswordStrength() === "weak" && "Faible"}
              {getPasswordStrength() === "medium" && "Moyen"}
              {getPasswordStrength() === "strong" && "Fort"}
            </p>

            <div className="password-rules">
              <p className={formData.password.length >= 8 ? "valid" : "invalid"}>
                {formData.password.length >= 8 ? "✔" : "✖"} 8 caractères minimum
              </p>

              <p className={/[A-Z]/.test(formData.password) ? "valid" : "invalid"}>
                {/[A-Z]/.test(formData.password) ? "✔" : "✖"} Une majuscule
              </p>

              <p className={/\d/.test(formData.password) ? "valid" : "invalid"}>
                {/\d/.test(formData.password) ? "✔" : "✖"} Un chiffre
              </p>
            </div>

            <Form.Group className="mb-4 mt-2">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer mot de passe"
                required
              />
              {errors.confirmPassword && (
                <small className="error">{errors.confirmPassword}</small>
              )}
            </Form.Group>

            <Button type="submit" className="btn-send w-100">
              Créer votre compte
            </Button>

          </Form>
        </div>
      </Container>
    </div>
    <WhatsAppButton/>
    </>
  );
}

export default CreerCompte;