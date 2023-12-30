// Modules
import { useState } from 'react';
import { Container, Navbar, Offcanvas, Nav, Button, Stack, Modal, Form, FormGroup, InputGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import zlib from 'react-zlib-js'
import Buffer from 'react-zlib-js/buffer';

// Assets
import ggoLogo from '/ggo.svg'
import ggoWide from '/ggo-wide.svg'

export default function MainNav(props) {
  const [showOffcanvas, setShowOffcanvass] = useState(false);
  const [showModal, setShowModal] = useState((!sessionStorage.getItem("session") ? true : false));
  const [isCopied, setIsCopied] = useState(false);
  const [restoreError, setRestoreError] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [restoreCode, setRestoreCode] = useState("");

  function handleModal() {
    setShowModal(false);
    !sessionStorage.setItem("session", "session");
    setIsCopied(false);
    setRestoreError(false);
    setRestoreCode("");
  }

  function getBackupCode() {
    if (!localStorage.getItem('LB_HSR')) localStorage.setItem('LB_HSR', '[]')
    const res = zlib.gzipSync(localStorage.getItem('LB_HSR'));
    setBackupCode(res.toString('hex'));
  }

  function restoreLocalData() {
    try {
      const res = zlib.gunzipSync(Buffer(restoreCode, 'hex')).toString();
      setShowModal(false);
      localStorage.setItem('LB_HSR', res);
      setRestoreCode("");
      window.location.reload();
    } catch(e) {
      setRestoreError(true);
    }
  }

  const devNav = (
    <>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setShowOffcanvass(true)}
      >
        <i className="bi bi-list" />
      </Button>
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
            <hr />
            <Button variant='outline-danger' onClick={props.handleLogout}>Logout</Button>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );

  const modalSiteInfo = (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Site Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>This site stores builds you add, locally to your device.
        <hr />
        The (Site Builds) are just general suggestion and may not be the most optimized builds.
      </Modal.Body>
    </>
  )

  const modalBackupInfo = (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Backup/Restore Local Storage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <h5>Backup</h5>
          <FormGroup>
            <Form.Label>Backup Data Code (Current Builds)</Form.Label>
            <InputGroup>
              <Form.Control type='text' value={backupCode} readOnly />
              <Button
                variant="outline-secondary"
                style={{ width: "80px" }}
                onClick={() => {
                  navigator.clipboard.writeText(backupCode)
                    .then(() => { setIsCopied(true) })
                    .catch(() => { setIsCopied(false) })
                }}
              >{isCopied ? "Copied" : "Copy"}</Button>
            </InputGroup>
          </FormGroup>
        </Form>
        <hr />
        <Form>
          <h5>Restore</h5>
          <FormGroup>
            <Form.Label>Enter Backup Code</Form.Label>
            <InputGroup>
              <Form.Control type='text'
                value={restoreCode}
                onChange={(e) => setRestoreCode(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                style={{ width: "80px" }}
                onClick={() => { restoreLocalData() }}
              >{restoreError ? "Failed" : "Restore"}</Button>
            </InputGroup>
            <p className='text-end mb-0' style={{ color: "#dc3545" }}>*Will overwrite current locally saved builds</p>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
  )

  return (
    <>
      <Navbar key={false} expand={false} className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img src={ggoLogo} className="logo d-inline-block align-top" alt="GachaGears.online logo" />
            &nbsp;
            <img src={ggoWide} className="logo d-inline-block align-top" alt="GachaGears.online" />
          </Navbar.Brand>
          {props.username ? <Navbar.Text>Admin Mode</Navbar.Text> : <></>}
          <Stack direction='horizontal' gap={2}>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => { getBackupCode(); setShowModal(true) }}
            >
              <i className="bi bi-save2" />
            </Button>
            {props.username ? devNav : <></>}
          </Stack>
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={handleModal}>
        {!sessionStorage.getItem("session") ? modalSiteInfo : modalBackupInfo}
      </Modal>
    </>
  );
}