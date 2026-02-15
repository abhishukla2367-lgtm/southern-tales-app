import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig"; 

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phone: "",      // New Field
    address: ""     // New Field
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] p-6">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl"
        autoComplete="off"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-[#2d2d2d]">Join Us</h2>
        
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:border-[#f5c27a]"
              required
              autoComplete="off"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:border-[#f5c27a]"
              required
              autoComplete="off"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:border-[#f5c27a]"
              required
              autoComplete="off"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Residential Address</label>
            <textarea
              rows="2"
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:border-[#f5c27a]"
              required
              autoComplete="off"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:border-[#f5c27a]"
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
          className="mt-8 w-full rounded-lg bg-[#f5c27a] py-3 text-lg font-bold text-[#1a1a1a] hover:bg-[#e0b06b] transition-all disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-bold text-[#e0b06b] hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;