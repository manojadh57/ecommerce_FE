import { useState, useMemo, useRef } from "react";
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
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userSignupAction } from "../features/users/userAction";
import {
  Person,
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  ShieldCheck,
  Gift,
  BoxSeam,
} from "react-bootstrap-icons";
import "../styles/auth.css";

/* -------- helpers for strength meter -------- */
const scorePassword = (pw = "") => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4); // 0..4
};
const strengthMeta = (score) =>
  [
    { label: "Too short", now: 10, variant: "secondary" },
    { label: "Weak", now: 30, variant: "danger" },
    { label: "Fair", now: 55, variant: "warning" },
    { label: "Good", now: 80, variant: "info" },
    { label: "Strong", now: 100, variant: "success" },
  ][score];

const Signup = () => {
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitBtnRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value }));

  const passScore = useMemo(
    () => scorePassword(form.password),
    [form.password]
  );
  const passMeta = strengthMeta(passScore);
  const confirmMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (confirmMismatch) {
      setError("Passwords do not match.");
      return;
    }
    if (passScore < 3) {
      setError(
        "Please use a stronger password (8+ chars incl. letters & numbers)."
      );
      return;
    }

    const { confirmPassword, ...userData } = form;

    try {
      setSubmitting(true);
      const { status, message } = await dispatch(userSignupAction(userData));
      if (status === "success") {
        navigate(`/verify-email-sent?email=${encodeURIComponent(form.email)}`);
      } else {
        setError(message || "Could not create your account.");
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
                <h2 className="h3 mb-2">Create your account</h2>
                <p className="text-muted mb-4">
                  Faster checkout and smarter order tracking.
                </p>

                <ListGroup variant="flush" className="auth-list">
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <ShieldCheck className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Track orders & invoices</div>
                      <div className="small text-muted">
                        All your purchases in one place.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <Gift className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Member-only deals</div>
                      <div className="small text-muted">
                        Early access to discounts & bundles.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <BoxSeam className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Easy returns</div>
                      <div className="small text-muted">
                        30-day money-back guarantee.
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
                <div className="d-flex justify-content-center mb-3 d-lg-none">
                  <img src="/logo.png" alt="B&M TechStore" height={24} />
                </div>

                <h1 className="h3 text-center mb-4">Create Account</h1>

                {error && (
                  <Alert variant="danger" className="py-2">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Row className="g-3">
                    <Col sm={6}>
                      <Form.Label className="small fw-semibold">
                        First name
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Person />
                        </InputGroup.Text>
                        <Form.Control
                          name="fName"
                          placeholder="First name"
                          value={form.fName}
                          onChange={onChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                    <Col sm={6}>
                      <Form.Label className="small fw-semibold">
                        Last name
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Person />
                        </InputGroup.Text>
                        <Form.Control
                          name="lName"
                          placeholder="Last name"
                          value={form.lName}
                          onChange={onChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  <Form.Label className="small fw-semibold mt-3">
                    Email
                  </Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <Envelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={onChange}
                      autoComplete="email"
                      required
                    />
                  </InputGroup>

                  <Form.Label className="small fw-semibold mt-2">
                    Password
                  </Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <Lock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPass ? "text" : "password"}
                      name="password"
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={onChange}
                      autoComplete="new-password"
                      required
                      minLength={8}
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
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <ProgressBar
                      now={passMeta.now}
                      variant={passMeta.variant}
                      style={{ height: 6, flex: 1 }}
                    />
                    <span className="small text-muted" style={{ width: 72 }}>
                      {passMeta.label}
                    </span>
                  </div>

                  <Form.Label className="small fw-semibold">
                    Confirm password
                  </Form.Label>
                  <InputGroup className="mb-1">
                    <InputGroup.Text>
                      <Lock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={onChange}
                      autoComplete="new-password"
                      required
                      isInvalid={confirmMismatch}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? <EyeSlash /> : <Eye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Passwords do not match.
                    </Form.Control.Feedback>
                  </InputGroup>

                  <Button
                    ref={submitBtnRef}
                    type="submit"
                    variant="primary"
                    className="w-100 py-2 mt-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Creating…
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </Form>

                <p className="text-center mt-3 mb-0">
                  <span className="text-muted me-1">
                    Already have an account?
                  </span>
                  <Link to="/login">Log in</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
