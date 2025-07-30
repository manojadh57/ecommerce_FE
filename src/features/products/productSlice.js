import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // list/grid data
  selected: null, // single product page
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (s, { payload }) => {
      s.items = payload;
    },
    setSelected: (s, { payload }) => {
      s.selected = payload;
    },
    setStatus: (s, { payload }) => {
      s.status = payload;
    },
    setError: (s, { payload }) => {
      s.error = payload;
      s.status = "failed";
    },
  },
});

export const { setProducts, setSelected, setStatus, setError } =
  productsSlice.actions;
export default productsSlice.reducer;
