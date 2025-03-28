import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../middleware/AdminRoute";
import ManageProducts from "../pages/Products";
import ManageOrders from "../pages/Orders";
import ManageCategories from "../pages/Categories";
import MarketingTools from "../pages/Marketing";
import ManageUsers from "../pages/Users";
import AddProduct from "../pages/AddProduct";
import { URLs } from "../../utils/urls";
import AdminRegister from "../pages/AdminRegister";
import AdminLogin from "../pages/AdminLogin";
import AdminAddCategory from "../pages/AddCategory";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path={URLs.ADMIN_ROUTES.REGISTER} element={<AdminRegister />} />
      <Route path={URLs.ADMIN_ROUTES.LOGIN} element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
        <Route path="/admin/manage-orders" element={<ManageOrders />} />
        <Route path="/admin/manage-categories" element={<ManageCategories />} />
        <Route path="/admin/marketing-tools" element={<MarketingTools />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/add-category" element={<AdminAddCategory />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
