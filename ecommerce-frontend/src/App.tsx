import RoutesConfig from "./routes/routes";
import Navbar from "./components/Navbar";
import AdminRoutes from "./admin/routes/adminRoutes";

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <RoutesConfig />
      <AdminRoutes />
    </div>
  );
};

export default App;
