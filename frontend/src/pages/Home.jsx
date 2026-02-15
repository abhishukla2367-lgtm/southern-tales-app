import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  User,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

/* ================= IMAGE IMPORTS ================= */
import offer1 from "../assets/images/offers/offer1.jpg";
import offer2 from "../assets/images/offers/offer2.jpg";
import offer3 from "../assets/images/offers/offer3.jpg";
import dosa from "../assets/images/dishes/dosa.jpg";
import idli from "../assets/images/dishes/idli.jpg";
import meduvada from "../assets/images/dishes/medu-vada.jpg";
import gallery1 from "../assets/images/gallery/gallery1.jpg";
import gallery2 from "../assets/images/gallery/gallery2.jpg";
import gallery3 from "../assets/images/gallery/gallery3.jpg";
import gallery4 from "../assets/images/gallery/gallery4.jpg";
import gallery5 from "../assets/images/gallery/gallery5.jpg";
import gallery6 from "../assets/images/gallery/gallery6.jpg";
import aboutImage from "../assets/images/about/our-story.jpg";

/* ================= DATA ================= */
const heroImages = [
  "https://images.pexels.com/photos/35539315/pexels-photo-35539315.jpeg?auto=compress&cs=tinysrgb&w=1470",
  "https://images.pexels.com/photos/31199041/pexels-photo-31199041.jpeg?auto=compress&cs=tinysrgb&w=1470",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1470",
];

const offers = [
  {
    img: offer1,
    title: "Weekend Special: 20% Off",
    description: "Enjoy 20% off on all South Indian dishes every weekend!",
  },
  {
    img: offer2,
    title: "Buy 1 Get 1 Free",
    description:
      "On all Filter Coffee and beverages during happy hours (5–7 PM).",
  },
  {
    img: offer3,
    title: "Lunch Combo Offer",
    description: "Get a free dessert with any Main Course combo meal!",
  },
];

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
];

/* ================= MAIN COMPONENT ================= */

