// Modules
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Row, Table } from "react-bootstrap";
// Components
import RelicForm from "./components/RelicForm";
import RelicRow from "./components/RelicRow";

export default function RelicPage() {
  axios.defaults.withCredentials = true;
  const [relics, setRelics] = useState([]);
  const [zones, setZones] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function getRelics() {
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/relics`)
      .then((res) => {
        setRelics(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/zones/Relic`)
      .then((res) => {
        setZones(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getRelics();
  }, []);

  function toggleSort(e) {
    var newObject;
    if (e.target.id === "name") {
      if (sortBy.name != "name") {
        newObject = { name: "name", direction: "desc", nameClass: "bi-sort-alpha-down", zoneClass: "" };
      } else if (sortBy.direction === "desc") {
        newObject = { name: "name", direction: "asc", nameClass: "bi-sort-alpha-up", zoneClass: "" };
      } else {
        newObject = { name: "key", direction: "desc", nameClass: "", zoneClass: "" };
      }
    }
    if (e.target.id === "zone") {
      if (sortBy.name != "zone") {
        newObject = { name: "zone", direction: "desc", nameClass: "", zoneClass: "bi-sort-alpha-down" };
      } else if (sortBy.direction === "desc") {
        newObject = { name: "zone", direction: "asc", nameClass: "", zoneClass: "bi-sort-alpha-up" };
      } else {
        newObject = { name: "key", direction: "desc", nameClass: "", zoneClass: "" };
      }
    }
    setSortBy(newObject);
  }

  function sortRelics() {
    switch (sortBy.name) {
      case "name":
        if (sortBy.direction === "desc") {
          relicList.sort((c1, c2) => {
            if (c2.props.relic.name > c1.props.relic.name) return -1;
            else if (c1.props.relic.name > c2.props.relic.name) return 1;
            else return 0;
          });
        } else {
          relicList.sort((c1, c2) => {
            if (c2.props.relic.name > c1.props.relic.name) return 1;
            else if (c1.props.relic.name > c2.props.relic.name) return -1;
            else return 0;
          });
        }
        break;
      case "zone":
        if (sortBy.direction === "desc") {
          relicList.sort((c1, c2) => {
            if (c2.props.relic.zone.name > c1.props.relic.zone.name) return -1;
            else if (c1.props.relic.zone.name > c2.props.relic.zone.name) return 1;
            else return 0;
          });
        } else {
          relicList.sort((c1, c2) => {
            if (c2.props.relic.zone.name > c1.props.relic.zone.name) return 1;
            else if (c1.props.relic.zone.name > c2.props.relic.zone.name) return -1;
            else return 0;
          });
        }
        break;
      default:
        relicList.sort((c1, c2) => {
          if (c2.props.relic.id > c1.props.relic.id) return -1;
          else if (c1.props.relic.id > c2.props.relic.id) return 1;
          else return 0;
        });
        break;
    }
  }

  const relicList = relics.map((relic, k) =>
    <RelicRow relic={relic} zones={zones} key={k} getRelics={getRelics} setShowModal={setShowModal} />
  );
  sortRelics();
  return (
    <>
      <h1 className="page-title">Relics</h1>
      <Container>
        <Row className="justify-content-center">
          <Table bordered>
            <thead>
              <tr>
                <th id="name" className="col-auto" onClick={toggleSort}>Name <i className={"bi " + sortBy.nameClass} /></th>
                <th id="zone" className="col-4 text-center" onClick={toggleSort}>Zone <i className={"bi " + sortBy.zoneClass} /></th>
                <th className="col-2 text-center">Action</th>
              </tr>
              <RelicForm getRelics={getRelics} zones={zones}/>
            </thead>
            <tbody>
              {relicList}
            </tbody>
          </Table>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion Failed: Dependencies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Please delete all builds that uses this relic before deleting this relic.</span>
        </Modal.Body>
      </Modal>
    </>
  )
}