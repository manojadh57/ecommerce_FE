import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-dark text-light pt-5 border-top border-secondary">
    <Container>
      {/* Top Links & Info */}
      <Row className="gy-4 text-center text-md-start">
        {/* Policies */}
        <Col md={4}>
          <h6 className="fw-bold mb-3">Shipping & Returns</h6>
          <p className="mb-1">
            <a href="/shipping" className="text-light text-decoration-none">
              Shipping & Returns
            </a>
          </p>
          <p className="mb-1">
            <a href="/policy" className="text-light text-decoration-none">
              Store Policy
            </a>
          </p>
          <p className="mb-1">
            <a href="/payments" className="text-light text-decoration-none">
              Payment Methods
            </a>
          </p>
        </Col>

        {/* Contact */}
        <Col md={4}>
          <h6 className="fw-bold mb-3">Contact</h6>
          <p className="mb-1">
            Tel:{" "}
            <a href="tel:1234567890" className="text-light">
              123-456-7890
            </a>
          </p>
          <p className="mb-1">
            Email:{" "}
            <a href="mailto:info@ausTECH.com" className="text-light">
              info@ausTECH.com
            </a>
          </p>
        </Col>

        {/* Social */}
        <Col md={4}>
          <h6 className="fw-bold mb-3">Follow Us</h6>
          <div className="d-flex justify-content-center justify-content-md-start gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener"
              className="text-light fs-5"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
              className="text-light fs-5"
            >
              <FaInstagram />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener"
              className="text-light fs-5"
            >
              <FaPinterestP />
            </a>
          </div>
        </Col>
      </Row>

      {/* Newsletter */}
      <Row className="mt-5 justify-content-center">
        <Col lg={8} className="text-center">
          <h6 className="mb-3">
            Join our mailing list and never miss an update
          </h6>
          <Form className="d-flex justify-content-center">
            <Form.Control
              type="email"
              placeholder="Email *"
              className="me-2"
              style={{ maxWidth: "300px" }}
            />
            <Button variant="light" className="fw-bold px-4">
              Subscribe Now
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Bottom Copyright */}
      <Row className="mt-5">
        <Col className="text-center">
          <small className="text-secondary">
            © {new Date().getFullYear()} ausTECH. All rights reserved.
          </small>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
