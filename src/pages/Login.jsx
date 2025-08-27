import { useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { userSignInAction } from "../features/users/userAction.js";
import {
  Person,
  Lock,
  Eye,
  EyeSlash,
  ShieldCheck,
  Truck,
  BoxSeam,
} from "react-bootstrap-icons";
import "../styles/auth.css";

const Login = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const cred = {
      email: emailRef.current.value.trim(),
      password: passRef.current.value,
    };

    try {
      const { status, message } = await dispatch(userSignInAction(cred));
      if (status === "success") {
        nav(loc.state?.from || "/");
      } else {
        setError(message || "Invalid email or password.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg py-5">
      <Container className="py-4">
        <Row className="justify-content-center g-4">
          <Col lg={6} className="d-none d-lg-block">
            <Card className="h-100 border-0 shadow-sm auth-hero">
              <Card.Body className="p-4 p-xxl-5 d-flex flex-column justify-content-center">
                <img
                  src="src/assets/logo.png"
                  alt="B&M TechStore"
                  height={70}
                  width={70}
                  className="mb-3"
                />
                <div className="mb-4">
                  <h2 className="h3 mb-1">Welcome back</h2>
                  <p className="text-muted mb-0">
                    Sign in to track orders, manage returns, and enjoy faster
                    checkout.
                  </p>
                </div>

                <ListGroup variant="flush" className="auth-list">
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <ShieldCheck className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Secure checkout</div>
                      <div className="small text-muted">
                        Your info is protected with SSL.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <Truck className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Fast shipping</div>
                      <div className="small text-muted">
                        Orders ship directly from Australia.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <BoxSeam className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">30-day guarantee</div>
                      <div className="small text-muted">
                        Money-back on all products.
                      </div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Form panel */}
          <Col xs={12} lg={6}>
            <Card className="border-0 shadow-lg auth-card">
              <Card.Body className="p-4 p-xxl-5">
                <h1 className="h3 text-center mb-4">Log in</h1>

                {error && (
                  <Alert variant="danger" className="py-2">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Label htmlFor="email" className="small fw-semibold">
                    Email
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <Person />
                    </InputGroup.Text>
                    <Form.Control
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      ref={emailRef}
                      autoComplete="email"
                      required
                    />
                  </InputGroup>

                  <Form.Label htmlFor="password" className="small fw-semibold">
                    Password
                  </Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <Lock />
                    </InputGroup.Text>
                    <Form.Control
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Your password"
                      ref={passRef}
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeSlash /> : <Eye />}
                    </Button>
                  </InputGroup>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      type="checkbox"
                      id="remember"
                      label={<span className="small">Remember me</span>}
                    />
                    <Link to="/forgot-password" className="small">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Logging in…
                      </>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                {/* Replace link with a full-width “Create an account” button */}
                <Link
                  to="/signup"
                  className="btn btn-outline-dark w-100 py-2 fw-semibold"
                >
                  Create an account
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
