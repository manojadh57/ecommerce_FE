import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Alert,
  ListGroup,
  Row,
  Col,
  Badge,
  Button,
} from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/?$/, "/");


const asAmount = (cents) =>
  ((Number(cents) || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusMeta = (s = "pending") => {
  const v = s.toLowerCase();
  if (v.includes("deliver")) return { variant: "success", label: "Delivered" };
  if (v.includes("ship")) return { variant: "info", label: "Shipped" };
  if (v.includes("cancel")) return { variant: "danger", label: "Cancelled" };
  if (v.includes("paid")) return { variant: "primary", label: "Paid" };
  return { variant: "secondary", label: "Pending" };
};

export default function OrderConfirmation() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // prefer order passed from Checkout; fallback to fetching /orders and finding it
  const [order, setOrder] = useState(state?.order || null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    const fetchIfNeeded = async () => {
      if (order) return;
      try {
        const res = await fetch(`${BASE}orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + (sessionStorage.getItem("accessJWT") || ""),
          },
        });
        if (!res.ok) throw new Error("Unable to load recent orders");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.orders)
          ? data.data.orders
          : [];
        const found =
          list.find((o) => String(o?._id) === String(id)) ||
          list[list.length - 1];
        if (!ignore) setOrder(found || null);
        if (!found && !ignore)
          setErr("We couldn’t find that order yet. Try My Orders.");
      } catch (e) {
        if (!ignore) setErr(e.message || "Could not load order");
      }
    };
    fetchIfNeeded();
    return () => {
      ignore = true;
    };
  }, [id, order]);

  const created = useMemo(
    () => (order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""),
    [order]
  );
  const lines = Array.isArray(order?.products) ? order.products : [];
  const itemCount = lines.reduce(
    (sum, l) => sum + (Number(l?.quantity) || 0),
    0
  );
  const { variant, label } = statusMeta(order?.status);

  return (
    <Container className="py-5" style={{ maxWidth: 880 }}>
      <h2 className="mb-2">Order confirmed</h2>
      <p className="text-muted mb-4">
        Order <strong>#{order?._id || id}</strong>
        {created ? ` • ${created}` : ""}{" "}
        {order?.status ? (
          <>
            • <Badge bg={variant}>{label}</Badge>
          </>
        ) : null}
      </p>

      {/* Info about email being sent */}
      <Alert variant="info" className="mb-4">
        We’re sending your order confirmation email now. It should arrive within
        a minute. If you don’t see it, check your spam folder.
      </Alert>

      {err ? (
        <Alert variant="warning" className="mb-4">
          {err}
        </Alert>
      ) : null}

      {/* Line items */}
      <ListGroup className="mb-3">
        {lines.map(({ productId, quantity }, idx) => {
          const p = typeof productId === "object" && productId ? productId : {};
          const name = p?.name || productId || "(product)";
          // if you store unit price in cents on productId.price:
          const unitCents = Number(p?.price || 0);
          return (
            <ListGroup.Item key={idx}>
              <Row className="align-items-center">
                <Col xs={7}>{name}</Col>
                <Col xs={2} className="text-center">
                  × {quantity}
                </Col>
                <Col xs={3} className="text-end">
                  {asAmount(unitCents * quantity)}
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
        <ListGroup.Item>
          <Row>
            <Col>
              <strong>Items</strong>
            </Col>
            <Col className="text-end">
              <strong>{itemCount}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>
              <strong>Total paid</strong>
            </Col>
            <Col className="text-end">
              <strong>{asAmount(order?.totalAmount || 0)}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>

      {/* Next steps */}
      <div className="mb-4">
        <h5>What happens next?</h5>
        <ul className="mb-0">
          <li>
            We’ll email you updates when your order is <em>shipped</em> or{" "}
            <em>delivered</em>.
          </li>
          <li>
            You can track the status anytime on <strong>My Orders</strong>.
          </li>
          <li>If you spot any mistake, contact support before it ships.</li>
        </ul>
      </div>

      <div className="d-flex gap-2">
        <Button variant="primary" onClick={() => navigate("/my-orders")}>
          Go to My Orders
        </Button>
        <Button variant="outline-secondary" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}
