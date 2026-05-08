import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Row, Col, Card, Table,
  Button, Modal, Form, Navbar, Nav
} from "react-bootstrap";
import "./Dashboard.css";

function Dashboard() {

  const [clients, setClients] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);

  const [showClientModal, setShowClientModal] = useState(false);
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);

  const [clientData, setClientData] = useState({
    nom: "", prenom: "", email: "", password: "", role: "user"
  });

  const [inscriptionData, setInscriptionData] = useState({
    nom: "", prenom: "", email: "", telephone: "", sujet: "", message: ""
  });

  const [editingClient, setEditingClient] = useState(null);
  const [editingInscription, setEditingInscription] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchInscriptions();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/clients");
    setClients(res.data);
  };

  const fetchInscriptions = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/inscriptions");
    setInscriptions(res.data);
  };

  const saveClient = async () => {
    if (editingClient) {
      await axios.put(`http://127.0.0.1:8000/api/clients/${editingClient.id}`, clientData);
    } else {
      await axios.post("http://127.0.0.1:8000/api/clients", clientData);
    }

    resetClientForm();
    fetchClients();
  };

  const deleteClient = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/clients/${id}`);
    fetchClients();
  };

  const editClient = (c) => {
    setEditingClient(c);
    setClientData({
      nom: c.nom,
      prenom: c.prenom,
      email: c.email,
      password: "",
      role: c.role
    });
    setShowClientModal(true);
  };

  const saveInscription = async () => {
    if (editingInscription) {
      await axios.put(`http://127.0.0.1:8000/api/inscriptions/${editingInscription.id}`, inscriptionData);
    } else {
      await axios.post("http://127.0.0.1:8000/api/inscription", inscriptionData);
    }

    resetInscriptionForm();
    fetchInscriptions();
  };

  const deleteInscription = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/inscriptions/${id}`);
    fetchInscriptions();
  };

  const editInscription = (i) => {
    setEditingInscription(i);
    setInscriptionData({
      nom: i.nom,
      prenom: i.prenom,
      email: i.email,
      telephone: i.telephone,
      sujet: i.sujet,
      message: i.message
    });
    setShowInscriptionModal(true);
  };

  const resetClientForm = () => {
    setShowClientModal(false);
    setEditingClient(null);
    setClientData({ nom:"", prenom:"", email:"", password:"", role:"user" });
  };

  const resetInscriptionForm = () => {
    setShowInscriptionModal(false);
    setEditingInscription(null);
    setInscriptionData({ nom:"", prenom:"", email:"", telephone:"", sujet:"", message:"" });
  };

  return (
    <div className="dashboard">

      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Button size="sm" className="me-2" onClick={() => setShowClientModal(true)}>+ Client</Button>
              <Button size="sm" onClick={() => setShowInscriptionModal(true)}>+ Inscription</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">

        <Row className="g-3 mb-4">
          <Col xs={12} md={6}>
            <Card className="text-center shadow-sm stat-card">
              <Card.Body>
                <h3>{clients.length}</h3>
                <p>Clients</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="text-center shadow-sm stat-card">
              <Card.Body>
                <h3>{inscriptions.length}</h3>
                <p>Inscriptions</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5>Clients</h5>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nom} {c.prenom}</td>
                      <td>{c.email}</td>
                      <td>
                        <span className={c.role === "admin" ? "badge-admin" : "badge-user"}>
                          {c.role}
                        </span>
                      </td>
                      <td>
                        <Button size="sm" className="btn-edit" onClick={() => editClient(c)}>Edit</Button>
                        <Button size="sm" className="btn-delete" onClick={() => deleteClient(c.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <h5>Inscriptions</h5>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Sujet</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map((i) => (
                    <tr key={i.id}>
                      <td>{i.id}</td>
                      <td>{i.nom} {i.prenom}</td>
                      <td>{i.email}</td>
                      <td>{i.sujet}</td>
                      <td>
                        <Button size="sm" className="btn-edit" onClick={() => editInscription(i)}>Edit</Button>
                        <Button size="sm" className="btn-delete" onClick={() => deleteInscription(i.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

      </Container>

      {/* CLIENT MODAL */}
      <Modal show={showClientModal} onHide={resetClientForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingClient ? "Edit Client" : "Add Client"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control value={clientData.nom} placeholder="Nom" onChange={(e)=>setClientData({...clientData,nom:e.target.value})}/>
            <Form.Control value={clientData.prenom} className="mt-2" placeholder="Prenom" onChange={(e)=>setClientData({...clientData,prenom:e.target.value})}/>
            <Form.Control value={clientData.email} className="mt-2" placeholder="Email" onChange={(e)=>setClientData({...clientData,email:e.target.value})}/>
            <Form.Control value={clientData.password} className="mt-2" placeholder="Password" onChange={(e)=>setClientData({...clientData,password:e.target.value})}/>
            <Form.Select value={clientData.role} className="mt-2" onChange={(e)=>setClientData({...clientData,role:e.target.value})}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveClient}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* INSCRIPTION MODAL */}
      <Modal show={showInscriptionModal} onHide={resetInscriptionForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingInscription ? "Edit Inscription" : "Add Inscription"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control value={inscriptionData.nom} placeholder="Nom" onChange={(e)=>setInscriptionData({...inscriptionData,nom:e.target.value})}/>
            <Form.Control value={inscriptionData.prenom} className="mt-2" placeholder="Prenom" onChange={(e)=>setInscriptionData({...inscriptionData,prenom:e.target.value})}/>
            <Form.Control value={inscriptionData.email} className="mt-2" placeholder="Email" onChange={(e)=>setInscriptionData({...inscriptionData,email:e.target.value})}/>
            <Form.Control value={inscriptionData.sujet} className="mt-2" placeholder="Sujet" onChange={(e)=>setInscriptionData({...inscriptionData,sujet:e.target.value})}/>
            <Form.Control value={inscriptionData.message} className="mt-2" placeholder="Message" onChange={(e)=>setInscriptionData({...inscriptionData,message:e.target.value})}/>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveInscription}>Save</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Dashboard;