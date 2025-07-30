import { apiProcesser } from "./axiosHelpers";

const productsEP = import.meta.env.VITE_BASE_URL + "products";

export const getAllProducts = () =>
  apiProcesser({ method: "get", url: productsEP });

export const getProductsByCategory = (categoryId) =>
  apiProcesser({
    method: "get",
    url: `${productsEP}?category=${categoryId}`,
  });

export const getProductById = (id) =>
  apiProcesser({ method: "get", url: `${productsEP}/${id}` });
