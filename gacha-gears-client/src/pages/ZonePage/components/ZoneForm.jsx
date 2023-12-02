// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

export default function ZoneForm(props) {
  axios.defaults.withCredentials = true;
  const [formFeedback, setformFeedback] = useState({ message: "Enter name", invalid: false });

  const [zone, setZone] = useState(() => {
    if (props.zone) {
      return props.zone;
    } else {
      return {
        name: "",
        type: "Relic",
      }
    }
  });

  function handleChange(e) {
    setZone({ ...zone, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (props.isEditing) {
        handleEdit();
      } else {
        handleAdd();
      }
    }
  }

  function handleAdd(e) {
    if (!zone.name.trim()) {
      setformFeedback({ message: "Enter name", invalid: true });
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_ADDRESS}/zones`, zone)
      .then((res) => {
        props.getZones();
        setZone({ ...zone, name: "" });
        setformFeedback({ message: "Enter name", invalid: false });
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setformFeedback({ message: "Zone already exists", invalid: true });
        } else {
          setformFeedback({ message: "Connection Error", invalid: true });
        }
      });
  }

  const handleEdit = (e) => {
    if (!zone.name.trim()) {
      setformFeedback({ message: "Enter zone name", invalid: true });
      return;
    }
    axios
      .put(`${import.meta.env.VITE_API_ADDRESS}/zones/${props.zone._id}`, zone)
      .then((res) => {
        props.toggleEditing();
        props.getZones();
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setformFeedback({ message: "Zone already exists", invalid: true });
        } else {
          setformFeedback({ message: "Connection Error", invalid: true });
        }
      });
  };

  const addZone = (
    <tr>
      <th className="align-middle">
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={zone.name}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          isInvalid={formFeedback.invalid}
        />
        <Form.Control.Feedback type="invalid">{formFeedback.message}</Form.Control.Feedback>
      </th>
      <th className="align-middle">
        <Form.Select
          name="type"
          size="sm"
          onChange={handleChange}
          value={zone.type}
        >
          <option value="Relic">Relic</option>
          <option value="Ornament">Ornament</option>
        </Form.Select>
      </th>
      <th className="align-middle text-center">
          <Button variant="outline-primary" size="sm" onClick={handleAdd}><i className="bi bi-check-lg" /></Button>
      </th>
    </tr>
  );

  const editZone = (
    <tr>
      <td>
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={zone.name}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          isInvalid={formFeedback.invalid}
        />
        <Form.Control.Feedback type="invalid">{formFeedback.message}</Form.Control.Feedback>
      </td>
      <td className="align-middle">
        <Form.Select
          name="type"
          size="sm"
          onChange={handleChange}
          value={zone.type}
        >
          <option value="Relic">Relic</option>
          <option value="Ornament">Ornament</option>
        </Form.Select>
      </td>
      <td className="align-middle">
        <Stack direction="horizontal" gap="1" className="justify-content-center">
          <Button variant="outline-primary" size="sm" onClick={handleEdit}><i className="bi bi-check-lg" /></Button>
          <Button variant="outline-danger" size="sm" onClick={props.toggleEditing}><i className="bi bi-x-lg" /></Button>
        </Stack>
      </td>
    </tr>
  );

  return props.isEditing ? editZone : addZone;
}