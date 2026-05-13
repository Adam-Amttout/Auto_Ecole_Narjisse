import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [activeSec,    setActiveSec]    = useState("home");
  const ddRef  = useRef(null);
  const bellRef = useRef(null);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const role     = localStorage.getItem("role");

  /* ── NOTIFICATIONS ── */
  const [notifs,       setNotifs]       = useState([]);
  const [bellOpen,     setBellOpen]     = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);

  const getLastSeen = () => parseInt(localStorage.getItem("notif_last_seen") || "0");

  const fetchNotifs = async () => {
    try {
      const r = await axios.get(`${API}/notifications`);
      const data = r.data || [];
      setNotifs(data);
      const lastSeen = getLastSeen();
      const unseen = data.filter(n => new Date(n.created_at).getTime() > lastSeen).length;
      setUnreadCount(unseen);
    } catch { /* silent */ }
  };

  // Poll toutes les 60 secondes
  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 60000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openBell = () => {
    setBellOpen(!bellOpen);
    if (!bellOpen) {
      // Mark all as read when opening
      localStorage.setItem("notif_last_seen", Date.now().toString());
      setUnreadCount(0);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60)  return "À l'instant";
    if (diff < 3600) return `${Math.floor(diff/60)}min`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}j`;
  };

  // Custom storage event listener to update user when profile picture changes
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const initials = user ? `${user.prenom?.[0]||""}${user.nom?.[0]||""}`.toUpperCase() : "";
  
  const renderAvatar = (large = false) => {
    if (user?.photo_url) {
      return <img src={user.photo_url} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
    } else if (user?.photo_profil) {
      return <img src={`http://127.0.0.1:8000/storage/${user.photo_profil}`} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
    }
    return initials;
  };

  useEffect(() => {
    let ticking = false;
    const ids = ["home","about","services","demarches","gallery","formation","faq"];

    const fn = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        let cur = "home";
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) { const r = el.getBoundingClientRect(); if (r.top <= 100 && r.bottom >= 100) cur = id; }
        });
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) cur = "contact";
        setActiveSec(cur);
        ticking = false;
      });
    };

    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDropdownOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
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
    { l:"Démarches", a:()=>scrollTo("demarches"), active: activeSec==="demarches" },
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
          <img src="/logo-small.png" alt="Narjiss" className="nb-logo-img"/>
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
          {/* 🌓 Dark Mode Toggle */}
          <button className="nb-theme-toggle" onClick={toggleTheme} title={theme === "light" ? "Mode Sombre" : "Mode Clair"}>
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* 🔔 Notification Bell */}
          {user && (
            <div className="nb-bell-wrap" ref={bellRef}>
              <button className="nb-bell-btn" onClick={openBell} title="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="nb-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>

              {bellOpen && (
                <div className="nb-notif-dropdown">
                  <div className="nb-notif-head">
                    <span>🔔 Notifications</span>
                    {notifs.length > 0 && (
                      <span className="nb-notif-count">{notifs.length}</span>
                    )}
                  </div>

                  {notifs.length === 0 ? (
                    <div className="nb-notif-empty">
                      <span>🎉</span>
                      <p>Aucune notification pour l'instant</p>
                    </div>
                  ) : (
                    <div className="nb-notif-list">
                      {notifs.map(n => {
                        const isNew = new Date(n.created_at).getTime() > getLastSeen();
                        return (
                          <div key={n.id} className={`nb-notif-item ${isNew ? "nb-notif-new" : ""}`}>
                            <span className="nb-notif-icon" style={{ background: n.color + "22", color: n.color }}>
                              {n.icon}
                            </span>
                            <div className="nb-notif-body">
                              <div className="nb-notif-titre">{n.titre}</div>
                              <div className="nb-notif-msg">{n.message}</div>
                            </div>
                            <span className="nb-notif-time">{timeAgo(n.created_at)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {notifs.length > 0 && (
                    <div className="nb-notif-foot">
                      <button onClick={() => { setBellOpen(false); goTo("/cours"); }}>
                        Voir les cours →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Link to="/reservation" className="nb-btn-reg" onClick={()=>setMobileOpen(false)}>Inscription</Link>

          {!user ? (
            <Link to="/connexion" className="nb-btn-login">Connexion</Link>
          ) : (
            <div className="nb-dd-wrap" ref={ddRef}>
              <button className="nb-user-btn" onClick={()=>setDropdownOpen(!dropdownOpen)}>
                <span className="nb-avatar" style={{ padding: user?.photo_url || user?.photo_profil ? 0 : undefined, overflow: 'hidden' }}>
                  {renderAvatar()}
                </span>
                <span className="nb-uname">{user.prenom}</span>
                <svg className={`nb-chev ${dropdownOpen?"open":""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nb-dd">
                  <div className="nb-dd-top">
                    <div className="nb-dd-av" style={{ padding: user?.photo_url || user?.photo_profil ? 0 : undefined, overflow: 'hidden' }}>
                      {renderAvatar(true)}
                    </div>
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
          
          <button className="nb-mob-link" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Mode Sombre" : "☀️ Mode Clair"}
          </button>

          {!user ? (
            <div style={{display:"flex",gap:8,padding:"4px 0"}}>
              <Link to="/reservation" className="nb-btn-reg" style={{flex:1,textAlign:"center"}} onClick={()=>setMobileOpen(false)}>Inscription</Link>
              <Link to="/connexion" className="nb-btn-login" style={{flex:1,textAlign:"center"}} onClick={()=>setMobileOpen(false)}>Connexion</Link>
            </div>
          ) : (
            <>
              <div className="nb-mob-user-info">
                <div className="nb-avatar lg" style={{ padding: user?.photo_url || user?.photo_profil ? 0 : undefined, overflow: 'hidden' }}>
                  {renderAvatar(true)}
                </div>
                <div>
                  <div style={{fontWeight:700,color:"var(--text-primary)",fontSize:14}}>{user.prenom} {user.nom}</div>
                  <div style={{fontSize:12,color:"var(--text-secondary)"}}>{user.email}</div>
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