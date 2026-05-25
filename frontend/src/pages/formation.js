import React, { useEffect } from "react";
import "./formation.css";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaMotorcycle, FaCar, FaTruck, FaBus, 
  FaClock, FaCheckCircle, FaArrowRight, FaRoute 
} from "react-icons/fa";

function Formation() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  const categories = [
    {
      title: "Particuliers (Auto & Moto)",
      desc: "Des formations adaptées pour votre indépendance au quotidien.",
      items: [
        {
          type: "Permis B",
          badge: "Le plus demandé",
          icon: <FaCar />,
          desc: "Formation complète pour voiture avec nos moniteurs experts. Idéal pour les débutants.",
          hours: "Min. 20h de conduite",
          features: ["Évaluation de départ", "Cours de code inclus", "Accompagnement examen"],
          img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
          color: "#3b82f6"
        },
        {
          type: "Permis A",
          icon: <FaMotorcycle />,
          desc: "Permis moto (A1, A2, A) pour les passionnés. Maîtrisez le deux-roues en toute sécurité.",
          hours: "Min. 20h de conduite",
          features: ["Plateau technique privé", "Motos récentes", "Équipement sécurité prêté"],
          img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800",
          color: "#e63946"
        },
        {
          type: "Pack Réussite",
          icon: <FaRoute />,
          desc: "Le pack complet Code + Conduite. L'offre idéale pour obtenir votre permis de A à Z.",
          hours: "Illimité + 25h",
          features: ["Code en ligne 24/7", "Tests blancs illimités", "Priorité sur les plannings"],
          img: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=800",
          color: "#8b5cf6"
        }
      ]
    },
    {
      title: "Professionnels (Poids Lourds & Transports)",
      desc: "Faites de la route votre métier avec nos formations qualifiantes et reconnues.",
      items: [
        {
          type: "Permis C",
          icon: <FaTruck />,
          desc: "Permis Poids Lourd (Marchandises) avec une formation intensive théorique et pratique.",
          hours: "Programme sur-mesure",
          features: ["Camions de dernière génération", "Piste adaptée", "Préparation FIMO"],
          img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800",
          color: "#f59e0b"
        },
        {
          type: "Permis D",
          icon: <FaBus />,
          desc: "Formation pour le transport de voyageurs (Autocar/Bus) en toute sécurité.",
          hours: "Programme sur-mesure",
          features: ["Autocars récents et confortables", "Gestion des passagers", "Règlementation stricte"],
          img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800",
          color: "#10b981"
        },
        {
          type: "Permis CE",
          badge: "Expertise",
          icon: <FaTruck />,
          desc: "Permis Super Lourd (Camion + Remorque) pour les as de la logistique.",
          hours: "Programme sur-mesure",
          features: ["Maniabilité remorque", "Mises à quai complexes", "Mécanique avancée"],
          img: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=800",
          color: "#0f172a"
        }
      ]
    }
  ];

  return (
    <div className="formation-page-premium">
      
      {/* HERO SECTION */}
      <section className="form-hero-section">
        <div className="form-hero-overlay"></div>
        <div className="container position-relative z-3 text-center">
          <span className="form-badge-top" data-aos="fade-down">Catalogue 2024</span>
          <h1 className="form-hero-title" data-aos="zoom-in">
            Tous les <span className="text-gradient-red">Permis de Conduire</span>
          </h1>
          <p className="form-hero-subtitle" data-aos="fade-up" data-aos-delay="100">
            De la moto au poids lourd, découvrez l'ensemble de nos formations dispensées par des experts diplômés d'État. Choisissez votre voie.
          </p>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="form-content-section">
        <div className="container">
          {categories.map((category, catIndex) => (
            <div className="category-block" key={catIndex}>
              
              <div className="category-header text-center" data-aos="fade-up">
                <h2 className="cat-title">{category.title}</h2>
                <p className="cat-desc">{category.desc}</p>
                <div className="cat-divider"></div>
              </div>

              <div className="row g-4 justify-content-center">
                {category.items.map((item, index) => (
                  <div className="col-lg-4 col-md-6" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                    <div className="premium-form-card">
                      
                      <div className="pf-image-wrapper">
                        <img src={item.img} alt={item.type} className="pf-img" />
                        <div className="pf-overlay"></div>
                        {item.badge && <span className="pf-badge">{item.badge}</span>}
                        <div className="pf-icon-floating" style={{ color: item.color }}>
                          {item.icon}
                        </div>
                      </div>

                      <div className="pf-content">
                        <h3 className="pf-title">{item.type}</h3>
                        <div className="pf-hours">
                          <FaClock className="me-2" style={{color: item.color}}/> 
                          {item.hours}
                        </div>
                        <p className="pf-desc">{item.desc}</p>
                        
                        <ul className="pf-features">
                          {item.features.map((feat, i) => (
                            <li key={i}>
                              <FaCheckCircle className="feat-icon" style={{color: item.color}}/>
                              {feat}
                            </li>
                          ))}
                        </ul>

                        <button 
                          className="pf-btn" 
                          style={{'--btn-color': item.color}}
                          onClick={() => navigate("/reservation")}
                        >
                          S'inscrire <FaArrowRight className="ms-2" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="form-cta-bottom text-center">
        <div className="container" data-aos="zoom-in">
          <h2>Vous hésitez sur la formation à choisir ?</h2>
          <p className="mt-3 mb-4">Notre équipe est là pour vous conseiller et vous orienter vers la formule la plus adaptée à vos besoins.</p>
          <button className="btn-contact-massive" onClick={() => navigate("/contact")}>
            Demander un conseil gratuit
          </button>
        </div>
      </section>

    </div>
  );
}

export default Formation;