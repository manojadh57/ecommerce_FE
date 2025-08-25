import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { userSignupAction } from "../features/users/userAction";

const Signup = () => {
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { confirmPassword, ...userData } = form;

    const { status } = await dispatch(userSignupAction(userData));

    if (status === "success") {
      setForm({
        fName: "",
        lName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // ⬇️ only change: go to verification page and echo the email
      navigate(`/verify-email-sent?email=${encodeURIComponent(form.email)}`);
    }
  };

  return (
    <div className="signup d-flex justify-content-center align-items-center">
      <Container
        style={{ maxWidth: 420 }}
        className="card signup-card p-5 mt-5 shadow-lg mb-5"
      >
        <h2 className="mb-4 text-center">Create Account</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Control
            className="mb-3"
            placeholder="First Name"
            name="fName"
            value={form.fName}
            onChange={handleChange}
            required
          />

          <Form.Control
            className="mb-3"
            placeholder="Last Name"
            name="lName"
            value={form.lName}
            onChange={handleChange}
            required
          />

          <Form.Control
            className="mb-3"
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Form.Control
            className="mb-3"
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={3}
          />

          <Form.Control
            className="mb-4"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={3}
          />

          <Button type="submit" variant="primary" className="w-100">
            Sign Up
          </Button>
        </Form>

        <p className="small mt-3 text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </Container>
    </div>
  );
};

export default Signup;
