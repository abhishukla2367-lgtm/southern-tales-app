import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Phone, Mail, User,
  Send, MapPin, Clock, CheckCircle2, ChevronDown, Play,
} from "lucide-react";

import offer1     from "../assets/images/offers/offer1.jpg";
import offer2     from "../assets/images/offers/offer2.jpg";
import offer3     from "../assets/images/offers/offer3.jpg";
import dosa       from "../assets/images/dishes/dosa.jpg";
import idli       from "../assets/images/dishes/idli.jpg";
import payasam   from "../assets/images/dishes/payasam.jpg";
import gallery1   from "../assets/images/gallery/gallery1.jpg";
import gallery2   from "../assets/images/gallery/gallery2.jpg";
import gallery3   from "../assets/images/gallery/gallery3.jpg";
import gallery4   from "../assets/images/gallery/gallery4.jpg";
import gallery5   from "../assets/images/gallery/gallery5.jpg";
import gallery6   from "../assets/images/gallery/gallery6.jpg";
import aboutImage from "../assets/images/about/our-story.jpg";

const promoVideos = [
  { 
    id: "SkUXFCIjXiI", 
    tag: "Restaurant Tour", 
    title: "Welcome to Southern Tales", 
    desc: "Take a tour of our restaurant in CBD Belapur — the ambiance, the warmth, and the hospitality." 
  },
  { 
    id: "HpQzYMVCeFw", 
    tag: "Chef's Special", 
    title: "Authentic South Indian Kitchen", 
    desc: "Watch our chefs craft traditional South Indian dishes with the finest spices and recipes." 
  },
  { 
    id: "fECzOAmRsso", 
    tag: "Dining Experience", 
    title: "A Feast at Southern Tales", 
    desc: "From crispy dosas to hearty meals — experience authentic South Indian dining at its finest." 
  },
];

const heroImages = [
  "https://images.pexels.com/photos/35539315/pexels-photo-35539315.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/31199041/pexels-photo-31199041.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920",
];

const offers = [
  { img: offer1, tag: "Weekend Deal",  title: "20% Off All Dishes", desc: "Enjoy 20% off on all South Indian dishes every weekend." },
  { img: offer2, tag: "Happy Hours",   title: "Buy 1 Get 1 Free",   desc: "Filter Coffee & beverages during 5–7 PM daily." },
  { img: offer3, tag: "Lunch Special", title: "Free Dessert Combo", desc: "Get a free dessert with any Main Course combo meal." },
];

const featuredDishes = [
  { img: dosa,  name: "Masala Dosa", origin: "Karnataka",   price: "₹149", desc: "Crispy rice crepe with spiced potato filling" },
  { img: idli,  name: "Idli Sambar", origin: "Tamil Nadu",  price: "₹99",  desc: "Steamed rice cakes with lentil vegetable stew" },
  { img: payasam, name: "Payasam",   origin: "Kerala", price: "₹180",  desc: "Creamy rice pudding slow-cooked with milk and jaggery" },
];

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const tickerItems = [
  "Dosa","Filter Coffee","Idli Sambar","Chettinad Chicken",
  "Appam","Kerala Prawn Curry","Medu Vada","Rasam","Pongal","Biryani",
];

const services = [
  { emoji: "🍽️", title: "Fine Dining",    desc: "Traditional ambiance with modern comfort and impeccable service." },
  { emoji: "🥡", title: "Quick Takeaway", desc: "Fresh packing to keep your food hot and flavourful." },
  { emoji: "🎉", title: "Event Catering", desc: "Authentic feasts crafted for your most special occasions." },
  { emoji: "📦", title: "Home Delivery",  desc: "Hot, freshly prepared meals delivered to your doorstep." },
];

const contactInfo = [
  { Icon: MapPin, title: "Our Location", detail: "CBD Belapur, Navi Mumbai, Maharashtra" },
  { Icon: Phone,  title: "Call Us",      detail: "+91 98765 43210" },
  { Icon: Mail,   title: "Email Us",     detail: "hello@southerntales.in" },
  { Icon: Clock,  title: "Hours",        detail: "Mon – Fri: 7 AM – 10:30 PM · Sat – Sun: 8 AM – 11 PM" },
];

/* ─────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const dir = e.target.dataset.reveal;
          if (dir === "up")    e.target.classList.remove("opacity-0", "translate-y-10");
          if (dir === "left")  e.target.classList.remove("opacity-0", "-translate-x-12");
          if (dir === "right") e.target.classList.remove("opacity-0",  "translate-x-12");
          io.unobserve(e.target);
        }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0   = performance.now();
          const tick = (now) => {
            const p    = Math.min((now - t0) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setCount(Math.floor(ease * target));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ─────────────────────────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────────────────────────── */
