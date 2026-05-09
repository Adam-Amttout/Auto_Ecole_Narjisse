import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Connexion.css";
import axios from "axios";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ email: false, password: false });

    if (!email) { setFieldErrors(f => ({ ...f, email: true })); return; }
    if (!password) { setFieldErrors(f => ({ ...f, password: true })); return; }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", { email, password });
      const data = res.data;

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
        setFieldErrors(f => ({ ...f, email: true }));
        setError("Aucun compte trouvé avec cet email.");
      } else if (status === "wrong_password") {
        setFieldErrors(f => ({ ...f, password: true }));
        setError("Mot de passe incorrect.");
      } else {
        setError("Erreur de connexion. Vérifiez votre réseau.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg-circle c1" />
      <div className="login-bg-circle c2" />
      <div className="login-bg-circle c3" />

      <div className="login-box fade-in">
        <span className="close-btn" onClick={() => navigate("/")}>×</span>
        <div className="login-avatar"><FaUserCircle /></div>
        <h2 className="login-title">Connexion</h2>
        <p className="login-subtitle">Bienvenue sur Auto École Narjiss</p>

        <Form onSubmit={handleLogin}>
          {error && <div className="login-error"><span>⚠</span> {error}</div>}

          <div className={`input-box ${fieldErrors.email ? "input-error" : ""}`}>
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(f => ({ ...f, email: false })); }}
              required
            />
          </div>
          {fieldErrors.email && <small className="field-error-msg">Email invalide ou introuvable</small>}

          <div className={`input-box ${fieldErrors.password ? "input-error" : ""}`}>
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(f => ({ ...f, password: false })); }}
              required
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {fieldErrors.password && <small className="field-error-msg">Mot de passe incorrect</small>}

          <div className="options">
            <label className="remember-me"><input type="checkbox" /> Se souvenir de moi</label>
            <span className="forgot" onClick={() => navigate("/creer_compte")}>Mot de passe oublié ?</span>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner"><span className="spinner-dot" /> Connexion...</span>
            ) : "Se connecter"}
          </button>

          <p className="register">
            Pas encore de compte ? <span onClick={() => navigate("/creer_compte")}>S'inscrire</span>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Connexion;