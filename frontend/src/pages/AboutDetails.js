import React, { useEffect } from "react";
import "./AboutDetails.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { 
  FaCar, 
  FaChalkboardTeacher, 
  FaChartLine, 
  FaUserPlus, 
  FaGraduationCap, 
  FaArrowLeft, 
  FaBook,
  FaCalendarCheck,
  FaCheckCircle
} from "react-icons/fa";

function AboutDetails() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  return (
    <div className="about-details-page">

      {/* 1. HERO SECTION */}
      <section className="details-hero">
        <div className="details-hero-overlay"></div>
        <div className="container position-relative z-3">
          <button className="btn-back" onClick={() => navigate("/about")}>
            <FaArrowLeft /> Retour à l'accueil
          </button>
          
          <div className="row mt-5">
            <div className="col-lg-8" data-aos="fade-up">
              <span className="badge-glow">L'Institution Narjiss</span>
              <h1 className="hero-display">
                Votre Partenaire de <span className="text-gradient-gold">Confiance</span>
              </h1>
              <p className="hero-lead">
                Découvrez l'histoire, la vision et la mission qui ont fait de l'Auto-École Narjiss une référence incontournable de la formation à la conduite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HISTOIRE & MISSION (SPLIT LAYOUT) */}
      <section className="history-mission-section">
        <div className="container">
          {/* Histoire */}
          <div className="row align-items-center mb-5 pb-5">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-right">
              <div className="image-frame-gold">
                <img src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1000" alt="Notre histoire" />
                <div className="frame-decoration"></div>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1" data-aos="fade-left">
              <h2 className="section-title-dark">Notre <span className="text-primary">Histoire</span></h2>
              <div className="title-underline"></div>
              <p className="desc-text mt-4">
                Fondée il y a plus de 10 ans, l'Auto-École Narjiss s'est imposée comme une référence absolue dans la formation à la conduite. Ce qui a commencé comme une petite structure locale est devenu aujourd'hui une institution reconnue.
              </p>
              <p className="desc-text">
                Grâce à notre expérience, notre passion pour l'enseignement et notre exigence, nous avons accompagné des milliers de candidats vers la réussite, avec une approche toujours humaine et bienveillante.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="row align-items-center flex-lg-row-reverse">
            <div className="col-lg-6 mb-4 mb-lg-0" data-aos="fade-left">
              <div className="image-frame-blue">
                <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1000" alt="Notre mission" />
                <div className="frame-decoration"></div>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1" data-aos="fade-right">
              <h2 className="section-title-dark">Notre <span className="text-primary">Mission</span></h2>
              <div className="title-underline"></div>
              <p className="desc-text mt-4">
                Notre mission va bien au-delà de l'obtention du permis : c'est de former des conducteurs responsables, autonomes, et respectueux de la sécurité routière.
              </p>
              <p className="desc-text">
                Nous utilisons des méthodes pédagogiques modernes, des véhicules de dernière génération, et un encadrement psychologique pour garantir une formation efficace, rapide et sans stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORMATIONS CARDS */}
      <section className="formations-showcase">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title-dark">Nos <span className="text-primary">Formations</span></h2>
            <p className="subtitle-text">Des programmes adaptés à chaque profil d'apprenant.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="100">
              <div className="formation-card">
                <div className="icon-wrapper"><FaCar /></div>
                <h4>Permis B</h4>
                <p>Formation complète et rigoureuse pour maîtriser la conduite automobile urbaine et sur autoroute.</p>
              </div>
            </div>
            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="200">
              <div className="formation-card">
                <div className="icon-wrapper"><FaBook /></div>
                <h4>Code de la route</h4>
                <p>Cours théoriques interactifs avec tests, examens blancs et suivi personnalisé.</p>
              </div>
            </div>
            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="300">
              <div className="formation-card">
                <div className="icon-wrapper"><FaUserPlus /></div>
                <h4>Conduite accompagnée</h4>
                <p>Apprentissage progressif dès 15 ans avec un accompagnateur pour maximiser l'expérience.</p>
              </div>
            </div>
            <div className="col-md-3" data-aos="zoom-in" data-aos-delay="400">
              <div className="formation-card">
                <div className="icon-wrapper"><FaCalendarCheck /></div>
                <h4>Stages intensifs</h4>
                <p>Formation accélérée sur quelques semaines pour obtenir votre permis rapidement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POURQUOI NOUS CHOISIR (DARK THEME) */}
      <section className="why-choose-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="text-white mb-4">L'Excellence <br/><span className="text-primary">Narjiss</span></h2>
              <p className="text-white-50">Découvrez pourquoi des milliers d'élèves nous font confiance chaque année pour leur apprentissage.</p>
            </div>
            <div className="col-lg-8">
              <div className="row g-4">
                <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                  <div className="feature-item">
                    <FaChalkboardTeacher className="f-icon" />
                    <div>
                      <h5>Moniteurs qualifiés</h5>
                      <p>Des formateurs diplômés d'État, expérimentés, patients et à l'écoute.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-item">
                    <FaCar className="f-icon" />
                    <div>
                      <h5>Véhicules modernes</h5>
                      <p>Une flotte renouvelée régulièrement pour un apprentissage en toute sécurité.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
                  <div className="feature-item">
                    <FaChartLine className="f-icon" />
                    <div>
                      <h5>Taux de réussite élevé</h5>
                      <p>Plus de 95% de réussite grâce à notre méthode pédagogique éprouvée.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6" data-aos="fade-up" data-aos-delay="400">
                  <div className="feature-item">
                    <FaCheckCircle className="f-icon" />
                    <div>
                      <h5>Suivi personnalisé</h5>
                      <p>Un encadrement sur-mesure adapté au rythme et aux besoins de chaque élève.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS TIMELINE */}
      <section className="process-flow">
        <div className="container text-center">
          <h2 className="section-title-dark mb-5" data-aos="fade-up">Votre chemin vers le <span className="text-primary">Succès</span></h2>
          
          <div className="step-container">
            <div className="step-box" data-aos="zoom-in" data-aos-delay="100">
              <div className="step-number">01</div>
              <h4>Inscription</h4>
              <p>Créez votre dossier facilement en agence ou en ligne.</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-box" data-aos="zoom-in" data-aos-delay="200">
              <div className="step-number">02</div>
              <h4>Formation</h4>
              <p>Suivez vos cours de code et de conduite à votre rythme.</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-box" data-aos="zoom-in" data-aos-delay="300">
              <div className="step-number">03</div>
              <h4>Examen</h4>
              <p>Préparez-vous sereinement avec nos examens blancs.</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-box" data-aos="zoom-in" data-aos-delay="400">
              <div className="step-number">04</div>
              <h4>Réussite</h4>
              <p>Obtenez votre précieux sésame avec confiance !</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="cta-premium">
        <div className="container text-center" data-aos="zoom-in">
          <h2>Prêt à prendre le volant ?</h2>
          <p>Rejoignez la meilleure auto-école et assurez votre réussite.</p>
          <button className="btn-glow mt-4" onClick={() => navigate("/reservation")}>
            Commencer ma formation
          </button>
        </div>
      </section>

    </div>
  );
}

export default AboutDetails;