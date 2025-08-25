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

// ⬇️ NEW: Stripe providers
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Publishable key from frontend .env (Vite)
// VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXX
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CartProvider>
        {/* ⬇️ Wrap the app once with Elements */}
        <Elements stripe={stripePromise}>
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
        </Elements>
      </CartProvider>
    </Provider>
  </StrictMode>
);
