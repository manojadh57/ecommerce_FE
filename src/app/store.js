import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import productsReducer from "../features/products/productSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    products: productsReducer,
    
  },
});

export default store;
