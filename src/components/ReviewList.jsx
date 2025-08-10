import { useEffect, useState } from "react";
import { ListGroup, Badge } from "react-bootstrap";

const ReviewList = ({ productId, baseUrl }) => {
  const [data, setData] = useState({ reviews: [], average: 0, count: 0 });

  useEffect(() => {
    (async () => {
      try {
        const url = `${baseUrl.replace(/\/?$/, "/")}reviews/${productId}`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch {
        setData({ reviews: [], average: 0, count: 0 });
      }
    })();
  }, [productId, baseUrl]);

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="mb-0">Reviews</h5>
        <Badge bg="secondary">{data.count}</Badge>
        <span className="text-muted">Avg: {data.average.toFixed(2)}★</span>
      </div>

      <ListGroup>
        {data.reviews.map((r) => (
          <ListGroup.Item key={r._id}>
            <div className="d-flex justify-content-between">
              <strong>
                {r.userId?.fName || r.userId?.name || r.userId?.email}
              </strong>
              <span>{r.rating}★</span>
            </div>
            {r.comment && <div className="text-muted mt-1">{r.comment}</div>}
            <small className="text-secondary">
              {new Date(r.createdAt).toLocaleDateString()}
            </small>
          </ListGroup.Item>
        ))}
        {!data.reviews.length && (
          <ListGroup.Item className="text-center text-muted">
            No reviews yet.
          </ListGroup.Item>
        )}
      </ListGroup>
    </>
  );
};

export default ReviewList;
