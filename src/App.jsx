import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./hooks/useCart.jsx";
import AppNavbar from "./components/Navbar";
import Home from "./pages/Home";

///error///
const NotFound = () => <p className="text-center mt-5">404 – Page not found</p>;

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

export default App;
