import { ArrowRight, BadgeCheck, Layers3 } from "lucide-react";
import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      setIsSubmitting(true);
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
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const fieldClass = (hasError, hasValue) =>
    `crm-field ${
      hasError
        ? "!border-rose-400 !ring-4 !ring-rose-500/10"
        : hasValue
        ? "!border-teal-400/70"
        : ""
    }`;

  return (
    <div className="crm-auth-shell flex items-center justify-center">
      <div className="crm-auth-card w-full">
        <section className="crm-auth-hero">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.2),transparent_28%),radial-gradient(circle_at_center_right,rgba(250,204,21,0.18),transparent_25%)]" />
          <div className="relative z-10">
            <span className="crm-kicker border-white/15 bg-white/10 text-white">
              <Layers3 className="h-3.5 w-3.5" />
              New Team Setup
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Create your workspace and start organizing the pipeline beautifully.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Build a cleaner interview process with a dashboard that helps your
              team review candidates, coordinate interviews, and move faster.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Responsive hiring workspace",
                "Cleaner candidate tracking",
                "Faster interview coordination",
                "Sharper decision visibility",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100"
                >
                  <BadgeCheck className="mb-2 h-[18px] w-[18px] text-teal-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="crm-auth-form">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Create Account
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Register</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Set up your access and start using the CRM with the same polished
              experience across desktop and mobile.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="crm-label">Full Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={fieldClass(errors.firstName, formData.firstName)}
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-rose-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="crm-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={fieldClass(errors.email, formData.email)}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="crm-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={fieldClass(errors.password, formData.password)}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-rose-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="crm-label">Confirm Password</label>
                <input
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={fieldClass(errors.rePassword, formData.rePassword)}
                />
                {errors.rePassword && (
                  <p className="mt-2 text-sm text-rose-600">{errors.rePassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="crm-button-primary w-full"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
                {!isSubmitting && <ArrowRight className="h-[18px] w-[18px]" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/90 px-4 py-4 text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-teal-700 transition hover:text-teal-600"
              >
                Sign in here
              </Link>
              .
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Registration;
