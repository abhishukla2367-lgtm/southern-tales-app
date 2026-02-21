import React, { useState } from "react";
import { Mail, User, Send, MapPin, Phone, Clock, CheckCircle2, Star } from "lucide-react";

const PHONE = "919876543210";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I'd like to enquire about Southern Tales Restaurant.");

// ─── WhatsApp SVG ───────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Star Rating Display ────────────────────────────────────────────────────
const StarRating = ({ rating, max = 5, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? "text-[#f5c27a] fill-[#f5c27a]" : "text-zinc-700 fill-zinc-700"}
      />
    ))}
  </div>
);

// ─── Interactive Star Picker (for submission form) ──────────────────────────
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={28}
            className={
              star <= (hovered || value)
                ? "text-[#f5c27a] fill-[#f5c27a]"
                : "text-zinc-700 fill-zinc-700"
            }
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-zinc-400 font-medium">
          {["", "Poor", "Fair", "Good", "Great", "Excellent"][value]}
        </span>
      )}
    </div>
  );
};

// ─── Review Card ─────────────────────────────────────────────────────────────
const ReviewCard = ({ review }) => (
  <div className="bg-[#0d0d0d] border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#f5c27a]/25 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f5c27a] to-[#e3922a] flex items-center justify-center text-black font-black text-sm flex-shrink-0">
          {review.avatar}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{review.name}</p>
          <p className="text-zinc-500 text-xs">{review.date}</p>
        </div>
      </div>
      <StarRating rating={review.rating} size={13} />
    </div>
    <p className="text-zinc-400 text-sm leading-relaxed">"{review.review}"</p>
    <div className="pt-2 border-t border-zinc-800/60">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c27a]/50">
        Ordered · {review.dish}
      </span>
    </div>
  </div>
);

