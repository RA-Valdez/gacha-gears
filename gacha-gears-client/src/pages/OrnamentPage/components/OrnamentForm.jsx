// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

export default function OrnamentForm(props) {
  axios.defaults.withCredentials = true;
  const [formFeedback, setFormFeedback] = useState({
    nameMessage: "Enter name",
    nameInvalid: false,
  });

  const [selectFeedback, setSelectFeedback] = useState({
    zoneMessage: "Select zone",
    zoneInvalid: false,
  });

  const [ornament, setOrnament] = useState(() => {
    if (props.ornament) {
      const propOrnament = {
        name: props.ornament.name,
        zone: props.ornament.zone._id,
      }
      return propOrnament;
    } else {
      return {
        name: "",
        zone: "",
      }
    }
  });

  const selectOptions = props.zones.map((zone, k) =>
    <option value={zone._id} key={k}>{zone.name}</option>
  );

  function handleChange(e) {
    setOrnament({ ...ornament, [e.target.name]: e.target.value });
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
    if (!ornament.name.trim() || !ornament.zone.trim()) {
      if (!ornament.name.trim()) {
        setFormFeedback({ ...formFeedback, nameMessage: "Enter name", nameInvalid: true });
      } else {
        setFormFeedback({ ...formFeedback, nameInvalid: false });
      }
      if (!ornament.zone.trim()) {
        setSelectFeedback({ ...selectFeedback, zoneMessage: "Select zone", zoneInvalid: true });
      } else {
        setSelectFeedback({ ...selectFeedback, zoneInvalid: false });
      }
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_ADDRESS}/ornaments`, ornament)
      .then((res) => {
        props.getOrnaments();
        setOrnament({ ...ornament, name: "" });
        setFormFeedback({ ...formFeedback, nameInvalid: false });
        setSelectFeedback({ ...selectFeedback, zoneInvalid: false });
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setFormFeedback({ message: "Ornament already exists", invalid: true });
        } else {
          setFormFeedback({ message: "Connection Error", invalid: true });
        }
      });
  }

  const handleEdit = (e) => {
    if (!ornament.name.trim() || !ornament.zone.trim()) {
      if (!ornament.name.trim()) {
        setFormFeedback({ ...formFeedback, nameMessage: "Enter name", nameInvalid: true });
      } else {
        setFormFeedback({ ...formFeedback, nameInvalid: false });
      }
      if (!ornament.zone.trim()) {
        setSelectFeedback({ ...selectFeedback, zoneMessage: "Select zone", zoneInvalid: true });
      } else {
        setSelectFeedback({ ...selectFeedback, zoneInvalid: false });
      }
      return;
    }
    axios
      .put(`${import.meta.env.VITE_API_ADDRESS}/ornaments/${props.ornament._id}`, ornament)
      .then((res) => {
        props.toggleEditing();
        props.getOrnaments();
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setFormFeedback({ message: "Ornament already exists", invalid: true });
        } else {
          setFormFeedback({ message: "Connection Error", invalid: true });
        }
      });
  };

  const addOrnament = (
    <tr>
      <th className="align-middle">
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={ornament.name}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          isInvalid={formFeedback.nameInvalid}
        />
        <Form.Control.Feedback type="invalid">{formFeedback.nameMessage}</Form.Control.Feedback>
      </th>
      <th className="align-middle">
        <Form.Select
          name="zone"
          size="sm"
          onChange={handleChange}
          value={ornament.zone}
          isInvalid={selectFeedback.zoneInvalid}
        >
          <option value="">Select Zone</option>
          {selectOptions}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{selectFeedback.zoneMessage}</Form.Control.Feedback>
      </th>
      <th className="align-middle text-center">
        <Button variant="outline-primary" size="sm" onClick={handleAdd}><i className="bi bi-check-lg" /></Button>
      </th>
    </tr>
  );

  const editOrnament = (
    <tr>
      <td>
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={ornament.name}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          isInvalid={formFeedback.nameInvalid}
        />
        <Form.Control.Feedback type="invalid">{formFeedback.nameMessage}</Form.Control.Feedback>
      </td>
      <td className="align-middle">
        <Form.Select
          name="zone"
          size="sm"
          onChange={handleChange}
          value={ornament.zone}
          isInvalid={selectFeedback.zoneInvalid}
        >
          <option value="">Select Zone</option>
          {selectOptions}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{selectFeedback.zoneMessage}</Form.Control.Feedback>
      </td>
      <td className="align-middle">
        <Stack direction="horizontal" gap="1" className="justify-content-center">
          <Button variant="outline-primary" size="sm" onClick={handleEdit}><i className="bi bi-check-lg" /></Button>
          <Button variant="outline-danger" size="sm" onClick={props.toggleEditing}><i className="bi bi-x-lg" /></Button>
        </Stack>
      </td>
    </tr>
  );

  return props.isEditing ? editOrnament : addOrnament;
}