//  src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const CUSTOMER_URL =
  import.meta.env.VITE_BASE_URL?.trim() ||
  "http://localhost:8000/api/customer/v1/";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${CUSTOMER_URL}products`);

        /* ---------- accept any of the 3 common shapes ------------ */
        const list = Array.isArray(data)
          ? data // plain array
          : Array.isArray(data?.data)
          ? data.data // { data: [...] }
          : Array.isArray(data?.products)
          ? data.products // { products: [...] }
          : [];

        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center fw-bold">Explore Products</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : products.length ? (
        <Row>
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
