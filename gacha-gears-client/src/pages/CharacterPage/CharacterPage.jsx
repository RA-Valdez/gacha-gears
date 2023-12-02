// Modules
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Row, Table } from "react-bootstrap";
// Components
import CharacterForm from "./components/CharacterForm";
import CharacterRow from "./components/CharacterRow";

export default function CharacterPage() {
  axios.defaults.withCredentials = true;
  const [characters, setCharacters] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function getCharacters() {
    axios.get(`${import.meta.env.VITE_API_ADDRESS}/characters`)
      .then((res) => {
        setCharacters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getCharacters();
  }, []);

  function toggleSort(e) {
    var newObject;
    if (e.target.id === "name") {
      if (sortBy.name != "name") {
        newObject = { name: "name", direction: "desc", nameClass: "bi-sort-alpha-down", rarityClass: "" };
      } else if (sortBy.direction === "desc") {
        newObject = { name: "name", direction: "asc", nameClass: "bi-sort-alpha-up", rarityClass: "" };
      } else {
        newObject = { name: "key", direction: "desc", nameClass: "", rarityClass: "" };
      }
    }
    if (e.target.id === "rarity") {
      if (sortBy.name != "rarity") {
        newObject = { name: "rarity", direction: "desc", nameClass: "", rarityClass: "bi-sort-down" };
      } else if (sortBy.direction === "desc") {
        newObject = { name: "rarity", direction: "asc", nameClass: "", rarityClass: "bi-sort-up" };
      } else {
        newObject = { name: "key", direction: "desc", nameClass: "", rarityClass: "" };
      }
    }
    setSortBy(newObject);
  }

  function sortCharacters() {
    switch (sortBy.name) {
      case "name":
        if (sortBy.direction === "desc") {
          characterList.sort((c1, c2) => {
            if (c2.props.character.name > c1.props.character.name) return -1;
            else if (c1.props.character.name > c2.props.character.name) return 1;
            else return 0;
          });
        } else {
          characterList.sort((c1, c2) => {
            if (c2.props.character.name > c1.props.character.name) return 1;
            else if (c1.props.character.name > c2.props.character.name) return -1;
            else return 0;
          });
        }
        break;
      case "rarity":
        if (sortBy.direction === "desc") {
          characterList.sort((c1, c2) => {
            if (c2.props.character.rarity > c1.props.character.rarity) return 1;
            else if (c1.props.character.rarity > c2.props.character.rarity) return -1;
            else return 0;
          });
        } else {
          characterList.sort((c1, c2) => {
            if (c2.props.character.rarity > c1.props.character.rarity) return -1;
            else if (c1.props.character.rarity > c2.props.character.rarity) return 1;
            else return 0;
          });
        }
        break;
      default:
        characterList.sort((c1, c2) => {
          if (c2.props.character.id > c1.props.character.id) return -1;
          else if (c1.props.character.id > c2.props.character.id) return 1;
          else return 0;
        });
        break;
    }
  }

  const characterList = characters.map((character, k) =>
    <CharacterRow character={character} key={k} getCharacters={getCharacters} setShowModal={setShowModal} />
  );
  sortCharacters();
  return (
    <>
      <h1 className="page-title">Characters</h1>
      <Container>
        <Row className="justify-content-center">
          <Table bordered>
            <thead>
              <tr>
                <th id="name" className="col-auto" onClick={toggleSort}>Name <i className={"bi " + sortBy.nameClass} /></th>
                <th id="rarity" className="col-2 text-center" onClick={toggleSort}>Rarity <i className={"bi " + sortBy.rarityClass} /></th>
                <th className="col-2 text-center">Action</th>
              </tr>
              <CharacterForm getCharacters={getCharacters} />
            </thead>
            <tbody>
              {characterList}
            </tbody>
          </Table>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deletion Failed: Dependencies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Please delete all builds that uses this character before deleting this character.</span>
        </Modal.Body>
      </Modal>
    </>
  )
}