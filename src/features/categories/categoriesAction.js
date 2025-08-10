import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategories } from "../../helpers/axiosHelpers";

export const loadCategoriesTree = createAsyncThunk(
  "categories/loadTree",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllCategories();

      const parents = data.filter((c) => !c.parent);

      const subsByParent = data.reduce((acc, cat) => {
        if (cat.parent) {
          acc[cat.parent] = acc[cat.parent] || [];
          acc[cat.parent].push(cat);
        }
        return acc;
      }, {});

      return { parents, subsByParent };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return rejectWithValue(msg);
    }
  }
);
