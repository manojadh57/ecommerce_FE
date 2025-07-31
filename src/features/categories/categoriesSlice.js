import { createSlice } from "@reduxjs/toolkit";
import { loadCategoriesTree } from "./categoriesAction";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    parents: [],
    subsByParent: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loadCategoriesTree.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCategoriesTree.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parents = action.payload.parents;
        state.subsByParent = action.payload.subsByParent;
      })
      .addCase(loadCategoriesTree.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }),
});

export default categoriesSlice.reducer;
