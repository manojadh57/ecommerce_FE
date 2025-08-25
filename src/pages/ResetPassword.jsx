import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../helpers/axiosHelpers.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  const handleChange = ({ target: { name, value } }) =>
    setForm((s) => ({ ...s, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { status, message } = await resetPasswordApi({
      token,
      password: form.password,
    });
    if (status === "success") {
      toast.success(message || "Password reset. Please log in.");
      navigate("/login");
    } else {
      toast.error(message || "Invalid or expired reset link");
    }
  };

  return (
    <Container
      style={{ maxWidth: 420 }}
      className="card p-5 mt-5 shadow-lg mb-5"
    >
      <h2 className="mb-4 text-center">Set a new password</h2>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Control
          className="mb-3"
          type="password"
          placeholder="New password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />
        <Form.Control
          className="mb-4"
          type="password"
          placeholder="Confirm new password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          minLength={6}
          required
        />
        <Button type="submit" className="w-100">
          Reset Password
        </Button>
      </Form>
      <p className="small mt-3 text-center">
        Remembered it? <Link to="/login">Log In</Link>
      </p>
    </Container>
  );
};

export default ResetPassword;
