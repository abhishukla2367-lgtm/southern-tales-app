import React, { useState, useContext, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/axiosConfig"; 
import { AuthContext } from "../context/AuthContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const fieldIds = useMemo(() => ({
    user: `u_${Math.random().toString(36).substring(7)}`,
    pass: `p_${Math.random().toString(36).substring(7)}`
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      
      if (res.data.token || res.data.accessToken) {
        const token = res.data.token || res.data.accessToken;
        const { token: _, accessToken: __, ...userData } = res.data;
        login(userData, token);
        navigate(from, { replace: true }); 
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid email or password.";
      setError(typeof errMsg === 'object' ? "An error occurred. Please try again." : errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* UPDATED: Full Black Background to match Home page */
    <div className="flex min-h-screen items-center justify-center bg-black p-5">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-[400px] rounded-3xl border border-white/10 bg-[#111111] p-10 shadow-2xl"
        autoComplete="off"
      >
        <h2 className="mb-2 text-center text-3xl font-black text-white">Welcome Back</h2>
        <p className="mb-8 text-center text-gray-500 text-sm">Log in to your Southern Tales account</p>
        
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-center text-sm font-medium text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold text-gray-400">Email Address</label>
          <input
            id={fieldIds.user}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder="name@example.com"
            /* UPDATED: Dark Input Styles */
            className="w-full rounded-xl border border-white/10 bg-black p-4 text-white outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-400">Password</label>
            <Link to="/forgot-password" size="sm" className="text-xs text-orange-500 hover:underline">Forgot Password?</Link>
          </div>
          <input
            id={fieldIds.pass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
            /* UPDATED: Dark Input Styles */
            className="w-full rounded-xl border border-white/10 bg-black p-4 text-white outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          /* UPDATED: Orange Theme Button */
          className={`w-full rounded-xl bg-orange-500 p-4 font-bold text-white shadow-lg transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-600 active:scale-[0.98] hover:shadow-orange-500/20"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Verifying...
            </span>
          ) : "Login to Account"}
        </button>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-orange-500 hover:text-orange-400 transition-colors">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
