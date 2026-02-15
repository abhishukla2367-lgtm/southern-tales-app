import React, { useState } from "react";
import { Mail, User, Send, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulating an API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            setForm({ name: "", email: "", message: "" });

            // Reset success message after 5 seconds
            setTimeout(() => setIsSent(false), 5000);
        }, 1500);
    };

    return (
        /* Main background set to deep black */
        <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
                        Get in <span className="text-orange-500">Touch</span>
                    </h2>
                    <p className="mt-4 text-xl text-zinc-400 max-w-2xl mx-auto font-light">
                        Have a question about our menu or want to book a table? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side: Contact Form */}
                    <div className="bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                        {isSent && (
                            <div className="absolute inset-0 bg-zinc-900/95 z-10 flex flex-col items-center justify-center animate-in fade-in duration-500">
                                <CheckCircle2 className="text-orange-500 w-20 h-20 mb-4" />
                                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                                <p className="text-zinc-400">We'll get back to you shortly.</p>
                                <button
                                    onClick={() => setIsSent(false)}
                                    className="mt-6 text-orange-500 font-semibold hover:text-orange-400 transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-300 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 rounded-2xl border border-white/10 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 rounded-2xl border border-white/10 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-300 ml-1">Your Message</label>
                                <textarea
                                    name="message"
                                    placeholder="Tell us what's on your mind..."
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-5 bg-zinc-800 rounded-2xl border border-white/10 text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg ${isSubmitting
                                    ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Contact Info & Map */}
                    <div className="flex flex-col h-full space-y-8">
                        <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-white/5 flex-grow">
                            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-5">
                                    <div className="bg-orange-500/10 p-3 rounded-xl">
                                        <MapPin className="text-orange-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Our Location</p>
                                        <p className="text-zinc-400">123 Southern Street, Belapur,<br />Navi Mumbai, MH 400614</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="bg-orange-500/10 p-3 rounded-xl">
                                        <Phone className="text-orange-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Phone Number</p>
                                        <p className="text-zinc-400">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="bg-orange-500/10 p-3 rounded-xl">
                                        <Clock className="text-orange-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Opening Hours</p>
                                        <p className="text-zinc-400">Mon - Sun: 10:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="w-full h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900 transform hover:scale-[1.01] transition-transform duration-500 grayscale opacity-80 hover:grayscale-0 hover:opacity-100">
                            <iframe
                                title="Google Maps Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.441113264423!2d73.0334803!3d19.0113111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3dadf000001%3A0x633d9c88220f8c37!2sCBD%20Belapur%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;