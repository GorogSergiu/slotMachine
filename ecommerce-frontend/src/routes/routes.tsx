import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import SingleProduct from "../pages/SingleProduct";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import { URLs } from "../utils/urls";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path={URLs.ACASA} element={<Home />} />
      <Route path={URLs.MAGAZIN} element={<Shop />} />
      <Route path={URLs.SINGLE_PRODUCT} element={<SingleProduct />} />
      <Route path={URLs.COS} element={<Cart />} />
      <Route path={URLs.FINALIZAREA_COMENZII} element={<Checkout />} />
    </Routes>
  );
};

export default RoutesConfig;
