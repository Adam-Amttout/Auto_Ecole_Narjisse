import React from "react";
import { useNavigate } from "react-router-dom";
import "./DangerDetail.css";
import img1 from "../assets/images/dangerDetail/img1.png";

function DangerDetail() {
  const navigate = useNavigate();

  return (
    <div className="container danger-detail-page my-5">
      <h2 className="text-center mb-4">Panneaux de Danger</h2>

      <div className="row g-3">
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video1")}>
            <img src={img1} alt="Danger 1" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video2")}>
            <img src="https://via.placeholder.com/150" alt="Danger 2" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video3")}>
            <img src="https://via.placeholder.com/150" alt="Danger 3" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video4")}>
            <img src="https://via.placeholder.com/150" alt="Danger 4" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video5")}>
            <img src="https://via.placeholder.com/150" alt="Danger 5" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video6")}>
            <img src="https://via.placeholder.com/150" alt="Danger 6" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video7")}>
            <img src="https://via.placeholder.com/150" alt="Danger 7" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video8")}>
            <img src="https://via.placeholder.com/150" alt="Danger 8" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video9")}>
            <img src="https://via.placeholder.com/150" alt="Danger 9" className="danger-img" />
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="danger-card" onClick={() => navigate("/video10")}>
            <img src="https://via.placeholder.com/150" alt="Danger 10" className="danger-img" />
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>
    </div>
  );
}

export default DangerDetail;