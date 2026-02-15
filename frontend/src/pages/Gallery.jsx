import React, { useState } from "react";

const images = [
    // FOOD
    { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe", category: "food", title: "Fine Dining Plate" },
    { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", category: "food", title: "Chef Special" },
    { src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092", category: "food", title: "Gourmet Cuisine" },
    { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", category: "food", title: "Traditional Dish" },
    { src: "https://images.unsplash.com/photo-1529042410759-befb1204b468", category: "food", title: "Dessert Collection" },
    { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", category: "food", title: "Healthy Menu" },
    { src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543", category: "food", title: "Breakfast Spread" },
    { src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141", category: "food", title: "Italian Cuisine" },
    { src: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9", category: "food", title: "Street Fusion" },

    // INTERIOR
    { src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36", category: "interior", title: "Luxury Interior" },
    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", category: "interior", title: "Restaurant Ambience" },
    { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9", category: "interior", title: "Modern Seating" },
    { src: "https://images.unsplash.com/photo-1592861956120-e524fc739696", category: "interior", title: "Fine Dining Hall" },
    { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", category: "interior", title: "Elegant Lighting" },
    { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", category: "interior", title: "Luxury Tables" },
    { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", category: "interior", title: "Cafe Interior" },

    // EVENTS
    { src: "https://images.unsplash.com/photo-1531058020387-3be344556be6", category: "events", title: "Birthday Celebration" },
    { src: "https://images.unsplash.com/photo-1521334884684-d80222895322", category: "events", title: "Corporate Event" },
    { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf", category: "events", title: "Live Music Night" },
    { src: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe", category: "events", title: "Private Party" },
    { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", category: "events", title: "Festival Evening" },
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", category: "events", title: "Celebration Setup" },
    { src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce", category: "events", title: "Night Event" },
];

const categories = ["all", "food", "interior", "events"];

function Gallery() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredImages =
        activeCategory === "all"
            ? images
            : images.filter((img) => img.category === activeCategory);

    return (
        <section className="bg-black text-white py-24 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Gallery
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Explore our food, interiors, and unforgettable events.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-8 mb-14 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`uppercase tracking-widest text-xs font-semibold relative py-2 transition-colors
                ${activeCategory === cat
                                    ? "text-orange-500"
                                    : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedImage(img.src)}
                            className="group relative rounded-xl overflow-hidden cursor-pointer bg-zinc-900"
                        >
                            <img
                                src={`${img.src}?auto=format&fit=crop&w=900&q=80`}
                                alt={img.title}
                                className="w-full h-[300px] object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center border border-white/10">
                                <span className="text-sm font-medium tracking-widest uppercase border-b border-orange-500 pb-1">
                                    {img.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center px-4"
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Close Button */}
                    <button className="absolute top-8 right-8 text-white text-3xl font-light hover:text-orange-500 transition-colors">
                        &times;
                    </button>

                    <img
                        src={`${selectedImage}?auto=format&fit=contain&w=1600`}
                        alt="Preview"
                        className="max-h-[85vh] max-w-full rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}

export default Gallery;