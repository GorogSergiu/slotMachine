import { useState } from "react";
import { registerAdmin } from "../api/adminApi";
import { useNavigate } from "react-router-dom";
import { URLs } from "../../utils/urls";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isPasswordValid = (password: string) => {
    return /^(?=.*[!@#$%^&*])(?=.{8,})/.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid(formData.password)) {
      setError(
        "Password must be at least 8 characters and contain a special character."
      );
      return;
    }

    try {
      await registerAdmin(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      navigate(URLs.ADMIN_ROUTES.REGISTER); // Redirect after successful registration
    } catch (err: any) {
      setError(err); // Show error message from API
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register Admin</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-3"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-3"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full mb-3"
        />
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
