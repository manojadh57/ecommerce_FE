import React, { useEffect, useState } from "react";
import {
  Container,
  Spinner,
  Alert,
  ListGroup,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderHistoryPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}orders`,
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("accessJWT"),
            },
          }
        );
        // take the most recent order
        if (Array.isArray(data) && data.length > 0) {
          // assuming data sorted by createdAt asc
          setOrder(data[data.length - 1]);
        } else {
          setErr("No orders found");
        }
      } catch (e) {
        setErr("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (err) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{err}</Alert>
        <Button onClick={() => navigate("/")}>Go Shopping</Button>
      </Container>
    );
  }

  // show confirmation and summary
  return (
    <Container className="py-5">
      <h2>Thank you for your purchase!</h2>
      <p>
        Your order <strong>#{order._id}</strong> is now{" "}
        <strong>{order.status}</strong>.
      </p>

      <ListGroup className="mb-4">
        {order.products.map(({ productId, quantity }) => (
          <ListGroup.Item key={productId._id || productId}>
            <Row className="align-items-center">
              <Col>{productId.name || productId}</Col>
              <Col>x {quantity}</Col>
              <Col className="text-end">
                ${((productId.price || 0) * quantity).toFixed(2)}
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
        <ListGroup.Item>
          <Row>
            <Col>
              <strong>Total Paid:</strong>
            </Col>
            <Col className="text-end">
              <strong>${order.totalAmount.toFixed(2)}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>

      <Button onClick={() => navigate("/")}>Continue Shopping</Button>
    </Container>
  );
}
