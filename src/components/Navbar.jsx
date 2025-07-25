import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart.jsx";
import { useSelector, useDispatch } from "react-redux";
import { userLogoutAction } from "../features/users/userAction.js";

const AppNavbar = () => {
  const { items } = useCart();
  const qty = items.reduce((n, i) => n + i.qty, 0);
  const { isAuth } = useSelector((s) => s.user);
  const dispatch = useDispatch();

  return (
    <Navbar bg="white" sticky="top" className="border-bottom py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          MANOJ
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Shop
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
        </Nav>
        <Form className="d-none d-lg-flex me-3">
          <FormControl size="sm" placeholder="Search" />
        </Form>
        <Nav>
          {isAuth ? (
            <Nav.Link onClick={() => dispatch(userLogoutAction())}>
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">
              Log In
            </Nav.Link>
          )}
          <Nav.Link as={Link} to="/cart" className="position-relative">
            <i className="bi bi-bag fs-5" />
            {qty > 0 && (
              <Badge
                pill
                bg="primary"
                className="position-absolute top-0 start-100 translate-middle"
              >
                {qty}
              </Badge>
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default AppNavbar;
