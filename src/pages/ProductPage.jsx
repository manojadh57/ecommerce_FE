import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../features/products/productsActions";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const {
    selected: product,
    status,
    error,
  } = useSelector((state) => state.products);
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

  const handleAdd = () => {
    addToCart(product, qty); // match hook signature
    toast.success(`${product.name} added`); // show toast
  };

  return (
    <div className="container my-5">
      <div className="row">
        {/* image */}
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

        {/* details */}
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
              onChange={(e) => setQty(Number(e.target.value) || 1)}
              className="form-control w-25"
            />
          </div>

          <button className="btn btn-success" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
