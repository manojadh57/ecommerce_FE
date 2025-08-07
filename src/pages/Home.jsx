import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

//  helper to concat base + path safely
const base =
  import.meta.env.VITE_BASE_URL?.trim() ||
  "http://localhost:8000/api/customer/v1/";
const PRODUCTS_ENDPOINT = `${base.replace(/\/?$/, "/")}products`; // always ends with /products

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search term from UR
  const { search: locSearch } = useLocation(); //
  const term = new URLSearchParams(locSearch).get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // /products?q=term (omit param if empty)
        const url =
          term.trim().length > 0
            ? `${PRODUCTS_ENDPOINT}?q=${encodeURIComponent(term.trim())}`
            : PRODUCTS_ENDPOINT;

        const res = await fetch(url);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data.data || data.products || [];

        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [term]); // efetch whenever ?q changes

  // ─── UI ─
  return (
    <Container className="py-4">
      {term ? (
        <h4 className="mb-4 text-center">
          Results for “{term}” ({products.length})
        </h4>
      ) : (
        <h2 className="mb-4 text-center fw-bold">Explore Products</h2>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : products.length ? (
        <Row className="justify-content-center">
          {products.map((p) => (
            <Col key={p._id} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No products found.</p>
      )}
    </Container>
  );
};

export default Home;
