import React, { useEffect } from "react";
import "./Services.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaBookOpen, FaCarSide, FaLaptopCode, FaBolt, 
  FaUserGraduate, FaBullseye, FaAngleRight, 
  FaChalkboardTeacher, FaRegClock, FaTrophy, 
  FaArrowRight
} from "react-icons/fa";

function Services() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  const services = [
    {
      id: "code-route",
      title: "Code de la Route",
      icon: <FaBookOpen />,
      description: "Apprentissage complet du code avec des sessions interactives, des tests blancs et un suivi personnalisé.",
      color: "#e63946" // primary
    },
    {
      id: "conduite-pratique",
      title: "Conduite Pratique",
      icon: <FaCarSide />,
      description: "Cours sur route avec des moniteurs qualifiés. Apprenez à conduire en toute sécurité et confiance.",
      color: "#3b82f6" // blue
    },
    {
      id: "tests-en-ligne",
      title: "Tests en Ligne",
      icon: <FaLaptopCode />,
      description: "Plateforme digitale pour vous entraîner 24/7 avec des questions similaires à l'examen officiel.",
      color: "#8b5cf6" // purple
    },
    {
      id: "stage-accelere",
      title: "Stage Accéléré",
      icon: <FaBolt />,
      description: "Vous êtes pressé ? Obtenez votre permis en un temps record grâce à notre formule intensive.",
      color: "#f59e0b" // amber
    },
    {
      id: "conduite-accompagnee",
      title: "Conduite Accompagnée",
      icon: <FaUserGraduate />,
      description: "La meilleure formule pour acquérir de l'expérience et réduire la période probatoire.",
      color: "#10b981" // emerald
    },
    {
      id: "perfectionnement",
      title: "Perfectionnement",
      icon: <FaBullseye />,
      description: "Reprenez confiance au volant après une longue période sans conduire ou suite à un retrait.",
      color: "#0f172a" // dark
    }
  ];

  const steps = [
    { title: "Évaluation", desc: "Premier test d'évaluation pour définir votre niveau et vos besoins." },
    { title: "Code", desc: "Apprentissage du code en salle ou en ligne jusqu'à réussite de l'examen." },
    { title: "Pratique", desc: "Heures de conduite avec suivi pédagogique numérique." },
    { title: "Examen", desc: "Passage de l'examen pratique avec notre accompagnement." }
  ];

  return (
    <div className="services-page-premium">
      
      {/* 1. HERO SECTION (ULTRA PREMIUM CINEMATIC) */}
      <section className="services-hero-cinematic">
        <div className="cinematic-overlay"></div>
        <div className="container position-relative z-3">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center" data-aos="fade-up">
              <span className="cinematic-badge">L'Excellence Automobile</span>
              <h1 className="hero-title-cinematic mt-4">
                L'Expertise qui vous <br />
                <span className="text-primary-gradient">Mène à la Réussite</span>
              </h1>
              <p className="hero-subtitle-cinematic mt-4 mx-auto">
                Explorez nos formations haut de gamme. De l'apprentissage classique aux stages accélérés, nous avons la formule qui correspond à votre ambition.
              </p>
              
              <div className="d-flex flex-wrap justify-content-center gap-4 mt-5">
                <div className="hero-metric-box">
                  <h3 className="text-white fw-bold mb-0">98%</h3>
                  <span className="text-white-50 small">Taux de réussite</span>
                </div>
                <div className="hero-metric-box">
                  <h3 className="text-white fw-bold mb-0">15+</h3>
                  <span className="text-white-50 small">Ans d'expérience</span>
                </div>
                <div className="hero-metric-box">
                  <h3 className="text-white fw-bold mb-0">5k+</h3>
                  <span className="text-white-50 small">Élèves formés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES CATALOG */}
      <section className="services-catalog">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">Catalogue de Formations</span>
            <h2 className="section-title">Nos <span className="text-highlight">Services</span></h2>
          </div>
          
          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-lg-4 col-md-6" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="service-card-modern">
                  <div className="service-icon-box" style={{ background: `${service.color}15`, color: service.color }}>
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link to={`/service/${service.id}`} className="service-link" style={{ color: service.color }}>
                    Découvrir ce service <FaAngleRight className="link-icon" />
                  </Link>
                  <div className="card-hover-border" style={{ background: service.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TIMELINE PROCESS */}
      <section className="process-timeline-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-5 mb-lg-0" data-aos="fade-right">
              <span className="section-tag">Votre Parcours</span>
              <h2 className="section-title">De l'inscription <br />au <span className="text-highlight">Permis</span></h2>
              <p className="process-desc mt-4">
                Nous avons simplifié chaque étape de votre apprentissage pour que vous puissiez vous concentrer sur l'essentiel : devenir un excellent conducteur.
              </p>
              <button className="btn-outline-dark mt-4" onClick={() => navigate("/reservation")}>
                S'inscrire maintenant
              </button>
            </div>
            
            <div className="col-lg-6 offset-lg-1" data-aos="fade-left">
              <div className="timeline-vertical">
                {steps.map((step, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker">{index + 1}</div>
                    <div className="timeline-content">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ADVANTAGES SECTION (DARK THEME) */}
      <section className="advantages-modern">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag text-white-50">L'Excellence Narjiss</span>
            <h2 className="section-title text-white">Pourquoi nous <span className="text-primary-light">choisir ?</span></h2>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
              <div className="advantage-box">
                <div className="adv-icon"><FaChalkboardTeacher /></div>
                <h4>Pédagogie Experte</h4>
                <p>Nos moniteurs sont formés aux dernières techniques d'apprentissage pour un suivi sur-mesure.</p>
              </div>
            </div>
            
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="advantage-box highlight-box">
                <div className="adv-icon"><FaTrophy /></div>
                <h4>Taux de Réussite</h4>
                <p>Avec 98% de réussite au premier passage, notre méthode a fait ses preuves auprès de milliers d'élèves.</p>
              </div>
            </div>
            
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="advantage-box">
                <div className="adv-icon"><FaRegClock /></div>
                <h4>Flexibilité Totale</h4>
                <p>Planifiez vos heures de conduite facilement selon votre emploi du temps, même le soir et le week-end.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default Services;