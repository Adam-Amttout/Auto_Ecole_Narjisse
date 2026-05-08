import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

/* ─── Minimal loading fallback ─── */
const PageLoader = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "60vh", flexDirection: "column", gap: 12
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      border: "3px solid #e63946", borderTopColor: "transparent",
      animation: "spin 0.7s linear infinite"
    }}/>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Guards ─── */
function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/connexion" replace />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  // ⚠️ Si pas admin → retour à l'accueil (PAS redirection automatique vers dashboard)
  return role === "admin" ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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

          {/* ── 404 → accueil ── */}
          <Route path="*"              element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;