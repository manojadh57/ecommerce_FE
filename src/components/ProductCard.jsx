import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  console.log(222, product);
  return (
    <Card className="h-100 shadow-sm">
      <div className="position-relative">
        {product.flag && (
          <Badge
            bg="dark"
            className="position-absolute top-0 start-0 m-2 text-capitalize"
          >
            {product.flag}
          </Badge>
        )}
        <Card.Img
          src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${product.images[0]}`}
          style={{ height: 220, objectFit: "cover" }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6 text-truncate">{product.name}</Card.Title>
        <Card.Text className="fw-bold">${product.price.toFixed(2)}</Card.Text>
        <Button
          as={Link}
          to={`/product/${product._id}`}
          variant="outline-primary"
          size="sm"
          className="mt-auto"
        >
          View
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
