import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Footer = () => (
  <footer className="bg-dark text-white pt-5">
    <Container>
      <Row className="mb-4">
        <Col md>
          <h6>Shipping & Returns</h6>
          <p className="small">
            Store Policy
            <br />
            Payment Methods
          </p>
        </Col>
        <Col md>
          <h6>Contact</h6>
          <p className="small mb-1">Tel 00000000</p>
          <p className="small">manoj@gmail.com</p>
        </Col>
        <Col md>
          <h6>Follow</h6>
          <p className="small">
            Facebook
            <br />
            Instagram
            <br />
            Pinterest
          </p>
        </Col>
      </Row>

      <Row className="align-items-center border-top border-light pt-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form className="d-flex">
            <Form.Control type="email" placeholder="Email" className="me-2" />
            <Button variant="primary">Subscribe Now</Button>
          </Form>
          <Form.Check
            label="Yes, subscribe me to your newsletter."
            className="mt-2 small"
          />
        </Col>
        <Col md={6} className="text-md-end small">
          © 2025 by Manoj
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
