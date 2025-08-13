import { useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { userSignInAction } from "../features/users/userAction.js";

const Login = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cred = {
      email: emailRef.current.value,
      password: passRef.current.value,
    };
    const { status } = await dispatch(userSignInAction(cred));
    if (status === "success") nav(loc.state?.from || "/");
  };
  return (
    <>
      <div className="login d-flex justify-content-center align-items-center">
        <Container
          style={{ maxWidth: 380 }}
          className="card login-card p-5 mt-5 shadow-lg mb-5"
        >
          <h2 className="mb-4 text-center">Log In</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              className="mb-3"
              type="email"
              placeholder="Email"
              ref={emailRef}
              required
            />
            <Form.Control
              className="mb-3"
              type="password"
              placeholder="Password"
              ref={passRef}
              required
            />
            <Button type="submit" variant="primary" className="w-100">
              Log In
            </Button>
          </Form>
          <br />
          
          <p className="text-center">
            Forgot Password? <a href="/forgot-password">Reset Now</a>
          </p>
          <p className="small mt-3 text-center">
            Need an account? <Link to="/signup">Sign up</Link>
          </p>
        </Container>
      </div>
    </>
  );
};
export default Login;
