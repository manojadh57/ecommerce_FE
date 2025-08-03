import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store.js";

import { CartProvider } from "./hooks/useCart.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";

import { ToastContainer } from "react-toastify";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CartProvider>
        <App />
        <ToastContainer position="top-center" theme="colored" />
      </CartProvider>
    </Provider>
  </StrictMode>
);
