import { createSlice } from "@reduxjs/toolkit";

const initial = {
  parents: [],
  subsByParent: {}, // { parentId: [subCats] }
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "categories",
  initialState: initial,
  reducers: {
    setParents: (s, { payload }) => {
      s.parents = payload;
    },
    setSubs: (s, { payload }) => {
      s.subsByParent[payload.parentId] = payload.subs;
    },
    setStatus: (s, { payload }) => {
      s.status = payload;
    },
    setError: (s, { payload }) => {
      s.error = payload;
      s.status = "failed";
    },
    reset: () => initial,
  },
});

export const { setParents, setSubs, setStatus, setError } = slice.actions;
export default slice.reducer;
