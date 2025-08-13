import { useState, useEffect, useRef } from "react";
import {
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
  Form,
  FormControl,
  ListGroup,
  Button,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Person, List as ListIcon } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

import logo from "../assets/logo.png";
import { loadCategoriesTree } from "../features/categories/categoriesAction.js";
import { logout as logoutSlice } from "../features/users/userSlice.js";
import CartButton from "./CartButton.jsx";
import "../styles/Navbar.css";

const BASE = (
  import.meta.env.VITE_BASE_URL || "http://localhost:8000/api/customer/v1/"
).trim();

export default function MainNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search: locSearch } = useLocation();

  const wrapRef = useRef(null);
  const [term, setTerm] = useState(
    () => new URLSearchParams(locSearch).get("q") || ""
  );
  const [suggest, setSuggest] = useState([]);
  const [showCats, setShowCats] = useState(false);

  // Load categories for dropdowns
  useEffect(() => {
    dispatch(loadCategoriesTree());
  }, [dispatch]);

  const { user, isAuth } = useSelector((s) => s.user);
  const { parents = [], subsByParent = {} } = useSelector(
    (s) => s.categories || {}
  );

  const displayName =
    user?.fName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  // Product search suggestions
  useEffect(() => {
    const q = term.trim();
    if (q.length < 2) return setSuggest([]);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BASE.replace(/\/?$/, "/")}products?q=${encodeURIComponent(
            q
          )}&limit=5`
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

  // Click-away to close suggestions
  useEffect(() => {
    const handle = (e) =>
      wrapRef.current && !wrapRef.current.contains(e.target) && setSuggest([]);
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

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

  const imageBase = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(
    /\/$/,
    ""
  );

  const doLogout = () => {
    try {
      sessionStorage.removeItem("accessJWT");
      localStorage.removeItem("refreshJWT");
    } catch {}
    dispatch(logoutSlice());
    navigate("/");
  };

  return (
    <>
      {/* Inline style is a final guarantee the header is NOT sticky */}
      <header
        className="two-row-navbar main-navbar shadow-sm"
        ref={wrapRef}
        style={{ position: "static", top: "auto" }}
      >
        {/* Top row: logo, search, greeting + My Orders + Logout, cart */}
        <div className="nb-top">
          <Container fluid className="py-2">
            <div className="d-flex align-items-center">
              {/* Mobile menu button + Logo */}
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="light"
                  size="sm"
                  className="d-lg-none me-1"
                  onClick={() => setShowCats(true)}
                  aria-label="Open categories"
                >
                  <ListIcon />
                </Button>
                <Link to="/" className="navbar-brand m-0 p-0">
                  <img src={logo} alt="brand" />
                </Link>
              </div>

              {/* Search (desktop) — compact */}
              <div className="flex-grow-1 d-none d-md-flex justify-content-center">
                <Form
                  className="search-bar position-relative"
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
                                ? `${imageBase}/${p.images[0]}`
                                : "https://i.imgur.com/pjITBzX.jpg"
                            }
                            alt={p.name}
                            className="suggest-thumb"
                          />
                          <span className="flex-grow-1 text-truncate">
                            {p.name}
                          </span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form>
              </div>

              {/* Right actions */}
              <div className="ms-auto d-flex align-items-center gap-3">
                {isAuth ? (
                  <>
                    <span className="fw-medium d-none d-md-inline">
                      Hi, {displayName}
                    </span>
                    <Link to="/my-orders" className="nav-link p-0 fw-semibold">
                      My Orders
                    </Link>
                    <button
                      className="btn btn-link p-0 nav-link"
                      onClick={doLogout}
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
                    title="Login"
                  />
                )}
                <CartButton onClick={() => navigate("/cart")} />
              </div>
            </div>
          </Container>
        </div>

        {/* Categories row (desktop) */}
        <div className="nb-cats d-none d-lg-block">
          <Container fluid>
            <Nav className="justify-content-center">
              <Nav.Link as={Link} to="/" className="fw-medium">
                Home
              </Nav.Link>
              {parents.map((p) => (
                <ParentLink key={p._id} cat={p} />
              ))}
            </Nav>
          </Container>
        </div>
      </header>

      {/* Mobile offcanvas */}
      <Offcanvas
        show={showCats}
        onHide={() => setShowCats(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Categories</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={() => setShowCats(false)}>
              Home
            </Nav.Link>

            {isAuth && (
              <Nav.Link
                as={Link}
                to="/my-orders"
                onClick={() => setShowCats(false)}
              >
                MY ORDERS
              </Nav.Link>
            )}

            {parents.map((p) => {
              const kids = subsByParent[p._id] || [];
              return !kids.length ? (
                <Nav.Link
                  as={Link}
                  key={p._id}
                  to={`/category/${p._id}`}
                  onClick={() => setShowCats(false)}
                >
                  {p.name}
                </Nav.Link>
              ) : (
                <div key={p._id} className="mb-2">
                  <div className="fw-semibold mb-1">{p.name}</div>
                  <div className="ps-3 d-flex flex-column gap-1">
                    {kids.map((c) => (
                      <Nav.Link
                        as={Link}
                        key={c._id}
                        to={`/category/${c._id}`}
                        onClick={() => setShowCats(false)}
                      >
                        {c.name}
                      </Nav.Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
