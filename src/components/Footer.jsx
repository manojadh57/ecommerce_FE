import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 border-top">
      <Container>
        {/* 3 Column Layout */}
        <Row className="mb-4 text-center text-md-start">
          <Col md={4}>
            <h6 className="fw-bold mb-3">Shipping & Returns</h6>
            <p className="mb-1">Store Policy</p>
            <p className="mb-1">Payment Methods</p>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-3">Contact</h6>
            <p className="mb-1">Tel: 123-456-7890</p>
            <a
              href="mailto:info@mysite.com"
              className="text-light text-decoration-underline"
            >
              info@mysite.com
            </a>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-3">Follow Us</h6>
            <p className="mb-1">Facebook</p>
            <p className="mb-1">Instagram</p>
            <p className="mb-1">Pinterest</p>
          </Col>
        </Row>

        {/* Newsletter */}
        <Row className="mt-4 justify-content-center text-center">
          <Col md={8}>
            <h6 className="mb-2">
              Join our mailing list and never miss an update
            </h6>
            <Form className="d-flex gap-2 justify-content-center">
              <Form.Control
                type="email"
                placeholder="Email *"
                className="w-50"
              />
              <Button variant="light" className="fw-bold px-4">
                Subscribe Now
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-5 text-center">
          <Col>
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} ausTECH. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
