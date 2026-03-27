import Interdiction from "./pages/interdiction";
import Indication from "./pages/indication";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Footer from "./pages/Footer"; // 🔥 مهم

import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Creer_compte from "./pages/Creer_compte";
import Reservation from "./pages/Reservation";
import Cours from "./pages/Cours";
import Dashboard from "./pages/Dashboard";
import DangerDetail from "./pages/DangerDetail";
import Video1 from "./pages/VideoX";
import AboutDetails from "./pages/AboutDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/creer_compte" element={<Creer_compte />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/cours" element={<Cours />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cours/danger" element={<DangerDetail />} />
        <Route path="/video1" element={<Video1 />} />
        <Route path="/indication" element={<Indication />} />
        <Route path="/interdiction" element={<Interdiction />} />
        <Route path="/about-details" element={<AboutDetails />} />
      </Routes>

      {/* 🔥 Footer ف جميع الصفحات */}
      <Footer />

    </BrowserRouter>
  );
}

export default App;