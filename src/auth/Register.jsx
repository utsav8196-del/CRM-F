import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.rePassword) {
      newErrors.rePassword = "Passwords do not match";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { firstName, email, password } = formData;
        const response = await authService.register({
          firstName,
          email,
          password,
        });
        const json = response.data;

        toast.success(json.message || "User registered successfully");
        navigate("/login", { replace: true });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "User registration failed",
          {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          }
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-4">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full p-3 rounded-lg outline-none ${
                errors.firstName
                  ? "border-2 border-red-500"
                  : formData.firstName
                  ? "border-2 border-green-500"
                  : "border border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 mt-1 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={`w-full p-3 rounded-lg outline-none ${
                errors.email
                  ? "border-2 border-red-500"
                  : formData.email
                  ? "border-2 border-green-500"
                  : "border border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              className={`w-full p-3 rounded-lg outline-none ${
                errors.password
                  ? "border-2 border-red-500"
                  : formData.password
                  ? "border-2 border-green-500"
                  : "border border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Confirm Password</label>
            <input
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full p-3 rounded-lg outline-none ${
                errors.rePassword
                  ? "border-2 border-red-500"
                  : formData.rePassword
                  ? "border-2 border-green-500"
                  : "border border-gray-300"
              }`}
            />
            {errors.rePassword && (
              <p className="text-red-500 mt-1 text-sm">{errors.rePassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            Register
          </button>

          <p className="text-center text-white/80 mt-4 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline font-semibold hover:text-white"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;
