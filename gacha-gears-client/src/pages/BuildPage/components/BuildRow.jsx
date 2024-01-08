// Modules
import axios from "axios";
import { Button, Col, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
import Cookies from 'universal-cookie';

export default function BuildRow(props) {
  axios.defaults.withCredentials = true;
  const cookies = new Cookies(null, { path: '/' });
  const renderTooltip = (text) => (
    <Tooltip>
      {text}
    </Tooltip>
  );

  function getRelicNames(relicArray) {
    var nameArray = [];
    for (const k of relicArray) {
      nameArray.push(k.name);
    }
    return nameArray.join(", ");
  }

  function handleEdit() {
    props.setEdit({ isEditing: true, build: props.build });
  }

  function handleCopy() {
    const copiedBuild = {...props.build, _id: "", lb: false};
    props.setEdit({ isEditing: false, build: copiedBuild });
  }

  function handleDelete() {
    if (props.build.lb) {
      var localbuilds = JSON.parse(localStorage.getItem('LB_HSR'));
      var target = localbuilds.findIndex((i) => i._id === props.build._id);
      localbuilds.splice(target, 1);
      localStorage.setItem('LB_HSR', JSON.stringify(localbuilds));
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

  const actionStack = (
    <Stack direction="horizontal" gap="1" className="justify-content-center" style={{ height: "100%" }}>
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip("Copy")}
      >
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleCopy}
        >
          <i className="bi bi-copy" />
        </Button>
      </OverlayTrigger>
      {props.build.lb || cookies.get('public-token') ? (
        <>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip("Edit")}
          >
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleEdit}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip("Delete")}
          >
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
            >
              <i className="bi bi-trash-fill" />
            </Button>
          </OverlayTrigger>
        </>) : <p className="text-center m-0 p-0"></p>}
    </Stack>
  )

  const buildRow = (
    <Row className="justify-content-center">
      <Col xs={9} md={10} className={"build-col rarity-" + props.build.character.rarity}><strong className="align-middle">{props.build.character.name}</strong></Col>
      <Col xs={3} md={2} className="build-col">
        {actionStack}
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
      <Col xs={9} md={3} className="build-col">
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
      <Col xs={3} md={{ span: 2, order: 1 }} className="build-col text-center">
        {actionStack}
      </Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.body}</Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.feet}</Col>
      <Col xs={6} md={3} className="build-col text-center">{props.build.substats}</Col>
    </Row>
  )

  const ornamentRow = (
    <Row>
      <Col xs={9} md={3} className="build-col">
        <strong className={"align-middle rarity-" + props.build.character.rarity}>{props.build.character.name}</strong>
      </Col>
      <Col xs={3} md={{ span: 2, order: 1 }} className="build-col text-center">
        {actionStack}
      </Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.sphere}</Col>
      <Col xs={3} md={2} className="build-col text-center">{props.build.rope}</Col>
      <Col xs={6} md={3} className="build-col text-center">{props.build.substats}</Col>
    </Row>
  )

  return props.viewMode === "Builds" ? buildRow : props.viewMode === "Relics" ? relicRow : ornamentRow;
}