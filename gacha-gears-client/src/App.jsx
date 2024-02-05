// Modules
import { useEffect, useState } from 'react';
import { BrowserRouter, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Cookies from 'universal-cookie';

// Components
import MainNav from './components/MainNav';
import Router from './components/Router';
import Footer from './components/Footer'

// Assets
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './App.css';
import axios from 'axios';

function App() {
  axios.defaults.withCredentials = true;
  const cookies = new Cookies(null, { path: '/' });
  const [publicToken, setPublicToken] = useState(cookies.get('public-token'));

  useEffect(() => {
    if (localStorage.getItem('localBuilds')) {
      localStorage.setItem('LB_HSR', localStorage.getItem('localBuilds'));
      localStorage.removeItem('localBuilds');
    }
  }, []);

  function handleLogout() {
    axios.post(`${import.meta.env.VITE_API_ADDRESS}/users/logout`)
      .then(setPublicToken(false));
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <MainNav username={publicToken} handleLogout={handleLogout} game="Honkai: Star Rail" />
        <Container className="pb-3">
          <Router username={publicToken} setPublicToken={setPublicToken} />
        </Container>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
