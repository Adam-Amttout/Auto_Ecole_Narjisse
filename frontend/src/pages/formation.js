    import React from "react";
    import "./formation.css";
    import { useNavigate } from "react-router-dom";

    function Formation() {
    const navigate = useNavigate();
    const formations = [
        {
        type: "Permis A",
        desc: "Permis moto pour débutants et professionnels avec accompagnement complet.",
        hours: "20h conduite",
        img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"
        },
        {
        type: "Permis B",
        desc: "Formation complète pour voiture avec moniteurs expérimentés.",
        hours: "25h conduite",
        img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
        },
        {
        type: "Permis C",
        desc: "Permis poids lourd avec formation intensive et pratique.",
        hours: "30h conduite",
        img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c"
        },
        {
        type: "Permis D",
        desc: "Formation pour transport de voyageurs (bus).",
        hours: "35h conduite",
        img: "https://images.unsplash.com/photo-1502877338535-766e1452684a"
        },
        {
        type: "Permis EC",
        desc: "Permis remorque et transport lourd avancé.",
        hours: "40h conduite",
        img: "https://images.unsplash.com/photo-1493238792000-8113da705763"
        },
        {
        type: "Code + Conduite",
        desc: "Formation complète code + conduite avec suivi personnalisé.",
        hours: "Illimité + 25h",
        img: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e"
        }
    ];

    return (
        <div className="formation-page">
        <h2 className="title">Nos Formations</h2>
        <p className="subtitle">
            Découvrez tous nos types de permis avec un accompagnement professionnel.
        </p>

        <div className="formation-container">
            {formations.map((item, index) => (
            <div className="formation-card" key={index}>
                <div className="card-img">
                <img src={item.img} alt={item.type} />
                </div>

                <div className="card-content">
                <h3>{item.type}</h3>
                <p>{item.desc}</p>

                <div className="info">
                    <span>⏱ {item.hours}</span>
                </div>

                <button
                    onClick={() => navigate("/reservation")}
                    className="btn-info"
                >
                    Plus d'information
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }

    export default Formation;