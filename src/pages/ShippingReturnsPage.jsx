import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

export default function ShippingReturnsPage() {
  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center">Shipping & Returns</h1>
      <Row className="align-items-center gy-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <img
              src="https://picsum.photos/seed/shipping/800/600"
              alt="Shipping box"
              className="img-fluid rounded"
            />
          </Card>
        </Col>
        <Col md={6}>
          <h4>Fast, Reliable Delivery</h4>
          <p>
            We partner with top carriers to get your order to your door in 3–5
            business days. Need it sooner? Choose express at checkout.
          </p>
          <ListGroup variant="flush">
            <ListGroup.Item>🚚 Free standard shipping over $50</ListGroup.Item>
            <ListGroup.Item>📦 Real-time tracking updates</ListGroup.Item>
            <ListGroup.Item>⚠️ Orders ship within 24 hours</ListGroup.Item>
          </ListGroup>

          <hr className="my-4" />

          <h4>Hassle-Free Returns</h4>
          <p>
            Didn’t love it? No worries—we accept returns up to 30 days after
            delivery. Items must be in original condition with tags attached.
          </p>
          <ListGroup variant="flush">
            <ListGroup.Item>🔄 Easy online return portal</ListGroup.Item>
            <ListGroup.Item>
              💰 Full refund to your original payment method
            </ListGroup.Item>
            <ListGroup.Item>
              🚀 Pre-paid return label on select orders
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