const Reveal = ({ children, dir = "up", delay = "", className = "" }) => {
  const initial = {
    up:    "opacity-0 translate-y-10",
    left:  "opacity-0 -translate-x-12",
    right: "opacity-0 translate-x-12",
  }[dir];

  return (
    <div
      data-reveal={dir}
      className={`${initial} transition-all duration-700 ease-spring ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   REUSABLE UI PIECES
───────────────────────────────────────────────────────────────── */
const PrimaryBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-9 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-none"
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-9 py-4 rounded-full border border-white/20 hover:border-white/50 bg-transparent text-white font-semibold text-base tracking-wide hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer"
  >
    {children}
  </button>
);

const SectionLabel = ({ children, center = false }) => (
  <div className={`mb-4 ${center ? "flex flex-col items-center" : ""}`}>
    <p className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-3">
      {children}
    </p>
    <div className="w-12 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
  </div>
);

const CounterStat = ({ target, suffix, label }) => {
  const [count, ref] = useCounter(target);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl font-bold text-orange-500 leading-none">
        {count}{suffix}
      </div>
      <p className="text-xs tracking-[3px] uppercase text-gray-500 mt-2">{label}</p>
    </div>
  );
};

/* ─── YouTube Video Card ─── */
const VideoCard = ({ id, tag, title, desc, delay }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <Reveal dir="up" delay={delay} className="group relative rounded-3xl bg-neutral-900 border border-white/5 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 hover:border-orange-500/20 transition-all duration-500">
      <div className="relative bg-black">
        {!playing ? (
          <div
            className="relative cursor-pointer overflow-hidden aspect-video"
            onClick={() => setPlaying(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-orange-500/40 animate-ping-slow" />
                <div className="relative z-10 w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/60 group-hover:scale-110 transition-all duration-300">
                  <Play size={24} className="text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
            <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
              YouTube
            </span>
          </div>
        ) : (
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      <div className="p-7">
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
          <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-orange-500">{tag}</span>
        </div>
        <h3 className="font-display text-2xl font-bold text-neutral-100 mb-2 leading-snug group-hover:text-orange-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        {!playing && (
          <button
            onClick={() => setPlaying(true)}
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[1.5px] uppercase text-orange-500 hover:text-orange-400 transition-colors cursor-pointer border-none bg-transparent p-0"
          >
            <Play size={11} fill="currentColor" /> Watch Now
          </button>
        )}
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-300 group-hover:w-full transition-all duration-500" />
    </Reveal>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [heroIdx,    setHeroIdx]    = useState(0);
  const [parallax,   setParallax]   = useState(0);
  const [form,       setForm]       = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent,       setSent]       = useState(false);

  useScrollReveal();

  /* Hero auto-slide */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* Parallax */
  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }, 1500);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 overflow-x-hidden font-sans">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Slides */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] brightness-[0.55] ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${img})`,
              transform:       `translateY(${parallax}px) scale(1.15)`,
            }}
          />
        ))}

        {/* Gradients */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/25 via-transparent to-neutral-950" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-br from-orange-500/5 to-transparent" />

        {/* Arrows */}
        {[-1, 1].map((dir) => (
          <button
            key={dir}
            onClick={() => setHeroIdx((p) => (p + dir + heroImages.length) % heroImages.length)}
            className={`absolute z-10 top-1/2 -translate-y-1/2 ${dir === -1 ? "left-6" : "right-6"} w-12 h-12 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 cursor-pointer`}
          >
            {dir === -1 ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </button>
        ))}

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-2 rounded-full border-none cursor-pointer transition-all duration-500 ${i === heroIdx ? "w-7 bg-orange-500" : "w-2 bg-white/25"}`}
            />
          ))}
        </div>

        {/* Copy */}
        <div className="relative z-[5] text-center max-w-4xl px-6">
          <p className="animate-fade-up text-xs tracking-[5px] uppercase text-orange-500 font-semibold mb-6">
            Authentic Southern Cuisine · Est. 2010
          </p>
          <h1 className="font-display animate-hero-up text-[clamp(60px,11vw,120px)] font-bold leading-[0.9] tracking-tight mb-8">
            Southern{" "}
            <em className="not-italic bg-shimmer-gold bg-200-auto bg-clip-text text-transparent animate-shimmer">
              Tales
            </em>
          </h1>
          <p className="animate-fade-up text-[clamp(16px,2vw,20px)] text-white/50 font-light leading-relaxed mb-12 max-w-xl mx-auto">
            Heritage recipes, finest spices, timeless flavours —
            <br className="hidden sm:block" />
            bringing the authentic taste of the South to your table.
          </p>
          <div className="animate-fade-up-late flex flex-wrap gap-4 justify-center">
            <PrimaryBtn onClick={() => navigate("/menu")}>Explore Menu</PrimaryBtn>
            <GhostBtn   onClick={() => navigate("/reservation")}>Reserve a Table</GhostBtn>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="animate-scroll-bob absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30 text-[10px] tracking-[3px] uppercase">
          <span>Scroll</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TICKER
      ══════════════════════════════════════════════════ */}
      <div className="group bg-orange-500 py-3 overflow-hidden whitespace-nowrap">
        <div className="animate-ticker inline-flex group-hover:[animation-play-state:paused]">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="font-display text-xl font-semibold text-white px-8">
              {item} <span className="opacity-50 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          OFFERS
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up" className="mb-16">
            <SectionLabel>Exclusive Offers</SectionLabel>
            <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold leading-tight mt-4">
              Crafted for Every<br />Occasion
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-7">
            {offers.map((o, i) => (
              <Reveal key={i} dir="up" delay={["delay-100","delay-200","delay-300"][i]} className="group relative rounded-3xl bg-neutral-900 border border-white/5 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-orange-500/20 transition-all duration-500">
                <div className="relative h-52 overflow-hidden">
                  <img src={o.img} alt={o.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold tracking-[2px] uppercase px-3 py-1.5 rounded-full">
                    {o.tag}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="font-display text-2xl font-bold text-neutral-100 mb-3 group-hover:text-orange-400 transition-colors duration-300">{o.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">{o.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-500 group-hover:w-full transition-all duration-500" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROMOTIONS — 3 YouTube Videos
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-500/4 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal dir="up" className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <SectionLabel>Watch &amp; Experience</SectionLabel>
                <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold leading-tight mt-4">
                  Taste the South<br />
                  <em className="text-orange-500 not-italic">on Screen</em>
                </h2>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed sm:text-right self-end">
                Dive into the sights, aromas and stories behind every dish — click any card to play.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-7">
            {promoVideos.map((v, i) => (
              <VideoCard key={i} {...v} delay={["delay-100","delay-200","delay-300"][i]} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED DISHES
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up" className="text-center mb-20">
            <SectionLabel center>From Our Kitchen</SectionLabel>
            <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold mt-4">Signature Dishes</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-7">
            {featuredDishes.map((d, i) => (
              <Reveal key={i} dir="up" delay={["delay-100","delay-200","delay-300"][i]} className="group rounded-3xl bg-neutral-900 border border-white/5 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute bottom-4 right-4 bg-orange-500 text-white font-bold text-sm px-4 py-1.5 rounded-full">{d.price}</span>
                </div>
                <div className="p-7">
                  <p className="text-[10px] tracking-[2.5px] uppercase text-amber-500 font-semibold mb-2">{d.origin}</p>
                  <h3 className="font-display text-2xl font-bold mb-3">{d.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal dir="up" className="text-center mt-14">
            <PrimaryBtn onClick={() => navigate("/menu")}>View Full Menu</PrimaryBtn>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          OUR STORY
      ══════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-neutral-900">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          <Reveal dir="left" className="animate-float relative">
            <div className="absolute -inset-5 rounded-[40px] border border-orange-500/15" />
            <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-br from-orange-500/6 to-transparent" />
            <img src={aboutImage} alt="Our Story" className="relative z-10 w-full rounded-[28px] shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 z-20 w-24 h-24 rounded-full bg-orange-500 flex flex-col items-center justify-center text-white shadow-xl shadow-orange-500/30">
              <span className="font-display text-3xl font-bold leading-none">15</span>
              <span className="text-[10px] tracking-[2px] uppercase opacity-80">Years</span>
            </div>
          </Reveal>

          <Reveal dir="right">
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="font-display text-[clamp(36px,4.5vw,54px)] font-bold leading-tight mt-4 mb-6">
              Authentic Flavors,<br />
              <em className="text-orange-500 not-italic">Traditional Recipes.</em>
            </h2>
            <p className="text-neutral-400 text-base leading-[1.9] mb-4">
              Nestled in the heart of CBD Belapur, we bring you an authentic dining experience celebrating flavors from Kerala, Tamil Nadu, Karnataka, and Andhra Pradesh.
            </p>
            <p className="text-neutral-500 text-base leading-[1.9] mb-10">
              Every dish tells a story — of grandmothers' kitchens, monsoon evenings, and the spice trails of the Deccan Plateau.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/[0.08] mb-10">
              <CounterStat target={50} suffix="+" label="Dishes" />
              <CounterStat target={10} suffix="k+" label="Guests" />
              <CounterStat target={4}  suffix=""   label="States" />
            </div>
            <PrimaryBtn onClick={() => navigate("/about")}>Know More About Us</PrimaryBtn>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up" className="text-center mb-20">
            <SectionLabel center>What We Offer</SectionLabel>
            <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold mt-4">Our Services</h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <Reveal key={i} dir="up" delay={["delay-100","delay-200","delay-300","delay-400"][i]} className="group text-center p-10 rounded-3xl border bg-neutral-900 border-white/5 hover:bg-orange-500 hover:border-orange-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 cursor-default">
                <span className="text-5xl mb-5 block group-hover:scale-125 transition-transform duration-500">{s.emoji}</span>
                <h3 className="font-display text-2xl font-bold mb-3 text-neutral-100">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400 group-hover:text-white/85 transition-colors duration-300">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div>
              <SectionLabel>Visual Story</SectionLabel>
              <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold leading-tight mt-4">
                Inside Southern Tales
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              A glimpse into our world — the flavours, the ambiance, and the stories behind every dish.
            </p>
          </Reveal>

          <Reveal dir="up" className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="row-span-2 group relative rounded-2xl overflow-hidden min-h-[420px]">
              <img src={galleryImages[0]} alt="Gallery 1" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden h-[200px]">
                <img src={galleryImages[idx]} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
            <div
              className="group relative rounded-2xl overflow-hidden h-[200px] cursor-pointer"
              onClick={() => navigate("/gallery")}
            >
              <img src={galleryImages[4]} alt="More" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/75 transition-colors duration-300 flex flex-col items-center justify-center gap-2">
                <span className="font-display text-5xl font-bold text-white leading-none">+{galleryImages.length - 4}</span>
                <span className="text-white/75 text-[10px] tracking-[3px] uppercase">More Photos</span>
              </div>
            </div>
          </Reveal>

          <Reveal dir="up" className="text-center mt-12">
            <PrimaryBtn onClick={() => navigate("/gallery")}>View Full Gallery</PrimaryBtn>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <Reveal dir="up" className="text-center mb-20">
            <SectionLabel center>Get In Touch</SectionLabel>
            <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold mt-4 mb-3">Connect With Us</h2>
            <p className="text-gray-400 text-base">Reach out for bookings, feedback, or inquiries.</p>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal dir="left" className="relative bg-neutral-900 rounded-3xl border border-white/5 p-10 overflow-hidden">
              {sent && (
                <div className="absolute inset-0 bg-neutral-950/95 z-20 flex flex-col items-center justify-center gap-5 rounded-3xl">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                    <CheckCircle2 size={64} className="text-green-500 relative z-10" />
                  </div>
                  <h3 className="font-display text-3xl font-bold">Message Received!</h3>
                  <p className="text-gray-400 text-base">We'll get back to you shortly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {[
                  { name: "name",  type: "text",  label: "Full Name",     placeholder: "e.g. Arjun Sharma",    Icon: User },
                  { name: "email", type: "email", label: "Email Address", placeholder: "e.g. arjun@gmail.com", Icon: Mail },
                ].map(({ name, type, label, placeholder, Icon }) => (
                  <div key={name}>
                    <label className="block text-[10px] tracking-[2px] uppercase text-gray-500 font-semibold mb-3">{label}</label>
                    <div className="relative">
                      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-base text-neutral-100 placeholder-neutral-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase text-gray-500 font-semibold mb-3">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-base text-neutral-100 placeholder-neutral-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:shadow-orange-500/40 cursor-pointer border-none"
                >
                  {submitting
                    ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-fast" />
                    : <><Send size={16} /> Send Message</>
                  }
                </button>
              </form>
            </Reveal>

            <Reveal dir="right" className="flex flex-col gap-5">
              {contactInfo.map(({ Icon, title, detail }) => (
                <div
                  key={title}
                  className="group flex items-center gap-5 p-5 rounded-2xl bg-neutral-900 border border-white/5 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors duration-300">
                    <Icon size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[2px] uppercase text-gray-500 font-semibold mb-1">{title}</p>
                    <p className="text-base font-medium text-neutral-100">{detail}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl overflow-hidden h-56 border border-white/5">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.583344682022!2d73.036063!3d19.016053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3dad636055d%3A0x88989e24345d4c9!2sCBD%20Belapur%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1707480000000!5m2!1sen!2sin"
                  className="w-full h-full border-0 grayscale invert brightness-[0.8] contrast-[1.2]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;