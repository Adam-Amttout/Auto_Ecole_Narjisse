import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Faq.css";
import { Carousel, Card, Container } from "react-bootstrap";

const API = "http://127.0.0.1:8000/api";

function Faq() {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/faq`)
      .then(res => setFaqData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="faq-section mt-5 text-center">
        <div className="faq-loading">Chargement des questions…</div>
      </Container>
    );
  }

  return (
    <Container className="faq-section mt-5">
      <h2 className="text-center mb-4">Questions fréquentes</h2>

      {faqData.length === 0 ? (
        <p className="text-center text-muted">Aucune question disponible pour le moment.</p>
      ) : (
        <Carousel indicators={false} controls={true} interval={3000} pause={false}>
          {faqData.map((item) => (
            <Carousel.Item key={item.id}>
              <div className="d-flex justify-content-center">
                <Card className="faq-card shadow">
                  {item.image && (
                    <Card.Img
                      variant="top"
                      src={item.image}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{item.question}</Card.Title>
                    <Card.Text>{item.reponse}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
}

export default Faq;