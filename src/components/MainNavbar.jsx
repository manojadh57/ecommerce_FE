import { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const MainNavbar = () => {
  const [groupedCategories, setGroupedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL ||
            "http://localhost:8000/api/customer/v1/"
          }categories`
        );

        const all = data.data;
        const parents = all.filter((cat) => !cat.parent);
        const subs = all.filter((cat) => cat.parent);

        const grouped = parents.map((p) => ({
          ...p,
          children: subs.filter((s) => s.parent === p._id),
        }));

        setGroupedCategories(grouped);
      } catch (err) {
        console.error("❌ Failed to load categories:", err.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Navbar expand="lg" bg="white" className="border-bottom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          MANOJ
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {groupedCategories.map((cat) => (
              <NavDropdown title={cat.name} id={`nav-${cat._id}`} key={cat._id}>
                {cat.children.length > 0 ? (
                  cat.children.map((sub) => (
                    <NavDropdown.Item
                      as={Link}
                      to={`/category/${sub._id}`}
                      key={sub._id}
                    >
                      {sub.name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item as={Link} to={`/category/${cat._id}`}>
                    View All
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            ))}
          </Nav>

          <Nav>
            <Nav.Link>
              <i className="bi bi-search"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              <i className="bi bi-person"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              <i className="bi bi-cart" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
