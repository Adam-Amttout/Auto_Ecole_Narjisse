import React from "react";
import "./Faq.css";
import { Carousel, Card, Container } from "react-bootstrap";

function Faq() {

  const faqData = [
    // {
    //   id: 1,
    //   title: "Quels documents sont nécessaires pour l'inscription ?",
    //   image: "https://images.unsplash.com/photo-1581090700227-4c4f50a2f66b",
    //   description: "Vous devez fournir une copie de la CIN, 4 photos, certificat médical et formulaire d’inscription."
    // },
    {
      id: 2,
      title: "Combien coûte la formation ?",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
      description: "Le tarif dépend de la formule choisie. Contactez-nous pour un devis personnalisé."
    },
    {
      id: 3,
      title: "Combien de temps dure la formation ?",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      description: "La durée moyenne est de 1 à 3 mois selon votre disponibilité."
    },
    // {
    //   id: 4,
    //   title: "Proposez-vous des tests en ligne ?",
    //   image: "https://images.unsplash.com/photo-1584697964154-6c1a2dba8bba",
    //   description: "Oui, des tests interactifs sont disponibles pour vous préparer à l'examen théorique."
    // },
    {
      id: 5,
      title: "Quel est le taux de réussite ?",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
      description: "Notre taux de réussite dépasse 95% grâce à un encadrement personnalisé."
    },
    {
      id: 6,
      title: "Puis-je choisir mon moniteur ?",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
      description: "Oui, selon disponibilité, vous pouvez choisir votre moniteur."
    },
    {
      id: 7,
      title: "Les cours sont-ils flexibles ?",
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
      description: "Nous proposons des horaires flexibles adaptés aux étudiants et salariés."
    },
    {
      id: 8,
      title: "Comment réserver une séance ?",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      description: "La réservation peut se faire directement à l’agence ou en ligne."
    }
  ];

  return (
    <Container className="faq-section mt-5">
      <h2 className="text-center mb-4">Questions frequentes</h2>

      <Carousel indicators={false} controls={true} interval={3000} pause={false}>
        {faqData.map((item) => (
          <Carousel.Item key={item.id}>
            <div className="d-flex justify-content-center">
              <Card className="faq-card shadow">
                <Card.Img variant="top" src={item.image} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}

export default Faq;