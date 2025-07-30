import { apiProcesser } from "./axiosHelpers";

const categoriesEP = import.meta.env.VITE_BASE_URL + "categories";

export const getAllCategories = () =>
  apiProcesser({ method: "get", url: categoriesEP });

export const getCategoryById = (id) =>
  apiProcesser({ method: "get", url: `${categoriesEP}/${id}` });
