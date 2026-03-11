import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cours.css";
import "bootstrap/dist/css/bootstrap.min.css";

import dangerImg from "../assets/images/cours/danger.png";
import indicationImg from "../assets/images/cours/indication.png";
import interdictionImg from "../assets/images/cours/interdiction.png";

function Cours() {
  const navigate = useNavigate();

  return (
    <div className="container cours-page">
      <h1 className="text-center my-5">Cours de Signalisation Routière</h1>

      <div className="row">

        {/* Danger */}
        <div className="col-md-4 mb-4">
          <div className="card cours-card shadow">
            <img src={dangerImg} className="card-img-top" alt="Panneau de danger" />
            <div className="card-body">
              <h5 className="card-title">Panneaux de Danger</h5>
              <p className="card-text">
                Panneaux indiquant un danger imminent sur la route.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/cours/danger")}>
                Lire plus
              </button>
            </div>
          </div>
        </div>

        {/* Indication */}
        <div className="col-md-4 mb-4">
          <div className="card cours-card shadow">
            <img src={indicationImg} className="card-img-top" alt="Panneau d’indication" />
            <div className="card-body">
              <h5 className="card-title">Panneaux d’Indication</h5>
              <p className="card-text">
                Panneaux fournissant des informations utiles (direction, services…).
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/cours/2")}>
                Lire plus
              </button>
            </div>
          </div>
        </div>

        {/* Interdiction */}
        <div className="col-md-4 mb-4">
          <div className="card cours-card shadow">
            <img src={interdictionImg} className="card-img-top" alt="Panneau d’interdiction" />
            <div className="card-body">
              <h5 className="card-title">Panneaux d’Interdiction</h5>
              <p className="card-text">
                Panneaux indiquant ce qui est interdit (accès, circulation…).
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/cours/3")}>
                Lire plus
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cours;