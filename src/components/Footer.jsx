import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Facebook, Instagram } from "react-bootstrap-icons";

import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcApplePay,
  FaCcPaypal,
  FaGooglePay,
  FaCreditCard, 
} from "react-icons/fa";
import { SiShopify } from "react-icons/si";

import "../styles/Footer.css";

const Footer = () => (
  <footer className="site-footer mt-auto pt-5">
    <Container>
      <Row className="gy-5">
        {/* ───── About ───── */}
        <Col md={4}>
          <h5 className="fw-bold mb-3">About Us</h5>
          <p className="footer-text mb-4">
            B&M TechStore thrives on providing Australians great products at
            great prices. All of our products come with a&nbsp;30&nbsp;Day Money
            Back Guarantee &amp; are shipped directly from Australia, to your
            doorstep.
          </p>

          <div className="d-flex gap-3 fs-4">
            <a href="https://facebook.com" className="footer-icon-link">
              <Facebook />
            </a>
            <a href="https://instagram.com" className="footer-icon-link">
              <Instagram />
            </a>
          </div>
        </Col>

        {/* ───── Footer menu ───── */}
        <Col md={4}>
          <h5 className="fw-bold mb-3">Footer menu</h5>
          <ul className="list-unstyled footer-menu">
            <li>
              <a href="faq">FAQ</a>
            </li>
            <li>
              <a href="shipping">Shipping Information</a>
            </li>
            <li>
              <a href="refund">Refund Policy</a>
            </li>
            <li>
              <a href="privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="terms">Terms Of Service</a>
            </li>
            <li>
              <a href="contact">Contact Us</a>
            </li>
          </ul>
        </Col>

        {/* ───── Newsletter ───── */}
        <Col md={4}>
          <h5 className="fw-bold mb-3">Newsletter</h5>
          <p className="footer-text">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>

          <Form className="d-flex flex-column gap-3 mt-3">
            <Form.Control
              type="email"
              placeholder="Enter your email address"
              className="rounded-0 py-2"
            />
            <Button variant="primary" className="w-100 py-2 fw-bold">
              SUBSCRIBE
            </Button>
          </Form>
        </Col>
      </Row>

      {/* ───── Payment icons & copyright ───── */}
      <Row className="pt-5 pb-2 align-items-center">
        <Col>
          <small>&copy; B&M TechStore</small>
        </Col>

        <Col className="d-flex justify-content-end gap-3 flex-wrap fs-3 payment-icons">
          <FaCcAmex />
          <FaCcApplePay />
          <FaGooglePay />
          <FaCcMastercard />
          <FaCcPaypal />
          <SiShopify /> {/* Shop Pay / Shopify */}
          <FaCcVisa />
          <FaCreditCard />
          {/* fallback / UnionPay placeholder */}
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
