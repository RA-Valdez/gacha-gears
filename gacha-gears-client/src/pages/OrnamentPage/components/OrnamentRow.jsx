// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
// Components
import OrnamentForm from "./OrnamentForm";

export default function OrnamentRow(props) {
  axios.defaults.withCredentials = true;
  const [isEditing, setIsEditing] = useState(false);

  function toggleEditing() {
    setIsEditing(!isEditing);
  }

  function handleDelete() {
    axios.delete(`${import.meta.env.VITE_API_ADDRESS}/ornaments/${props.ornament._id}`)
      .then((res) => {
        if (res.data.depCount) {
          props.setShowModal(true);
        } else {
          props.getOrnaments();
        }
      })
      .catch((err) => {
        console.log("Delete ornament failed");
      });
  }

  const viewRow = (
    <tr>
      <td className="align-middle">{props.ornament.name}</td>
      <td className="align-middle text-center">
        <span>{props.ornament.zone.name}</span>
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

  return !isEditing ? viewRow : (<OrnamentForm isEditing={true} ornament={props.ornament} zones={props.zones} getOrnaments={props.getOrnaments} toggleEditing={toggleEditing} />);
}