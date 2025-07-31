import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavbar from "./components/MainNavbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import ShippingReturnsPage from "./pages/ShippingReturnsPage.jsx";
import StorePolicyPage from "./pages/StorePolicyPage.jsx";
import PaymentMethodsPage from "./pages/PaymentMethodsPage.jsx";

const NotFound = () => (
  <div className="text-center my-5">
    <h2>404 – Page not found</h2>
    <p>The page you’re looking for doesn’t exist.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <MainNavbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Product detail */}
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Cart */}
        <Route path="/cart" element={<CartPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />

        {/* existing routes… */}
        <Route path="/shipping" element={<ShippingReturnsPage />} />
        <Route path="/policy" element={<StorePolicyPage />} />
        <Route path="/payments" element={<PaymentMethodsPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
