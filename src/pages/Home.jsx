import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

// Helper to concat base + path safely
const base =
  (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL.trim()) ||
  "http://localhost:8000/api/customer/v1/";
const PRODUCTS_ENDPOINT = `${base.replace(/\/?$/, "/")}products`; // .../products

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search term from URL
  const { search: locSearch } = useLocation();
  const term = new URLSearchParams(locSearch).get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build URL: always include ratings, optionally include q
        const url = new URL(PRODUCTS_ENDPOINT);
        url.searchParams.set("includeRatings", "1");
        if (term.trim()) url.searchParams.set("q", term.trim());

        const res = await fetch(url.toString());
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [term]);

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
