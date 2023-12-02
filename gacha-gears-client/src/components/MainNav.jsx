// Modules
import { useState } from 'react';
import { Container, Navbar, Offcanvas, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// Assets
import ggoLogo from '/ggo.svg'

export default function MainNav() {
  const [showOffcanvas, setShowOffcanvass] = useState(false);

  const devNav = (
    <>
      <Navbar.Toggle onClick={() => setShowOffcanvass(true)} />
      <Navbar.Offcanvas id="admin-nav" placement="end" show={showOffcanvas}>
        <Offcanvas.Header closeButton onClick={() => setShowOffcanvass(false)}>
          <Offcanvas.Title id="admin-nav">
            Admin Navigation
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="justify-content-end flex-grow-1 pe-3" onClick={() => setShowOffcanvass(false)}>
            <LinkContainer to="/">
              <Nav.Link>Builds</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/characters">
              <Nav.Link>Characters</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/zones">
              <Nav.Link>Zones</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/relics">
              <Nav.Link>Relics</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/ornaments">
              <Nav.Link>Ornaments</Nav.Link>
            </LinkContainer>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );

  return (
    <Navbar key={false} expand={false} className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img src={ggoLogo} className="logo d-inline-block align-top" alt="Vite logo" />
          {' '}GachaGears.online
        </Navbar.Brand>
        {import.meta.env.DEV ? devNav : <></>}
      </Container>
    </Navbar>
  );
}