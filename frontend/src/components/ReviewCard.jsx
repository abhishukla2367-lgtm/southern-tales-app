import React from "react";
import StarRating from "./StarRating";

const ReviewCard = ({ name, text, rating }) => (
    /* Changed bg-white to bg-black and added a subtle border for card definition */
    <div className="bg-black p-6 rounded-xl shadow-2xl border border-zinc-800 space-y-2">
        <StarRating rating={rating} />
        {/* Updated text-gray-700 to text-zinc-400 for legibility on black */}
        <p className="text-zinc-400">{text}</p>
        {/* Updated name to text-white */}
        <h4 className="font-semibold text-white">{name}</h4>
    </div>
);

export default ReviewCard;