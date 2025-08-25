import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
  Image,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Clipboard,
  CheckCircleFill,
  Truck,
  ClockHistory,
  XCircle,
  BoxSeam,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import { useCart } from "../hooks/useCart.jsx";
import "../styles/my-orders.css";

const BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/?$/, "/");
const IMG_BASE = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "");

const imgUrl = (path) =>
  !path
    ? "https://i.imgur.com/pjITBzX.jpg"
    : /^https?:\/\//i.test(path)
    ? path
    : `${IMG_BASE}/${path}`.replace(/([^:]\/)\/+/g, "$1");

// ✅ FIX: cents → plain number with 2 decimals, no currency symbol
const formatMoney = (cents) =>
  ((Number(cents) || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function statusMeta(raw) {
  const s = (raw || "pending").toLowerCase();
  if (s.includes("deliver"))
    return { variant: "success", label: "Delivered", Icon: CheckCircleFill };
  if (s.includes("ship"))
    return { variant: "info", label: "Shipped", Icon: Truck };
  if (s.includes("cancel"))
    return { variant: "danger", label: "Cancelled", Icon: XCircle };
  if (s.includes("paid"))
    return { variant: "primary", label: "Paid", Icon: CheckCircleFill };
  return { variant: "secondary", label: "Pending", Icon: ClockHistory };
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const access = sessionStorage.getItem("accessJWT") || "";
        const res = await fetch(`${BASE}orders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        if (!res.ok) {
          const msg =
            res.status === 401 ? "Please log in again." : await res.text();
          throw new Error(msg || "Failed to load orders");
        }

        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data?.orders)
          ? data.data.orders
          : [];

        setOrders(list);
      } catch (e) {
        setErr(e.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (err) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{err}</Alert>
      </Container>
    );
  }

  if (!orders.length) {
    return (
      <Container className="py-4">
        <h3 className="mb-3">My Orders</h3>
        <Alert variant="info" className="mb-0">
          You haven’t placed any orders yet.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4 my-orders">
      <div className="d-flex align-items-center gap-2 mb-3">
        <BoxSeam className="text-primary" size={20} />
        <h3 className="m-0">My Orders</h3>
        <Badge bg="light" text="dark" className="ms-2">
          {orders.length}
        </Badge>
      </div>

      <div className="d-flex flex-column gap-4">
        {orders.map((o, idx) => {
          const created = o.createdAt
            ? new Date(o.createdAt).toLocaleString()
            : "";
          const { variant, label, Icon } = statusMeta(o.status);
          const total = formatMoney(o.totalAmount); // now correct (cents → 2-decimals, no $)
          const lines = Array.isArray(o.products) ? o.products : [];
          const itemCount = lines.reduce(
            (sum, l) => sum + (Number(l?.quantity) || 0),
            0
          );
          const isPendingLike = (o.status || "").toLowerCase().includes("pend");

          // actions
          const copyId = async () => {
            try {
              await navigator.clipboard.writeText(o._id || "");
            } catch {}
            alert("Order ID copied");
          };

          const reorder = () => {
            let added = 0;
            lines.forEach((line) => {
              const prod =
                typeof line.productId === "object" && line.productId
                  ? line.productId
                  : null;
              const qty = Number(line?.quantity) || 1;
              if (prod && prod._id) {
                addToCart(prod, qty);
                added += qty;
              }
            });
            if (added) alert(`Added ${added} item(s) to your cart.`);
            else alert("Reorder not available for this order.");
          };

          const downloadInvoice = () => {
            alert("Invoice download coming soon.");
          };

          const cancelOrder = async () => {
            if (!isPendingLike) return;
            const ok = confirm("Cancel this order? This cannot be undone.");
            if (!ok) return;
            // TODO: implement API call (e.g., PATCH /orders/:id/cancel)
            alert("Cancel request sent (stub).");
          };

          return (
            <Card key={o._id || idx} className="order-card shadow-sm border-0">
              <Card.Header className="order-card__header d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="text-muted small">Order</span>
                  <strong className="order-id">{o._id}</strong>
                  <span className="ms-2 small text-muted">• {created}</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* ▼ per-order dropdown */}
                  <Dropdown align="end" className="order-menu">
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="border"
                      aria-label="Order actions"
                    >
                      <ThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={copyId}>
                        <Clipboard size={14} className="me-2" />
                        Copy Order ID
                      </Dropdown.Item>
                      <Dropdown.Item onClick={reorder}>
                        Reorder items
                      </Dropdown.Item>
                      <Dropdown.Item onClick={downloadInvoice}>
                        Download invoice
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={cancelOrder}
                        disabled={!isPendingLike}
                        className={isPendingLike ? "text-danger" : ""}
                      >
                        Cancel order
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Badge bg={variant} className="px-2 py-1">
                    <Icon className="me-1" size={14} />
                    {label}
                  </Badge>
                  <div className="order-total fw-semibold">{total}</div>
                </div>
              </Card.Header>

              <Card.Body className="pt-3">
                {lines.map((line, i) => {
                  const prod =
                    typeof line.productId === "object" && line.productId
                      ? line.productId
                      : {};
                  const id = prod?._id || line?.productId || "";
                  const name = prod?.name || line?.name || "(product)";
                  const qty = line?.quantity ?? 1;
                  const thumb = imgUrl(
                    prod?.images?.[0] || prod?.image || line?.image
                  );

                  return (
                    <Row key={i} className="align-items-center g-3 order-line">
                      <Col xs="auto">
                        <Link
                          to={id ? `/product/${id}` : "#"}
                          className="text-decoration-none"
                        >
                          <Image
                            src={thumb}
                            alt={name}
                            width={64}
                            height={64}
                            rounded
                            className="order-thumb"
                          />
                        </Link>
                      </Col>
                      <Col className="min-w-0">
                        <div className="text-truncate">
                          {id ? (
                            <Link to={`/product/${id}`} className="order-name">
                              {name}
                            </Link>
                          ) : (
                            <span className="order-name">{name}</span>
                          )}
                        </div>
                        <div className="small text-muted">Qty: {qty}</div>
                      </Col>
                      <Col xs="auto">
                        <Badge bg="light" text="dark" className="qty-badge">
                          × {qty}
                        </Badge>
                      </Col>
                    </Row>
                  );
                })}
              </Card.Body>

              <Card.Footer className="bg-transparent d-flex justify-content-between align-items-center">
                <span className="small text-muted">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
                <span className="fw-semibold">{total}</span>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
