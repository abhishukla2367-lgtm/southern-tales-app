import React, { useState } from "react";
import { Star, MessageSquare, User, Send, CheckCircle } from "lucide-react";

const initialReviews = [
    { name: "Rohit Verma", rating: 5, comment: "Authentic South Indian flavors. The dosa was crisp!" },
    { name: "Ananya Iyer", rating: 4, comment: "Loved the ambience. Sambhar was rich and comforting." },
    { name: "Vikram Patel", rating: 4, comment: "Food was good, but service was slightly slow." },
];

const Review = () => {
    const [reviews, setReviews] = useState(initialReviews);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating!");
            return;
        }

        const newReview = { name, rating, comment };
        setReviews([newReview, ...reviews]);

        setSubmitted(true);
        setName("");
        setComment("");
        setRating(0);

        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="bg-black min-h-screen py-12 text-white">
            <section className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* 1. Review Submission Form Card */}
                <div className="bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 mb-24 transition-all hover:shadow-orange-500/10">
                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-8 px-8 text-center">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Share Your Tale</h2>
                        <p className="text-orange-100 mt-1 font-medium italic">We value your authentic feedback</p>
                    </div>

                    <div className="p-10 relative">
                        {submitted && (
                            <div className="absolute inset-0 bg-zinc-900/95 z-20 flex flex-col items-center justify-center animate-in fade-in duration-500 rounded-b-[2.5rem]">
                                <CheckCircle className="text-orange-500 w-20 h-20 mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white">Review Posted!</h3>
                                <p className="text-zinc-400">Your story has been added to our collection.</p>
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="space-y-8">
                            {/* Interactive Star Rating */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            onMouseEnter={() => setHover(num)}
                                            onMouseLeave={() => setHover(0)}
                                            className="transition-all hover:scale-125 active:scale-90 focus:outline-none"
                                        >
                                            <Star
                                                size={48}
                                                fill={(hover || rating) >= num ? "#f97316" : "transparent"}
                                                className={`transition-colors duration-200 ${(hover || rating) >= num ? "text-orange-500" : "text-zinc-700"
                                                    }`}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-1 rounded-full">
                                    {rating > 0 ? `${rating} Star Experience` : "Select your rating"}
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Your Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-800 rounded-2xl border-none ring-1 ring-white/10 focus:ring-2 focus:ring-orange-500 text-white outline-none transition-all placeholder:text-zinc-500"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-5 text-zinc-500" size={20} />
                                    <textarea
                                        placeholder="Tell us what you loved..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-800 rounded-2xl border-none ring-1 ring-white/10 focus:ring-2 focus:ring-orange-500 text-white outline-none transition-all resize-none placeholder:text-zinc-500"
                                        required
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 text-lg group">
                                Post My Review <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. Reviews Display List */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b-4 border-zinc-800 pb-6">
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight uppercase">Community Tales</h3>
                            <p className="text-zinc-500 text-sm mt-1">Real experiences from our valued guests</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-lg font-black bg-zinc-800 text-orange-500 px-6 py-2 rounded-2xl rotate-2 border border-white/5 shadow-md">
                                {reviews.length} total
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-10">
                        {reviews.map((rev, i) => (
                            <div
                                key={i}
                                className="bg-zinc-900 p-8 rounded-[2.5rem] shadow-lg border border-white/5 flex flex-col md:flex-row gap-8 items-start hover:shadow-orange-500/5 transition-all duration-500 group"
                            >
                                {/* Avatar Circle */}
                                <div className="h-20 w-20 bg-gradient-to-br from-zinc-700 to-zinc-800 text-orange-500 rounded-[2rem] flex-shrink-0 flex items-center justify-center font-black text-3xl shadow-xl transform group-hover:rotate-0 -rotate-6 transition-transform border border-white/10">
                                    {rev.name.charAt(0)}
                                </div>

                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <h4 className="text-2xl font-bold text-white">{rev.name}</h4>
                                        <div className="flex gap-1.5 text-orange-500 bg-orange-500/5 px-3 py-1.5 rounded-xl border border-orange-500/10">
                                            {[...Array(5)].map((_, j) => (
                                                <Star
                                                    key={j}
                                                    size={20}
                                                    fill={j < rev.rating ? "currentColor" : "transparent"}
                                                    className={j < rev.rating ? "text-orange-500" : "text-zinc-800"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <span className="text-6xl text-zinc-800 absolute -top-4 -left-4 font-serif">“</span>
                                        <p className="text-zinc-300 leading-relaxed italic text-xl relative z-10 pl-4">
                                            {rev.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Review;