// ─── Static Reviews Data ─────────────────────────────────────────────────────
const REVIEWS = [
  {
    id: 1,
    name: "Priya Ramesh",
    avatar: "PR",
    rating: 5,
    date: "January 2025",
    review: "Absolutely the best South Indian food I've had outside of Chennai. The Chettinad Chicken Curry was rich, aromatic, and perfectly spiced. The ambiance is warm and the service was exceptional.",
    dish: "Chettinad Chicken Curry",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    avatar: "AM",
    rating: 5,
    date: "February 2025",
    review: "Southern Tales is a hidden gem. The dosas are crispy perfection and the sambar is divine. Brought my entire family here for a Sunday brunch and everyone left absolutely satisfied.",
    dish: "Masala Dosa",
  },
  {
    id: 3,
    name: "Sneha Nair",
    avatar: "SN",
    rating: 4,
    date: "December 2024",
    review: "Lovely restaurant with an authentic Southern vibe. The filter coffee alone is worth the visit — strong, frothy, and served in the traditional steel tumbler. Food quality is consistently great.",
    dish: "Filter Coffee & Idli",
  },
  {
    id: 4,
    name: "Ravi Krishnan",
    avatar: "RK",
    rating: 5,
    date: "January 2025",
    review: "Came here for my anniversary dinner and the experience was phenomenal. Staff was attentive, the biryani was fragrant and perfectly layered, and the desserts were a wonderful end to the meal.",
    dish: "Hyderabadi Biryani",
  },
  {
    id: 5,
    name: "Divya Shetty",
    avatar: "DS",
    rating: 5,
    date: "February 2025",
    review: "The reservation process was seamless and the table was ready when we arrived. Every dish was impeccably presented and tasted even better than it looked. Southern Tales sets the gold standard.",
    dish: "Prawn Masala",
  },
  {
    id: 6,
    name: "Karthik Iyer",
    avatar: "KI",
    rating: 4,
    date: "November 2024",
    review: "Authentic flavors that remind me of home. The thali is a great deal — generous portions, fresh accompaniments, and the rice is cooked just right. A must-visit for anyone craving real Southern food.",
    dish: "South Indian Thali",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Contact = () => {
  // Contact form state
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Review submission state
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 0, dish: "", message: "" });
  const [reviewErrors, setReviewErrors] = useState({});
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [isReviewSent, setIsReviewSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 6000);
    }, 1500);
  };

  const validateReview = () => {
    const errs = {};
    if (!reviewForm.name.trim()) errs.name = "Name is required";
    if (!reviewForm.email.trim() || !/^\S+@\S+\.\S+$/.test(reviewForm.email))
      errs.email = "Valid email required";
    if (reviewForm.rating === 0) errs.rating = "Please select a star rating";
    if (!reviewForm.message.trim() || reviewForm.message.length < 10)
      errs.message = "Review must be at least 10 characters";
    return errs;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const errs = validateReview();
    if (Object.keys(errs).length > 0) return setReviewErrors(errs);
    setIsReviewSubmitting(true);
    setTimeout(() => {
      setIsReviewSubmitting(false);
      setIsReviewSent(true);
      setReviewForm({ name: "", email: "", rating: 0, dish: "", message: "" });
      setReviewErrors({});
    }, 1500);
  };

  const inputBase =
    "w-full bg-[#141414] rounded-xl border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-[#f5c27a] focus:ring-2 focus:ring-[#f5c27a]/20 outline-none transition-all duration-200 text-sm";

  return (
    <section className="min-h-screen bg-black text-white">

      {/* ── Hero ── */}
      <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#f5c27a]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] text-[#f5c27a]/60 mb-4 px-4 py-1.5 rounded-full border border-[#f5c27a]/20 bg-[#f5c27a]/5">
            We'd Love to Hear From You
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-4 mb-4 leading-tight tracking-tight">
            Get in <span className="text-[#f5c27a]">Touch</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light">
            Questions, reservations, or just a hello — we're always here for you.
          </p>
        </div>
      </div>

      {/* ── Contact Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT: Contact Form */}
          <div className="relative bg-[#0d0d0d] border border-zinc-800/80 rounded-3xl shadow-2xl p-8 md:p-10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5c27a] to-transparent" />

            {isSent ? (
              <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="text-green-400" size={36} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">Message Sent!</h3>
                  <p className="text-zinc-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-2 px-6 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:border-[#f5c27a]/40 hover:text-[#f5c27a] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-1">Send a Message</h2>
                  <p className="text-zinc-500 text-sm">Fill out the form and our team will respond shortly.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={handleChange}
                          className={`${inputBase} pl-11 pr-4 py-3.5`}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input
                          type="email"
                          name="email"
                          placeholder="hello@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={`${inputBase} pl-11 pr-4 py-3.5`}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Your Message</label>
                    <textarea
                      name="message"
                      placeholder="How can we help you? Ask about reservations, menu, events..."
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className={`${inputBase} p-4 resize-none`}
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg ${
                        isSubmitting
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/30"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Send size={15} /> Send Message</>
                      )}
                    </button>
                    <a
                      href={`https://wa.me/${PHONE}?text=${WHATSAPP_MESSAGE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm uppercase tracking-wider bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all active:scale-[0.98] shadow-lg shadow-green-900/20"
                    >
                      <WhatsAppIcon size={18} />
                      WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* RIGHT: Info + Map */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Phone size={18} className="text-[#f5c27a]" />, label: "Phone", value: "+91 98765 43210", sub: "Mon–Sun, 10 AM – 11 PM" },
                { icon: <Mail size={18} className="text-[#f5c27a]" />, label: "Email", value: "hello@southerntales.in", sub: "Reply within 24 hours" },
                { icon: <MapPin size={18} className="text-[#f5c27a]" />, label: "Address", value: "123 Southern Street", sub: "Belapur, Navi Mumbai 400614" },
                { icon: <Clock size={18} className="text-[#f5c27a]" />, label: "Hours", value: "Mon – Sun", sub: "10:00 AM – 11:00 PM" },
              ].map((item) => (
                <div key={item.label} className="bg-[#0d0d0d] border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3 hover:border-[#f5c27a]/30 transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-xl bg-[#f5c27a]/10 border border-[#f5c27a]/20 flex items-center justify-center group-hover:bg-[#f5c27a]/15 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{item.label}</p>
                    <p className="text-white font-bold text-sm leading-snug">{item.value}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 h-64 group">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.441113264423!2d73.0334803!3d19.0113111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3dadf000001%3A0x633d9c88220f8c37!2sCBD%20Belapur%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* WhatsApp CTA Banner */}
            <a
              href={`https://wa.me/${PHONE}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-[#25D366]/10 border border-[#25D366]/25 hover:bg-[#25D366]/15 hover:border-[#25D366]/40 rounded-2xl p-5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-green-900/30">
                <WhatsAppIcon size={22} />
              </div>
              <div>
                <p className="font-black text-white text-sm">Chat on WhatsApp</p>
                <p className="text-zinc-400 text-xs mt-0.5">Instant replies during business hours</p>
              </div>
              <div className="ml-auto text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity">
                <Send size={16} />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ── Testimonials Section ── */}
      <div className="border-t border-zinc-900 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] text-[#f5c27a]/60 mb-4 px-4 py-1.5 rounded-full border border-[#f5c27a]/20 bg-[#f5c27a]/5">
              Guest Experiences
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6 tracking-tight">
              What Our Guests <span className="text-[#f5c27a]">Say</span>
            </h2>

            {/* Overall Rating Badge */}
            <div className="inline-flex items-center gap-6 bg-[#0d0d0d] border border-zinc-800 rounded-2xl px-8 py-5">
              <div className="text-center">
                <p className="text-5xl font-black text-[#f5c27a] leading-none">4.8</p>
                <p className="text-zinc-500 text-xs mt-1">out of 5</p>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div className="text-left">
                <StarRating rating={5} size={20} />
                <p className="text-zinc-400 text-xs mt-2">
                  Based on <span className="text-white font-bold">248 reviews</span>
                </p>
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* ── Review Submission Form ── */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-[#0d0d0d] border border-zinc-800/80 rounded-3xl p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5c27a] to-transparent" />

              {isReviewSent ? (
                <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#f5c27a]/10 border border-[#f5c27a]/30 flex items-center justify-center">
                    <Star size={32} className="text-[#f5c27a] fill-[#f5c27a]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">Thank You!</h3>
                    <p className="text-zinc-400 text-sm">Your review has been submitted and is pending approval.</p>
                  </div>
                  <button
                    onClick={() => setIsReviewSent(false)}
                    className="mt-2 px-6 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:border-[#f5c27a]/40 hover:text-[#f5c27a] transition-all"
                  >
                    Write Another Review
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-white mb-1">Leave a Review</h3>
                    <p className="text-zinc-500 text-sm">Dined with us recently? Share your experience with others.</p>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Your Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            className={`${inputBase} pl-11 pr-4 py-3.5`}
                          />
                        </div>
                        {reviewErrors.name && <p className="text-red-400 text-xs mt-1">{reviewErrors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                          <input
                            type="email"
                            placeholder="hello@example.com"
                            value={reviewForm.email}
                            onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                            className={`${inputBase} pl-11 pr-4 py-3.5`}
                          />
                        </div>
                        {reviewErrors.email && <p className="text-red-400 text-xs mt-1">{reviewErrors.email}</p>}
                      </div>
                    </div>

                    {/* Dish Ordered (optional) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">
                        Dish Ordered <span className="text-zinc-600 normal-case font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Masala Dosa, Payasam..."
                        value={reviewForm.dish}
                        onChange={(e) => setReviewForm({ ...reviewForm, dish: e.target.value })}
                        className={`${inputBase} px-4 py-3.5`}
                      />
                    </div>

                    {/* Star Rating Picker */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Your Rating</label>
                      <div className="bg-[#141414] border border-zinc-800 rounded-xl px-4 py-3.5">
                        <StarPicker
                          value={reviewForm.rating}
                          onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
                        />
                      </div>
                      {reviewErrors.rating && <p className="text-red-400 text-xs mt-1">{reviewErrors.rating}</p>}
                    </div>

                    {/* Review Text */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#f5c27a]/70">Your Review</label>
                      <textarea
                        placeholder="Tell us about your dining experience — food quality, ambiance, service..."
                        value={reviewForm.message}
                        onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })}
                        rows={4}
                        className={`${inputBase} p-4 resize-none`}
                      />
                      <div className="flex items-center justify-between">
                        {reviewErrors.message
                          ? <p className="text-red-400 text-xs">{reviewErrors.message}</p>
                          : <span />
                        }
                        <p className="text-zinc-600 text-xs ml-auto">{reviewForm.message.length} / 500</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isReviewSubmitting}
                      className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg ${
                        isReviewSubmitting
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-[#f5c27a] hover:bg-[#e3b26a] text-black shadow-yellow-900/20"
                      }`}
                    >
                      {isReviewSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <><Star size={15} className="fill-black" /> Submit Review</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;