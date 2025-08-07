import { useState, useEffect, useRef } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
  Form,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Person } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

import logo from "../assets/logo.png";
import { loadCategoriesTree } from "../features/categories/categoriesAction.js";
import { userLogoutAction } from "../features/users/userAction.js";
import CartButton from "./CartButton.jsx";
import "../styles/Navbar.css";

const BASE =
  import.meta.env.VITE_BASE_URL?.trim() ||
  "http://localhost:8000/api/customer/v1/";

export default function MainNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search: locSearch } = useLocation();

  /* ─── search state ─── */
  const [term, setTerm] = useState(
    () => new URLSearchParams(locSearch).get("q") || ""
  );
  const [suggest, setSuggest] = useState([]);
  const boxRef = useRef(null);

  /* ─── categories ─── */
  useEffect(() => {
    dispatch(loadCategoriesTree());
  }, [dispatch]);

  const { user } = useSelector((s) => s.user);
  const { parents, subsByParent } = useSelector((s) => s.categories);
  const displayName =
    user?.fName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  /* ─── fetch suggestions ─── */
  useEffect(() => {
    const q = term.trim();
    if (q.length < 2) return setSuggest([]);

    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BASE}products?q=${encodeURIComponent(q)}&limit=5`
        );
        const data = await res.json();
        setSuggest(
          Array.isArray(data) ? data : data.data || data.products || []
        );
      } catch {
        setSuggest([]);
      }
    }, 250);

    return () => clearTimeout(id);
  }, [term]);

  /* ─── close on outside click ─── */
  useEffect(() => {
    const handle = (e) =>
      boxRef.current && !boxRef.current.contains(e.target) && setSuggest([]);
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* ─── handlers ─── */
  const submitSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (q) navigate(`/?q=${encodeURIComponent(q)}`);
    setSuggest([]);
  };

  const ParentLink = ({ cat }) => {
    const kids = subsByParent[cat._id] || [];
    return !kids.length ? (
      <Nav.Link as={Link} to={`/category/${cat._id}`} className="fw-medium">
        {cat.name}
      </Nav.Link>
    ) : (
      <NavDropdown title={cat.name} id={cat._id} className="fw-medium">
        {kids.map((c) => (
          <NavDropdown.Item as={Link} to={`/category/${c._id}`} key={c._id}>
            {c.name}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    );
  };

  return (
    <>
      <Navbar
        sticky="top"
        expand="lg"
        bg="white"
        className="shadow-sm main-navbar"
        ref={boxRef}
      >
        <Container fluid>
          {/* brand */}
          <Navbar.Brand as={Link} to="/" className="py-0 me-3">
            <img src={logo} alt="brand" height={70} />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvas-nav" />

          {/* off-canvas menu (mobile) */}
          <Navbar.Offcanvas id="offcanvas-nav" placement="start">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-grow-1">
                <Nav.Link as={Link} to="/" className="fw-medium">
                  Home
                </Nav.Link>
                {parents.map((p) => (
                  <ParentLink key={p._id} cat={p} />
                ))}
                <Nav.Link as={Link} to="/collections" className="fw-medium">
                  All Collections
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* pill search (desktop) */}
          <Form
            className="search-bar d-none d-lg-flex position-relative me-lg-4"
            onSubmit={submitSearch}
          >
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0 ps-3">
                <Search size={18} className="text-muted" />
              </span>

              <FormControl
                type="search"
                placeholder="Search products"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-0 shadow-none"
              />

              <button
                className="btn btn-primary rounded-end-pill"
                type="submit"
              >
                Go
              </button>
            </div>

            {suggest.length > 0 && (
              <ListGroup className="suggest-box">
                {suggest.map((p) => (
                  <ListGroup.Item
                    action
                    key={p._id}
                    className="d-flex align-items-center gap-3"
                    onClick={() => {
                      navigate(`/product/${p._id}`);
                      setTerm("");
                      setSuggest([]);
                    }}
                  >
                    <img
                      src={
                        p.images?.[0]
                          ? `${(
                              import.meta.env.VITE_IMAGE_BASE_URL || ""
                            ).replace(/\/$/, "")}/${p.images[0]}`
                          : "https://i.imgur.com/pjITBzX.jpg"
                      }
                      alt={p.name}
                      className="suggest-thumb"
                    />
                    <span className="flex-grow-1 text-truncate">{p.name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form>

          {/* right-hand cluster */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {user?._id ? (
              <>
                <span className="fw-medium d-none d-md-inline">
                  Hi, {displayName}
                </span>
                <button
                  className="btn btn-link p-0 nav-link"
                  onClick={() => dispatch(userLogoutAction())}
                >
                  Logout
                </button>
              </>
            ) : (
              <Person
                role="button"
                size={22}
                onClick={() => navigate("/login")}
                className="text-primary"
              />
            )}
            <CartButton onClick={() => navigate("/cart")} />
          </div>
        </Container>
      </Navbar>
    </>
  );
}
