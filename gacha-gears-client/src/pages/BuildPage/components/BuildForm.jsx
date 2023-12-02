// Modules
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Stack, Row, Col, Alert } from "react-bootstrap";

export default function BuildForm(props) {
  axios.defaults.withCredentials = true;
  const [id, setID] = useState("");
  const [character, setCharacter] = useState("");
  const [relic1, setRelic1] = useState("");
  const [relic2, setRelic2] = useState("");
  const [ornament, setOrnament] = useState("");
  const [body, setBody] = useState("");
  const [feet, setFeet] = useState("");
  const [sphere, setSphere] = useState("");
  const [rope, setRope] = useState("");
  const [substats, setSubstats] = useState("");
  const [lb, setLb] = useState(false);
  const [isValid, setIsValid] = useState("");
  const formRef = useRef(null);

  function clearFields() {
    setCharacter("");
    setRelic1("");
    setRelic2("");
    setOrnament("");
    setBody("");
    setFeet("");
    setSphere("");
    setRope("");
    setSubstats("");
    setLb(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    var build = {
      character: character,
      relic: [relic1],
      ornament: ornament,
      body: body,
      feet: feet,
      sphere: sphere,
      rope: rope,
      substats: substats,
      lb: lb,
    };
    if (relic2 != "" && relic2 != relic1) build.relic.push(relic2);
    if (props.edit.isEditing) {
      build._id = id;
      handleEdit(build);
    } else handleAdd(build);
    formRef.current.focus();
  }

  function handleAdd(build) {
    axios
      .post(`${import.meta.env.VITE_API_ADDRESS}/builds`, build)
      .then((res) => {
        clearFields();
        // Test Guest Add
        if (!res.data.msg) {
          var localbuilds = JSON.parse(localStorage.getItem("localBuilds"));
          if (!localbuilds) {
            localbuilds = [res.data];
            localStorage.setItem("localBuilds", JSON.stringify(localbuilds));
          } else {
            localbuilds.push(res.data);
            localStorage.setItem("localBuilds", JSON.stringify(localbuilds));
          }
        }
        // Get UpdatedBuilds
        props.getBuilds();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEdit(build) {
    axios
      .put(`${import.meta.env.VITE_API_ADDRESS}/builds/${props.edit.build._id}`, build)
      .then((res) => {
        clearFields();
        if (!res.data.msg) {
          var localbuilds = JSON.parse(localStorage.getItem("localBuilds"));
          var target = localbuilds.findIndex((i) => i._id === res.data._id);
          localbuilds[target] = res.data;
          localStorage.setItem("localBuilds", JSON.stringify(localbuilds));
        }
        props.setEdit({ isEditing: false, build: "" });
        props.getBuilds();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleCancel(e) {
    e.preventDefault();
    clearFields();
    props.setEdit({ isEditing: false, build: "" });
    formRef.current.focus();
  }


  // Handle Fields
  var characterList = <></>;
  if (props.fields.characters) {
    characterList = props.fields.characters.map((character, k) =>
      <option value={character._id} key={k}>{character.name}</option>
    );
  }
  var relicList = <></>;
  if (props.fields.relics) {
    relicList = props.fields.relics.map((relics, k) =>
      <option value={relics._id} key={k}>{relics.name}</option>
    );
  }
  var ornamentList = <></>;
  if (props.fields.ornaments) {
    ornamentList = props.fields.ornaments.map((ornaments, k) =>
      <option value={ornaments._id} key={k}>{ornaments.name}</option>
    );
  }

  useEffect(() => {
    if (props.edit.isEditing) {
      setID(props.edit.build._id);
      setCharacter(props.edit.build.character._id);
      setRelic1(props.edit.build.relic[0]._id);
      if (props.edit.build.relic.length > 1) setRelic2(props.edit.build.relic[1]._id);
      else setRelic2("");
      setOrnament(props.edit.build.ornament._id);
      setBody(props.edit.build.body);
      setFeet(props.edit.build.feet);
      setSphere(props.edit.build.sphere);
      setRope(props.edit.build.rope);
      setSubstats(props.edit.build.substats);
      setLb(props.edit.build.lb);
      formRef.current.focus();
    }
  }, [props]);

  useEffect(() => {
    if (character != "" && relic1 != "" && ornament != "") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [character, relic1, ornament]);


  return (
    <Form className="build-form" onSubmit={handleSubmit}>
      <Form.Control type="hidden" value={id} />
      <Row className="build-form-row">
        <Form.Label column xs="3">Character:</Form.Label>
        <Col>
          <Form.Select value={character} ref={formRef} onChange={e => setCharacter(e.target.value)}>
            <option value="">Select Character</option>
            {characterList}
          </Form.Select>
        </Col>
      </Row>
      <Row className="build-form-row">
        <Form.Label column xs="3">Relic 1:</Form.Label>
        <Col>
          <Form.Select value={relic1} onChange={e => setRelic1(e.target.value)}>
            <option value="">Select Relic</option>
            {relicList}
          </Form.Select>
        </Col>
      </Row>
      <Row className="build-form-row">
        <Form.Label column xs="3">Relic 2:</Form.Label>
        <Col>
          <Form.Select value={relic2} onChange={e => setRelic2(e.target.value)}>
            <option value="">Select Relic</option>
            {relicList}
          </Form.Select>
        </Col>
      </Row>
      <Row className="build-form-row">
        <Form.Label column xs="3">Ornament:</Form.Label>
        <Col>
          <Form.Select value={ornament} onChange={e => setOrnament(e.target.value)}>
            <option value="">Select Ornament</option>
            {ornamentList}
          </Form.Select>
        </Col>
      </Row>
      <Row className="build-form-row">
        <Form.Label column xs="3">Stats (B/F/S/R):</Form.Label>
        <Col><Form.Control type="text" value={body} onChange={e => setBody(e.target.value)}></Form.Control></Col>
        <Col><Form.Control type="text" value={feet} onChange={e => setFeet(e.target.value)}></Form.Control></Col>
        <Col><Form.Control type="text" value={sphere} onChange={e => setSphere(e.target.value)}></Form.Control></Col>
        <Col><Form.Control type="text" value={rope} onChange={e => setRope(e.target.value)}></Form.Control></Col>
      </Row>
      <Row className="build-form-row">
        <Form.Label column xs="3">Substats:</Form.Label>
        <Col><Form.Control type="text" value={substats} onChange={e => setSubstats(e.target.value)}></Form.Control></Col>
      </Row>
      <Row className="build-form-row">
        <Col>
          <Stack direction="horizontal" gap="1" className="justify-content-end">
            <Button type="submit" variant="outline-primary" disabled={!isValid}>
              {props.edit.isEditing ? "Edit" : "Add"}
            </Button>
            <Button variant="outline-danger" onClick={handleCancel} hidden={!props.edit.isEditing}>Cancel</Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}