import { useLocation } from "react-router-dom";
import AdminNavbar from "./admin/components/AdminNavbar";
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminRoutes from "./admin/routes/adminRoutes";
import { URLs } from "./utils/urls";

const AdminApp: React.FC = () => {
  const location = useLocation();
  const hideLayout =
    location.pathname === URLs.ADMIN_ROUTES.LOGIN ||
    location.pathname === URLs.ADMIN_ROUTES.REGISTER;

  return (
    <>
      {!hideLayout && <AdminNavbar />}
      <div className={`min-h-screen ${!hideLayout ? "flex flex-row" : ""}`}>
        {!hideLayout && <AdminSidebar />}
        <AdminRoutes />
      </div>
    </>
  );
};

export default AdminApp;
