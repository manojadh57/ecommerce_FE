import React, { useEffect, useState } from "react";
import { Alert, Spinner, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { verifyNewUserApi } from "../helpers/axiosHelpers.js";

export const VerifyUser = () => {
  const { token } = useParams(); // token from /verify-email/:token
  const navigate = useNavigate();

  const [isPending, setIsPending] = useState(true);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status, message } = await verifyNewUserApi(token);
        if (!mounted) return;

        if (status === "success") {
          setVariant("success");
          setMessage("Email verified successfully — you can log in now.");
        } else {
          setVariant("danger");
          setMessage(message || "Invalid or already verified.");
        }
      } catch (e) {
        if (!mounted) return;
        setVariant("danger");
        setMessage(e?.message || "Could not verify email. Please try again.");
      } finally {
        if (mounted) setIsPending(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <div className="text-center">
        <h3 className="mb-4">Verify your email</h3>

        {isPending ? (
          <>
            <Spinner animation="border" variant="primary" />
            <div className="mt-3">Please wait, verifying your email…</div>
          </>
        ) : (
          <>
            <Alert variant={variant} className="mt-2">
              {message}
            </Alert>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <Button variant="primary" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default VerifyUser;
