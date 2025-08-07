import { Container, Form, Button } from "react-bootstrap";

const ContactUs = () => (
  <Container className="py-5" style={{ maxWidth: "600px" }}>
    <h1 className="mb-4">Contact Us</h1>

    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Your name" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="name@example.com" />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" rows={4} />
      </Form.Group>

      <Button type="submit" variant="primary">
        Send Message
      </Button>
    </Form>
  </Container>
);

export default ContactUs;
