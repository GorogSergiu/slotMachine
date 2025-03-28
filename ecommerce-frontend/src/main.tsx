import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { useLocation } from "react-router-dom";

const RootComponent = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return <AdminApp />;
  }

  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <RootComponent />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
