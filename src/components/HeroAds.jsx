import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hero-ads.css";

const BASE = (import.meta.env.VITE_BASE_URL || "").replace(/\/?$/, "/");

export default function HeroAds({
  items = [],
  // maximum height cap; the stage uses aspect-ratio 3/2 so your 1500x1000 shows fully
  maxHeight = 560,
  delayMs = 50000,
  radius = 22,
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!items.length || paused) return;
    timerRef.current = setInterval(
      () => setIdx((i) => (i + 1) % items.length),
      delayMs
    );
    return () => clearInterval(timerRef.current);
  }, [items.length, delayMs, paused]);

  const open = async (ad) => {
    if (!ad) return;
    if (ad.productId) return nav(`/product/${ad.productId}`);
    const q = (ad.query || "").trim();
    if (!q) return;
    const res = await fetch(
      `${BASE}products?q=${encodeURIComponent(q)}&limit=1`
    );
    const data = await res.json();
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data?.data?.products)
      ? data.data.products
      : [];
    const first = list[0];
    nav(first?._id ? `/product/${first._id}` : `/?q=${encodeURIComponent(q)}`);
  };

  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  return (
    <section
      className="hero-ads hero-ads--contain"
      style={{ "--h-max": `${maxHeight}px`, "--r": `${radius}px` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-ads__stage" aria-roledescription="carousel">
        {items.map((ad, i) => (
          <button
            key={i}
            className={`hero-ads__slide ${i === idx ? "is-active" : ""}`}
            onClick={() => open(ad)}
            aria-label={ad.alt || "View product"}
            style={{ "--bg": `url(${ad.img})` }}
          >
            {/* Soft blurred background to fill any letterbox area */}
            <div className="hero-ads__bg" aria-hidden="true" />
            {/* The actual image — fully visible, no cropping */}
            <img
              src={ad.img}
              alt={ad.alt || ""}
              className="hero-ads__img"
              loading={i === idx ? "eager" : "lazy"}
            />
          </button>
        ))}

        {/* nav arrows */}
        {items.length > 1 && (
          <>
            <button
              className="hero-ads__nav left"
              onClick={prev}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              className="hero-ads__nav right"
              onClick={next}
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* dots */}
      {items.length > 1 && (
        <div className="hero-ads__dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`hero-ads__dot ${i === idx ? "is-on" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Show slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
