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

  const navigate = useNavigate();

  const users = [
    { email: "adam@mail.com", password: "123456" },
    { email: "test@mail.com", password: "abcdef" },
  ];

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:8000/api/login", {
      email: email,
      password: password,
    });

    // ✅ نجاح
    alert(res.data.message);

    // نحفظ client
    localStorage.setItem("client", JSON.stringify(res.data.client));

    navigate("/");

  } catch (err) {
    // ❌ خطأ
    alert("Email ou mot de passe incorrect !");
  }

  setLoading(false);
};

  return (
    <>
    <div className="login-page">
      <div className="login-box fade-in">
        <span className="close-btn" onClick={() => navigate("/")}>×</span>

        <FaUserCircle className="avatar" />

        <h2>Login</h2>

        <Form onSubmit={handleLogin}>
          {/* EMAIL */}
          <div className="input-box">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* SHOW / HIDE PASSWORD */}
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* OPTIONS */}
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot">Forgot?</span>
          </div>

          {/* BUTTON */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          {/* REGISTER */}
          <p className="register">
            Don't have an account?
            <span onClick={() => navigate("/creer_compte")}>
              Register
            </span>
          </p>
        </Form>
      </div>
    </div>
    <WhatsAppButton/>
    </>
  );
}

export default Connexion;