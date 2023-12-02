// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
// Components
import ZoneForm from "./ZoneForm";

export default function ZoneRow(props) {
  axios.defaults.withCredentials = true;
  const [isEditing, setIsEditing] = useState(false);

  function toggleEditing() {
    setIsEditing(!isEditing);
  }

  function handleDelete() {
    axios.delete(`${import.meta.env.VITE_API_ADDRESS}/zones/${props.zone._id}`)
      .then((res) => {
        if (res.data.type) {
          var modalBody = "";
          props.toggleModal({
            show: true,
            type: res.data.type,
            dependencies: res.data.deps,
          });
        } else {
          props.getZones();
        }
      });
    /*.catch((err) => {
      console.log(err);
    });*/
  }

  const viewRow = (
    <tr>
      <td className="align-middle">{props.zone.name}</td>
      <td className="align-middle text-center">
        <span>{props.zone.type}</span>
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

  return !isEditing ? viewRow : (<ZoneForm isEditing={true} zone={props.zone} getZones={props.getZones} toggleEditing={toggleEditing} />);
}