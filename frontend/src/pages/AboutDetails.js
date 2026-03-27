import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function AboutDetails() {

  const navigate = useNavigate();

  return (
    <div className="container py-5">

      {/* BTN RETOUR */}
      

      {/* TITLE */}
      <div className="text-center mb-5">
        <h1>Auto-École Narjiss</h1>
        <p className="lead">
          Votre partenaire de confiance pour réussir votre permis de conduire
        </p>
      </div>

      {/* HISTOIRE */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-6">
          <img
            src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
            className="img-fluid rounded shadow"
            alt=""
          />
        </div>
        <div className="col-md-6">
          <h3>Notre histoire</h3>
          <p>
            Fondée il y a plus de 10 ans, l’Auto-École Narjiss s’est imposée
            comme une référence dans la formation à la conduite.
          </p>
          <p>
            Grâce à notre expérience et notre passion pour l’enseignement,
            nous avons accompagné des centaines de candidats vers la réussite.
          </p>
        </div>
      </div>

      {/* MISSION */}
      <div className="row mb-5 align-items-center flex-md-row-reverse">
        <div className="col-md-6">
          <img
            src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc"
            className="img-fluid rounded shadow"
            alt=""
          />
        </div>
        <div className="col-md-6">
          <h3>Notre mission</h3>
          <p>
            Notre mission est de former des conducteurs responsables,
            autonomes et respectueux du code de la route.
          </p>
          <p>
            Nous utilisons des méthodes pédagogiques modernes pour garantir
            une formation efficace et rapide.
          </p>
        </div>
      </div>

      {/* FORMATIONS */}
      <div className="mb-5">
        <h3 className="text-center mb-4">Nos formations</h3>

        <div className="row text-center">

          <div className="col-md-3">
            <div className="card p-3 shadow">
              <h5>Permis B</h5>
              <p>Formation complète pour la conduite automobile.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 shadow">
              <h5>Code de la route</h5>
              <p>Cours théoriques avec tests et examens blancs.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 shadow">
              <h5>Conduite accompagnée</h5>
              <p>Apprentissage progressif avec accompagnement.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 shadow">
              <h5>Stages intensifs</h5>
              <p>Formation rapide pour obtenir votre permis.</p>
            </div>
          </div>

        </div>
      </div>

      {/* AVANTAGES */}
      <div className="mb-5">
        <h3 className="text-center mb-4">Pourquoi nous choisir ?</h3>

        <div className="row text-center">

          <div className="col-md-4">
            <h5>👨‍🏫 Moniteurs qualifiés</h5>
            <p>Des formateurs expérimentés et certifiés.</p>
          </div>

          <div className="col-md-4">
            <h5>🚗 Véhicules modernes</h5>
            <p>Des voitures récentes pour un apprentissage optimal.</p>
          </div>

          <div className="col-md-4">
            <h5>📈 Taux de réussite élevé</h5>
            <p>Plus de 95% de réussite grâce à notre méthode.</p>
          </div>

        </div>
      </div>

      {/* PROCESS */}
      <div className="mb-5">
        <h3 className="text-center mb-4">Comment ça marche ?</h3>

        <div className="row text-center">

          <div className="col-md-3">
            <h5>1️⃣ Inscription</h5>
            <p>Créez votre compte en ligne facilement.</p>
          </div>

          <div className="col-md-3">
            <h5>2️⃣ Formation</h5>
            <p>Suivez les cours de code et de conduite.</p>
          </div>

          <div className="col-md-3">
            <h5>3️⃣ Examen</h5>
            <p>Préparez-vous avec nos examens blancs.</p>
          </div>

          <div className="col-md-3">
            <h5>4️⃣ Réussite</h5>
            <p>Obtenez votre permis avec confiance.</p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-5">
        <h3>Prêt à commencer ?</h3>
        <p>Rejoignez-nous dès aujourd’hui et démarrez votre formation.</p>

        <button onClick={() => navigate("/reservation")}  className="custom-btn">
          S’inscrire maintenant
        </button>
      </div>
      <button 
        className="custom-btn mb-4"
        onClick={() => navigate("/")}
      >
        ← Retour
      </button>

    </div>
  );
}

export default AboutDetails;