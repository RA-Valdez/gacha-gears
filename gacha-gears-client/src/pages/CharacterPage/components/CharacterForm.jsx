// Modules
import axios from "axios";
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

export default function CharacterForm(props) {
  axios.defaults.withCredentials = true;
  const [formFeedback, setformFeedback] = useState({ message: "Enter name", invalid: false });

  const [character, setCharacter] = useState(() => {
    if (props.character) {
      return props.character;
    } else {
      return {
        name: "",
        rarity: "SSR",
      }
    }
  });

  function handleChange(e) {
    setCharacter({ ...character, [e.target.name]: e.target.value });
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
    if (!character.name.trim()) {
      setformFeedback({ message: "Enter name", invalid: true });
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_ADDRESS}/characters`, character)
      .then((res) => {
        props.getCharacters();
        setCharacter({ ...character, name: "" });
        setformFeedback({ message: "Enter name", invalid: false });
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setformFeedback({ message: "Character already exists", invalid: true });
        } else {
          setformFeedback({ message: "Connection Error", invalid: true });
        }
      });
  }

  const handleEdit = (e) => {
    if (!character.name.trim()) {
      setformFeedback({ message: "Enter name", invalid: true });
      return;
    }
    axios
      .put(`${import.meta.env.VITE_API_ADDRESS}/characters/${props.character._id}`, character)
      .then((res) => {
        props.toggleEditing();
        props.getCharacters();
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setformFeedback({ message: "Character already exists", invalid: true });
        } else {
          setformFeedback({ message: "Connection Error", invalid: true });
        }
      });
  };

  const addCharacter = (
    <tr>
      <th className="align-middle">
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={character.name}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          isInvalid={formFeedback.invalid}
        />
        <Form.Control.Feedback type="invalid">{formFeedback.message}</Form.Control.Feedback>
      </th>
      <th className="align-middle">
        <Form.Select
          name="rarity"
          size="sm"
          className={"rarity-" + character.rarity}
          onChange={handleChange}
          value={character.rarity}
        >
          <option className="rarity-SSR" value="SSR">SSR</option>
          <option className="rarity-SR" value="SR">SR</option>
        </Form.Select>
      </th>
      <th className="align-middle text-center">
          <Button variant="outline-primary" size="sm" onClick={handleAdd}><i className="bi bi-check-lg" /></Button>
      </th>
    </tr>
  );

  const editCharacter = (
    <tr>
      <td>
        <Form.Control
          name="name"
          type="text"
          size="sm"
          value={character.name}
          onChange={handleChange}
          onKeyUp={handleSubmit}
          isInvalid={formFeedback.invalid}
        />
        <Form.Control.Feedback type="invalid">{formFeedback.message}</Form.Control.Feedback>
      </td>
      <td className="align-middle">
        <Form.Select
          name="rarity"
          size="sm"
          className={"rarity-" + character.rarity}
          onChange={handleChange}
          value={character.rarity}
        >
          <option className="rarity-SSR" value="SSR">SSR</option>
          <option className="rarity-SR" value="SR">SR</option>
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

  return props.isEditing ? editCharacter : addCharacter;
}