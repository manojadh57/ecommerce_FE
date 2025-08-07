import { Container } from "react-bootstrap";

const ShippingInfo = () => (
  <Container className="py-5">
    <h1 className="mb-4">Shipping Information</h1>
    <p>
      • Standard Shipping — <strong>FREE</strong> on orders $50+ (otherwise
      $6.95).
      <br />• Express Shipping — <strong>$12.95</strong>, 1-3 business days.
      <br />• All parcels include tracking &amp; signature on delivery.
    </p>
  </Container>
);

export default ShippingInfo;
