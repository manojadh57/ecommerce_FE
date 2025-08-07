import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import axios from "axios";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // compute totalAmount
  const totalAmount = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // build payload to match Order schema in backend
      const payload = {
        products: items.map(({ product, quantity }) => ({
          productId: product._id,
          quantity,
        })),
        totalAmount,
      };

      // call the customer orders endpoint
      await axios.post(`${import.meta.env.VITE_BASE_URL}orders`, payload, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessJWT"),
        },
      });

      toast.success("Order placed successfully");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your cart is empty.</h2>
        <Button onClick={() => navigate("/")}>Go Shopping</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Confirm Your Order</h2>
      <Row className="mt-4">
        <Col md={8}>
          <ListGroup variant="flush">
            {items.map(({ product, quantity }) => (
              <ListGroup.Item key={product._id}>
                <Row className="align-items-center">
                  <Col xs={2}>
                    <img
                      src={
                        product.images?.[0]
                          ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace(
                              /\/$/,
                              ""
                            )}/${product.images[0]}`
                          : "https://i.imgur.com/pjITBzX.jpg"
                      }
                      alt={product.name}
                      className="img-fluid"
                    />
                  </Col>
                  <Col xs={6}>{product.name}</Col>
                  <Col xs={2}>x {quantity}</Col>
                  <Col xs={2}>${(product.price * quantity).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <Row>
                <Col>
                  <strong>Total:</strong>
                </Col>
                <Col className="text-end">
                  <strong>${totalAmount.toFixed(2)}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4} className="text-end">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Place Order"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
