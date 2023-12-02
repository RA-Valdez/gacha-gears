// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

export default function RelicForm(props) {
  axios.defaults.withCredentials = true;
  const [formFeedback, setFormFeedback] = useState({
    nameMessage: "Enter name",
    nameInvalid: false,
  });

  const [selectFeedback, setSelectFeedback] = useState({
    zoneMessage: "Select zone",
    zoneInvalid: false,
  });

  const [relic, setRelic] = useState(() => {
    if (props.relic) {
      const propRelic = {
        name: props.relic.name,
        zone: props.relic.zone._id,
      }
      return propRelic;
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
    setRelic({ ...relic, [e.target.name]: e.target.value });
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
    if (!relic.name.trim() || !relic.zone.trim()) {
      if (!relic.name.trim()) {
        setFormFeedback({ ...formFeedback, nameMessage: "Enter name", nameInvalid: true });
      } else {
        setFormFeedback({ ...formFeedback, nameInvalid: false });
      }
      if (!relic.zone.trim()) {
        setSelectFeedback({ ...selectFeedback, zoneMessage: "Select zone", zoneInvalid: true });
      } else {
        setSelectFeedback({ ...selectFeedback, zoneInvalid: false });
      }
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_ADDRESS}/relics`, relic)
      .then((res) => {
        props.getRelics();
        setRelic({ ...relic, name: "" });
        setFormFeedback({ ...formFeedback, nameInvalid: false });
        setSelectFeedback({ ...selectFeedback, zoneInvalid: false });
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setFormFeedback({ message: "Relic already exists", invalid: true });
        } else {
          setFormFeedback({ message: "Connection Error", invalid: true });
        }
      });
  }

  const handleEdit = (e) => {
    if (!relic.name.trim() || !relic.zone.trim()) {
      if (!relic.name.trim()) {
        setFormFeedback({ ...formFeedback, nameMessage: "Enter name", nameInvalid: true });
      } else {
        setFormFeedback({ ...formFeedback, nameInvalid: false });
      }
      if (!relic.zone.trim()) {
        setSelectFeedback({ ...selectFeedback, zoneMessage: "Select zone", zoneInvalid: true });
      } else {
        setSelectFeedback({ ...selectFeedback, zoneInvalid: false });
      }
      return;
    }
    axios
      .put(`${import.meta.env.VITE_API_ADDRESS}/relics/${props.relic._id}`, relic)
      .then((res) => {
        props.toggleEditing();
        props.getRelics();
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setFormFeedback({ message: "Relic already exists", invalid: true });
        } else {
          setFormFeedback({ message: "Connection Error", invalid: true });
        }
      });
  };

  const addRelic = (
    <tr>
      <th className="align-middle">
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={relic.name}
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
          value={relic.zone}
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

  const editRelic = (
    <tr>
      <td>
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={relic.name}
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
          value={relic.zone}
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

  return props.isEditing ? editRelic : addRelic;
}