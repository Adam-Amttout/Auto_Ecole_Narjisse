import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ServiceDetail.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaArrowLeft, FaCheckCircle, FaRegClock, FaTrophy, 
  FaChalkboardTeacher, FaBookOpen, FaCarSide, FaLaptopCode, 
  FaBolt, FaUserGraduate, FaBullseye, FaMapMarkerAlt
} from "react-icons/fa";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
    window.scrollTo(0, 0); 
  }, [id]);

  const serviceData = {
    "code-route": {
      title: "Code de la Route",
      subtitle: "La première étape vers votre indépendance",
      icon: <FaBookOpen />,
      color: "#e63946",
      img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&q=80&w=1200",
      overview: "Notre formation au code de la route est conçue pour maximiser votre taux de réussite. Fini l'apprentissage ennuyeux ! Nous combinons des cours interactifs en agence animés par des experts et une plateforme e-learning ultra-performante.",
      duration: "4 à 6 Semaines",
      location: "En Agence & En Ligne",
      level: "Débutant",
      program: [
        { title: "Évaluation de départ", desc: "Test initial pour identifier votre niveau et personnaliser votre parcours." },
        { title: "Cours Thématiques", desc: "Apprentissage des panneaux, priorités, règles de circulation et éco-conduite." },
        { title: "Entraînement Intensif", desc: "Séries de questions avec boîtiers interactifs et correction détaillée." },
        { title: "Examens Blancs", desc: "Mise en situation réelle (40 questions, temps limité) pour être prêt le jour J." }
      ],
      packages: [
        { name: "Forfait Essentiel", price: "700 DH", features: ["Accès illimité salle (3 mois)", "Livre de code fourni", "Suivi pédagogique", "Présentation à l'examen"] },
        { name: "Forfait Premium", price: "1200 DH", isPopular: true, features: ["Accès salle (6 mois)", "Code en ligne 24/7", "Livre + Livret tests", "2 Présentations examen", "Stage intensif 2 jours"] }
      ]
    },
    "conduite-pratique": {
      title: "Conduite Pratique",
      subtitle: "Prenez le volant en toute sérénité",
      icon: <FaCarSide />,
      color: "#3b82f6",
      img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1200",
      overview: "Apprenez à conduire dans un environnement sécurisé avec des véhicules de dernière génération. Nos moniteurs diplômés d'État s'adaptent à votre rythme et à votre profil pour vous transformer en conducteur sûr et autonome.",
      duration: "Minimum 20 Heures",
      location: "Sur Route (Ville & Autoroute)",
      level: "Pratique",
      program: [
        { title: "Maîtrise du véhicule", desc: "Installation au poste de conduite, démarrage, arrêt, et maniement du volant." },
        { title: "Appréhension de la route", desc: "Positionnement sur la chaussée, franchissement d'intersections et ronds-points." },
        { title: "Circulation complexe", desc: "Conduite en agglomération dense, insertion sur autoroute, et conduite de nuit." },
        { title: "Préparation Examen", desc: "Parcours types d'examen, créneaux, batailles et vérifications intérieures/extérieures." }
      ],
      packages: [
        { name: "Forfait 20 Heures", price: "2500 DH", features: ["20h de conduite individuelle", "Évaluation de départ", "Frais de dossier inclus", "1 Présentation examen"] },
        { name: "Forfait 30 Heures", price: "3500 DH", isPopular: true, features: ["30h de conduite individuelle", "Conduite sur autoroute", "Livre de vérifications", "1 Présentation examen", "Bilan personnalisé"] }
      ]
    },
    "tests-en-ligne": {
      title: "Tests en Ligne",
      subtitle: "Révisez d'où vous voulez, quand vous voulez",
      icon: <FaLaptopCode />,
      color: "#8b5cf6",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
      overview: "Accédez à la meilleure plateforme e-learning du marché. Plus de 3000 questions conformes au nouvel examen du code de la route, avec des statistiques détaillées pour cibler vos faiblesses.",
      duration: "Accès 6 Mois",
      location: "Application & Web",
      level: "Tous Niveaux",
      program: [
        { title: "Diagnostic", desc: "Série d'évaluation pour créer votre profil de révision personnalisé." },
        { title: "Séries Thématiques", desc: "Focus sur les 10 thèmes officiels du code de la route (Croisement, dépassement, etc.)." },
        { title: "Examens Blancs illimités", desc: "Entraînez-vous dans les mêmes conditions que l'examen final avec timer." },
        { title: "Statistiques Intelligentes", desc: "L'algorithme vous propose des questions sur les sujets que vous maîtrisez le moins." }
      ],
      packages: [
        { name: "Pack Web Standard", price: "300 DH", features: ["Accès Web 3 mois", "1500 questions", "Corrections simples", "Suivi basique"] },
        { name: "Pack Mobile + Web", price: "500 DH", isPopular: true, features: ["Accès Web + Appli 6 mois", "3000 questions", "Corrections animées", "Mode hors-ligne", "Stats avancées"] }
      ]
    },
    "stage-accelere": {
      title: "Stage Accéléré",
      subtitle: "Votre permis en un temps record",
      icon: <FaBolt />,
      color: "#f59e0b",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200",
      overview: "Vous avez un besoin urgent de votre permis pour des raisons professionnelles ou personnelles ? Notre formule accélérée vous permet de passer votre code et votre conduite en un temps record grâce à un planning ultra-intensif.",
      duration: "3 à 4 Semaines",
      location: "En Agence & Sur Route",
      level: "Intensif",
      program: [
        { title: "Semaine 1 : Code Intensif", desc: "3 jours complets de formation théorique avec un moniteur dédié, suivi de l'examen." },
        { title: "Semaine 2 : Pratique 1", desc: "Immersion totale au volant avec 2 à 3 heures de conduite par jour." },
        { title: "Semaine 3 : Pratique 2", desc: "Conduite en circulation complexe et sur autoroute." },
        { title: "Semaine 4 : Examen", desc: "Préparation spécifique aux parcours d'examen et passage de l'épreuve." }
      ],
      packages: [
        { name: "Code Accéléré", price: "1500 DH", features: ["Stage de 3 jours pleins", "Manuel pédagogique", "Passage prioritaire à l'examen", "Déjeuner inclus"] },
        { name: "Permis Complet Accéléré", price: "5000 DH", isPopular: true, features: ["Code accéléré", "20h de conduite condensées", "Priorité sur le planning", "Accompagnement VIP", "2 Présentations examen"] }
      ]
    },
    "conduite-accompagnee": {
      title: "Conduite Accompagnée",
      subtitle: "L'expérience maximale avant l'examen",
      icon: <FaUserGraduate />,
      color: "#10b981",
      img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200",
      overview: "Accessible dès 15 ans, l'Apprentissage Anticipé de la Conduite (AAC) est la meilleure méthode pour acquérir de l'expérience, réduire sa période probatoire et augmenter drastiquement ses chances de réussite à l'examen final.",
      duration: "1 An Minimum",
      location: "Auto-école & Avec Parents",
      level: "Jeune Conducteur",
      program: [
        { title: "Formation Initiale", desc: "Obtention du code de la route et 20 heures de conduite avec un moniteur de l'auto-école." },
        { title: "Rendez-vous Préalable", desc: "Bilan de 2h avec l'élève, l'accompagnateur et le moniteur avant de partir en conduite accompagnée." },
        { title: "Phase de Conduite", desc: "L'élève doit parcourir un minimum de 3000 km sur une durée d'au moins un an." },
        { title: "Rendez-vous Pédagogiques", desc: "Deux bilans obligatoires en auto-école pendant la phase de conduite avec l'accompagnateur." }
      ],
      packages: [
        { name: "Forfait AAC Standard", price: "3800 DH", features: ["Formation Initiale (Code + 20h)", "Livret d'apprentissage", "2 RDV pédagogiques", "1 Présentation examen"] },
        { name: "Forfait AAC Premium", price: "4500 DH", isPopular: true, features: ["Formation Initiale (Code + 25h)", "Code en ligne 6 mois", "3 RDV pédagogiques", "Assurance complémentaire", "1 Présentation examen"] }
      ]
    },
    "perfectionnement": {
      title: "Perfectionnement",
      subtitle: "Reprenez confiance au volant",
      icon: <FaBullseye />,
      color: "#0f172a",
      img: "https://images.unsplash.com/photo-1449960238630-7e720e630019?auto=format&fit=crop&q=80&w=1200",
      overview: "Vous avez déjà votre permis mais vous n'avez pas conduit depuis longtemps ? Vous avez une appréhension spécifique (autoroute, créneaux, circulation dense) ? Nos cours de perfectionnement sur-mesure sont faits pour vous.",
      duration: "À La Carte",
      location: "Sur Route",
      level: "Avancé",
      program: [
        { title: "Bilan de Compétences", desc: "Une première heure pour évaluer vos acquis et définir vos besoins précis." },
        { title: "Travail Ciblé", desc: "Exercices pratiques sur vos points faibles (stationnement, ronds-points, etc.)." },
        { title: "Gestion du Stress", desc: "Accompagnement psychologique par nos moniteurs pour vaincre l'amaxophobie (peur de conduire)." },
        { title: "Autonomie Validée", desc: "Bilan final pour s'assurer que vous êtes prêt à conduire seul en toute sécurité." }
      ],
      packages: [
        { name: "Pack 2 Heures (Bilan)", price: "400 DH", features: ["1h d'évaluation", "1h de pratique ciblée", "Conseils personnalisés", "Véhicule double-commande"] },
        { name: "Pack 10 Heures (Remise à niveau)", price: "1800 DH", isPopular: true, features: ["Bilan de compétences", "9h de pratique intensive", "Gestion du stress", "Conduite de nuit/autoroute", "Possibilité sur votre véhicule"] }
      ]
    }
  };

  const service = serviceData[id];

  // If ID doesn't exist, redirect or show not found
  if (!service) {
    return (
      <div className="container text-center py-5 mt-5">
        <h2>Service introuvable</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/services")}>Retour aux services</button>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      
      {/* 1. HERO BANNER */}
      <div className="service-detail-hero" style={{ backgroundImage: `url(${service.img})` }}>
        <div className="hero-gradient-overlay" style={{ background: `linear-gradient(135deg, rgba(15,23,42,0.95) 0%, ${service.color}aa 100%)` }}></div>
        <div className="container position-relative z-3 pt-5">
          <button className="btn-return" onClick={() => navigate("/services")}>
            <FaArrowLeft /> Nos Formations
          </button>
          
          <div className="row mt-5 align-items-center" data-aos="fade-up">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-4 mb-4">
                <div className="service-icon-massive" style={{ color: service.color, background: `${service.color}20` }}>
                  {service.icon}
                </div>
                <span className="premium-badge">Formation Premium</span>
              </div>
              <h1 className="service-title-massive">{service.title}</h1>
              <p className="service-subtitle-massive">{service.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INFO QUICK BAR */}
      <div className="quick-info-bar">
        <div className="container">
          <div className="row g-0 quick-info-container shadow-lg">
            <div className="col-md-4 info-cell">
              <FaRegClock className="q-icon" style={{color: service.color}}/>
              <div>
                <span>Durée estimée</span>
                <strong>{service.duration}</strong>
              </div>
            </div>
            <div className="col-md-4 info-cell">
              <FaMapMarkerAlt className="q-icon" style={{color: service.color}}/>
              <div>
                <span>Lieu de formation</span>
                <strong>{service.location}</strong>
              </div>
            </div>
            <div className="col-md-4 info-cell border-0">
              <FaUserGraduate className="q-icon" style={{color: service.color}}/>
              <div>
                <span>Niveau requis</span>
                <strong>{service.level}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT (Overview + Syllabus) */}
      <section className="service-content-section">
        <div className="container">
          <div className="row">
            
            <div className="col-lg-7" data-aos="fade-right">
              <div className="overview-box mb-5">
                <h2 className="section-title-dark mb-4">Présentation de la <span style={{color: service.color}}>Formation</span></h2>
                <p className="overview-text">{service.overview}</p>
              </div>

              <div className="syllabus-box">
                <h3 className="mb-4 fw-bold">Au Programme</h3>
                <div className="syllabus-timeline">
                  {service.program.map((step, idx) => (
                    <div className="syllabus-item" key={idx}>
                      <div className="syll-marker" style={{background: service.color}}></div>
                      <div className="syll-content">
                        <h5>{step.title}</h5>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing Cards */}
            <div className="col-lg-5" data-aos="fade-left">
              <div className="pricing-sidebar sticky-top" style={{top: '120px'}}>
                <h3 className="mb-4 fw-bold text-center">Tarifs & Forfaits</h3>
                
                <div className="pricing-cards-container">
                  {service.packages.map((pkg, idx) => (
                    <div className={`pricing-card ${pkg.isPopular ? 'popular-card' : ''}`} key={idx} style={pkg.isPopular ? {borderColor: service.color} : {}}>
                      {pkg.isPopular && <div className="popular-badge" style={{background: service.color}}>Le plus choisi</div>}
                      
                      <h4 className="pkg-name">{pkg.name}</h4>
                      <div className="pkg-price" style={{color: pkg.isPopular ? service.color : '#0f172a'}}>
                        {pkg.price}
                      </div>
                      
                      <ul className="pkg-features">
                        {pkg.features.map((f, i) => (
                          <li key={i}><FaCheckCircle style={{color: service.color}}/> {f}</li>
                        ))}
                      </ul>
                      
                      <button 
                        className={`btn-pkg w-100 mt-4 ${pkg.isPopular ? 'btn-pkg-solid' : 'btn-pkg-outline'}`}
                        style={pkg.isPopular ? {background: service.color} : {borderColor: service.color, color: service.color}}
                        onClick={() => navigate("/reservation")}
                      >
                        Sélectionner ce forfait
                      </button>
                    </div>
                  ))}
                </div>

                <div className="guarantee-alert mt-4">
                  <FaChalkboardTeacher /> 
                  <span>Accompagnement garanti par des experts diplômés d'État.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default ServiceDetail;
