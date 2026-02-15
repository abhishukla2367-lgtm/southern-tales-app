import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent!");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        <p className="text-sm text-gray-600 text-center">
          Enter your registered email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400"
          required
        />

        <button
          type="submit"
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg w-full hover:bg-yellow-500 transition"
        >
          Send Reset Link
        </button>

        <div className="text-center text-sm">
          <Link to="/login" className="text-orange-500 font-medium">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
