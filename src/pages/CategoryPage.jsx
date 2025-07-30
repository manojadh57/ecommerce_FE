import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { id } = useParams(); // categoryId
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/customer/v1/products?category=${id}`
      );
      setProducts(data);
    } catch (err) {
      console.error("Error loading category products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center fw-bold">Category Products</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center">No products found in this category.</p>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CategoryPage;
