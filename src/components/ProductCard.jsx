import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

/* ---- build absolute URL no matter what Mongo gives us ---- */
const BASE = (
  import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");
const PLACEHOLDER = `${BASE}/assets/placeholder.png`;

const imgUrl = (raw) => {
  if (!raw) return PLACEHOLDER;
  if (raw.startsWith("http")) return raw; // full URL
  if (raw.startsWith("/")) return BASE + raw; // "/assets/…"
  if (raw.startsWith("assets/")) return `${BASE}/${raw}`; // "assets/…"
  return `${BASE}/assets/${raw}`; // bare filename
};

const ProductCard = ({ product }) => {
  const imgSrc = imgUrl(product.images?.[0]);

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        src={imgSrc}
        alt={product.name}
        style={{
          width: "100%",
          height: "240px",
          objectFit: "cover",
          background: "#f6f6f6",
        }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.price.toFixed(2)}</Card.Text>

        <Button
          as={Link}
          to={`/product/${product._id}`}
          variant="primary"
          size="sm"
          className="mt-auto"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
