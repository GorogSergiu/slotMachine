import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const registerAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register`, {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Registration failed.";
  }
};

export const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      return response.data; // Returns the user data with token
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed.");
    }
  };
  
  // Logout Admin (Optional, if needed for backend token invalidation)
  export const logoutAdmin = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };
