import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import "../styles/Checkout.css";

// ⬇️ NEW: Stripe hooks + card field
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const BASE =
  (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL.trim()) ||
  "http://localhost:8000/api/customer/v1/";

const IMG_BASE = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "");
const getP = (it) => it.product || it;
const getQty = (it) => it.qty ?? it.quantity ?? 1;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, cart, cartItems, clearCart } = useCart();

  // ⬇️ NEW: Stripe context
  const stripe = useStripe();
  const elements = useElements();

  // consolidate cart items
  const list = useMemo(
    () => items || cartItems || cart || [],
    [items, cartItems, cart]
  );

  // shipping method + cost (UI only; server recomputes)
  const [shipping, setShipping] = useState("standard"); // "standard" | "express"
  const shipCost = shipping === "express" ? 12.95 : 6.95;

  // simple totals for display
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

  // form state
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

  // auth check
  const isAuthed = Boolean(sessionStorage.getItem("accessJWT"));

  // submit lock
  const [placing, setPlacing] = useState(false);

  // Build address object for server
  const buildAddress = () => ({
    name: `${customer.fName} ${customer.lName}`.trim(),
    email: customer.email,
    phone: customer.phone,
    line1: customer.address1,
    line2: customer.address2,
    city: customer.city,
    state: customer.state,
    postalCode: customer.postcode,
    country: customer.country,
  });

  // ====== NEW payment flow ======
  const placeOrder = async (e) => {
    e.preventDefault();

    if (!isAuthed) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    if (!list.length) return;

    // required fields
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
    if (!EMAIL_RX.test(customer.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!stripe || !elements) {
      toast.warn("Payment is still loading. Please wait a moment.");
      return;
    }

    try {
      setPlacing(true);

      // 1) Create PaymentIntent (server computes exact cents in AUD)
      const initRes = await fetch(`${BASE}payments/create-intent`, {
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
          shippingMethod: shipping, // "standard" | "express"
        }),
      });
      const init = await initRes.json();
      if (init.status !== "success")
        throw new Error(init.message || "Init failed");

      // 2) Confirm card payment with Stripe
      const card = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        init.clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: `${customer.fName} ${customer.lName}`.trim(),
              email: customer.email,
              phone: customer.phone,
            },
          },
        }
      );
      if (error) throw new Error(error.message || "Payment failed");
      if (paymentIntent?.status !== "succeeded")
        throw new Error("Payment not completed");

      // 3) Verify+create order on server (also decrements stock)
      const confRes = await fetch(`${BASE}payments/confirm-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessJWT") || ""}`,
        },
        body: JSON.stringify({
          intentId: paymentIntent.id,
          products: list.map((it) => ({
            productId: getP(it)._id,
            quantity: getQty(it),
          })),
          shippingMethod: shipping,
          address: buildAddress(),
          notes: "",
          customer: {
            name: `${customer.fName} ${customer.lName}`.trim(),
            email: customer.email,
          },
        }),
      });
      const conf = await confRes.json();
      if (conf.status !== "success")
        throw new Error(conf.message || "Order failed");

      clearCart?.();
      toast.success("Payment completed and order placed!");
      navigate("/my-orders");
    } catch (err) {
      toast.error(err.message || "Could not place order");
    } finally {
      setPlacing(false);
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
    <>
      {/* slim animated progress bar while placing */}
      {placing && <div className="top-progress" />}

      <Container className="py-4">
        <Row className="g-lg-4">
          {/* left: details */}
          <Col lg={8}>
            <h3 className="mb-3">Checkout</h3>

            <Form onSubmit={placeOrder}>
              {/* disable inputs while placing */}
              <fieldset disabled={placing} aria-busy={placing}>
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

                {/* ⬇️ NEW: Card details */}
                <Card className="p-4 mb-4">
                  <h5 className="mb-3">Card details (test mode)</h5>
                  <div className="border rounded p-3">
                    <CardElement options={{ hidePostalCode: true }} />
                  </div>
                  <div className="text-muted small mt-2">
                    Use <code>4242 4242 4242 4242</code>, any future date, any
                    CVC.
                  </div>
                </Card>
              </fieldset>

              {/* CTA adapts to auth; shows spinner while placing */}
              <Button
                className="w-100"
                size="lg"
                type={isAuthed ? "submit" : "button"}
                disabled={isAuthed ? placing || !stripe || !elements : false}
                onClick={
                  isAuthed
                    ? undefined
                    : () => navigate("/login", { state: { from: "/checkout" } })
                }
              >
                {isAuthed ? (
                  placing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing…
                    </>
                  ) : (
                    "Pay & Place order"
                  )
                ) : (
                  "Sign in to order"
                )}
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
    </>
  );
};

export default CheckoutPage;
