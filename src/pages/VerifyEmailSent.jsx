import React from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmailSent = () => {
  const [params] = useSearchParams();
  const email = params.get("email") || "your email";
  const navigate = useNavigate();

  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <h3 className="mb-3 text-center">Check your email</h3>
      <Alert variant="info">
        We’ve sent a verification link to <strong>{email}</strong>. Click the
        link to activate your account. If you don’t see it, check your spam
        folder.
      </Alert>
      <div className="d-flex gap-2 justify-content-center">
        <Button variant="primary" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
        <Button variant="outline-secondary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default VerifyEmailSent;
