import { Fragment } from "react";
import ProductGrid from "./ProductGrid.jsx";
import About from "../components/About.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => (
  <Fragment>
    <ProductGrid />

    <Footer />
  </Fragment>
);

export default Home;
