import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imgSrc = `${
    import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8000"
  }/${product.images?.[0] || "placeholder.png"}`;

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={imgSrc}
        alt={product.name}
        style={{
          width: "100%",
          height: "250px", // Fixed height for all images
          objectFit: "cover", // Crop + scale to fill perfectly
          borderRadius: "8px 8px 0 0",
          backgroundColor: "#f6f6f6",
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
