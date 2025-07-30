import {
  setProducts,
  setSelected,
  setStatus,
  setError,
} from "./productSlice.js";

import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
} from "../../helpers/axiosHelpers";

export const fetchProducts =
  (categoryId = "") =>
  async (dispatch) => {
    try {
      dispatch(setStatus("loading"));
      const resp = categoryId
        ? await getProductsByCategory(categoryId)
        : await getAllProducts();
      dispatch(setProducts(resp.products || []));
      dispatch(setStatus("succeeded"));
    } catch (e) {
      dispatch(setError(e?.message || "Failed to load products"));
    }
  };

export const fetchSingleProduct = (id) => async (dispatch) => {
  try {
    dispatch(setStatus("loading"));
    const resp = await getProductById(id);
    dispatch(setSelected(resp.product));
    dispatch(setStatus("succeeded"));
  } catch (e) {
    dispatch(setError(e?.message || "Failed to load product"));
  }
};
