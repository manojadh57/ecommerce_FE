import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, fetchSingleProduct } from "./productsActions";

const initialState = {
  items: [],
  selected: null,
  status: "idle", 
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (s, a) => {
      s.items = a.payload;
    },
    setSelected: (s, a) => {
      s.selected = a.payload;
    },
    setStatus: (s, a) => {
      s.status = a.payload;
    },
    setError: (s, a) => {
      s.error = a.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //list//
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.items = payload;
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })

      // single//
      .addCase(fetchSingleProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.selected = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.selected = payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });
  },
});

export const { setProducts, setSelected, setStatus, setError } =
  productsSlice.actions;
export default productsSlice.reducer;
