import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: {}, isAuth: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (s, { payload }) => {
      s.user = payload;
      s.isAuth = true;
    },
    logout: () => initialState,
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
