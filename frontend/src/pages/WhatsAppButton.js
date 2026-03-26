import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

function WhatsAppButton() {
    return (
        <a
        href="https://wa.me/212698837698"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        >
        <FaWhatsapp className="whatsapp-icon" />
        <span className="whatsapp-text">Discutez avec nous</span>
        </a>
    );
    }

export default WhatsAppButton;