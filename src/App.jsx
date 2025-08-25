import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restoreSession } from "./features/users/userAction.js";

import MainNavbar from "./components/MainNavbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductPage from "./pages/ProductPage.jsx";

import ForgotPassword from "./pages/ForgotPassword.jsx";
import CartPage from "./pages/CartPage.jsx";
import Footer from "./components/Footer.jsx";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import FAQ from "./pages/FAQ.jsx";
import ShippingInfo from "./pages/ShippingInfo.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";

import VerifyEmailSent from "./pages/VerifyEmailSent.jsx";
import VerifyUser from "./pages/VerifyUser.jsx";

import ResetPassword from "./pages/ResetPassword.jsx";

const NotFound = () => (
  <div className="text-center my-5">
    <h2>404 – Page not found</h2>
    <p>The page you’re looking for doesn’t exist.</p>
  </div>
);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <MainNavbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
        <Route path="/verify-email/:token" element={<VerifyUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Product detail */}
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />

        {/* Cart / Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Orders */}
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />

        {/* Info pages */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Catch-all (only once) */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
