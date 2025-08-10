import React, { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import "../styles/Cart.css";

const IMG_BASE = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "");

/* Small utility to normalize your cart item shape */
const getP = (item) => item.product || item;
const getQty = (item) => item.qty ?? item.quantity ?? 1;

const CartItemRow = ({ item, onQty, onRemove, onOpen }) => {
  const p = getP(item);
  const qty = getQty(item);
  const img = p.images?.[0]
    ? `${IMG_BASE}/${p.images[0]}`
    : "https://i.imgur.com/pjITBzX.jpg";
  const line = Number(p.price || 0) * Number(qty || 1) || 0;

  const bump = (d) => onQty?.(p._id, Math.max(1, Number(qty) + d));

  return (
    <Card className="cart-item">
      <div
        className="cart-left"
        onClick={() => onOpen(p._id)}
        role="button"
        tabIndex={0}
      >
        <img src={img} alt={p.name} className="cart-thumb" />
      </div>

      <div className="cart-mid">
        <h6 className="cart-title mb-1">
          <button className="link-like" onClick={() => onOpen(p._id)}>
            {p.name}
          </button>
        </h6>
        <div className="text-muted small mb-2">
          ${Number(p.price || 0).toFixed(2)} each
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="qty-box">
            <button
              type="button"
              onClick={() => bump(-1)}
              aria-label="Decrease quantity"
            >
              <FaMinus />
            </button>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) =>
                onQty?.(p._id, Math.max(1, Number(e.target.value) || 1))
              }
            />
            <button
              type="button"
              onClick={() => bump(1)}
              aria-label="Increase quantity"
            >
              <FaPlus />
            </button>
          </div>

          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={() => onRemove?.(p._id)}
            title="Remove item"
          >
            <FaTrashAlt />
          </Button>
        </div>
      </div>

      <div className="cart-right">
        <div className="line-total">${line.toFixed(2)}</div>
      </div>
    </Card>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  // ⚠️ Your hook names may differ; this covers the common ones.
  const { items, cart, cartItems, updateQty, removeFromCart, clearCart } =
    useCart();

  const list = useMemo(
    () => items || cartItems || cart || [],
    [items, cartItems, cart]
  );

  const subtotal = useMemo(
    () =>
      list.reduce((sum, it) => {
        const p = getP(it);
        const q = getQty(it);
        return sum + Number(p.price || 0) * Number(q || 1);
      }, 0),
    [list]
  );

  const handleOpen = (id) => navigate(`/product/${id}`);
  const handleQty = (id, q) => updateQty?.(id, q);
  const handleRemove = (id) => removeFromCart?.(id);

  if (!list.length) {
    return (
      <Container className="py-5">
        <Card className="p-5 text-center">
          <h4 className="mb-2">Your cart is empty</h4>
          <p className="text-muted mb-4">Let’s find something you’ll love.</p>
          <Button as={Link} to="/" variant="primary">
            Continue shopping
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-lg-4">
        <Col lg={8}>
          <h3 className="mb-3">Your Cart</h3>

          <div className="d-flex flex-column gap-3">
            {list.map((item) => {
              const p = getP(item);
              return (
                <CartItemRow
                  key={p._id}
                  item={item}
                  onQty={handleQty}
                  onRemove={handleRemove}
                  onOpen={handleOpen}
                />
              );
            })}
          </div>

          <div className="mt-3 d-flex gap-2">
            <Button variant="outline-secondary" as={Link} to="/">
              Continue shopping
            </Button>
            {clearCart && (
              <Button variant="outline-danger" onClick={() => clearCart()}>
                Clear cart
              </Button>
            )}
          </div>
        </Col>

        <Col lg={4}>
          <Card className="p-4 cart-summary sticky-lg-top">
            <h5 className="mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="text-muted small mb-3">
              Shipping & taxes are calculated at checkout.
            </div>

            <Button
              className="w-100 mb-2"
              size="lg"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </Button>

            <Alert variant="light" className="mb-0 small">
              Your items are reserved for a limited time.
            </Alert>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
