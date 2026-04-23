import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
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
    <div className="crm-auth-shell flex items-center justify-center">
      <div className="crm-auth-card w-full">
        <section className="crm-auth-hero">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.15),transparent_24%)]" />
          <div className="relative z-10">
            <span className="crm-kicker border-white/15 bg-white/10 text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Hiring Workspace
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Run your recruitment flow from one sharp, focused dashboard.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Manage candidates, interviews, status movement, and daily hiring
              signals with a calmer experience built for real HR teams.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Track pipeline performance in real time",
                "Organize interviews without losing candidate context",
                "Move from scheduling to decisions with less friction",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] text-teal-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="crm-auth-form">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Welcome Back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Access your hiring workspace and continue managing candidates with
              confidence.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="crm-label">Work Email</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="crm-field"
                />
              </div>

              <div>
                <label className="crm-label">Password</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="crm-field"
                />
              </div>

              <button
                type="submit"
                className="crm-button-primary w-full"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
                {!isSubmitting && <ArrowRight className="h-[18px] w-[18px]" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/90 px-4 py-4 text-sm text-slate-600">
              Need an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-teal-700 transition hover:text-teal-600"
              >
                Create one here
              </Link>
              .
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
