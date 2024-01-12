// Modules
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row, Stack, Alert, DropdownButton, InputGroup, Dropdown } from "react-bootstrap";
// Components
import BuildForm from "./components/BuildForm";
import BuildRow from "./components/BuildRow";

export default function BuildPage(props) {
  axios.defaults.withCredentials = true;
  const username = props.username;
  const [builds, setBuilds] = useState();
  const [fields, setFields] = useState([]);
  const [edit, setEdit] = useState({ isEditing: false, build: "" });
  const [viewMode, setViewMode] = useState("Builds");
  const [filter, setFilter] = useState("All");
  const [bsort, setBsort] = useState("Latest Build");
  const [bsortDir, setBsortDir] = useState("down");
  const [asort, setAsort] = useState("Latest Area");
  const [asortDir, setAsortDir] = useState("down");
  var buildList;

  function getBuilds() {
    console.log("test");
    // Get filter
    var reqFilter;
    switch (filter) {
      case "All": reqFilter = "all"; break;
      case "Local Builds": reqFilter = "local"; break;
      case "GachaGear Builds": reqFilter = "admin"; break;
    }
    // Get buildSort
    var reqBuildSort;
    switch (bsort) {
      case "Latest Build": reqBuildSort = "BLB"; break;
      case "Latest Character": reqBuildSort = "BLC"; break;
      case "Character Name": reqBuildSort = "BCN"; break;
      case "Character Rarity": reqBuildSort = "BCR"; break;
    }
    reqBuildSort += bsortDir[0];
    // Get areaSort
    var reqAreaSort;
    switch (asort) {
      case "Latest Area": reqAreaSort = "ALA"; break;
      case "Area Name": reqAreaSort = "AAN"; break;
    }
    reqAreaSort += asortDir[0];

    const reqObject = {
      filter: reqFilter,
      buildSort: reqBuildSort,
      view: viewMode,
      areaSort: reqAreaSort,
      localBuilds: JSON.parse(localStorage.getItem('LB_HSR')),
    }
    axios.post(`${import.meta.env.VITE_API_ADDRESS}/builds/`, reqObject)
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
  }, [viewMode, filter, bsort, bsortDir, asort, asortDir])

  if (builds === undefined) {
    buildList = (
      <Container className="build-row justify-content-center">
        <div className="loader" />
        <p className="text-center" style={{ padding: "0 50px" }}>First time loading may take a few minutes because this site is current hosted freely and must wake up the server after inactivity.</p>
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
              <Col xs={9} md={10} className="build-col"><strong>Character</strong></Col>
              <Col xs={3} md={2} className="build-col text-center"><strong>Actions</strong></Col>
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
                username={username}
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
                            username={username}
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
                            username={username}
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
        username={username}
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
      <hr className="mt-2 mb-2" />
      <Stack direction="horizontal" gap={2}>
        <div />
        <div className="ms-auto">
          <DropdownButton id="filter-dropdown" title={filter} size="sm" variant="outline-secondary" align="end">
            <Dropdown.Item onClick={e => setFilter(e.nativeEvent.target.innerHTML)}>All</Dropdown.Item>
            <Dropdown.Item onClick={e => setFilter(e.nativeEvent.target.innerHTML)}>Local Builds</Dropdown.Item>
            <Dropdown.Item onClick={e => setFilter(e.nativeEvent.target.innerHTML)}>GachaGear Builds</Dropdown.Item>
          </DropdownButton>
        </div>
        <div>
          <InputGroup>
            <DropdownButton id="bsort-dropdown" title={bsort} size="sm" variant="outline-secondary" align="end">
              <Dropdown.Item onClick={e => {setBsort(e.nativeEvent.target.innerHTML); setBsortDir("down");}}>Latest Build</Dropdown.Item>
              <Dropdown.Item onClick={e => {setBsort(e.nativeEvent.target.innerHTML); setBsortDir("down");}}>Latest Character</Dropdown.Item>
              <Dropdown.Item onClick={e => {setBsort(e.nativeEvent.target.innerHTML); setBsortDir("down");}}>Character Name</Dropdown.Item>
              <Dropdown.Item onClick={e => {setBsort(e.nativeEvent.target.innerHTML); setBsortDir("down");}}>Character Rarity</Dropdown.Item>
            </DropdownButton>
            <Button
              id="filter-direction"
              size="sm"
              variant="outline-secondary"
              onClick={e => bsortDir == "down" ? setBsortDir("up") : setBsortDir("down")}
            >
              <i className={"bi bi-sort-" + bsortDir}></i>
            </Button>
          </InputGroup>
        </div>
        {viewMode != "Builds" ? (<div>
          <InputGroup>
            <DropdownButton id="bsort-dropdown" title={asort} size="sm" variant="outline-secondary" align="end">
              <Dropdown.Item onClick={e => {setAsort(e.nativeEvent.target.innerHTML); setAsortDir("down")}}>Latest Area</Dropdown.Item>
              <Dropdown.Item onClick={e => {setAsort(e.nativeEvent.target.innerHTML); setAsortDir("down")}}>Area Name</Dropdown.Item>
            </DropdownButton>
            <Button
              id="filter-direction"
              size="sm"
              variant="outline-secondary"
              onClick={e => asortDir == "down" ? setAsortDir("up") : setAsortDir("down")}
            >
              <i className={"bi bi-sort-" + asortDir}></i>
            </Button>
          </InputGroup>
        </div>) : ""}
      </Stack>
      <br />
      {buildList}
    </>
  )
}