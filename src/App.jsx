import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

const NotFound = () => <p className="text-center mt-5">404 – Page not found</p>;

const App = () => (
  <BrowserRouter>
    <AppNavbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
