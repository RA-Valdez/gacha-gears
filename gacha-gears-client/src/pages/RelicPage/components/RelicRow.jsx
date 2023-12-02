// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
// Components
import RelicForm from "./RelicForm";

export default function RelicRow(props) {
  axios.defaults.withCredentials = true;
  const [isEditing, setIsEditing] = useState(false);

  function toggleEditing() {
    setIsEditing(!isEditing);
  }

  function handleDelete() {
    axios.delete(`${import.meta.env.VITE_API_ADDRESS}/relics/${props.relic._id}`)
      .then((res) => {
        if (res.data.depCount) {
          props.setShowModal(true);
        } else {
          props.getRelics();
        }
      })
      .catch((err) => {
        console.log("Delete relic failed");
      });
  }

  const viewRow = (
    <tr>
      <td className="align-middle">{props.relic.name}</td>
      <td className="align-middle text-center">
        <span>{props.relic.zone.name}</span>
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

  return !isEditing ? viewRow : (<RelicForm isEditing={true} relic={props.relic} zones={props.zones} getRelics={props.getRelics} toggleEditing={toggleEditing} />);
}