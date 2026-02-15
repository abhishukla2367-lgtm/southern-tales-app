import React, { useState } from "react";

const ReviewForm = () => {
    const [form, setForm] = useState({ name: "", email: "", review: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Review submitted! (UI only)");
    };

    return (
        /* Section wrapper set to black, Form set to a dark zinc to stand out */
        <div className="bg-black py-10 px-4 min-h-[400px]">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-6 rounded-xl shadow-2xl max-w-lg mx-auto space-y-4 border border-white/10"
            >
                <h2 className="text-white text-xl font-bold mb-2">Leave a Review</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                    required
                />

                <textarea
                    name="review"
                    placeholder="Your Review"
                    rows={4}
                    value={form.review}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                    required
                />

                <button className="w-full bg-yellow-400 text-black font-semibold p-3 rounded-lg hover:bg-yellow-500 transition active:scale-[0.98]">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;