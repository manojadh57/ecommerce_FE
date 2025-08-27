import React, { useMemo, useState } from "react";
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
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../helpers/axiosHelpers.js";
import {
  Lock,
  Eye,
  EyeSlash,
  ShieldCheck,
  Key,
  Check2Circle,
} from "react-bootstrap-icons";
import "../styles/auth.css";

/* ---------- helpers for strength meter ---------- */
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = ({ target: { name, value } }) =>
    setForm((s) => ({ ...s, [name]: value }));

  const passScore = useMemo(
    () => scorePassword(form.password),
    [form.password]
  );
  const meta = strengthMeta(passScore);
  const mismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mismatch) {
      setError("Passwords do not match.");
      return;
    }
    if (passScore < 3) {
      setError(
        "Please choose a stronger password (8+ chars incl. letters & numbers)."
      );
      return;
    }

    try {
      setSubmitting(true);
      const { status, message } = await resetPasswordApi({
        token,
        password: form.password,
      });

      if (status === "success") {
        toast.success(message || "Password reset. Please log in.");
        navigate("/login");
      } else {
        setError(message || "Invalid or expired reset link.");
        toast.error(message || "Invalid or expired reset link.");
      }
    } catch (err) {
      const msg = err?.message || "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg py-5">
      <Container className="py-4">
        <Row className="justify-content-center g-4">
          {/* Hero panel (desktop) */}
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
                <h2 className="h3 mb-2">Reset your password</h2>
                <p className="text-muted mb-4">
                  Create a strong password you don’t use elsewhere.
                </p>

                <ListGroup variant="flush" className="auth-list">
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <ShieldCheck className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Secure reset</div>
                      <div className="small text-muted">
                        Your link is encrypted and time-limited.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <Key className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Use 8+ characters</div>
                      <div className="small text-muted">
                        Mix letters, numbers, and a symbol.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <Check2Circle className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Don’t reuse passwords</div>
                      <div className="small text-muted">
                        Keep your account safe from credential stuffing.
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

                <h1 className="h3 text-center mb-4">Set a new password</h1>

                {error && (
                  <Alert variant="danger" className="py-2">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
                  <Form.Label className="small fw-semibold">
                    New password
                  </Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <Lock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPass ? "text" : "password"}
                      placeholder="At least 8 characters"
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      minLength={8}
                      required
                      autoComplete="new-password"
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
                      now={meta.now}
                      variant={meta.variant}
                      style={{ height: 6, flex: 1 }}
                    />
                    <span className="small text-muted" style={{ width: 80 }}>
                      {meta.label}
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
                      placeholder="Re-enter new password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={onChange}
                      minLength={8}
                      required
                      isInvalid={mismatch}
                      autoComplete="new-password"
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
                    type="submit"
                    className="w-100 py-2 mt-3"
                    variant="primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Resetting…
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <Link to="/login" className="small">
                    Log in
                  </Link>
                  <Link to="/forgot-password" className="small">
                    Request a new link
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
