import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../features/products/productsActions";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { useCart } from "../hooks/useCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { addToCart } = useCart();

  const prodState = useSelector((state) => state.products);
  console.log("products slice:", prodState);

  const product = prodState.selected;
  const status = prodState.status;
  const error = prodState.error;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

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

  return (
    <div className="container my-5">
      <div className="row">
        {/* Image */}
        <div className="col-md-6 mb-4">
          <img
            src={
              product.images?.[0]
                ? `${import.meta.env.VITE_IMAGE_BASE_URL.replace(/\/$/, "")}/${
                    product.images[0]
                  }`
                : "/assets/placeholder.png"
            }
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>

        {/* Details */}
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="h4 text-primary">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>

          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="qty" className="me-2 mb-0">
              Qty:
            </label>
            <input
              id="qty"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="form-control w-25"
            />
          </div>

          <button
            className="btn btn-success"
            onClick={() => {
              addToCart({ product, quantity: qty });
              toast.success(" Added to cart!");
            }}
          >
            Add to Cart
          </button>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
