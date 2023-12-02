// Modules
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Row, Table } from "react-bootstrap";
// Components
import ZoneForm from "./components/ZoneForm";
import ZoneRow from "./components/ZoneRow";

export default function ZonePage() {
  axios.defaults.withCredentials = true;
  const [zones, setZones] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
    dependencies: "",
  });

  function getZones() {
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/zones`)
      .then((res) => {
        setZones(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getZones();
  }, []);

  function toggleSort(e) {
    var newObject;
    if (e.target.id === "name") {
      if (sortBy.name != "name") {
        newObject = { name: "name", direction: "desc", nameClass: "bi-sort-alpha-down", typeClass: "" };
      } else if (sortBy.direction === "desc") {
        newObject = { name: "name", direction: "asc", nameClass: "bi-sort-alpha-up", typeClass: "" };
      } else {
        newObject = { name: "key", direction: "desc", nameClass: "", typeClass: "" };
      }
    }
    if (e.target.id === "type") {
      if (sortBy.name != "type") {
        newObject = { name: "type", direction: "desc", nameClass: "", typeClass: "bi-sort-alpha-down" };
      } else if (sortBy.direction === "desc") {
        newObject = { name: "type", direction: "asc", nameClass: "", typeClass: "bi-sort-alpha-up" };
      } else {
        newObject = { name: "key", direction: "desc", nameClass: "", typeClass: "" };
      }
    }
    setSortBy(newObject);
  }

  function sortZones() {
    switch (sortBy.name) {
      case "name":
        if (sortBy.direction === "desc") {
          zoneList.sort((c1, c2) => {
            if (c2.props.zone.name > c1.props.zone.name) return -1;
            else if (c1.props.zone.name > c2.props.zone.name) return 1;
            else return 0;
          });
        } else {
          zoneList.sort((c1, c2) => {
            if (c2.props.zone.name > c1.props.zone.name) return 1;
            else if (c1.props.zone.name > c2.props.zone.name) return -1;
            else return 0;
          });
        }
        break;
      case "type":
        if (sortBy.direction === "desc") {
          zoneList.sort((c1, c2) => {
            if (c2.props.zone.type > c1.props.zone.type) return -1;
            else if (c1.props.zone.type > c2.props.zone.type) return 1;
            else return 0;
          });
        } else {
          zoneList.sort((c1, c2) => {
            if (c2.props.zone.type > c1.props.zone.type) return 1;
            else if (c1.props.zone.type > c2.props.zone.type) return -1;
            else return 0;
          });
        }
        break;
      default:
        zoneList.sort((c1, c2) => {
          if (c2.props.zone.id > c1.props.zone.id) return -1;
          else if (c1.props.zone.id > c2.props.zone.id) return 1;
          else return 0;
        });
        break;
    }
  }

  function toggleModal(obj) {
    setShowModal(obj);
  }

  const zoneList = zones.map((zone, k) =>
    <ZoneRow zone={zone} key={k} getZones={getZones} toggleModal={toggleModal} />
  );
  sortZones();
  return (
    <>
      <h1 className="page-title">Zones</h1>
      <Container>
        <Row className="justify-content-center">
          <Table bordered>
            <thead>
              <tr>
                <th id="name" className="col-auto" onClick={toggleSort}>Name <i className={"bi " + sortBy.nameClass} /></th>
                <th id="type" className="col-3 text-center" onClick={toggleSort}>Type <i className={"bi " + sortBy.typeClass} /></th>
                <th className="col-2 text-center">Action</th>
              </tr>
              <ZoneForm getZones={getZones} />
            </thead>
            <tbody>
              {zoneList}
            </tbody>
          </Table>
        </Row>
      </Container>
      <Modal show={showModal.show} onHide={() => setShowModal({ show: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion Failed: Dependencies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Please delete these dependencies before deleting this zone.</span><br />
          <span>{showModal.type}{"(s)"}: {showModal.dependencies}</span>
        </Modal.Body>
      </Modal>
    </>
  )
}