import Interdiction  from "./pages/interdiction";
import Indication    from "./pages/indication";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar         from "./components/Navbar";
import Footer         from "./pages/Footer";
import Home           from "./pages/Home";
import Connexion      from "./pages/Connexion";
import Creer_compte   from "./pages/Creer_compte";
import Reservation    from "./pages/Reservation";
import Cours          from "./pages/Cours";
import CoursDetail    from "./pages/CoursDetail";   // ← NOUVEAU
import Dashboard      from "./pages/Dashboard";
import DangerDetail   from "./pages/DangerDetail";
import Video1         from "./pages/VideoX";
import AboutDetails   from "./pages/AboutDetails";
import Formation      from "./pages/formation";
import Profil         from "./pages/Profil";
import SeancesPage    from "./pages/SeancesPage";

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
        <Route path="/cours"         element={<PrivateRoute><Cours /></PrivateRoute>} />
        <Route path="/cours/:id"     element={<PrivateRoute><CoursDetail /></PrivateRoute>} />
        <Route path="/seances"       element={<PrivateRoute><SeancesPage /></PrivateRoute>} />
        <Route path="/profil"        element={<PrivateRoute><Profil /></PrivateRoute>} />
        <Route path="/profil/:id"    element={<AdminRoute><Profil /></AdminRoute>} />

        {/* ── ADMIN UNIQUEMENT ── */}
        <Route path="/dashboard"     element={<AdminRoute><Dashboard /></AdminRoute>} />

        {/* ── 404 → accueil ── */}
        <Route path="*"              element={<Navigate to="/" replace />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;