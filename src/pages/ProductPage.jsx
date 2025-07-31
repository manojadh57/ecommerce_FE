import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../helpers/axiosHelpers";

const ProductPage = () => {
  const params = useParams();
  console.log("ID:", params.id);
  const [product, setProduct] = useState({});

  const fetchProductDetail = async () => {
    // api call
    let data = await getProductById(params.id);

    if (data) {
      setProduct(data);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  return (
    <div>
      ProductPage<div>{product.name}</div>
    </div>
  );
};

export default ProductPage;
