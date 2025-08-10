import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavbar from "./components/MainNavbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import { VerifyUser } from "./pages/VerifyUser.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

const NotFound = () => <p className="text-center mt-5">404 – Page not found</p>;

export default function App() {
  return (
    <BrowserRouter>
      <MainNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/activate-user" element={<VerifyUser/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="*" element={<NotFound />} />

        {/* product description page */}
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
