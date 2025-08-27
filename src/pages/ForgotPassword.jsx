import React, { useState } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { requestPasswordResetApi } from "../helpers/axiosHelpers.js";
import {
  Envelope,
  ShieldCheck,
  ClockHistory,
  Inbox,
} from "react-bootstrap-icons";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { status, message } = await requestPasswordResetApi(email.trim());
      if (status === "success") {
        toast.info(
          message || "If the account exists, we’ve sent a password reset link."
        );
        navigate("/login");
      } else {
        // Backend should typically return success for privacy; handle just in case
        setError(message || "Could not send reset link. Please try again.");
        toast.error(message || "Could not send reset link");
      }
    } catch (err) {
      const msg =
        err?.message || "Could not send reset link. Please try again.";
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
                <h2 className="h3 mb-2">Forgot your password?</h2>
                <p className="text-muted mb-4">
                  Enter your account email and we’ll send a link to reset it.
                </p>

                <ListGroup variant="flush" className="auth-list">
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <ShieldCheck className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Private & secure</div>
                      <div className="small text-muted">
                        We don’t reveal if an email exists on the account.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <ClockHistory className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Time-limited link</div>
                      <div className="small text-muted">
                        Reset links expire for your security.
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                    <Inbox className="text-primary mt-1" />
                    <div>
                      <div className="fw-semibold">Check spam/junk</div>
                      <div className="small text-muted">
                        If you don’t see it, peek in the spam folder.
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

                <h1 className="h3 text-center mb-3">Forgot password</h1>
                <p className="text-muted small mb-4 text-center">
                  Enter your account email. We’ll send a reset link if an
                  account exists.
                </p>

                {error && (
                  <Alert variant="danger" className="py-2">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
                  <Form.Label htmlFor="email" className="small fw-semibold">
                    Email
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <Envelope />
                    </InputGroup.Text>
                    <Form.Control
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </InputGroup>

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
                        Sending…
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <Link to="/login" className="small">
                    Log in
                  </Link>
                  <Link to="/signup" className="small">
                    Create an account
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

export default ForgotPassword;
