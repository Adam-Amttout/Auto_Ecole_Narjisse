import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [activeSec,    setActiveSec]    = useState("home");
  const ddRef = useRef(null);

  const user     = JSON.parse(localStorage.getItem("user"));
  const role     = localStorage.getItem("role");
  const initials = user ? `${user.prenom?.[0]||""}${user.nom?.[0]||""}`.toUpperCase() : "";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = ["home","about","services","gallery","formation","faq"];
    const fn = () => {
      let cur = "home";
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) { const r = el.getBoundingClientRect(); if (r.top <= 100 && r.bottom >= 100) cur = id; }
      });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) cur = "contact";
      setActiveSec(cur);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false); setDropdownOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { sectionId: id } });
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 58, behavior: "smooth" });
    }
  };

  const goTo  = (p) => { navigate(p); setMobileOpen(false); setDropdownOpen(false); };
  const logout = ()  => { localStorage.removeItem("user"); localStorage.removeItem("role"); goTo("/connexion"); };

  const NAV = [
    { l:"Accueil",   a:()=>scrollTo("home"),      active: activeSec==="home" },
    { l:"À propos",  a:()=>scrollTo("about"),     active: activeSec==="about" },
    { l:"Services",  a:()=>scrollTo("services"),  active: activeSec==="services" },
    { l:"Galerie",   a:()=>scrollTo("gallery"),   active: activeSec==="gallery" },
    { l:"Formation", a:()=>scrollTo("formation"), active: activeSec==="formation" },
    { l:"Cours",     a:()=>goTo(user?"/cours":"/connexion"), active: location.pathname==="/cours" },
    ...(user ? [{ l:"Séances", a:()=>goTo("/seances"), active: location.pathname==="/seances" }] : []),
    { l:"FAQ",       a:()=>scrollTo("faq"),       active: activeSec==="faq" },
    { l:"Contact",   a:()=>scrollTo("contact"),   active: activeSec==="contact" },
    ...(user && role==="admin" ? [{ l:"Dashboard", a:()=>goTo("/dashboard"), active: location.pathname==="/dashboard" }] : []),
  ];

  return (
    <nav className={`nb ${scrolled?"nb-s":""}`}>
      <div className="nb-inner">

        <Link to="/" className="nb-logo" onClick={()=>setMobileOpen(false)}>
          <img src="/logo.png" alt="Narjiss" className="nb-logo-img"/>
          <div className="nb-logo-txt">
            <span className="nb-logo-sm">Auto École</span>
            <span className="nb-logo-big">Narjiss</span>
          </div>
        </Link>

        <div className="nb-links">
          {NAV.map((l,i)=>(
            <button key={i} className={`nb-link ${l.active?"active":""}`} onClick={l.a}>{l.l}</button>
          ))}
        </div>

        <div className="nb-actions">
          <Link to="/reservation" className="nb-btn-reg" onClick={()=>setMobileOpen(false)}>Inscription</Link>

          {!user ? (
            <Link to="/connexion" className="nb-btn-login">Connexion</Link>
          ) : (
            <div className="nb-dd-wrap" ref={ddRef}>
              <button className="nb-user-btn" onClick={()=>setDropdownOpen(!dropdownOpen)}>
                <span className="nb-avatar">{initials}</span>
                <span className="nb-uname">{user.prenom}</span>
                <svg className={`nb-chev ${dropdownOpen?"open":""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nb-dd">
                  <div className="nb-dd-top">
                    <div className="nb-dd-av">{initials}</div>
                    <div>
                      <div className="nb-dd-name">{user.prenom} {user.nom}</div>
                      <div className="nb-dd-mail">{user.email}</div>
                      <span className={`nb-dd-role ${role}`}>{role==="admin"?"🛡 Admin":"🎓 Élève"}</span>
                    </div>
                  </div>
                  <div className="nb-dd-sep"/>
                  <button className="nb-dd-item" onClick={()=>goTo("/profil")}>👤 Mon profil</button>
                  <button className="nb-dd-item" onClick={()=>goTo("/cours")}>📚 Mes cours</button>
                  <button className="nb-dd-item" onClick={()=>goTo("/seances")}>🚗 Mes séances</button>
                  {role==="admin" && <button className="nb-dd-item" onClick={()=>goTo("/dashboard")}>⚙️ Dashboard</button>}
                  <div className="nb-dd-sep"/>
                  <button className="nb-dd-item logout" onClick={logout}>🚪 Déconnexion</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className={`nb-burger ${mobileOpen?"open":""}`} onClick={()=>setMobileOpen(!mobileOpen)}>
          <span/><span/><span/>
        </button>
      </div>

      {mobileOpen && (
        <div className="nb-mob">
          {NAV.map((l,i)=>(
            <button key={i} className={`nb-mob-link ${l.active?"active":""}`} onClick={l.a}>{l.l}</button>
          ))}
          <div className="nb-mob-sep"/>
          {!user ? (
            <div style={{display:"flex",gap:8,padding:"4px 0"}}>
              <Link to="/reservation" className="nb-btn-reg" style={{flex:1,textAlign:"center"}} onClick={()=>setMobileOpen(false)}>Inscription</Link>
              <Link to="/connexion" className="nb-btn-login" style={{flex:1,textAlign:"center"}} onClick={()=>setMobileOpen(false)}>Connexion</Link>
            </div>
          ) : (
            <>
              <div className="nb-mob-user-info">
                <div className="nb-avatar lg">{initials}</div>
                <div>
                  <div style={{fontWeight:700,color:"#1d3557",fontSize:14}}>{user.prenom} {user.nom}</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>{user.email}</div>
                </div>
              </div>
              <button className="nb-mob-link" onClick={()=>goTo("/profil")}>👤 Mon profil</button>
              <button className="nb-mob-link logout" onClick={logout}>🚪 Déconnexion</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}