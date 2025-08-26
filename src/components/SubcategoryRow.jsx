import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import "./subcategory-row.css";

const BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/?$/, "/");

const parseList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  return [];
};

export default function SubcategoryRow({ subId, title, speed = 26 }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!subId) return;
    (async () => {
      try {
       
        const res = await fetch(
          `${BASE}products?category=${subId}&limit=16&sort=-createdAt`
        );
        const data = await res.json();
        setItems(parseList(data));
      } catch (e) {
        setErr(e.message || "Failed to load products.");
      }
    })();
  }, [subId]);

 
  const loop = useMemo(
    () => (items.length ? [...items, ...items] : []),
    [items]
  );
  const duration = `${Math.max(
    18,
    Math.min(48, Math.round((items.length || 8) * 2))
  )}s`;

  if (err) {
    return (
      <section className="sub-row">
        <div className="sub-row__header">
          <h3 className="sub-row__title">{title}</h3>
          <Link to={`/category/${subId}`} className="sub-row__more">
            View all →
          </Link>
        </div>
        <div className="sub-row__empty">Could not load products.</div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="sub-row">
      <div className="sub-row__header">
        <h3 className="sub-row__title">{title}</h3>
        <Link to={`/category/${subId}`} className="sub-row__more">
          View all →
        </Link>
      </div>

      <div className="sub-row__marquee" style={{ "--duration": duration }}>
        <div className="sub-row__track">
          {loop.map((p, i) => (
            <div className="sub-row__cell" key={`${p._id || i}-${i}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
