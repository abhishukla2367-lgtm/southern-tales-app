import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/axiosConfig"; 
import { AuthContext } from "../context/AuthContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Destructure 'user' to check if already logged in
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  // Task 3: If user is already logged in, send them home immediately
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true }); 
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const loginCredentials = { 
        email: email.trim().toLowerCase(), 
        password: password 
      };

      const res = await API.post("/auth/login", loginCredentials);
      
      const token = res.data.token || res.data.accessToken;
      const userData = res.data.user; // Ensure this matches your backend response

      if (token && userData) {
        // Update global Auth state - Task 3: This triggers the Navbar change
        login(userData, token);
        
        // Final Task: Force navigate to homepage
        navigate(from, { replace: true }); 
      } else {
        setError("Login failed: Invalid data from server.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid email or password.";
      setError(errMsg);
      console.error("Login Error:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Updated to black background per request
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-5">
      <form 
        onSubmit={handleSubmit} 
        autoComplete="off"
        className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1a1a1a] p-10 shadow-2xl"
      >
        <h2 className="mb-2 text-center text-3xl font-extrabold text-white">Welcome Back</h2>
        <p className="mb-8 text-center text-sm text-gray-400">Login to your account to continue</p>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold text-gray-300">Email Address</label>
          <input
            type="email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full rounded-xl border border-white/10 bg-[#252525] p-3.5 text-white outline-none transition-all focus:border-[#f5c27a] focus:ring-1 focus:ring-[#f5c27a]"
            required
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-sm font-bold text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-[#252525] p-3.5 text-white outline-none transition-all focus:border-[#f5c27a] focus:ring-1 focus:ring-[#f5c27a]"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full rounded-xl bg-[#f5c27a] p-4 font-bold text-[#0a0a0a] shadow-lg transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#eab366] hover:scale-[1.01] active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Authenticating..." : "Login"}
        </button>

        <div className="mt-8 text-center text-sm text-gray-400">
          New here?{" "}
          {/* Fixed Link to go to /register instead of /signup */}
          <Link to="/register" className="font-bold text-[#f5c27a] hover:underline">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
