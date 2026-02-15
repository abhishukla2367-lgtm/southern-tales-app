import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserCircle, Loader2 } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "", username: "", email: "", password: "", confirmPassword: "",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return alert("Passwords do not match!");

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration Successful!");
                navigate("/login");
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            alert("Could not reach the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6 pt-28 pb-12 font-sans">
            <div className="bg-[#111111] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/5">
                <h2 className="text-4xl font-black text-center text-white mb-8 tracking-tight">
                    Create <span className="text-orange-500">Account</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Inputs for Name, Username, Email, Password - Styled as per your request */}
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-600" size={18} />
                        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600" />
                    </div>

                    <div className="relative">
                        <UserCircle className="absolute left-4 top-3.5 text-gray-600" size={18} />
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-600" size={18} />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-600" size={18} />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-600" size={18} />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>

                    <button disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-4 rounded-xl flex justify-center items-center transition-all uppercase tracking-widest text-sm mt-4 shadow-lg shadow-orange-500/10">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Register Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;