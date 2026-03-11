



import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
// import Footer from "./pages/Footer";

import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Creer_compte from "./pages/Creer_compte";
import Reservation from "./pages/Reservation";
import Cours from "./pages/Cours";
import Dashboard from "./pages/Dashboard";

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
      </Routes>

      {/* <Footer /> */}

    </BrowserRouter>
  );
}

export default App;
