// Modules
import { useState } from 'react';
import { BrowserRouter, Outlet } from 'react-router-dom';
import { Container, Modal } from 'react-bootstrap';
import Cookies from 'universal-cookie';

// Components
import MainNav from './components/MainNav';
import Router from './components/Router';

// Assets
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './App.css';
import axios from 'axios';

function App() {
  axios.defaults.withCredentials = true;
  const cookies = new Cookies(null, { path: '/' });
  const [publicToken, setPublicToken] = useState(cookies.get('public-token'));
  const [showModal, setShowModal] = useState((!sessionStorage.getItem("session") ? true : false));

  function handleModal() {
    !sessionStorage.setItem("session", "session");
    setShowModal(false);
  }

  function handleLogout() {
    axios.post(`${import.meta.env.VITE_API_ADDRESS}/users/logout`)
      .then(setPublicToken(false));
  }

  return (
    <BrowserRouter>
      <MainNav username={publicToken} handleLogout={handleLogout} />
      <Container>
        <Router username={publicToken} setPublicToken={setPublicToken} /><Outlet context={[setPublicToken]}/>
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
