// Modules
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row, Modal, Stack, Form, Alert } from "react-bootstrap";
// Components
import BuildForm from "./components/BuildForm";
import BuildRow from "./components/BuildRow";

export default function BuildPage() {
  axios.defaults.withCredentials = true;
  const [builds, setBuilds] = useState();
  const [fields, setFields] = useState([]);
  const [edit, setEdit] = useState({ isEditing: false, build: "" });
  const [viewMode, setViewMode] = useState("Builds");
  const [localOnly, setLocalOnly] = useState(false);
  var buildList;

  function getBuilds() {
    axios.post(`${import.meta.env.VITE_API_ADDRESS}/builds/${viewMode}/${localOnly}`, JSON.parse(localStorage.getItem('localBuilds')))
      .then((res) => {
        setBuilds(res.data);
      })
      .catch((err) => {
        setBuilds("API_ERROR");
      });
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/builds/fields`)
      .then((res) => {
        setFields(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getBuilds();
  }, [viewMode, localOnly])

  if (builds === undefined) {
    buildList = (
      <Container className="build-row justify-content-center">
        <div className="loader" />
        <p className="text-center" style={{padding: "0 50px"}}>First time loading may take a few minutes because this site is current hosted freely and must wake up the server after inactivity.</p>
      </Container>
    );
  } else if (builds === "API_ERROR") {
    buildList = (
      <Container className="build-row">
        <Alert variant="danger" className="text-center mt-3 mb-3">Connection Error</Alert>
      </Container>
    );
  } else {
    switch (viewMode) {
      case "Builds":
        buildList = (
          <Container className="build-row">
            <Row className="justify-content-center">
              <Col xs={9} className="build-col"><strong>Character</strong></Col>
              <Col xs={3} className="build-col text-center"><strong>Actions</strong></Col>
              <Col xs={12} md={3} className="build-col text-center"><strong>Relic(s)</strong></Col>
              <Col xs={12} md={2} className="build-col text-center"><strong>Ornament</strong></Col>
              <Col xs={3} md className="build-col text-center"><strong>Body</strong></Col>
              <Col xs={3} md className="build-col text-center"><strong>Feet</strong></Col>
              <Col xs={3} md className="build-col text-center"><strong>Sphere</strong></Col>
              <Col xs={3} md className="build-col text-center"><strong>Rope</strong></Col>
              <Col xs={12} md={2} className="build-col text-center"><strong>Substats</strong></Col>
            </Row>
            {builds.map((build, k) =>
              <BuildRow
                build={build}
                key={k}
                getBuilds={getBuilds}
                setEdit={setEdit}
                viewMode={viewMode}
              />
            )}
          </Container>
        );
        break;
      case "Relics":
        buildList = builds.map((obj, ok) => {
          return (
            <div key={ok}>
              <h4>{obj.zone.name}</h4>
              <Container className="build-row justify-content-center">
                <Row>
                  <Col xs={9} md={3} className="build-col"><strong>Character</strong></Col>
                  <Col xs={3} md={{ span: 2, order: 1 }} className="build-col text-center"><strong>Actions</strong></Col>
                  <Col xs={3} md={2} className="build-col text-center"><strong>Body</strong></Col>
                  <Col xs={3} md={2} className="build-col text-center"><strong>Feet</strong></Col>
                  <Col xs={6} md={3} className="build-col text-center"><strong>Substats</strong></Col>
                </Row>
                {
                  obj.relics.map((relic, rk) => {
                    return (
                      <React.Fragment key={rk}>
                        <Row>
                          <Col className="build-col" key={rk}><strong>{relic.relic.name}</strong></Col>
                        </Row>
                        {relic.builds.map((build, bk) =>
                          <BuildRow
                            build={build}
                            key={bk}
                            getBuilds={getBuilds}
                            setEdit={setEdit}
                            viewMode={viewMode}
                            relicID={relic.relic._id}
                          />
                        )}
                      </React.Fragment>
                    );
                  })
                }
              </Container>
              <br />
            </div>
          )
        });
        break;
      case "Ornaments":
        buildList = builds.map((obj, ok) => {
          return (
            <div key={ok}>
              <h4>{obj.zone.name}</h4>
              <Container className="build-row justify-content-center">
                <Row>
                  <Col xs={9} md={3} className="build-col"><strong>Character</strong></Col>
                  <Col xs={3} md={{ span: 2, order: 1 }} className="build-col text-center"><strong>Actions</strong></Col>
                  <Col xs={3} md={2} className="build-col text-center"><strong>Sphere</strong></Col>
                  <Col xs={3} md={2} className="build-col text-center"><strong>Rope</strong></Col>
                  <Col xs={6} md={3} className="build-col text-center"><strong>Substats</strong></Col>
                </Row>
                {
                  obj.ornaments.map((ornament, rk) => {
                    return (
                      <React.Fragment key={rk}>
                        <Row>
                          <Col className="build-col" key={rk}><strong>{ornament.ornament.name}</strong></Col>
                        </Row>
                        {ornament.builds.map((build, bk) =>
                          <BuildRow
                            build={build}
                            key={bk}
                            getBuilds={getBuilds}
                            setEdit={setEdit}
                            viewMode={viewMode}
                          />
                        )}
                      </React.Fragment>
                    );
                  })
                }
              </Container>
              <br />
            </div>
          )
        });
        break;
    }
  }

  return (
    <>
      <h1 className="page-title">Add Build</h1>
      <BuildForm
        fields={fields}
        getBuilds={getBuilds}
        edit={edit}
        setEdit={setEdit}
        viewMode={viewMode}
      />
      <br />
      <ButtonGroup className="w-100">
        <Button
          variant="outline-secondary"
          onClick={e => { setBuilds(); setViewMode("Builds") }}
          active={viewMode === "Builds"}
        >Builds</Button>
        <Button
          variant="outline-secondary"
          onClick={e => { setBuilds(); setViewMode("Relics") }}
          active={viewMode === "Relics"}
        >Relics</Button>
        <Button
          variant="outline-secondary"
          onClick={e => { setBuilds(); setViewMode("Ornaments") }}
          active={viewMode === "Ornaments"}
        >Ornaments</Button>
      </ButtonGroup>
      <Stack direction="horizontal">
        <h1 className="page-title">{viewMode}</h1>
        <Form.Check
          className="ms-auto"
          type="checkbox"
          label="Local Builds Only"
          checked={localOnly}
          onChange={() => setLocalOnly(!localOnly)}
          reverse
        />
      </Stack>
      {buildList}
    </>
  )
}