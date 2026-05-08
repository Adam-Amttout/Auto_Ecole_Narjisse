import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Connexion.css";
import axios from "axios";
import WhatsAppButton from "./WhatsAppButton";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const data = res.data;

      // ✅ succès
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        if (data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/cours");
        }
      }

    } catch (err) {
      const status = err.response?.data?.status;

      if (status === "not_found") {
        setError("Compte introuvable → création en cours...");
        setTimeout(() => {
          navigate("/creer_compte");
        }, 1500);
      }

      else if (status === "wrong_password") {
        setError("Mot de passe incorrect");
      }

      else {
        setError("Erreur serveur");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="login-page">
        <div className="login-box fade-in">
          <span className="close-btn" onClick={() => navigate("/")}>×</span>

          <FaUserCircle className="avatar" />
          <h2>Connexion</h2>

          <Form onSubmit={handleLogin}>

            {error && <div className="error-message">{error}</div>}

            <div className="input-box">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Chargement..." : "Se connecter"}
            </button>

            <p className="register">
              Vous n’avez pas de compte ?
              <span onClick={() => navigate("/creer_compte")}>
                S’inscrire
              </span>
            </p>

          </Form>
        </div>
      </div>

      <WhatsAppButton />
    </>
  );
}

export default Connexion;