import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";

export default function PaymentMethodsPage() {
  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center">Payment Methods</h1>
      <Row className="gy-4 align-items-center">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Img
              src="https://source.unsplash.com/800x600/?credit-card,payment"
              alt="Payment"
            />
          </Card>
        </Col>
        <Col md={6}>
          <h4>Secure & Flexible</h4>
          <p>
            We accept all major credit cards and digital wallets. All
            transactions are encrypted with SSL.
          </p>
          <div className="d-flex align-items-center fs-1 gap-3">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcAmex />
            <FaCcPaypal />
          </div>
          <Button
            variant="primary"
            className="mt-4"
            href="https://www.paypal.com"
            target="_blank"
          >
            Learn More About PayPal
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
