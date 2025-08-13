import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { CartProvider } from "./hooks/useCart.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import "./App.css";
import "./styles/theme.css";

import { ToastContainer, Slide } from "react-toastify";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CartProvider>
        <App />
        <ToastContainer
          position="top-left"
          transition={Slide}
          autoClose={2200}
          hideProgressBar
          newestOnTop
          closeOnClick={false}
          draggable={false}
          pauseOnHover
          limit={3}
          theme="light"
          className="toast-container-left"
          // sit just below the navbar height that MainNavbar writes to --nav-h
          style={{ top: "calc(var(--nav-h, 72px) + 12px)" }}
        />
      </CartProvider>
    </Provider>
  </StrictMode>
);
