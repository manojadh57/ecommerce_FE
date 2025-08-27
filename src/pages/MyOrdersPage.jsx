// src/pages/MyOrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  Modal,
  ProgressBar,
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
  Search,
  GeoAlt,
  Person,
  Telephone,
  Envelope,
} from "react-bootstrap-icons";
import { useCart } from "../hooks/useCart.jsx";
import "../styles/my-orders.css";

/* ---------- Config ---------- */
const BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/?$/, "/");
const IMG_BASE = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(/\/$/, "");

/* ---------- Utils ---------- */
const imgUrl = (path) =>
  !path
    ? "https://i.imgur.com/pjITBzX.jpg"
    : /^https?:\/\//i.test(path)
    ? path
    : `${IMG_BASE}/${path}`.replace(/([^:]\/)\/+/g, "$1");

const formatMoney = (cents) =>
  ((Number(cents) || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* Allowed statuses: pending | shipped | delivered | cancelled */
function normalizeStatus(raw) {
  const s = String(raw || "").toLowerCase();
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("deliver")) return "delivered";
  if (s.includes("ship") || s.includes("dispatch")) return "shipped";
  return "pending";
}

function statusMeta(raw) {
  const s = normalizeStatus(raw);
  if (s === "delivered")
    return {
      variant: "success",
      label: "Delivered",
      Icon: CheckCircleFill,
      step: 2,
    };
  if (s === "shipped")
    return { variant: "info", label: "Shipped", Icon: Truck, step: 1 };
  if (s === "cancelled")
    return { variant: "danger", label: "Cancelled", Icon: XCircle, step: -1 };
  return {
    variant: "secondary",
    label: "Pending",
    Icon: ClockHistory,
    step: 0,
  };
}

/* ---------- Track stepper ---------- */
const STEPS = ["pending", "shipped", "delivered"]; // positions: 0/1/2

function Stepper({ status }) {
  const s = normalizeStatus(status);
  if (s === "cancelled") {
    return <div className="alert alert-warning py-2 mb-3">Order CANCELLED</div>;
  }
  const idx = s === "delivered" ? 2 : s === "shipped" ? 1 : 0;

  return (
    <>
      <ol className="list-unstyled d-flex flex-wrap gap-3 mb-2">
        {STEPS.map((label, i) => {
          const done = i <= idx;
          return (
            <li key={label} className="d-flex align-items-center">
              <span
                className={`me-2 rounded-circle ${
                  done ? "bg-dark" : "bg-light"
                } border`}
                style={{ width: 14, height: 14, display: "inline-block" }}
                aria-hidden="true"
              />
              <span className={`small ${done ? "fw-semibold" : "text-muted"}`}>
                {label[0].toUpperCase() + label.slice(1)}
              </span>
              {i < STEPS.length - 1 && (
                <span className="mx-2 text-muted" aria-hidden="true">
                  —
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Animated progress: 33% / 66% / 100% */}
      <ProgressBar
        now={(idx + 1) * 33.34}
        className="progress-bar-striped progress-bar-animated"
        style={{ height: 8 }}
      />
    </>
  );
}

/* ---------- Address block ---------- */
function AddressBlock({ address, status, shippingMethod }) {
  if (!address) return null;
  const { name, phone, email, line1, line2, city, state, postalCode, country } =
    address || {};

  const headline =
    String(status).toLowerCase() === "delivered"
      ? "Delivered to"
      : "Shipping to";

  return (
    <div className="border rounded p-3 mt-3">
      <div className="d-flex align-items-center gap-2 mb-2">
        <GeoAlt className="text-danger" size={18} />
        <span className="fw-semibold">{headline}</span>
        {shippingMethod && (
          <Badge bg="light" text="dark" className="ms-2">
            {shippingMethod}
          </Badge>
        )}
      </div>

      <div className="small">
        {name && (
          <div className="mb-1">
            <Person size={14} className="me-1" />
            {name}
          </div>
        )}

        {(line1 || line2) && (
          <div className="mb-1">
            {line1}
            {line2 ? `, ${line2}` : ""}
          </div>
        )}

        {(city || state || postalCode) && (
          <div className="mb-1">
            {[city, state, postalCode].filter(Boolean).join(" ")}
          </div>
        )}

        {country && <div className="mb-1">{country}</div>}

        {(phone || email) && (
          <div className="text-muted">
            {phone && (
              <>
                <Telephone size={14} className="me-1" />
                {phone}
              </>
            )}
            {phone && email && <span className="mx-2">•</span>}
            {email && (
              <>
                <Envelope size={14} className="me-1" />
                {email}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Track Modal (no new routes; uses already-fetched orders) ---------- */
function TrackModal({ show, onHide, orders = [], prefillId = "" }) {
  const [query, setQuery] = useState(prefillId || "");
  useEffect(() => {
    setQuery(prefillId || "");
  }, [prefillId, show]);

  const found = useMemo(() => {
    const id = (query || "").trim();
    if (!id) return null;
    return orders.find((o) => String(o._id) === id) || null;
  }, [orders, query]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    // No network call—this finds within orders[]
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      aria-labelledby="track-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="track-title">Track my order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="row g-2 mb-3">
          <div className="col-12 col-md-9">
            <label className="form-label small">Order ID</label>
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                className="form-control"
                placeholder="e.g., 68ac0413cd12d074d6b3efb1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="form-text">
              Tip: click “Track” on a specific order card to auto-fill.
            </div>
          </div>
          <div className="col-12 col-md-3 d-grid">
            <label className="form-label small opacity-0">.</label>
            <Button type="submit" variant="dark">
              Show status
            </Button>
          </div>
        </form>

        {!query && (
          <Alert variant="light" className="border">
            Enter an Order ID or use the Track button from an order card.
          </Alert>
        )}

        {query && !found && (
          <Alert variant="warning" className="mb-0">
            No order with that ID was found in <strong>your</strong> orders.
          </Alert>
        )}

        {found && (
          <>
            <div className="d-flex flex-wrap justify-content-between align-items-start mb-2">
              <div>
                <div className="fw-semibold">Order #{found._id}</div>
                <div className="text-muted small">
                  Placed:{" "}
                  {found.createdAt
                    ? new Date(found.createdAt).toLocaleString()
                    : "—"}
                </div>
              </div>
              <div className="text-end">
                {(() => {
                  const { variant, label } = statusMeta(found.status);
                  return <Badge bg={variant}>{label}</Badge>;
                })()}
                <div className="small text-muted mt-1">
                  Total: A${formatMoney(found.totalAmount)}
                </div>
              </div>
            </div>

            <Stepper status={found.status} />

            {/* Items preview */}
            <div className="d-flex flex-wrap gap-2 my-3">
              {(Array.isArray(found.products) ? found.products : [])
                .slice(0, 6)
                .map((line, i) => {
                  const p =
                    typeof line.productId === "object" ? line.productId : {};
                  const img = p?.images?.[0] || p?.image || line?.image;
                  const name = p?.name || line?.name || "item";
                  return (
                    <img
                      key={i}
                      src={imgUrl(img)}
                      alt={name}
                      width={56}
                      height={56}
                      className="rounded border"
                      style={{ objectFit: "cover" }}
                    />
                  );
                })}
            </div>

            {/* Address */}
            <AddressBlock
              address={found.address}
              status={normalizeStatus(found.status)}
              shippingMethod={found.shippingMethod}
            />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

/* ---------- Page ---------- */
export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { addToCart } = useCart();

  const [showTrack, setShowTrack] = useState(false);
  const [prefillId, setPrefillId] = useState("");

  const openTrack = (id = "") => {
    setPrefillId(id || "");
    setShowTrack(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const access = sessionStorage.getItem("accessJWT") || "";
        const res = await fetch(`${BASE}orders`, {
          headers: {
            "Content-Type": "application/json",
            ...(access ? { Authorization: `Bearer ${access}` } : {}),
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
          : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data?.orders)
          ? data.data.orders
          : Array.isArray(data?.data)
          ? data.data
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

  return (
    <Container className="py-4 my-orders">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <BoxSeam className="text-primary" size={20} />
          <h3 className="m-0">My Orders</h3>
          <Badge bg="light" text="dark" className="ms-2">
            {orders.length}
          </Badge>
        </div>

        {/* Header-level Track (manual input) */}
        <Button variant="outline-dark" onClick={() => openTrack("")}>
          <Truck className="me-1" size={18} />
          Track
        </Button>
      </div>

      {orders.length === 0 ? (
        <Alert variant="info" className="mb-0">
          You haven’t placed any orders yet.
        </Alert>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((o, idx) => {
            const created = o.createdAt
              ? new Date(o.createdAt).toLocaleString()
              : "";
            const { variant, label, Icon } = statusMeta(o.status);
            const total = formatMoney(o.totalAmount);
            const lines = Array.isArray(o.products) ? o.products : [];
            const itemCount = lines.reduce(
              (sum, l) => sum + (Number(l?.quantity) || 0),
              0
            );

            const orderId = o._id;

            const copyId = async () => {
              try {
                await navigator.clipboard.writeText(orderId || "");
                alert("Order ID copied");
              } catch {}
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

            return (
              <Card
                key={o._id || idx}
                className="order-card shadow-sm border-0"
              >
                <Card.Header className="order-card__header d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="text-muted small">Order</span>
                    <strong className="order-id">{orderId}</strong>
                    <span className="ms-2 small text-muted">• {created}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* Per-order Track (prefilled modal) */}
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => openTrack(orderId)}
                      title="Track this order"
                    >
                      <Truck className="me-1" size={14} /> Track
                    </Button>

                    {/* Actions */}
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
                      <Row
                        key={i}
                        className="align-items-center g-3 order-line"
                      >
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
                              <Link
                                to={`/product/${id}`}
                                className="order-name"
                              >
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
      )}

      {/* One shared modal instance that searches within orders[] */}
      <TrackModal
        show={showTrack}
        onHide={() => setShowTrack(false)}
        orders={orders}
        prefillId={prefillId}
      />
    </Container>
  );
}
