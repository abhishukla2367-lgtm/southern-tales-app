import React from "react";
import Mission from "../components/Mission";
import ChefCard from "../components/ChefCard";

/* ================= IMAGE IMPORTS ================= */
import aboutImage from "../assets/images/about/our-story.jpg";
import chefArjun from "../assets/images/chefs/chef-arjun.jpg";
import chefPooja from "../assets/images/chefs/chef-pooja.jpg";
import chefVikram from "../assets/images/chefs/chef-vikram.jpg";

export default function About() {
  return (
    /* UPDATED: Background to Pure Black, Text to Light Gray, Added pt-28 for Header Gap */
    <main
      role="main"
      className="bg-black text-[#F3F4F6] overflow-hidden font-sans pt-28"
    >
      {/* 1. ARCHITECTURAL HERO */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Deep Obsidian Background with Mesh Gradient */}
        <div className="absolute inset-0 bg-[#000000]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_left,_#b45309,_transparent_50%),radial-gradient(circle_at_top_right,_#111827,_transparent_50%)]" />

        {/* Decorative Pattern - Faded for Noir look */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L15 0h30L30 30zM15 60L0 30h30L15 60zM45 60L30 30h30L45 60zM30 30L15 0h30L30 30z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-orange-500"></div>
            <span className="text-xs uppercase tracking-[0.4em] text-orange-500 font-black">
              ESTABLISHED 2015
            </span>
            <div className="h-[1px] w-12 bg-orange-500"></div>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tighter">
            Heritage <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-500 to-yellow-600">
              Redefined.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Southern Tales is a sanctuary where ancestral spice secrets meet the
            finesse of modern culinary artistry.
          </p>

          <div className="mt-12 animate-bounce">
            <div className="w-px h-20 bg-gradient-to-b from-orange-500 to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY (Asymmetric Design) */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          {/* IMAGE SIDE */}
          <div className="lg:col-span-7 relative group">
            <div className="absolute -inset-4 border border-orange-500/20 rounded-[3rem] translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
            <img
              src={aboutImage}
              alt="Culinary craftsmanship"
              className="rounded-[2.5rem] shadow-2xl w-full h-[550px] object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute -bottom-10 -right-10 hidden xl:flex w-48 h-48 bg-[#111111] rounded-full items-center justify-center p-8 text-center border-8 border-black shadow-2xl">
              <p className="text-orange-500 text-xs font-black leading-tight uppercase tracking-widest">
                100% Organic Spices
              </p>
            </div>
          </div>

          {/* TEXT SIDE */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest">
                Our Philosophy
              </h3>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                Rooted in Tradition, <br />
                Refined for Today.
              </h2>
            </div>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Southern Tales was born from a deep respect for Southern Indian
                culinary traditions. We believe food isn't just sustenance—it's
                a vessel for memory and emotion.
              </p>
              <p className="border-l-2 border-orange-500 pl-6 italic font-medium text-gray-200 bg-white/5 py-4 rounded-r-xl">
                "Every recipe we serve carries generations of wisdom, carefully
                adapted to dance on the modern palate."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOIR STATS SECTION */}
      <section className="bg-[#080808] border-y border-white/5 text-white py-24 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { value: "15+", label: "Years of Heritage" },
            { value: "50+", label: "Spice Blends" },
            { value: "10k+", label: "Global Guests" },
            { value: "3", label: "Master Chefs" },
          ].map((item, i) => (
            <div key={i} className="group text-center">
              <p className="text-5xl md:text-6xl font-black text-orange-500 mb-2 transition-transform group-hover:scale-110">
                {item.value}
              </p>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CHEF CURATION SECTION */}
      <section className="bg-black py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs border border-orange-500/30 px-6 py-2 rounded-full">
            The Artisans
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-8 text-white tracking-tighter">
            The Minds Behind <br /> the Magic
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
          <ChefCard
            image={chefArjun}
            name="Arjun Mehta"
            role="Executive Visionary"
            colorTheme="orange"
            description="18 years of redefining the boundaries of Southern Coastal cuisine."
          />
          <ChefCard
            image={chefPooja}
            name="Pooja Nair"
            role="Pastry Alchemist"
            colorTheme="orange"
            description="Blending botanical extracts with traditional jaggery-based sweets."
          />
          <ChefCard
            image={chefVikram}
            name="Vikram Singh"
            role="Spice Master"
            colorTheme="orange"
            description="A specialist in the lost art of slow-fire regional tempering."
          />
        </div>
      </section>

      {/* 5. THE MISSION */}
      <div className="bg-[#080808] border-t border-white/5">
        <Mission />
      </div>
    </main>
  );
}
