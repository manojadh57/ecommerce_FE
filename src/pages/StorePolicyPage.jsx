import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function StorePolicyPage() {
  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center">Store Policy</h1>
      <Row className="gy-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Img
              src="https://source.unsplash.com/800x600/?policy,agreement"
              alt="Policy"
            />
          </Card>
        </Col>
        <Col md={6}>
          <h4>Our Commitment</h4>
          <p>
            At ausTECH, we believe in transparency, sustainability, and the
            highest level of customer care. All our products are ethically
            sourced and backed by a one-year warranty.
          </p>

          <h5 className="mt-4">Warranty</h5>
          <p>
            Manufacturers’ defects? We’ve got you covered. Simply contact
            support within one year of purchase, and we’ll repair or replace
            your item at no extra cost.
          </p>

          <h5 className="mt-4">Privacy</h5>
          <p>
            We respect your data. All personal information is encrypted in
            transit and never shared with third parties without your explicit
            consent.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
