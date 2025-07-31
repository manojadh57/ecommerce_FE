import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Search, Person, Cart3 } from "react-bootstrap-icons";

import logo from "../assets/logo.png";
import { loadCategoriesTree } from "../features/categories/categoriesAction.js";
import { userLogoutAction } from "../features/users/userAction.js";

export default function MainNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  fire categories thunk once
  useEffect(() => {
    dispatch(loadCategoriesTree());
  }, [dispatch]);

  const { user } = useSelector((store) => store.user);
  const { parents, subsByParent } = useSelector((s) => s.categories);
  const cartQty = 1;

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
      {/* Row 1 */}
      <Navbar bg="white" variant="light" className="border-bottom">
        <Container fluid className="py-2">
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="brand" height={70} />
          </Navbar.Brand>

          <div className="ms-auto d-flex align-items-center gap-4 fs-5">
            <Search role="button" />
            {user && user._id ? (
              <>
                "Logged In"{" "}
                <button
                  onClick={() => {
                    dispatch(userLogoutAction());
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Person role="button" onClick={() => navigate("/login")} />
            )}

            <div
              role="button"
              className="position-relative"
              onClick={() => navigate("/cart")}
            >
              <Cart3 />
              {!!cartQty && (
                <Badge
                  pill
                  bg="dark"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartQty}
                </Badge>
              )}
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Row 2: category bar */}
      <nav className="border-bottom bg-white">
        <Container fluid className="overflow-auto">
          <Nav className="flex-nowrap">
            <Nav.Link as={Link} to="/" className="fw-medium me-2">
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
      </nav>
    </>
  );
}
