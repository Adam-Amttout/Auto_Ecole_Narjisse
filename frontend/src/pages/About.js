import React from "react";
import "./About.css";
import "bootstrap/dist/css/bootstrap.min.css";

function About() {

  const team = [
    {
      name: "Ahmed Benali",
      role: "Directeur",
      img: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1"
    },
    {
      name: "Sara El Idrissi",
      role: "Monitrice",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
    },
    {
      name: "Youssef Amrani",
      role: "Moniteur",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    }
  ];

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero text-center text-white d-flex align-items-center">
        <div className="container">
          <h1>À propos de notre Auto-École</h1>
          <p>
            Depuis plusieurs années, Auto-École Narjiss accompagne les
            candidats vers la réussite du permis de conduire.
          </p>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="container about-section">
        <div className="row align-items-center">

          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
              alt="auto ecole"
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6">
            <h2>Qui sommes-nous ?</h2>
            <p>
              Auto-École Narjiss est spécialisée dans la formation à la
              conduite. Notre objectif est d'offrir une formation de qualité
              avec des méthodes modernes et un accompagnement personnalisé.
            </p>

            <p>
              Nos moniteurs expérimentés accompagnent chaque élève pour
              développer les compétences nécessaires à une conduite sûre et
              responsable.
            </p>

            <button className="btn btn-primary">
              En savoir plus
            </button>
          </div>

        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats-section text-center">
        <div className="container">
          <div className="row">

            <div className="col-md-3">
              <h3>500+</h3>
              <p>Candidats formés</p>
            </div>

            <div className="col-md-3">
              <h3>95%</h3>
              <p>Taux de réussite</p>
            </div>

            <div className="col-md-3">
              <h3>10+</h3>
              <p>Années d'expérience</p>
            </div>

            <div className="col-md-3">
              <h3>8</h3>
              <p>Moniteurs certifiés</p>
            </div>

          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="container team-section">
        <h2 className="text-center mb-5">Notre Équipe</h2>

        <div className="row">
          {team.map((member, index) => (
            <div className="col-md-4" key={index}>
              <div className="card team-card shadow">
                <img src={member.img} className="card-img-top" alt={member.name} />
                <div className="card-body text-center">
                  <h5>{member.name}</h5>
                  <p>{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}

export default About;