import React, { useState } from "react";
import "./Cours.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Cours() {

  const coursData = [
    {
      id: 1,
      title: "Les panneaux de signalisation",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
      description: "Apprenez les différents panneaux de circulation et leur signification.",
      content:
        "Les panneaux de signalisation sont essentiels pour guider les conducteurs. Ils se divisent en trois catégories : panneaux de danger, panneaux d'interdiction et panneaux d'indication."
    },
    {
      id: 2,
      title: "Les règles de priorité",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      description: "Comprendre les règles de priorité aux intersections.",
      content:
        "La priorité à droite est une règle fondamentale. Dans certaines situations, les panneaux ou feux de signalisation indiquent une priorité différente."
    },
    {
      id: 3,
      title: "Les limitations de vitesse",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      description: "Connaître les vitesses autorisées selon les routes.",
      content:
        "Les limitations varient selon le type de route : en ville, sur route nationale ou autoroute. Respecter la vitesse réduit les risques d'accidents."
    },
    {
      id: 4,
      title: "Les distances de sécurité",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
      description: "Maintenir une distance suffisante entre les véhicules.",
      content:
        "La distance de sécurité dépend de la vitesse et des conditions de circulation. Une règle simple est de garder au moins deux secondes d'écart."
    },
    {
      id: 5,
      title: "Les feux de circulation",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      description: "Comprendre les feux rouges, orange et verts.",
      content:
        "Le feu rouge signifie arrêt obligatoire, le feu orange indique de ralentir et le feu vert autorise le passage."
    },
    {
      id: 6,
      title: "Le stationnement",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      description: "Les règles à respecter pour se garer.",
      content:
        "Il est interdit de stationner sur les passages piétons, devant les sorties de garage ou dans les zones interdites."
    }
  ];

  const [selectedCours, setSelectedCours] = useState(null);

  return (
    <div className="container cours-page">

      <h1 className="text-center my-5">Cours de Code de la Route</h1>

      <div className="row">

        {coursData.map((cours) => (

          <div className="col-md-4 mb-4" key={cours.id}>

            <div className="card cours-card shadow">

              <img src={cours.image} className="card-img-top" alt={cours.title} />

              <div className="card-body">

                <h5 className="card-title">{cours.title}</h5>

                <p className="card-text">{cours.description}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedCours(cours)}
                >
                  Lire le cours
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {selectedCours && (

        <div className="cours-detail mt-5 p-4 shadow">

          <h3>{selectedCours.title}</h3>

          <p>{selectedCours.content}</p>

          <button
            className="btn btn-danger"
            onClick={() => setSelectedCours(null)}
          >
            Fermer
          </button>

        </div>

      )}

    </div>
  );
}

export default Cours;