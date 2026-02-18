import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig"; 

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phone: "",      
    address: ""     
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // STRICT AUTOCOMPLETE KILL: Generate stable random names once per mount
  // This prevents focus loss while keeping the field names unique to the browser
  const fieldKeys = useMemo(() => ({
    name: `n_${Math.random().toString(36).substring(7)}`,
    email: `e_${Math.random().toString(36).substring(7)}`,
    phone: `p_${Math.random().toString(36).substring(7)}`,
    address: `a_${Math.random().toString(36).substring(7)}`,
    pass: `pw_${Math.random().toString(36).substring(7)}`
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await API.post("/auth/register", formData);
      navigate("/login", { state: { message: "Registration successful! Please login." } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-lg rounded-xl bg-black p-8 shadow-2xl border border-gray-800"
        autoComplete="off"
      >
        {/* HONEYPOT: Catches initial browser autofill attempts */}
        <input style={{ display: 'none' }} type="text" name="prevent_autofill_user" />
        <input style={{ display: 'none' }} type="password" name="prevent_autofill_pass" />

        <h2 className="mb-6 text-center text-3xl font-bold text-white">Join Us</h2>
        
        {error && (
          <div className="mb-4 rounded-md border border-red-900 bg-red-900/20 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-400">Full Name</label>
            <input
              name={fieldKeys.name}
              type="text"
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white outline-none focus:border-[#f5c27a]"
              required
              autoComplete="one-time-code"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email Address - FIXED SYNTAX */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-400">Email Address</label>
            <input
              name={fieldKeys.email}
              type="email"
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white outline-none focus:border-[#f5c27a]"
              required
              autoComplete="new-password"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-400">Phone Number</label>
            <input
              name={fieldKeys.phone}
              type="tel"
              placeholder="+91"
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white outline-none focus:border-[#f5c27a]"
              required
              autoComplete="new-password"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-400">Residential Address</label>
            <textarea
              name={fieldKeys.address}
              rows="2"
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white outline-none focus:border-[#f5c27a]"
              required
              autoComplete="new-password"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-400">Password</label>
            <input
              name={fieldKeys.pass}
              type="password"
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white outline-none focus:border-[#f5c27a]"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-8 w-full rounded-lg bg-[#f5c27a] py-3 text-lg font-bold text-black hover:bg-[#e0b06b] transition-all disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-bold text-[#f5c27a] hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
