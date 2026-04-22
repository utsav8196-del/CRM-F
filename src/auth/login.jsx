import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { setAuthSession } from "../utils/auth";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authService.login(formData);
      const payload = response.data;
      const token = payload.authtoken || payload.token;

      if (!payload.success || !token) {
        throw new Error(payload.error || payload.message || "Login failed");
      }

      setAuthSession({
        token,
        user: {
          id: payload.userId || payload.user?.id || null,
          email: formData.email,
          role: payload.role || payload.user?.role || "user",
          isAdmin: Boolean(payload.isAdmin),
        },
      });

      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">Sign in</h1>
            <p className="text-sm opacity-70">
              Log in first to open the dashboard and manage the CRM.
            </p>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-3 text-sm opacity-70">
              <span>Need an account? </span>
              <Link to="/register" className="link">
                Register here
              </Link>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
