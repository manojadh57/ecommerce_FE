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
import { userLogoutAction } from "../features/users/userAction.js";
import CartButton from "./CartButton.jsx";
import "../styles/Navbar.css";

const BASE =
  (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL.trim()) ||
  "http://localhost:8000/api/customer/v1/";

export default function MainNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search: locSearch } = useLocation();

  // wrapper ref (for outside-click + measuring height)
  const wrapRef = useRef(null);

  // search state
  const [term, setTerm] = useState(
    () => new URLSearchParams(locSearch).get("q") || ""
  );
  const [suggest, setSuggest] = useState([]);

  // mobile categories drawer
  const [showCats, setShowCats] = useState(false);

  // data
  useEffect(() => {
    dispatch(loadCategoriesTree());
  }, [dispatch]);

  const { user } = useSelector((s) => s.user);
  const { parents, subsByParent } = useSelector((s) => s.categories);
  const displayName =
    user?.fName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  // keep CSS var of header height (so sticky content avoids overlap)
  useEffect(() => {
    const setNavH = () => {
      const h = wrapRef.current?.offsetHeight || 72;
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };
    setNavH();
    window.addEventListener("resize", setNavH);
    return () => window.removeEventListener("resize", setNavH);
  }, []);

  // fetch search suggestions (with debounce)
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

  // close suggestions on outside click
  useEffect(() => {
    const handle = (e) =>
      wrapRef.current && !wrapRef.current.contains(e.target) && setSuggest([]);
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // handlers
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

  return (
    <>
      <header className="two-row-navbar main-navbar shadow-sm" ref={wrapRef}>
        {/* Row 1: logo | search (center) | user + cart */}
        <div className="nb-top">
          <Container fluid className="py-2">
            <div className="d-flex align-items-center">
              {/* left: logo + (mobile) categories button */}
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
                  <img src={logo} alt="brand" height={64} />
                </Link>
              </div>

              {/* center: search */}
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

              {/* right: auth + cart */}
              <div className="ms-auto d-flex align-items-center gap-3">
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
                    title="Login"
                  />
                )}
                <CartButton onClick={() => navigate("/cart")} />
              </div>
            </div>
          </Container>
        </div>

        {/* Row 2: centered categories (desktop) */}
        <div className="nb-cats d-none d-lg-block border-top">
          <Container fluid>
            <Nav className="justify-content-center">
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
          </Container>
        </div>
      </header>

      {/* Mobile categories drawer */}
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
            <Nav.Link
              as={Link}
              to="/collections"
              onClick={() => setShowCats(false)}
            >
              All Collections
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
