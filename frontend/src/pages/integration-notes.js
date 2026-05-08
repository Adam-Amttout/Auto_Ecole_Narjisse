// ═══════════════════════════════════════════════════════════
// FICHIER 1 : src/App.js  — REMPLACER ENTIÈREMENT
// ═══════════════════════════════════════════════════════════

import Interdiction  from "./pages/interdiction";
import Indication    from "./pages/indication";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar        from "./components/Navbar";
import Footer        from "./pages/Footer";
import WhatsAppButton from "./pages/WhatsAppButton";
import Home          from "./pages/Home";
import Connexion     from "./pages/Connexion";
import Creer_compte  from "./pages/Creer_compte";
import Reservation   from "./pages/Reservation";
import Cours         from "./pages/Cours";
import Dashboard     from "./pages/Dashboard";
import DangerDetail  from "./pages/DangerDetail";
import Video1        from "./pages/VideoX";
import AboutDetails  from "./pages/AboutDetails";
import Formation     from "./pages/formation";
import Profil        from "./pages/Profil";   // ← NOUVEAU

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/connexion" />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/connexion"     element={<Connexion />} />
        <Route path="/creer_compte"  element={<Creer_compte />} />
        <Route path="/reservation"   element={<Reservation />} />
        <Route path="/cours/danger"  element={<DangerDetail />} />
        <Route path="/video1"        element={<Video1 />} />
        <Route path="/indication"    element={<Indication />} />
        <Route path="/interdiction"  element={<Interdiction />} />
        <Route path="/about-details" element={<AboutDetails />} />
        <Route path="/formation"     element={<Formation />} />

        {/* Routes privées */}
        <Route path="/cours"   element={<PrivateRoute><Cours /></PrivateRoute>} />
        <Route path="/profil"  element={<PrivateRoute><Profil /></PrivateRoute>} />

        {/* Admin consulte le profil d'un user : /profil/42 */}
        <Route path="/profil/:id" element={<AdminRoute><Profil /></AdminRoute>} />

        {/* Admin uniquement */}
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Routes>
      <Footer />
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;


// ═══════════════════════════════════════════════════════════
// FICHIER 2 : src/components/Navbar.js  — REMPLACER ENTIÈREMENT
// ═══════════════════════════════════════════════════════════

