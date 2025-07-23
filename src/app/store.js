import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice.js";

export default configureStore({
  reducer: { user: userReducer },
});
