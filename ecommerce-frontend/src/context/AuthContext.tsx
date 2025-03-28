import { createContext, useContext, useState } from "react";
import { loginAdmin } from "../admin/api/adminApi";

interface User {
  first_name: String;
  last_name: String;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface AuthContextType {
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("adminUser")
      ? JSON.parse(localStorage.getItem("adminUser")!)
      : null
  );

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginAdmin(email, password);
      setUser(userData);
      localStorage.setItem("adminUser", JSON.stringify(userData));
      localStorage.setItem("adminToken", userData.token);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

  return (
    <AuthContext.Provider
      value={{ isAdmin: user?.isAdmin || false, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
