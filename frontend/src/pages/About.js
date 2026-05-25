import React, { useEffect } from "react";
import "./About.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaChalkboardTeacher, FaTrophy, FaCheckCircle, FaFacebookF, FaInstagram, FaLinkedinIn, FaPlay } from "react-icons/fa";

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  const team = [
    {
      name: "Ahmed Benali",
      role: "Directeur Pédagogique",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
      desc: "Plus de 15 ans d'expérience dans la formation automobile."
    },
    {
      name: "Sara El Idrissi",
      role: "Monitrice Experte",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      desc: "Spécialiste de la conduite accompagnée et gestion du stress."
    },
    {
      name: "Youssef Amrani",
      role: "Moniteur & Formateur",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
      desc: "Expert en sécurité routière et éco-conduite."
    }
  ];

  const values = [
    { icon: <FaShieldAlt />, title: "Sécurité Absolue", desc: "Des véhicules récents, double commande, et une rigueur totale pour vous protéger." },
    { icon: <FaChalkboardTeacher />, title: "Pédagogie Adaptée", desc: "Nous prenons le temps d'adapter notre enseignement au rythme de chaque élève." },
    { icon: <FaTrophy />, title: "Excellence & Réussite", desc: "Notre taux de réussite de 98% reflète la qualité de notre engagement envers vous." }
  ];

  return (
    <div className="about-page-premium">
      
      {/* 1. HERO SECTION */}
      <section className="about-hero-modern">
        <div className="hero-modern-overlay"></div>
        <div className="container hero-modern-content">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <span className="hero-badge">Notre Histoire</span>
              <h1 className="hero-title">
                Plus qu'une Auto-École, <br />
                <span className="text-gradient">Votre Partenaire de Réussite</span>
              </h1>
              <p className="hero-subtitle">
                Depuis 2010, Auto-École Narjiss révolutionne l'apprentissage de la conduite avec une approche moderne, bienveillante et orientée vers l'excellence.
              </p>
              <div className="hero-buttons">
                <button className="btn-modern-primary" onClick={() => navigate("/reservation")}>
                  Rejoignez-nous
                </button>
                <button className="btn-modern-play">
                  <span className="play-icon"><FaPlay /></span> Voir notre vidéo
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Abstract Shapes */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="stats-banner-wrapper">
        <div className="container">
          <div className="stats-banner" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-item">
              <h3 className="stat-number">500+</h3>
              <p className="stat-text">Candidats Formés</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="stat-number">98%</h3>
              <p className="stat-text">Taux de Réussite</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="stat-number">15+</h3>
              <p className="stat-text">Années d'Expérience</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="stat-number">8</h3>
              <p className="stat-text">Moniteurs Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STORY SECTION */}
      <section className="story-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
              <div className="story-image-composition">
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800" alt="Driving school" className="img-main shadow-lg" />
                <img src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=600" alt="Student smiling" className="img-secondary shadow-lg" />
                <div className="experience-badge">
                  <span className="years">15</span>
                  <span className="text">Ans<br/>d'Excellence</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1" data-aos="fade-left">
              <div className="section-header-left">
                <span className="section-tag">Qui Sommes-Nous</span>
                <h2>L'Auto-École de la <span className="text-gradient">Nouvelle Génération</span></h2>
              </div>
              <p className="story-description">
                L'Auto-École Narjiss a été fondée avec une vision claire : transformer l'apprentissage de la conduite en une expérience positive, sereine et mémorable. Nous avons remplacé le stress traditionnel par des méthodes interactives.
              </p>
              <ul className="story-features">
                <li><FaCheckCircle className="feature-icon" /> Accompagnement 100% personnalisé</li>
                <li><FaCheckCircle className="feature-icon" /> Flotte de véhicules hybrides dernière génération</li>
                <li><FaCheckCircle className="feature-icon" /> Salles de code interactives et simulateurs</li>
                <li><FaCheckCircle className="feature-icon" /> Application mobile pour le suivi de votre progression</li>
              </ul>
              <button className="btn-modern-outline mt-4" onClick={() => navigate("/about-details")}>
                Découvrir notre histoire
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUES SECTION */}
      <section className="values-section">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">Notre Philosophie</span>
            <h2 className="section-title">Nos Valeurs <span className="text-gradient">Fondamentales</span></h2>
          </div>
          <div className="row g-4">
            {values.map((val, index) => (
              <div className="col-md-4" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                <div className="value-card">
                  <div className="value-icon-wrapper">
                    {val.icon}
                  </div>
                  <h3>{val.title}</h3>
                  <p>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="team-section-modern">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">Les Experts</span>
            <h2 className="section-title">Rencontrez <span className="text-gradient">Notre Équipe</span></h2>
            <p className="team-subtitle">Des professionnels passionnés, dédiés à votre réussite sur la route.</p>
          </div>
          
          <div className="row g-4">
            {team.map((member, index) => (
              <div className="col-lg-4 col-md-6" key={index} data-aos="zoom-in" data-aos-delay={index * 150}>
                <div className="team-member-card">
                  <div className="team-img-wrapper">
                    <img src={member.img} alt={member.name} />
                    <div className="team-socials">
                      <a href="#/"><FaFacebookF /></a>
                      <a href="#/"><FaInstagram /></a>
                      <a href="#/"><FaLinkedinIn /></a>
                    </div>
                  </div>
                  <div className="team-info">
                    <h4>{member.name}</h4>
                    <span className="role">{member.role}</span>
                    <p>{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;