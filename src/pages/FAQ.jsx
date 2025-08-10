import { Container } from "react-bootstrap";

const FAQ = () => (
  <Container className="py-5">
    <h1 className="mb-4">FAQ</h1>

    <h5>How long does shipping take?</h5>
    <p>
      Most orders ship from our Sydney warehouse within 24 hours and arrive in
      2-5 business days.
    </p>

    <h5>Do you ship internationally?</h5>
    <p>Currently we only ship within Australia.</p>

    <h5>What is the 30-day guarantee?</h5>
    <p>
      If you’re unhappy for any reason, return your item within 30 days for a
      full refund.
    </p>
  </Container>
);

export default FAQ;