const Home = () => {
  const navigate = useNavigate();
  const [currentHero, setCurrentHero] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Auto-rotate Hero Images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulated API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 4000);
    }, 1500);
  };

  return (
    /* UPDATED: Background to Pure Black */
    <div className="bg-black scroll-smooth m-0 font-sans text-gray-100">
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative h-[90vh] md:h-screen flex items-center justify-center text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
          style={{
            backgroundImage: `url(${heroImages[currentHero]})`,
            filter: "brightness(0.4)",
          }}
        />
        {/* UPDATED: Gradient overlay to blend into Black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-10" />

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-10 z-20 pointer-events-none">
          <button
            onClick={() =>
              setCurrentHero(
                (prev) => (prev - 1 + heroImages.length) % heroImages.length,
              )
            }
            className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-orange-500 transition-all pointer-events-auto active:scale-90"
          >
            <ArrowLeft size={28} />
          </button>
          <button
            onClick={() =>
              setCurrentHero((prev) => (prev + 1) % heroImages.length)
            }
            className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-orange-500 transition-all pointer-events-auto active:scale-90"
          >
            <ArrowRight size={28} />
          </button>
        </div>

        <div className="relative z-20 max-w-4xl px-6">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Southern <span className="text-orange-500">Tales</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 italic font-light">
            Bringing the authentic taste of the South to your table.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => navigate("/menu")}
              className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              Explore Our Menu
            </button>
            <button
              onClick={() => navigate("/reservation")}
              className="flex items-center gap-3 border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all active:scale-95"
            > Reserve a Table
            </button>
          </div>
        </div>
      </section>

      {/* OFFERS SECTION */}
      <section id="offers" className="py-24 px-6 max-w-7xl mx-auto bg-black">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Exclusive Offers
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className="bg-[#111111] rounded-3xl shadow-lg overflow-hidden border border-white/10 group hover:shadow-orange-500/10 hover:shadow-2xl transition-all duration-300"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={offer.img}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-orange-500 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {offer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section id="about" className="py-24 bg-[#0a0a0a] px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/20 rounded-[40px] rotate-3 group-hover:rotate-0 transition-transform duration-500" />
            <img
              src={aboutImage}
              alt="Our Story"
              className="relative rounded-[32px] shadow-2xl z-10 w-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-orange-500/10 text-orange-500 rounded-full text-sm font-bold tracking-widest uppercase">
              Established 2010
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Authentic Flavors, <br />
              Traditional Recipes.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Nestled in the heart of CBD Belapur, we bring you an authentic
              dining experience celebrating flavors from Kerala, Tamil Nadu,
              Karnataka, and Andhra Pradesh.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/10">
              <Stat value="15+" label="Years" />
              <Stat value="50+" label="Dishes" />
              <Stat value="10k+" label="Guests" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-black text-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20">Our Services</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              emoji="🍽️"
              title="Fine Dining"
              desc="Traditional ambiance with modern comfort."
            />
            <ServiceCard
              emoji="🥡"
              title="Quick Takeaway"
              desc="Fast packing to keep your food fresh."
            />
            <ServiceCard
              emoji="🎉"
              title="Event Catering"
              desc="Authentic feasts for your special days."
            />
            <ServiceCard
              emoji="📦"
              title="Home Delivery"
              desc="Hot meals delivered to your doorstep."
            />
          </div>
        </div>
      </section>

      {/* CONTACT & MAP SECTION */}
      <section id="contact" className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Connect With Us
            </h2>
            <p className="text-gray-500">
              Reach out for bookings, feedback, or inquiries.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div className="bg-[#111111] rounded-[32px] p-10 shadow-xl border border-white/5 relative overflow-hidden">
              {isSent && (
                <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <CheckCircle2 className="text-green-500 w-20 h-20 mb-6" />
                  <h3 className="text-3xl font-bold mb-2">Message Received!</h3>
                  <p className="text-gray-400">
                    We'll get back to you shortly.
                  </p>
                </div>
              )}
              <form
                onSubmit={handleContactSubmit}
                className="space-y-6 relative z-10"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      size={20}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows={4}
                    className="w-full p-5 rounded-2xl bg-black border border-white/10 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                    required
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={22} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Details & Fixed Map */}
            <div className="space-y-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <ContactInfoCard
                  icon={<MapPin />}
                  title="Our Location"
                  detail="CBD Belapur, Navi Mumbai"
                />
                <ContactInfoCard
                  icon={<Phone />}
                  title="Call Us"
                  detail="+91 98765 43210"
                />
              </div>

              {/* FIXED GOOGLE MAP EMBED */}
              <div className="rounded-[32px] overflow-hidden h-80 shadow-2xl border-4 border-[#111111]">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.583344682022!2d73.036063!3d19.016053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3dad636055d%3A0x88989e24345d4c9!2sCBD%20Belapur%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1707480000000!5m2!1sen!2sin"
                  className="w-full h-full border-0 grayscale invert brightness-90 contrast-125"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Stat = ({ value, label }) => (
  <div className="text-center">
    <h4 className="text-3xl font-black text-orange-500">{value}</h4>
    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
      {label}
    </p>
  </div>
);

const ServiceCard = ({ emoji, title, desc }) => (
  <div className="bg-[#111111] border border-white/5 rounded-[32px] p-10 text-center hover:bg-orange-500 transition-all duration-500 group cursor-default">
    <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">
      {emoji}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 group-hover:text-white/90 text-sm leading-relaxed">
      {desc}
    </p>
  </div>
);

const ContactInfoCard = ({ icon, title, detail }) => (
  <div className="bg-[#111111] p-6 rounded-3xl shadow-lg border border-white/5 flex items-center gap-5 hover:border-orange-500 transition-colors">
    <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h4 className="font-black text-white text-sm uppercase tracking-wide">
        {title}
      </h4>
      <p className="text-gray-500 text-sm mt-0.5">{detail}</p>
    </div>
  </div>
);

export default Home;
