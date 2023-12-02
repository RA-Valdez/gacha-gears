import axios from "axios";
import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom"

export default function LogInPage() {
  axios.defaults.withCredentials = true;
  const [process, setProcess] = useState("Log In");
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordC, setPasswordC] = useState("");
  const [validPasswordC, setValidPasswordC] = useState(false);
  const [validLogin, setValidLogin] = useState(true);
  const navigate = useNavigate();

  function clearFields() {
    setUsername("");
    setValidUsername(false);
    setEmail("");
    setValidEmail(false);
    setPassword("");
    setValidPassword(false);
    setPasswordC("");
    setValidPasswordC(false);
  }

  function handleChangeProcess() {
    clearFields();
    if (process === "Log In") setProcess("Register");
    else setProcess("Log In");
  }

  function onChange(e) {
    switch (e.target.id) {
      case "username":
        setUsername(e.target.value);
        if (process === "Log In") setValidUsername(e.target.value != "");
        else setValidUsername(/(?=.{8,128})/.test(e.target.value));
        break;
      case "email":
        setEmail(e.target.value);
        setValidEmail(/.(?=@).(?=.{1,}).{1,}(?=\.).(?=.{1,})/.test(e.target.value));
        break;
      case "password":
        setPassword(e.target.value);
        if (process === "Log In") setValidPassword(e.target.value != "");
        else setValidPassword(/(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])/.test(e.target.value));
        break;
      case "passwordc":
        setPasswordC(e.target.value);
        setValidPasswordC(password === e.target.value);
        break;
    }
  }

  function handleLogIn() {
    const user = { username: username, password: password };
    axios
      .post(`${import.meta.env.VITE_API_ADDRESS}/users/login`, user, { withCredentials: true })
      .then((res) => {
        clearFields();
        navigate("/")
      })
      .catch((err) => {
        clearFields();
        setValidLogin(false);
      });
  }

  function handleRegister() {
    if (validUsername && validEmail && validPassword && validPasswordC) {
      const user = { username: username, email: email, password: password };
      console.log(user);
      axios
        .post(`${import.meta.env.VITE_API_ADDRESS}/users/register`, user)
        .then((res) => {
          clearFields();
          setProcess("Log In");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (process === "Log In") handleLogIn();
    else handleRegister();
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={6}>
          <h1>{process}</h1>
          {validLogin ? <></> : <Alert className="m-1 text-center" variant="danger" dismissible>Login Failed</Alert>}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group controlId="username" className="mb-2">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder={process === "Log In" ? "Enter Username:" : "Enter Username"}
                value={username}
                onChange={onChange}
                isInvalid={process === "Log In" ? false : !validUsername}
              />
              <Form.Control.Feedback type="invalid">Username must contain atleast 8 characters</Form.Control.Feedback>
            </Form.Group>
            {process != "Log In" ?
              <Form.Group controlId="email" className="mb-2">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={onChange}
                  isInvalid={!validEmail}
                />
                <Form.Control.Feedback type="invalid">Email must be a valid Email Address</Form.Control.Feedback>
              </Form.Group>
              : ""}
            <Form.Group controlId="password" className="mb-2">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={onChange}
                isInvalid={process === "Log In" ? false : !validPassword}
              />
              <Form.Control.Feedback type="invalid">Password must contain atleast 8 characters including a lowercase, uppercase, number, and symbol</Form.Control.Feedback>
            </Form.Group>
            {process != "Log In" ?
              <Form.Group controlId="passwordc" className="mb-2">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={passwordC}
                  onChange={onChange}
                  isInvalid={!validPasswordC}
                />
                <Form.Control.Feedback type="invalid">Passwords not matching</Form.Control.Feedback>
              </Form.Group>
              : ""}
            {import.meta.env.DEV ? (<a href="#" onClick={handleChangeProcess}>{process === "Log In" ? "Register" : "Log In"}</a>) : <></>}

            <Button
              variant="primary"
              type="submit"
              className="float-end"
              disabled={process === "Log In" ? !(validUsername && validPassword) : !(validUsername && validEmail && validPassword && validPasswordC)}
            >{process}</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}