import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import "../styles/Checkout.css";

const BASE =
  (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL.trim()) ||
  "http://localhost:8000/api/customer/v1/";

const IMG_BASE = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "");
const getP = (it) => it.product || it;
const getQty = (it) => it.qty ?? it.quantity ?? 1;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, cart, cartItems, clearCart } = useCart();

  const list = useMemo(
    () => items || cartItems || cart || [],
    [items, cartItems, cart]
  );

  const [shipping, setShipping] = useState("standard"); // standard|express
  const shipCost = shipping === "express" ? 12.95 : 6.95;

  const subtotal = useMemo(
    () =>
      list.reduce((sum, it) => {
        const p = getP(it);
        const q = getQty(it);
        return sum + Number(p.price || 0) * Number(q || 1);
      }, 0),
    [list]
  );
  const total = Math.max(0, subtotal + shipCost);

  const [customer, setCustomer] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "AU",
  });
  const onChange = (e) =>
    setCustomer((s) => ({ ...s, [e.target.name]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!list.length) return;

    // basic required checks
    const reqd = [
      "fName",
      "lName",
      "email",
      "address1",
      "city",
      "state",
      "postcode",
    ];
    for (const k of reqd) {
      if (!String(customer[k] || "").trim()) {
        toast.error(`Please fill ${k}`);
        return;
      }
    }

    try {
      const res = await fetch(`${BASE}orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessJWT") || ""}`,
        },
        body: JSON.stringify({
          products: list.map((it) => ({
            productId: getP(it)._id,
            quantity: getQty(it),
          })),
          status: "pending",
          // client total is advisory; backend should re-price
          totalAmount: total,
          // optional extra details (backend may store them if schema allows)
          customer: {
            name: `${customer.fName} ${customer.lName}`.trim(),
            email: customer.email,
            phone: customer.phone,
          },
          shipping: {
            ...customer,
            method: shipping,
            cost: shipCost,
          },
          payment: {
            provider: "none",
            status: "unpaid",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      clearCart?.();
      toast.success("Order placed. We’ll email you the details.");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!list.length) {
    return (
      <Container className="py-5">
        <Card className="p-5 text-center">
          <h4>Your cart is empty</h4>
          <p className="text-muted">Add items to continue to checkout.</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-lg-4">
        {/* left: details */}
        <Col lg={8}>
          <h3 className="mb-3">Checkout</h3>

          <Form onSubmit={placeOrder}>
            <Card className="p-4 mb-4">
              <h5 className="mb-3">Customer details</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    name="fName"
                    value={customer.fName}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    name="lName"
                    value={customer.lName}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={customer.phone}
                    onChange={onChange}
                  />
                </Col>
              </Row>
            </Card>

            <Card className="p-4 mb-4">
              <h5 className="mb-3">Shipping address</h5>
              <Row className="g-3">
                <Col md={8}>
                  <Form.Label>Address line 1</Form.Label>
                  <Form.Control
                    name="address1"
                    value={customer.address1}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Address line 2</Form.Label>
                  <Form.Control
                    name="address2"
                    value={customer.address2}
                    onChange={onChange}
                  />
                </Col>
                <Col md={5}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    value={customer.city}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name="state"
                    value={customer.state}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control
                    name="postcode"
                    value={customer.postcode}
                    onChange={onChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="country"
                    value={customer.country}
                    onChange={onChange}
                  >
                    <option value="AU">Australia</option>
                  </Form.Select>
                </Col>
                <Col md={8}>
                  <Form.Label>Shipping method</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="ship-standard"
                      label="Standard (2–5 days) — $6.95"
                      checked={shipping === "standard"}
                      onChange={() => setShipping("standard")}
                    />
                    <Form.Check
                      type="radio"
                      id="ship-express"
                      label="Express (1–3 days) — $12.95"
                      checked={shipping === "express"}
                      onChange={() => setShipping("express")}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Button className="w-100" size="lg" type="submit">
              Place order
            </Button>
          </Form>
        </Col>

        {/* right: summary */}
        <Col lg={4}>
          <Card className="p-4 sticky-lg-top checkout-summary">
            <h5 className="mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <strong>${shipCost.toFixed(2)}</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Total</span>
              <strong>${total.toFixed(2)} AUD</strong>
            </div>

            <div className="mini-items mt-3">
              {list.slice(0, 4).map((it) => {
                const p = getP(it);
                const q = getQty(it);
                const img = p.images?.[0]
                  ? `${IMG_BASE}/${p.images[0]}`
                  : "https://i.imgur.com/pjITBzX.jpg";
                return (
                  <div className="mini-line" key={p._id}>
                    <img src={img} alt={p.name} />
                    <div className="mini-name text-truncate">
                      {p.name} ×{q}
                    </div>
                    <div className="mini-line-total">
                      ${(Number(p.price || 0) * Number(q)).toFixed(2)}
                    </div>
                  </div>
                );
              })}
              {list.length > 4 && (
                <div className="text-muted small mt-1">
                  + {list.length - 4} more item(s)
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
