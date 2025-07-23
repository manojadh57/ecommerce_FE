import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import api from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products", {
        params: { page: 1, limit: 20 },
      });

      setProducts(data || []);
    } catch (err) {
      console.error("API error:", err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );

  if (!products.length)
    return <p className="text-center mt-5">No products yet.</p>;

  return (
    <Container className="py-4">
      <Row className="g-4">
        {products.map((p) => (
          <Col key={p._id} xs={6} md={4} lg={3}>
            <ProductCard product={p} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;
