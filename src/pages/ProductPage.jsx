import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../features/products/productsActions";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaCheckCircle,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProductCard.css"; // re-use the price-sticker styles
import "../styles/ProductPage.css"; // page-specific styles
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

const BASE =
  (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL.trim()) ||
  "http://localhost:8000/api/customer/v1/";

/* Small star row for the header summary */
const StarsInline = ({ value = 0, count = 0 }) => {
  // CHANGED: removed early return so stars always show (even with 0 reviews)
  const v = Math.max(0, Math.min(5, Math.round((Number(value) || 0) * 2) / 2));
  const slots = Array.from({ length: 5 }, (_, i) => {
    const n = i + 1;
    return v >= n ? "full" : v >= n - 0.5 ? "half" : "empty";
  });
  return (
    <div className="d-flex align-items-center gap-2">
      {/* CHANGED: force visible color for stars */}
      <span className="rating-stars text-warning">
        {slots.map((t, i) =>
          t === "full" ? (
            <FaStar key={i} />
          ) : t === "half" ? (
            <FaStarHalfAlt key={i} />
          ) : (
            <FaRegStar key={i} />
          )
        )}
      </span>
      <span className="small text-muted">({count})</span>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { addToCart } = useCart();

  const { selected: product, status, error } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.user);

  const [qty, setQty] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [summary, setSummary] = useState({ average: 0, count: 0 });

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  // CHANGED: review summary fetch now handles multiple response shapes
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${BASE.replace(/\/?$/, "/")}reviews/${id}`);
        const json = await res.json();

        let avg = 0,
          count = 0;

        // Shape A: raw array of reviews
        if (Array.isArray(json)) {
          const ratings = json
            .map((r) => Number(r?.rating ?? r?.stars ?? 0))
            .filter((n) => Number.isFinite(n));
          count = ratings.length;
          avg = count ? ratings.reduce((a, b) => a + b, 0) / count : 0;
        }
        // Shape B: { data: [...] }
        else if (Array.isArray(json?.data)) {
          const ratings = json.data
            .map((r) => Number(r?.rating ?? r?.stars ?? 0))
            .filter((n) => Number.isFinite(n));
          count = ratings.length;
          avg = count ? ratings.reduce((a, b) => a + b, 0) / count : 0;
        }
        // Shape C: { average, count } or variants
        else {
          avg = Number(json?.average ?? json?.avg ?? 0);
          count = Number(json?.count ?? json?.total ?? json?.reviewsCount ?? 0);
        }

        setSummary({
          average: Math.round(avg * 2) / 2, // CHANGED: half-step rounding
          count,
        });
      } catch {
        setSummary({ average: 0, count: 0 });
      }
    })();
  }, [id]);

  const images = useMemo(() => product?.images || [], [product]);
  useEffect(() => setActiveIdx(0), [images?.[0]]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="text-center my-5">
        <Spinner />
        <p>Loading product…</p>
      </div>
    );
  }
  if (status === "failed") {
    return (
      <Alert variant="danger" className="my-5">
        Error: {error}
      </Alert>
    );
  }
  if (!product) {
    return (
      <Alert variant="warning" className="my-5">
        No product data found.
      </Alert>
    );
  }

  const imgBase = (import.meta.env.VITE_IMAGE_BASE_URL || "").replace(
    /\/$/,
    ""
  );
  const mainSrc = images?.[activeIdx]
    ? `${imgBase}/${images[activeIdx]}`
    : "/assets/placeholder.png";

  const price = Number(product.price || 0);
  const formatted =
    Math.round(price * 100) % 100 === 0
      ? price.toLocaleString()
      : price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const bump = (d) => setQty((q) => Math.max(1, q + d));

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${product.name} ×${qty} added`);
  };

  return (
    <div className="container my-5">
      <div className="row g-lg-4">
        {/* Gallery */}
        <div className="col-lg-7">
          <div className="product-gallery card p-3">
            <div className="main-img-wrap">
              <img
                src={mainSrc}
                alt={product.name}
                className="img-fluid rounded"
              />
            </div>

            {images?.length > 1 && (
              <div className="thumbs mt-3">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    className={`thumb ${i === activeIdx ? "active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                  >
                    <img src={`${imgBase}/${img}`} alt={`thumb ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buy box */}
        <div className="col-lg-5">
          <div className="buy-box card p-4 sticky-lg-top">
            <h2 className="mb-1">{product.name}</h2>
            <StarsInline value={summary.average} count={summary.count} />

            {/* Centered price sticker */}
            <div className="d-flex justify-content-center my-3">
              <span
                className="price-sticker"
                aria-label={`Price ${formatted} dollars`}
              >
                <span className="currency">$</span>
                <span className="amount">{formatted}</span>
              </span>
            </div>

            <p className="text-muted">{product.description}</p>

            {/* Qty stepper */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fw-semibold">Quantity</span>
              <div className="qty-box">
                <button
                  type="button"
                  onClick={() => bump(-1)}
                  aria-label="Decrease"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                />
                <button
                  type="button"
                  onClick={() => bump(1)}
                  aria-label="Increase"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg w-100 mb-3"
              onClick={handleAdd}
            >
              Add to Cart
            </button>

            {/* Trust bullets */}
            <ul className="list-unstyled small text-muted trust-list">
              <li>
                <FaCheckCircle /> 30-Day Money-Back Guarantee
              </li>
              <li>
                <FaCheckCircle /> Secure checkout
              </li>
              <li>
                <FaCheckCircle /> Fast dispatch from AU
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <hr className="my-5" />
      <div className="row">
        <div className="col-lg-7">
          <ReviewList productId={product._id} baseUrl={BASE} />
        </div>
        <div className="col-lg-5">
          {user?._id ? (
            <ReviewForm
              productId={product._id}
              baseUrl={BASE}
              accessToken={sessionStorage.getItem("accessJWT") || ""}
            />
          ) : (
            <Alert variant="info">Please log in to write a review.</Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
