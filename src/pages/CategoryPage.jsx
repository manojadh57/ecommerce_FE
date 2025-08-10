import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const BASE =
  (import.meta.env.VITE_BASE_URL && import.meta.env.VITE_BASE_URL.trim()) ||
  "http://localhost:8000/api/customer/v1/";

export default function CategoryPage() {
  const { id } = useParams();
  const { search: locSearch } = useLocation();
  const q = new URLSearchParams(locSearch).get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Try to get the category name from the Redux tree
  const { parents, subsByParent } = useSelector((s) => s.categories);
  const allCats = useMemo(() => {
    const kids = Object.values(subsByParent || {}).flat();
    return [...(parents || []), ...kids];
  }, [parents, subsByParent]);
  const catName = allCats.find((c) => c._id === id)?.name || "Category";

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const url = new URL(`${BASE.replace(/\/?$/, "/")}products`);
        url.searchParams.set("category", id);
        url.searchParams.set("includeRatings", "1");
        if (q.trim()) url.searchParams.set("q", q.trim());

        const res = await fetch(url.toString());
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.data || data.products || [];
        if (alive) setProducts(list);
      } catch (e) {
        console.error(e);
        if (alive) setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, q]);

  return (
    <Container className="py-4">
      <h2 className="mb-3 text-center fw-bold">{catName}</h2>
      {q && (
        <p className="text-center text-muted mb-4">
          Filtered by “{q}” — {products.length} item
          {products.length === 1 ? "" : "s"}
        </p>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : products.length ? (
        <Row className="justify-content-center">
          {products.map((p) => (
            <Col key={p._id} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No products found in this category.</p>
      )}
    </Container>
  );
}