import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [expanded, setExpanded]           = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/connexion");
  };

  const scrollToSection = (id) => {
    setExpanded(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sections = ["home", "about", "services", "gallery", "formation", "faq"];
    const handleScroll = () => {
      let current = "home";
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 120 && r.bottom >= 120) current = id;
        }
      });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) current = "contact";
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScrollNavbar = () => {
      const navbar = document.querySelector(".custom-navbar");
      if (navbar) {
        if (window.scrollY > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScrollNavbar);
    return () => window.removeEventListener("scroll", handleScrollNavbar);
  }, []);

  return (
    <BSNavbar expand="lg" expanded={expanded} className="custom-navbar">
      <Container>

        {/* LOGO */}
        <BSNavbar.Brand as={Link} to="/" onClick={() => setExpanded(false)} className="brand-container">
          <img src="/logo.png" alt="Auto École Narjiss" className="navbar-logo" />
          <div className="brand-texts">
            <span className="brand-title">Auto École</span>
            <span className="brand-name">Narjiss</span>
          </div>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="align-items-lg-center">
            {[
              { label: "Accueil",    id: "home" },
              { label: "À propos",  id: "about" },
              { label: "Services",  id: "services" },
              { label: "Galerie",   id: "gallery" },
              { label: "Formation", id: "formation" },
            ].map(({ label, id }) => (
              <Nav.Link key={id}
                onClick={() => scrollToSection(id)}
                className={activeSection === id ? "nav-link active" : "nav-link"}>
                {label}
              </Nav.Link>
            ))}

            {/* Cours — redirige vers connexion si pas connecté */}
            <Nav.Link
              onClick={() => { navigate(user ? "/cours" : "/connexion"); setExpanded(false); }}
              className={location.pathname === "/cours" ? "nav-link active" : "nav-link"}>
              Cours
            </Nav.Link>

            {[
              { label: "FAQ",     id: "faq" },
              { label: "Contact", id: "contact" },
            ].map(({ label, id }) => (
              <Nav.Link key={id}
                onClick={() => scrollToSection(id)}
                className={activeSection === id ? "nav-link active" : "nav-link"}>
                {label}
              </Nav.Link>
            ))}

            {/* Dashboard — admin seulement */}
            {user && role === "admin" && (
              <Nav.Link
                onClick={() => { navigate("/dashboard"); setExpanded(false); }}
                className={location.pathname === "/dashboard" ? "nav-link active" : "nav-link"}>
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          {/* BOUTONS */}
          <div className="nav-buttons">
            <Button as={Link} to="/reservation" className="btn-register" onClick={() => setExpanded(false)}>
              Inscription
            </Button>

            {!user ? (
              <Button as={Link} to="/connexion" className="btn-login" onClick={() => setExpanded(false)}>
                Connexion
              </Button>
            ) : (
              <>
                {/* Bouton profil avec prénom */}
                <Button
                  className="btn-profil-nav"
                  onClick={() => { navigate("/profil"); setExpanded(false); }}
                  title={`${user.prenom} ${user.nom}`}
                >
                  <FaUserCircle style={{ marginRight: 5 }} />
                  <span className="profil-nav-name">{user.prenom}</span>
                </Button>

                <Button className="btn-login" onClick={logout}>
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;


// ═══════════════════════════════════════════════════════════
// FICHIER 3 : src/components/Navbar.css  — AJOUTER À LA FIN
// ═══════════════════════════════════════════════════════════
/*
.btn-profil-nav {
  display: inline-flex;
  align-items: center;
  background: rgba(29,53,87,0.08);
  border: 1.5px solid #1d3557;
  color: #1d3557;
  padding: 6px 13px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 600;
  transition: 0.25s;
  white-space: nowrap;
}
.btn-profil-nav:hover {
  background: #1d3557;
  color: white;
  transform: scale(1.04);
}
.profil-nav-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

/* Fix taille uniforme tous les boutons navbar */
.btn-register,
.btn-login,
.btn-profil-nav {
  height: auto !important;
  min-height: 36px;
  line-height: 1.4;
}
*/


// ═══════════════════════════════════════════════════════════
// FICHIER 4 : Dashboard.js — AJOUTER dans le tableau Clients
// Ligne à ajouter dans la colonne Actions de chaque client
// ═══════════════════════════════════════════════════════════
/*
  Dans le tableau Clients, remplacez la colonne Actions par :

  <td>
    <div className="d-flex gap-1">
      <Button size="sm" variant="outline-info"
        className="btn-action-dash"
        title="Voir le profil"
        onClick={() => window.open(`/profil/${c.id}`, '_blank')}>
        👁
      </Button>
      <Button size="sm" className="btn-edit" onClick={() => editClient(c)}>✏️</Button>
      {confirmDelete.type === "client" && confirmDelete.id === c.id ? (
        <>
          <Button size="sm" variant="danger" className="btn-confirm" onClick={() => deleteClient(c.id)}>Oui</Button>
          <Button size="sm" variant="outline-secondary" className="btn-confirm" onClick={() => setConfirmDelete({ type: "", id: null })}>Non</Button>
        </>
      ) : (
        <Button size="sm" className="btn-delete" onClick={() => setConfirmDelete({ type: "client", id: c.id })}>🗑️</Button>
      )}
    </div>
  </td>

  Et ajoutez dans Dashboard.css :

  .btn-action-dash {
    padding: 4px 8px !important;
    font-size: 13px !important;
    border-radius: 6px !important;
    min-width: 32px;
    line-height: 1.4;
  }
*/


// ═══════════════════════════════════════════════════════════
// FICHIER 5 : app/Http/Controllers/ClientController.php
//             CORRIGER la méthode update (hash password)
// ═══════════════════════════════════════════════════════════
/*
  public function update(Request $request, $id)
  {
      $client = Client::findOrFail($id);

      $data = [
          'nom'    => $request->nom    ?? $client->nom,
          'prenom' => $request->prenom ?? $client->prenom,
          'email'  => $request->email  ?? $client->email,
          'role'   => $request->role   ?? $client->role,
      ];

      // Met à jour le mot de passe seulement si fourni
      if ($request->filled('password')) {
          $data['password'] = Hash::make($request->password);
      }

      $client->update($data);

      return response()->json([
          'message' => 'Client mis à jour',
          'data'    => $client
      ]);
  }
*/