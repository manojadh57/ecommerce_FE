import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getProductById,
  getProductsByCatId,
} from "../../helpers/axiosHelpers";

// ── Fetch list of products (optionally by category) ──
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (categoryId = "", { rejectWithValue }) => {
    try {
      const resp = categoryId
        ? await getProductsByCatId(categoryId)
        : await getAllProducts();

      return resp.products || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load products");
    }
  }
);

// ── Fetch a single product by ID ──
export const fetchSingleProduct = createAsyncThunk(
  "products/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const product = await getProductById(id);
      return product;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load product");
    }
  }
);
