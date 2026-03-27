import React, { useEffect, useRef, useState } from "react";
import "./Gallery.css";
import AOS from "aos";
import "aos/dist/aos.css";

function Gallery() {
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Import all images dynamically with error handling
  const importAllImages = () => {
    const images = [];
    for (let i = 1; i <= 16; i++) {
      try {
        images.push({
          id: i,
          src: require(`../assets/images/gallery/car${i}.jpg`),
          alt: `Gallery image ${i}`,
          category: i <= 6 ? "formation" : i <= 10 ? "entreprise" : "reussite"
        });
      } catch (error) {
        console.warn(`Image car${i}.jpg not found`);
        images.push({
          id: i,
          src: `https://via.placeholder.com/600x400?text=Image+${i}`,
          alt: `Placeholder ${i}`,
          category: i <= 6 ? "formation" : i <= 10 ? "entreprise" : "reussite"
        });
      }
    }
    return images;
  };

  const allImages = importAllImages();
  
  // Split images for different sections
  const carouselImages = allImages.slice(0, 6);
  const entrepriseImages = allImages.slice(6, 10);
  const reussiteImages = allImages.slice(10, 16);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
      easing: 'ease-in-out-cubic',
      delay: 100
    });
    
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -350,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 350,
        behavior: "smooth"
      });
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const carouselData = [
    { title: "Cours Théoriques", icon: "📚", description: "Apprentissage interactif des règles de circulation avec nos experts", duration: "20h", color: "#e63946" },
    { title: "Conduite Pratique", icon: "🚗", description: "Formation sur route et manoeuvres avancées en conditions réelles", duration: "25h", color: "#2ecc71" },
    { title: "Simulation Examen", icon: "🎯", description: "Préparation intensive à l'examen final avec mises en situation", duration: "5h", color: "#3498db" },
    { title: "Code de la Route", icon: "📖", description: "Maîtrisez le code avec nos méthodes pédagogiques innovantes", duration: "30h", color: "#f39c12" },
    { title: "Conduite Nuit", icon: "🌙", description: "Apprentissage des conditions nocturnes et météo difficiles", duration: "10h", color: "#9b59b6" },
    { title: "Certification", icon: "🎓", description: "Obtention du permis avec un taux de réussite de 98%", duration: "Final", color: "#1abc9c" }
  ];

  const entrepriseFeatures = [
    { icon: "🏢", title: "Locaux Modernes", description: "Espace de 300m² entièrement équipé" },
    { icon: "🚘", title: "Flotte de Véhicules", description: "12 véhicules récents avec double commande" },
    { icon: "💻", title: "Salle Informatique", description: "10 postes pour la formation au code" },
    { icon: "🎥", title: "Simulateurs", description: "Technologie de pointe pour l'apprentissage" }
  ];

  const successStories = [
    { name: "Sophie Martin", age: 22, result: "Permis obtenu en 20h", date: "Mars 2024", quote: "Une formation exceptionnelle !" },
    { name: "Thomas Bernard", age: 25, result: "Réussite du premier coup", date: "Février 2024", quote: "Les moniteurs sont top !" },
    { name: "Laura Dubois", age: 19, result: "Permis en 3 mois", date: "Janvier 2024", quote: "Je recommande à 100%" },
    { name: "Nicolas Petit", age: 28, result: "Mention très bien", date: "Décembre 2023", quote: "Formation de qualité" },
    { name: "Emma Richard", age: 21, result: "Permis obtenu", date: "Novembre 2023", quote: "Équipe à l'écoute" },
    { name: "Lucas Moreau", age: 24, result: "Premier essai réussi", date: "Octobre 2023", quote: "Méthode efficace" }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Permis B obtenu en 20h",
      text: "Une expérience exceptionnelle ! Les moniteurs sont très professionnels et à l'écoute. J'ai obtenu mon permis du premier coup grâce à leur méthode pédagogique unique. Les locaux sont modernes et bien équipés.",
      rating: 5,
      date: "Mars 2024",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Thomas Bernard",
      role: "Permis B obtenu en 25h",
      text: "Je recommande vivement cette auto-école. Le suivi personnalisé et les cours pratiques m'ont permis de gagner en confiance rapidement. Un grand merci à toute l'équipe pour leur patience et leur professionnalisme !",
      rating: 5,
      date: "Février 2024",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 3,
      name: "Laura Dubois",
      role: "Permis B obtenu en 18h",
      text: "Formation de qualité avec des moniteurs patients et compétents. Les supports de cours sont modernes et adaptés. Une réussite grâce à une équipe formidable qui m'a accompagnée jusqu'au bout.",
      rating: 5,
      date: "Janvier 2024",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  const stats = [
    { value: "98%", label: "Taux de réussite", icon: "🎯", trend: "+12%" },
    { value: "1500+", label: "Élèves formés", icon: "👨‍🎓", trend: "+200" },
    { value: "15+", label: "Années d'expérience", icon: "⭐", trend: "Expertise" },
    { value: "4.9/5", label: "Avis clients", icon: "💯", trend: "Top rating" }
  ];

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <div className="loader-circle"></div>
          <p>Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <img src={selectedImage.src} alt={selectedImage.alt} />
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content" data-aos="fade-up" data-aos-duration="1200">
            <span className="hero-badge">Auto-École Premium</span>
            <h1>Votre Permis <span className="gradient-text">En Toute Confiance</span></h1>
            <p>Formation professionnelle, accompagnement personnalisé et taux de réussite exceptionnel de 98%</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToSection('carousel-section')}>
                Explorer la galerie
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('contact')}>
                Contactez-nous
              </button>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-trend">{stat.trend}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CAROUSEL SECTION - PARCOURS DE FORMATION */}
      <section id="carousel-section" className="carousel-section">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Notre Méthode</span>
          <h2>Parcours de <span className="gradient-text">Formation Complet</span></h2>
          <p>Un accompagnement structuré pour votre réussite au permis de conduire</p>
        </div>

        <div className="carousel-wrapper">
          <button className="arrow left" onClick={scrollLeft} aria-label="Précédent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="carousel" ref={scrollRef}>
            {carouselImages.map((image, index) => (
              <div className="carousel-card" key={image.id} data-aos="fade-up" data-aos-delay={index * 150}>
                <div className="card-image-wrapper" onClick={() => openLightbox(image)}>
                  <img 
                    src={image.src} 
                    alt={carouselData[index]?.title || `Étape ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <div className="card-icon" style={{ backgroundColor: carouselData[index]?.color }}>
                      {carouselData[index]?.icon}
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{carouselData[index]?.title}</h3>
                  <p>{carouselData[index]?.description}</p>
                  <div className="card-meta">
                    <span className="duration">⏱️ {carouselData[index]?.duration}</span>
                    <span className="step-number">Étape {index + 1}/6</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="arrow right" onClick={scrollRight} aria-label="Suivant">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* AUTO ECOLE SECTION - ENTREPRISE */}
      <section className="section entreprise-section">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Notre Établissement</span>
          <h2>Auto-École <span className="gradient-text">Moderne & Professionnelle</span></h2>
          <p>Des infrastructures de qualité pour une formation optimale</p>
        </div>

        {/* Features Grid */}
        <div className="features-grid" data-aos="fade-up">
          {entrepriseFeatures.map((feature, index) => (
            <div className="feature-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Images Grid */}
        <div className="grid grid-4" data-aos="fade-up">
          {entrepriseImages.map((image, index) => (
            <div 
              className="card entreprise-card" 
              key={image.id} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              onClick={() => openLightbox(image)}
            >
              <div className="card-image-wrapper">
                <img src={image.src} alt={`Auto-école ${index + 1}`} loading="lazy" />
                <div className="card-hover-effect">
                  <div className="hover-content">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
                    </svg>
                    <span>Agrandir</span>
                  </div>
                </div>
              </div>
              <div className="card-info">
                <h4>Espace {index === 0 ? "Accueil" : index === 1 ? "Formation" : index === 2 ? "Pratique" : "Simulation"}</h4>
                <p>Équipement professionnel</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REUSSITES SECTION - SUCCESS STORIES */}
      <section className="section reussite-section section-light">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Nos Félicitations</span>
          <h2>Nos <span className="gradient-text">Réussites</span></h2>
          <p>Découvrez nos élèves qui ont obtenu leur permis avec succès</p>
        </div>

        {/* Success Stats */}
        <div className="success-stats" data-aos="fade-up">
          <div className="success-stat-item">
            <div className="success-stat-number">98%</div>
            <div className="success-stat-label">Taux de réussite</div>
          </div>
          <div className="success-stat-item">
            <div className="success-stat-number">1500+</div>
            <div className="success-stat-label">Élèves diplômés</div>
          </div>
          <div className="success-stat-item">
            <div className="success-stat-number">4.9/5</div>
            <div className="success-stat-label">Satisfaction</div>
          </div>
        </div>

        {/* Images Grid with Success Stories */}
        <div className="grid grid-3">
          {reussiteImages.map((image, index) => (
            <div 
              className="success-card" 
              key={image.id}
              data-aos="flip-up" 
              data-aos-delay={index * 100}
              onClick={() => openLightbox(image)}
            >
              <div className="success-image-wrapper">
                <img src={image.src} alt={`Élève ${index + 1}`} loading="lazy" />
                <div className="success-badge">
                  <span>🏆</span>
                </div>
                {index < successStories.length && (
                  <div className="success-quote">{successStories[index].quote}</div>
                )}
              </div>
              <div className="success-content">
                {index < successStories.length ? (
                  <>
                    <h4>{successStories[index].name}</h4>
                    <p>{successStories[index].result}</p>
                    <div className="success-footer">
                      <span className="success-date">{successStories[index].date}</span>
                      <span className="success-icon">🎉</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h4>Élève Diplômé</h4>
                    <p>Permis B obtenu avec succès</p>
                    <div className="success-footer">
                      <span className="success-date">Félicitations !</span>
                      <span className="success-icon">🎉</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Success Banner */}
        <div className="success-banner" data-aos="fade-up">
          <div className="banner-content">
            <span className="banner-icon">🎓</span>
            <h3>Rejoignez nos élèves qui ont réussi !</h3>
            <p>Inscrivez-vous dès maintenant et bénéficiez de notre expertise</p>
            <button className="btn-primary" onClick={() => scrollToSection('contact')}>
              Commencer votre formation
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="section">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Avis Clients</span>
          <h2>Ce que disent <span className="gradient-text">Nos Élèves</span></h2>
          <p>Des retours authentiques sur notre formation</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              className="testimonial-card" 
              key={testimonial.id}
              data-aos="zoom-in" 
              data-aos-delay={index * 150}
            >
              <div className="testimonial-header">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
                <div className="quote-icon">"</div>
              </div>
              <div className="testimonial-content">
                <p>{testimonial.text}</p>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <div className="testimonial-date">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section" id="contact">
        <div className="cta-container" data-aos="zoom-in">
          <h2>Prêt à obtenir votre permis ?</h2>
          <p>Rejoignez nos 1500+ élèves satisfaits et commencez votre formation dès aujourd'hui</p>
          <button
  className="btn-primary btn-large"
  onClick={() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }}
>
  Contactez-nous maintenant
</button>
        </div>
      </section>
    </div>
  );
}

export default Gallery;