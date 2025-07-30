import { apiProcesser } from "./axiosHelpers";

const root = import.meta.env.VITE_BASE_URL;

/**
 * /categories/:catId/sub-categories
 */
export const getSubCategoriesByCategory = (catId) =>
  apiProcesser({
    method: "get",
    url: `${root}categories/${catId}/sub-categories`,
  });
