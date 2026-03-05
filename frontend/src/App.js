import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Creer_compte from "./pages/Creer_compte";
// import About from "./pages/About";
// // import Destinations from "./pages/Destinations";
// // import Offers from "./pages/Offers";
import Reservation from "./pages/Reservation";
import Connexion from "./pages/Connexion";
import Faq from "./pages/Faq";
// import TestPost from "./pages/TestPost";
// import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
   
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/creer_compte" element={<Creer_compte />} />
        {/* 
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/offers" element={<Offers />} />
        
        <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/reservation" element={<Reservation />} />

        <Route path="/faq" element={<Faq />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
