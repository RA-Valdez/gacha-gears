// Modules
import axios from "axios";
import { Button, Col, Row, Stack } from "react-bootstrap";

export default function BuildRow(props) {
  axios.defaults.withCredentials = true;
  function getRelicNames(relicArray) {
    var nameArray = [];
    for (const k of relicArray) {
      nameArray.push(k.name);
    }
    return nameArray.join(", ");
  }

  function handleEdit() {
    //console.log(props.build);
    props.setEdit({ isEditing: true, build: props.build });
  }

  function handleDelete() {
    if (props.build.lb) {
      var localbuilds = JSON.parse(localStorage.getItem("localBuilds"));
      var target = localbuilds.findIndex((i) => i._id === props.build._id);
      localbuilds.splice(target, 1);
      localStorage.setItem("localBuilds", JSON.stringify(localbuilds));
      props.getBuilds();
    } else {
      axios.delete(`${import.meta.env.VITE_API_ADDRESS}/builds/${props.build._id}`)
        .then((res) => {
          props.getBuilds();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const buildRow = (
    <Row className="justify-content-center">
      <Col xs={10} className={"build-col rarity-" + props.build.character.rarity}><strong className="align-middle">{props.build.character.name}</strong></Col>
      <Col xs={2} className="build-col">
        <Stack direction="horizontal" gap="1" className="justify-content-center">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-fill" />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleDelete}
          >
            <i className="bi bi-trash-fill" />
          </Button>
        </Stack>
      </Col>
      <Col xs={12} md={3} className="build-col">{getRelicNames(props.build.relic)}</Col>
      <Col xs={12} md={2} className="build-col">{props.build.ornament.name}</Col>
      <Col xs={3} md className="build-col text-center">{props.build.body}</Col>
      <Col xs={3} md className="build-col text-center">{props.build.feet}</Col>
      <Col xs={3} md className="build-col text-center">{props.build.sphere}</Col>
      <Col xs={3} md className="build-col text-center">{props.build.rope}</Col>
      <Col xs={12} md={2} className="build-col">{props.build.substats}</Col>
    </Row>
  );

  const relicRow = (
    <Row>
      <Col xs={10} md={3} className="build-col">
        <strong className={"align-middle rarity-" + props.build.character.rarity}>{props.build.character.name}</strong>
        {props.build.relic.length > 1 && props.relicID === props.build.relic[0]._id ?
          <span className="align-middle">
            &ensp;(+{props.build.relic[1].name})
          </span>
          : props.build.relic.length > 1 && props.relicID === props.build.relic[1]._id ?
            <span className="align-middle">
              &ensp;(+{props.build.relic[0].name})
            </span>
            : ""
        }
      </Col>
      <Col xs={2} md={{ span: 2, order: 1 }} className="build-col text-center">
        <Stack direction="horizontal" gap="1" className="justify-content-center">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-fill" />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleDelete}
          >
            <i className="bi bi-trash-fill" />
          </Button>
        </Stack>
      </Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.body}</Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.feet}</Col>
      <Col xs={6} md={3} className="build-col text-center">{props.build.substats}</Col>
    </Row>
  )

  const ornamentRow = (
    <Row>
      <Col xs={10} md={3} className="build-col">
        <strong className={"align-middle rarity-" + props.build.character.rarity}>{props.build.character.name}</strong>
      </Col>
      <Col xs={2} md={{ span: 2, order: 1 }} className="build-col text-center">
        <Stack direction="horizontal" gap="1" className="justify-content-center">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-fill" />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleDelete}
          >
            <i className="bi bi-trash-fill" />
          </Button>
        </Stack>
      </Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.sphere}</Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.rope}</Col>
      <Col xs={6} md={3} className="build-col text-center">{props.build.substats}</Col>
    </Row>
  )

  return props.viewMode === "Builds" ? buildRow : props.viewMode === "Relics" ? relicRow : ornamentRow;
}