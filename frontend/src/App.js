import React, { lazy, Suspense, useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

/* ─── Always-visible: load eagerly ─── */
import Navbar  from "./components/Navbar";
import Footer  from "./pages/Footer";

/* ─── Lazy-loaded pages: only downloaded when navigated to ─── */
const Home          = lazy(() => import("./pages/Home"));
const Connexion     = lazy(() => import("./pages/Connexion"));
const Creer_compte  = lazy(() => import("./pages/Creer_compte"));
const Reservation   = lazy(() => import("./pages/Reservation"));
const Cours         = lazy(() => import("./pages/Cours"));
const CoursDetail   = lazy(() => import("./pages/CoursDetail"));
const Dashboard     = lazy(() => import("./pages/Dashboard"));
const DangerDetail  = lazy(() => import("./pages/DangerDetail"));
const Video1        = lazy(() => import("./pages/VideoX"));
const AboutDetails  = lazy(() => import("./pages/AboutDetails"));
const Formation     = lazy(() => import("./pages/formation"));
const Profil        = lazy(() => import("./pages/Profil"));
const SeancesPage   = lazy(() => import("./pages/SeancesPage"));
const Indication    = lazy(() => import("./pages/indication"));
const Interdiction  = lazy(() => import("./pages/interdiction"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));

/* ─── Branded Page Loader ─── */
const PageLoader = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9999,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #1d3557 0%, #0f2744 100%)",
    animation: "fadeInLoader 0.2s ease",
  }}>
    <style>{`

      @keyframes fadeInLoader {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes pulse-ring {
        0%   { transform: scale(0.85); opacity: 0.8; }
        50%  { transform: scale(1.08); opacity: 0.4; }
        100% { transform: scale(0.85); opacity: 0.8; }
      }
      @keyframes logo-bounce {
        0%, 100% { transform: translateY(0px); }
        40%       { transform: translateY(-10px); }
        70%       { transform: translateY(-5px); }
      }
      @keyframes progress-fill {
        0%   { width: 0%; }
        20%  { width: 25%; }
        50%  { width: 55%; }
        80%  { width: 80%; }
        100% { width: 95%; }
      }
      @keyframes dots-fade {
        0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
        40%            { opacity: 1;   transform: scale(1.2); }
      }
      @keyframes text-shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      .loader-dot:nth-child(1) { animation: dots-fade 1.2s ease-in-out 0.0s infinite; }
      .loader-dot:nth-child(2) { animation: dots-fade 1.2s ease-in-out 0.2s infinite; }
      .loader-dot:nth-child(3) { animation: dots-fade 1.2s ease-in-out 0.4s infinite; }
    `}</style>

    {/* ── Pulse ring behind logo ── */}
    <div style={{ position: "relative", marginBottom: 28 }}>
      <div style={{
        position: "absolute", inset: -18,
        borderRadius: "50%",
        background: "rgba(230,57,70,0.18)",
        animation: "pulse-ring 1.8s ease-in-out infinite",
      }}/>
      <div style={{
        position: "absolute", inset: -8,
        borderRadius: "50%",
        background: "rgba(230,57,70,0.1)",
        animation: "pulse-ring 1.8s ease-in-out 0.3s infinite",
      }}/>

      {/* ── Logo circle ── */}
      <div style={{
        width: 80, height: 80,
        borderRadius: 22,
        background: "linear-gradient(135deg, #e63946, #c1121f)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40,
        boxShadow: "0 12px 40px rgba(230,57,70,0.5)",
        animation: "logo-bounce 1.8s ease-in-out infinite",
        position: "relative", zIndex: 2,
      }}>
        🚗
      </div>
    </div>

    {/* ── Brand name ── */}
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: 22, fontWeight: 800,
      background: "linear-gradient(90deg, #ffffff 0%, #fca5a5 40%, #ffffff 80%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "text-shimmer 2s linear infinite",
      marginBottom: 4,
    }}>
      Auto École Narjiss
    </div>

    <div style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: 11, fontWeight: 500,
      color: "rgba(255,255,255,0.4)",
      letterSpacing: "2px",
      textTransform: "uppercase",
      marginBottom: 32,
    }}>
      Marrakech
    </div>

    {/* ── Progress bar ── */}
    <div style={{
      width: 180, height: 3,
      background: "rgba(255,255,255,0.1)",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 20,
    }}>
      <div style={{
        height: "100%",
        background: "linear-gradient(90deg, #e63946, #ff6b6b)",
        borderRadius: 10,
        animation: "progress-fill 1.8s ease-in-out infinite",
      }}/>
    </div>

    {/* ── Dots ── */}
    <div style={{ display: "flex", gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} className="loader-dot" style={{
          width: 7, height: 7,
          borderRadius: "50%",
          background: "#e63946",
        }}/>
      ))}
    </div>

  </div>
);
/* ─── Global route transition overlay ─── */
/* Uses navCount as `key` → forces full remount → CSS animations restart cleanly every time */
const RT_STYLE = `
  @keyframes rt-fadein  { from { opacity:0 } to { opacity:1 } }
  @keyframes rt-fadeout { from { opacity:1 } to { opacity:0 } }
  @keyframes rt-pop {
    0%   { transform: scale(0.5) translateY(20px); opacity:0; }
    65%  { transform: scale(1.12) translateY(-4px); opacity:1; }
    100% { transform: scale(1)    translateY(0);    opacity:1; }
  }
  @keyframes rt-pulse {
    0%,100% { transform:scale(1);    opacity:.55; }
    50%      { transform:scale(1.2);  opacity:.18; }
  }
  @keyframes rt-text {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes rt-bar {
    0%   { width:0%;   opacity:1; }
    70%  { width:88%;  opacity:1; }
    100% { width:95%;  opacity:1; }
  }
  @keyframes rt-dots {
    0%,80%,100% { opacity:.25; transform:scale(.75); }
    40%          { opacity:1;   transform:scale(1.35); }
  }
  .rt-overlay {
    animation: rt-fadein 0.18s ease forwards;
  }
  .rt-overlay.rt-out {
    animation: rt-fadeout 0.55s ease forwards;
  }
  .rt-dot:nth-child(1){animation:rt-dots 1.1s ease-in-out 0.0s  infinite;}
  .rt-dot:nth-child(2){animation:rt-dots 1.1s ease-in-out 0.18s infinite;}
  .rt-dot:nth-child(3){animation:rt-dots 1.1s ease-in-out 0.36s infinite;}
`;

