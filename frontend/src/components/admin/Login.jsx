import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard"); // Redirect on success
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* UPDATED: Background to Pure Black */
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-sans selection:bg-orange-500/30">
      {/* UPDATED: Card style to dark gray with subtle border */}
      <div className="bg-[#111111] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white tracking-tight">
            Welcome <span className="text-orange-500">Back</span>
          </h2>
          <p className="text-gray-500 mt-2 font-light">
            Please enter your credentials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20 animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-600" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              /* UPDATED: Input colors for Dark Mode */
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-600" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-2xl shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 uppercase tracking-widest text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 hover:underline font-bold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
