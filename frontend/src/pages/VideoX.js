import React from "react";
import { useNavigate } from "react-router-dom";
import video1 from "../assets/video/vid1.mp4";

function Video1() {
  const navigate = useNavigate();

  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">Vidéo Danger 1</h2>

      {/* Conteneur de la vidéo plus petit */}
      <div
        style={{
          display: "inline-block",
          maxWidth: "350px", // plus petit que 600px
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          margin: "0 auto"
        }}
      >
        <video
          src={video1}
          controls
          autoPlay
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        >
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>

      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>
    </div>
  );
}

export default Video1;