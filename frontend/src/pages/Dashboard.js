import React, { useState } from "react";
import "./Dashboard.css";
import { Container, Row, Col, Card, Table, ProgressBar, Badge } from "react-bootstrap";

function Dashboard() {
  // Données simulées
  const [stats] = useState({
    coursesInProgress: 5,
    upcomingTests: 3,
    reservations: 2,
    courseProgress: [
      { name: "Code de la route", progress: 70 },
      { name: "Conduite pratique", progress: 50 },
      { name: "Conduite avancée", progress: 85 },
    ],
  });

  const [recentCourses] = useState([
    { name: "Code de la route", instructor: "Mr. Khalid", date: "12/03/2026" },
    { name: "Conduite pratique", instructor: "Mme. Laila", date: "15/03/2026" },
    { name: "Conduite avancée", instructor: "Mr. Yassine", date: "18/03/2026" },
  ]);

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row>

        {/* SIDEBAR */}
        <Col md={3} style={{ background: "#002b5b", color: "white", minHeight: "100vh", padding: "30px" }}>
          <h3 style={{ marginBottom: "40px" }}>Narjiss Student</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ padding: "15px 0", cursor: "pointer" }}>Mes Cours</li>
            <li style={{ padding: "15px 0", cursor: "pointer" }}>Mes Tests</li>
            <li style={{ padding: "15px 0", cursor: "pointer" }}>Mes Réservations</li>
            <li style={{ padding: "15px 0", cursor: "pointer" }}>Mon Profil</li>
            <li style={{ padding: "15px 0", cursor: "pointer" }}>Notifications</li>
          </ul>
        </Col>

        {/* MAIN CONTENT */}
        <Col md={9} style={{ padding: "40px", background: "#f5f5f5", minHeight: "100vh" }}>
          <h2 style={{ marginBottom: "30px" }}>Bienvenue, Adam !</h2>

          {/* CARDS STATS */}
          <Row style={{ marginBottom: "30px" }}>
            <Col md={4}>
              <Card style={{ textAlign: "center", padding: "25px", borderRadius: "12px", color: "#002b5b" }} className="shadow">
                <h3>{stats.coursesInProgress}</h3>
                <p>Cours en cours</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={{ textAlign: "center", padding: "25px", borderRadius: "12px", color: "#002b5b" }} className="shadow">
                <h3>{stats.upcomingTests}</h3>
                <p>Tests à venir</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={{ textAlign: "center", padding: "25px", borderRadius: "12px", color: "#002b5b" }} className="shadow">
                <h3>{stats.reservations}</h3>
                <p>Réservations</p>
              </Card>
            </Col>
          </Row>

          {/* BARRES DE PROGRESSION */}
          <Card className="shadow" style={{ marginBottom: "30px", padding: "20px" }}>
            <h4 style={{ marginBottom: "20px" }}>Progression des cours</h4>
            {stats.courseProgress.map((course, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <p>{course.name}</p>
                <ProgressBar now={course.progress} label={`${course.progress}%`} />
              </div>
            ))}
          </Card>

          {/* TABLE DES COURS */}
          <Card className="shadow" style={{ padding: "20px" }}>
            <h4 style={{ marginBottom: "20px" }}>Mes cours récents</h4>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Moniteur</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((c, idx) => (
                  <tr key={idx}>
                    <td>{c.name}</td>
                    <td>{c.instructor}</td>
                    <td>{c.date}</td>
                    <td>
                      <Badge bg="success">En cours</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;