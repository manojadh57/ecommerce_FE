import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { requestPasswordResetApi } from "../helpers/axiosHelpers.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setSubmitting(true);
    try {
      const { status, message } = await requestPasswordResetApi(email.trim());
      if (status === "success") {
        toast.info(
          message || "If the account exists, a reset link has been sent."
        );
        navigate("/login");
      } else {
        // Backend should still return success for privacy, but handle just in case
        toast.error(message || "Could not send reset link");
      }
    } catch (err) {
      toast.error(err?.message || "Could not send reset link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Container
        style={{ maxWidth: 420 }}
        className="card p-5 mt-5 shadow-lg mb-5"
      >
        <h2 className="mb-3 text-center">Forgot password</h2>
        <p className="text-muted small mb-4 text-center">
          Enter your account email. We’ll send a link to reset your password if
          the account exists.
        </p>

        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Control
            className="mb-3"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </Form>

        <p className="small mt-3 text-center">
          Remembered it? <Link to="/login">Log In</Link>
        </p>
      </Container>
    </div>
  );
};

export default ForgotPassword;
