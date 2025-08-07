import React from "react";
import { Table, Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQty, removeFromCart, clearCart } = useCart();

  console.log("CartPage items:", items);

  // compute subtotal
  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + (product?.price || 0) * quantity,
    0
  );

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <Button onClick={() => navigate("/")}>Go Shopping</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Your Cart</h2>
      <Table bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Product</th>
            <th className="text-center">Price</th>
            <th className="text-center">Qty</th>
            <th className="text-center">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product?._id}>
              <td>
                <img
                  src={
                    product?.images?.[0]
                      ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace(
                          /\/$/,
                          ""
                        )}/${product.images[0]}`
                      : "https://i.imgur.com/pjITBzX.jpg"
                  }
                  alt={product?.name}
                  style={{ width: "60px", marginRight: "10px" }}
                />
                {product?.name}
              </td>
              <td className="text-center">
                ${product?.price?.toFixed(2) || "0.00"}
              </td>
              <td className="text-center w-25">
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    updateQty(product._id, Number(e.target.value))
                  }
                />
              </td>
              <td className="text-center">
                ${(product?.price * quantity).toFixed(2)}
              </td>
              <td className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeFromCart(product._id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button variant="secondary" onClick={clearCart}>
          Clear Cart
        </Button>

        <h4>Subtotal: ${subtotal.toFixed(2)}</h4>

        <Button variant="success" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </Button>
      </div>
    </Container>
  );
}
