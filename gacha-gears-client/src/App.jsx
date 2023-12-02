// Modlues
import { useState } from 'react';
import { BrowserRouter, Outlet } from 'react-router-dom';
import { Container, Modal } from 'react-bootstrap';

// Components
import MainNav from './components/MainNav';
import Router from './components/Router';

// Assets
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState((!sessionStorage.getItem("session") ? true : false));
  function handleModal() {
    !sessionStorage.setItem("session", "session");
    setShowModal(false);
  }

  return (
    <BrowserRouter>
      <MainNav />
      <Container>
        <Router /><Outlet />
      </Container>
      <Modal show={showModal} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Site Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>This site stores builds you add, locally to your device.</Modal.Body>
      </Modal>
    </BrowserRouter>
  )
}

export default App