function TransitionScreen({ onDone }) {
  const [out, setOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true),  180); // stay 0.18s then fade
    const t2 = setTimeout(() => onDone(),       350); // remove after fade
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`rt-overlay${out ? " rt-out" : ""}`}
      style={{
        position:"fixed", inset:0, zIndex:9998,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        background:"linear-gradient(135deg,#1d3557 0%,#0f2744 100%)",
        pointerEvents:"none",
      }}
    >
      <style>{RT_STYLE}</style>

      {/* Pulse rings + logo */}
      <div style={{position:"relative",marginBottom:24}}>
        <div style={{
          position:"absolute",inset:-18,borderRadius:"50%",
          background:"rgba(230,57,70,0.22)",
          animation:"rt-pulse 1.5s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute",inset:-9,borderRadius:"50%",
          background:"rgba(230,57,70,0.12)",
          animation:"rt-pulse 1.5s ease-in-out .25s infinite",
        }}/>
        <div style={{
          width:72,height:72,borderRadius:20,
          background:"linear-gradient(135deg,#e63946,#c1121f)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:36,
          boxShadow:"0 12px 36px rgba(230,57,70,.55)",
          animation:"rt-pop 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards",
          position:"relative",zIndex:2,
        }}>🚗</div>
      </div>

      {/* Brand */}
      <div style={{
        fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:"#fff",
        animation:"rt-text .45s ease .3s both",marginBottom:4,
      }}>Auto École Narjiss</div>
      <div style={{
        fontSize:10,fontWeight:600,
        color:"rgba(255,255,255,.35)",
        letterSpacing:"2.5px",textTransform:"uppercase",
        animation:"rt-text .45s ease .42s both",marginBottom:28,
      }}>Marrakech</div>

      {/* Progress bar */}
      <div style={{
        width:160,height:3,
        background:"rgba(255,255,255,.1)",
        borderRadius:10,overflow:"hidden",marginBottom:20,
      }}>
        <div style={{
          height:"100%",
          background:"linear-gradient(90deg,#e63946,#ff6b6b)",
          borderRadius:10,
          animation:"rt-bar 1.3s ease-out forwards",
        }}/>
      </div>

      {/* Dots */}
      <div style={{display:"flex",gap:7}}>
        {[0,1,2].map(i=>(
          <div key={i} className="rt-dot" style={{
            width:7,height:7,borderRadius:"50%",background:"#e63946",
          }}/>
        ))}
      </div>
    </div>
  );
}

function RouteTransitionOverlay() {
  const location  = useLocation();
  const [navCount, setNavCount] = useState(0);
  const [show,     setShow]     = useState(false);
  const isFirst   = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    setNavCount(c => c + 1);
    setShow(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const handleDone = useCallback(() => setShow(false), []);

  if (!show) return null;
  return <TransitionScreen key={navCount} onDone={handleDone} />;
}


function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/connexion" replace />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  // ⚠️ Si pas admin → retour à l'accueil (PAS redirection automatique vers dashboard)
  return role === "admin" ? children : <Navigate to="/" replace />;
}

/* ── Wrapper to conditionally hide Footer on dashboard pages ── */
function ConditionalFooter() {
  const location = useLocation();
  const hideFooter = location.pathname === "/dashboard" || location.pathname === "/mon-espace";
  if (hideFooter) return null;
  return <Footer />;
}

function App() {
  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <BrowserRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <RouteTransitionOverlay />
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── PUBLIQUES ── */}
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

          {/* ── CONNECTÉ ── */}
          <Route path="/cours"         element={<Cours />} />
          <Route path="/cours/:id"     element={<PrivateRoute><CoursDetail /></PrivateRoute>} />
          <Route path="/seances"       element={<PrivateRoute><SeancesPage /></PrivateRoute>} />
          <Route path="/profil"        element={<PrivateRoute><Profil /></PrivateRoute>} />
          <Route path="/profil/:id"    element={<AdminRoute><Profil /></AdminRoute>} />

          {/* ── ADMIN UNIQUEMENT ── */}
          <Route path="/dashboard"     element={<AdminRoute><Dashboard /></AdminRoute>} />

          {/* ── CLIENT ESPACE PRIVÉ ── */}
          <Route path="/mon-espace"    element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />

          {/* ── 404 → accueil ── */}
          <Route path="*"              element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
      <ConditionalFooter />
    </BrowserRouter>
  );
}

export default App;
