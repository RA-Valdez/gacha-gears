// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
// Components
import CharacterForm from "./CharacterForm";

export default function CharacterRow(props) {
  axios.defaults.withCredentials = true;
  const [isEditing, setIsEditing] = useState(false);

  function toggleEditing() {
    setIsEditing(!isEditing);
  }

  function handleDelete() {
    axios.delete(`${import.meta.env.VITE_API_ADDRESS}/characters/${props.character._id}`)
      .then((res) => {
        if (res.data.depCount) {
          props.setShowModal(true);
        } else {
          props.getCharacters();
        }
      })
      .catch((err) => {
        console.log("Delete character failed");
      });
  }

  const viewRow = (
    <tr>
      <td className="align-middle">{props.character.name}</td>
      <td className="align-middle text-center">
        <span className={"rarity-" + props.character.rarity}>{props.character.rarity}</span>
      </td>
      <td className="align-middle">
        <Stack direction="horizontal" gap="1" className="justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={toggleEditing}
            size="sm"
          >
            <i className="bi bi-pencil-fill" />
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            size="sm"
          >
            <i className="bi bi-trash-fill" />
          </Button>
        </Stack>
      </td>
    </tr>
  );

  return !isEditing ? viewRow : (<CharacterForm isEditing={true} character={props.character} getCharacters={props.getCharacters} toggleEditing={toggleEditing} />);
}