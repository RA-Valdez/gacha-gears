// Modules
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Row, Table } from "react-bootstrap";
// Components
import OrnamentForm from "./components/OrnamentForm";
import OrnamentRow from "./components/OrnamentRow";

export default function OrnamentPage() {
  axios.defaults.withCredentials = true;
  const [ornaments, setOrnaments] = useState([]);
  const [zones, setZones] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function getOrnaments() {
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/ornaments`)
      .then((res) => {
        setOrnaments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/zones/Ornament`)
      .then((res) => {
        setZones(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getOrnaments();
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

  function sortOrnaments() {
    switch (sortBy.name) {
      case "name":
        if (sortBy.direction === "desc") {
          ornamentList.sort((c1, c2) => {
            if (c2.props.ornament.name > c1.props.ornament.name) return -1;
            else if (c1.props.ornament.name > c2.props.ornament.name) return 1;
            else return 0;
          });
        } else {
          ornamentList.sort((c1, c2) => {
            if (c2.props.ornament.name > c1.props.ornament.name) return 1;
            else if (c1.props.ornament.name > c2.props.ornament.name) return -1;
            else return 0;
          });
        }
        break;
      case "zone":
        if (sortBy.direction === "desc") {
          ornamentList.sort((c1, c2) => {
            console.log(c2.props.ornament.zone.name + " vs " + c1.props.ornament.zone.name);
            if (c2.props.ornament.zone.name > c1.props.ornament.zone.name) return -1;
            else if (c1.props.ornament.zone.name > c2.props.ornament.zone.name) return 1;
            else return 0;
          });
        } else {
          ornamentList.sort((c1, c2) => {
            if (c2.props.ornament.zone.name > c1.props.ornament.zone.name) return 1;
            else if (c1.props.ornament.zone.name > c2.props.ornament.zone.name) return -1;
            else return 0;
          });
        }
        break;
      default:
        ornamentList.sort((c1, c2) => {
          if (c2.props.ornament.id > c1.props.ornament.id) return -1;
          else if (c1.props.ornament.id > c2.props.ornament.id) return 1;
          else return 0;
        });
        break;
    }
  }

  const ornamentList = ornaments.map((ornament, k) =>
    <OrnamentRow ornament={ornament} zones={zones} key={k} getOrnaments={getOrnaments} setShowModal={setShowModal} />
  );
  sortOrnaments();
  return (
    <>
      <h1 className="page-title">Ornaments</h1>
      <Container>
        <Row className="justify-content-center">
          <Table bordered>
            <thead>
              <tr>
                <th id="name" className="col-auto" onClick={toggleSort}>Name <i className={"bi " + sortBy.nameClass} /></th>
                <th id="zone" className="col-4 text-center" onClick={toggleSort}>Zone <i className={"bi " + sortBy.zoneClass} /></th>
                <th className="col-2 text-center">Action</th>
              </tr>
              <OrnamentForm getOrnaments={getOrnaments} zones={zones}/>
            </thead>
            <tbody>
              {ornamentList}
            </tbody>
          </Table>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion Failed: Dependencies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Please delete all builds that uses this ornament before deleting this ornament.</span>
        </Modal.Body>
      </Modal>
    </>
  )
}