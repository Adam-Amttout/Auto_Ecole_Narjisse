import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  /* ── scroll navbar ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── section active ── */
  useEffect(() => {
    const ids = ["home","about","services","gallery","formation","faq"];
    const onScroll = () => {
      let cur = "home";
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 100 && r.bottom >= 100) cur = id;
        }
      });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) cur = "contact";
      setActiveSection(cur);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── fermer dropdown en cliquant dehors ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setDropdownOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 64, behavior: "smooth" });
      }, 120);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 64, behavior: "smooth" });
    }
  };

  const goTo = (path) => { navigate(path); setMenuOpen(false); setDropdownOpen(false); };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/connexion");
  };

  const initiales = user ? `${user.prenom?.charAt(0)}${user.nom?.charAt(0)}`.toUpperCase() : "";

  const LINKS = [
    { label: "Accueil",   type: "scroll", id: "home"      },
    { label: "À propos",  type: "scroll", id: "about"     },
    { label: "Services",  type: "scroll", id: "services"  },
    { label: "Galerie",   type: "scroll", id: "gallery"   },
    { label: "Formation", type: "scroll", id: "formation" },
    { label: "Cours",     type: "route",  path: "/cours"  },
    { label: "FAQ",       type: "scroll", id: "faq"       },
    { label: "Contact",   type: "scroll", id: "contact"   },
  ];

  return (
    <nav className={`nb ${scrolled ? "nb-scrolled" : ""}`}>
      <div className="nb-inner">

        {/* ── LOGO ── */}
        <Link to="/" className="nb-logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Narjiss" className="nb-logo-img" />
          <div className="nb-logo-text">
            <span className="nb-logo-sub">Auto École</span>
            <span className="nb-logo-name">Narjiss</span>
          </div>
        </Link>

        {/* ── LIENS (desktop) ── */}
        <div className="nb-links">
          {LINKS.map((l, i) => {
            const isActive = l.type === "scroll"
              ? activeSection === l.id
              : location.pathname === l.path;
            return (
              <button key={i} className={`nb-link ${isActive ? "active" : ""}`}
                onClick={() => l.type === "scroll" ? scrollTo(l.id) : goTo(l.path)}>
                {l.label}
              </button>
            );
          })}
          {user && role === "admin" && (
            <button className={`nb-link ${location.pathname === "/dashboard" ? "active" : ""}`}
              onClick={() => goTo("/dashboard")}>
              Dashboard
            </button>
          )}
        </div>

        {/* ── ACTIONS (desktop) ── */}
        <div className="nb-actions">
          <Link to="/reservation" className="nb-btn-register" onClick={() => setMenuOpen(false)}>
            Inscription
          </Link>

          {!user ? (
            <Link to="/connexion" className="nb-btn-login" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
          ) : (
            /* ── DROPDOWN UTILISATEUR ── */
            <div className="nb-user-wrap" ref={dropdownRef}>
              <button className="nb-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="nb-avatar">{initiales}</span>
                <span className="nb-user-name">{user.prenom}</span>
                <svg className={`nb-chevron ${dropdownOpen ? "open" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nb-dropdown">
                  {/* Entête */}
                  <div className="nb-dd-header">
                    <div className="nb-dd-avatar">{initiales}</div>
                    <div>
                      <div className="nb-dd-fullname">{user.prenom} {user.nom}</div>
                      <div className="nb-dd-email">{user.email}</div>
                      <span className={`nb-dd-role ${role}`}>
                        {role === "admin" ? "🛡 Admin" : "🎓 Élève"}
                      </span>
                    </div>
                  </div>
                  <div className="nb-dd-sep"/>
                  {/* Liens */}
                  <button className="nb-dd-item" onClick={() => goTo("/profil")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Mon profil
                  </button>
                  <button className="nb-dd-item" onClick={() => goTo("/cours")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Mes cours
                  </button>
                  {role === "admin" && (
                    <button className="nb-dd-item" onClick={() => goTo("/dashboard")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Dashboard
                    </button>
                  )}
                  <div className="nb-dd-sep"/>
                  <button className="nb-dd-item logout" onClick={logout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── HAMBURGER (mobile) ── */}
        <button className={`nb-burger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span/><span/><span/>
        </button>
      </div>

      {/* ── MENU MOBILE ── */}
      {menuOpen && (
        <div className="nb-mobile">
          {LINKS.map((l, i) => (
            <button key={i} className={`nb-mobile-link ${
              l.type === "scroll" ? (activeSection === l.id ? "active" : "") : (location.pathname === l.path ? "active" : "")
            }`} onClick={() => l.type === "scroll" ? scrollTo(l.id) : goTo(l.path)}>
              {l.label}
            </button>
          ))}
          {user && role === "admin" && (
            <button className={`nb-mobile-link ${location.pathname === "/dashboard" ? "active" : ""}`}
              onClick={() => goTo("/dashboard")}>Dashboard</button>
          )}
          <div className="nb-mobile-sep"/>
          {!user ? (
            <div className="nb-mobile-btns">
              <Link to="/reservation" className="nb-btn-register" onClick={() => setMenuOpen(false)}>Inscription</Link>
              <Link to="/connexion"   className="nb-btn-login"    onClick={() => setMenuOpen(false)}>Connexion</Link>
            </div>
          ) : (
            <div className="nb-mobile-user">
              <div className="nb-mobile-user-info">
                <div className="nb-avatar lg">{initiales}</div>
                <div>
                  <div style={{fontWeight:700,color:"#1d3557"}}>{user.prenom} {user.nom}</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>{user.email}</div>
                </div>
              </div>
              <button className="nb-mobile-link" onClick={() => goTo("/profil")}>👤 Mon profil</button>
              <button className="nb-mobile-link logout" onClick={logout}>🚪 Déconnexion</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;