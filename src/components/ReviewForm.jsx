import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ReviewForm = ({ productId, baseUrl, accessToken }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl.replace(/\/?$/, "/")}reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to submit review");
      toast.success("Review submitted. Awaiting approval.");
      setComment("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Form onSubmit={submit} className="mt-4">
      <Form.Label className="fw-semibold">Your rating</Form.Label>
      <Form.Select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mb-2"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n}★
          </option>
        ))}
      </Form.Select>

      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Write a short review (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-2"
      />
      <Button type="submit">Submit review</Button>
    </Form>
  );
};

export default ReviewForm;
