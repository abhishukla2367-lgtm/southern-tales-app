import { useState, useEffect, useCallback } from "react";

const IMAGES = [
  // ── FOOD (15 images – South Indian dishes) ───────────────────────────
  { src: "https://images.unsplash.com/photo-1630383249896-424e482df921", category: "food", title: "Masala Dosa",        h: "h-64" },
  { src: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc", category: "food", title: "Idli Sambar",        h: "h-48" },
  { src: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8", category: "food", title: "Biryani",            h: "h-72" },
  { src: "https://images.unsplash.com/photo-1606491956689-2ea866880c84", category: "food", title: "South Indian Thali", h: "h-56" },
  { src: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15", category: "food", title: "Medu Vada",          h: "h-80" },
  { src: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853", category: "food", title: "Uttapam",              h: "h-52" },
  { src: "https://images.unsplash.com/photo-1625398407796-82650a8c135f", category: "food", title: "Appam",              h: "h-64" },
  { src: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7", category: "food", title: "Sambar Rice",        h: "h-56" },
  { src: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0", category: "food", title: "Coconut Chutney",    h: "h-48" },
  { src: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4", category: "food", title: "Pongal",             h: "h-72" },
  { src: "https://images.unsplash.com/photo-1606756790138-261d2b21cd75", category: "food", title: "Rasam",              h: "h-60" },
  { src: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2", category: "food", title: "Fish Curry",         h: "h-80" },
  { src: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1", category: "food", title: "Filter Coffee",      h: "h-44" },
  { src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0", category: "food", title: "Dosa & Chutneys",    h: "h-64" },
  { src: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb", category: "food", title: "Kerala Prawn Curry", h: "h-56" },

  // ── INTERIOR (15 images – South Indian restaurant spaces) ─────────────
  { src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36", category: "interior", title: "Luxury Dining Hall",   h: "h-72" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", category: "interior", title: "Restaurant Ambience",  h: "h-56" },
  { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9", category: "interior", title: "Modern Seating",          h: "h-64" },
  { src: "https://images.unsplash.com/photo-1592861956120-e524fc739696", category: "interior", title: "Fine Dining Hall",     h: "h-48" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", category: "interior", title: "Cafe Interior",           h: "h-80" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", category: "interior", title: "Premium Dining",       h: "h-52" },
  { src: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d", category: "interior", title: "Outdoor Seating",      h: "h-64" },
  { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de", category: "interior", title: "Rooftop Dining",          h: "h-72" },
  { src: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae", category: "interior", title: "Bar Lounge",            h: "h-44" },
  { src: "https://images.unsplash.com/photo-1567521464027-f127ff144326", category: "interior", title: "Warm Ambience",         h: "h-60" },
  { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330", category: "interior", title: "Heritage Decor",           h: "h-56" },
  { src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17", category: "interior", title: "Garden Dining",         h: "h-80" },
  { src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88", category: "interior", title: "Candlelit Table",       h: "h-48" },
  { src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814", category: "interior", title: "Cozy Corner",           h: "h-64" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e", category: "interior", title: "Private Booth",         h: "h-56" },

  // ── EVENTS (15 images – South Indian restaurant events) ───────────────
  { src: "https://images.unsplash.com/photo-1531058020387-3be344556be6", category: "events", title: "Birthday Celebration",   h: "h-64" },
  { src: "https://images.unsplash.com/photo-1521334884684-d80222895322", category: "events", title: "Corporate Gathering",    h: "h-80" },
  { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf", category: "events", title: "Live Music Night",       h: "h-52" },
  { src: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe", category: "events", title: "Private Party",          h: "h-72" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", category: "events", title: "Festival Evening",       h: "h-56" },
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", category: "events", title: "Celebration Setup",      h: "h-64" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3", category: "events", title: "Wedding Banquet",        h: "h-80" },
  { src: "https://images.unsplash.com/photo-1510076857177-7470076d4098", category: "events", title: "Anniversary Dinner",     h: "h-60" },
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87", category: "events", title: "Grand Opening",          h: "h-48" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", category: "events", title: "Gala Dinner",            h: "h-72" },
  { src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329", category: "events", title: "Live Performance",       h: "h-44" },
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3", category: "events", title: "DJ Night",               h: "h-64" },
  { src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7", category: "events", title: "Cultural Night",         h: "h-56" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865", category: "events", title: "Conference Banquet",     h: "h-80" },
  { src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4", category: "events", title: "Neon Party Night",       h: "h-52" },
];

const FILTERS = [
  { key: "all",      label: "All",      activeBg: "bg-orange-400", activeText: "text-stone-950" },
  { key: "food",     label: "Food",     activeBg: "bg-orange-400", activeText: "text-stone-950" },
  { key: "interior", label: "Interior", activeBg: "bg-teal-400",   activeText: "text-stone-950" },
  { key: "events",   label: "Events",   activeBg: "bg-violet-400", activeText: "text-stone-950" },
];

const catText   = { all: "text-orange-400", food: "text-orange-400", interior: "text-teal-400",   events: "text-violet-400"  };
const catDot    = { all: "bg-orange-400",   food: "bg-orange-400",   interior: "bg-teal-400",     events: "bg-violet-400"    };
const catBorder = { all: "border-orange-400/40", food: "border-orange-400/40", interior: "border-teal-400/40", events: "border-violet-400/40" };
const catRing   = { all: "ring-orange-400", food: "ring-orange-400", interior: "ring-teal-400",   events: "ring-violet-400"  };

export default function Gallery() {
  const [active,    setActive]    = useState("all");
  const [displayed, setDisplayed] = useState("all");
  const [fading,    setFading]    = useState(false);
  const [shown,     setShown]     = useState({});
  const [lb,        setLb]        = useState(null);

  const filtered = displayed === "all" ? IMAGES : IMAGES.filter(i => i.category === displayed);
  const current  = lb ? lb.list[lb.index] : null;

  const switchCat = (key) => {
    if (key === active || fading) return;
    setFading(true);
    setShown({});
    setTimeout(() => { setDisplayed(key); setActive(key); setFading(false); }, 260);
  };

  useEffect(() => {
    setShown({});
    const timers = filtered.map((_, i) =>
      setTimeout(() => setShown(s => ({ ...s, [i]: true })), 40 + i * 20)
    );
    return () => timers.forEach(clearTimeout);
  }, [displayed]);

  const onKey = useCallback((e) => {
    if (!lb) return;
    if (e.key === "Escape")     setLb(null);
    if (e.key === "ArrowRight") setLb(l => ({ ...l, index: (l.index + 1) % l.list.length }));
    if (e.key === "ArrowLeft")  setLb(l => ({ ...l, index: (l.index - 1 + l.list.length) % l.list.length }));
  }, [lb]);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  useEffect(() => {
    document.body.style.overflow = lb ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lb]);

  return (
    <section className="min-h-screen bg-stone-950 text-stone-100">

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center text-center px-6 pt-24 pb-14">
        <span className={`text-[10px] font-semibold tracking-[0.4em] uppercase mb-5 block transition-colors duration-500 ${catText[active]}`}>
          Visual Stories
        </span>
        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold leading-none tracking-tight mb-6">
          Our{" "}
          <em className={`not-italic transition-colors duration-500 ${catText[active]}`}>Gallery</em>
        </h1>
        <p className="text-sm text-stone-500 max-w-md leading-relaxed font-light">
          A curated window into our world — the dishes we craft, the spaces we design,
          and the moments we celebrate together.
        </p>
        <div className={`w-px h-12 mt-8 opacity-50 transition-colors duration-500 ${catDot[active]}`} />
      </div>

      {/* ── FILTER BAR ── */}
      <div className="flex justify-center px-4 pb-12">
        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-full p-1">
          {FILTERS.map(({ key, label, activeBg, activeText }) => {
            const count = key === "all" ? IMAGES.length : IMAGES.filter(i => i.category === key).length;
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => switchCat(key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 select-none ${isActive ? `${activeBg} ${activeText} shadow-lg` : "text-stone-500 hover:text-stone-300"}`}
              >
                {label}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${isActive ? "bg-black/20" : "bg-stone-800 text-stone-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── UNIFORM GRID ── */}
      <div className={`grid grid-cols-3 gap-8 px-10 pb-24 transition-opacity duration-[260ms] ${fading ? "opacity-0" : "opacity-100"}`}>
        {filtered.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            onClick={() => setLb({ index: i, list: filtered })}
            className={`group relative overflow-hidden rounded-md cursor-pointer bg-stone-900 transition-all duration-500 aspect-[4/3] ${shown[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <img
              src={`${img.src}?auto=format&fit=crop&w=600&q=80`}
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className={`text-[9px] font-semibold tracking-[0.3em] uppercase mb-1.5 ${catText[img.category]}`}>
                {img.category}
              </span>
              <span className="font-serif text-base italic text-stone-100 leading-tight">{img.title}</span>
            </div>
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ── LIGHTBOX ── */}
      {lb && current && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/96 backdrop-blur-2xl flex items-center justify-center px-4 py-6"
          style={{ animation: "fadeIn 0.25s ease" }}
          onClick={() => setLb(null)}
        >
          <button
            onClick={() => setLb(null)}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 hover:bg-red-600 hover:border-red-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 text-stone-600 text-[10px] tracking-widest uppercase font-medium select-none">
            <span>← → Navigate</span>
            <span className="w-px h-3 bg-stone-700" />
            <span>Esc Close</span>
          </div>

          <div className="relative max-w-5xl w-full flex flex-col items-center gap-5" onClick={e => e.stopPropagation()}>
            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={() => setLb(l => ({ ...l, index: (l.index - 1 + l.list.length) % l.list.length }))}
                className="absolute -left-4 sm:-left-14 w-11 h-11 rounded-full bg-stone-800/70 border border-stone-700 text-stone-300 hover:bg-orange-400 hover:border-orange-400 hover:text-stone-950 flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <img
                key={lb.index}
                src={`${current.src}?auto=format&fit=contain&w=1400&q=90`}
                alt={current.title}
                className="max-h-[66vh] max-w-full rounded-lg shadow-2xl object-contain"
                style={{ animation: "imgIn 0.3s ease" }}
              />

              <button
                onClick={() => setLb(l => ({ ...l, index: (l.index + 1) % l.list.length }))}
                className="absolute -right-4 sm:-right-14 w-11 h-11 rounded-full bg-stone-800/70 border border-stone-700 text-stone-300 hover:bg-orange-400 hover:border-orange-400 hover:text-stone-950 flex items-center justify-center transition-all duration-200 z-10 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between w-full px-1">
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border bg-stone-900/60 ${catText[current.category]} ${catBorder[current.category]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${catDot[current.category]}`} />
                  {current.category}
                </span>
                <span className="font-serif text-lg italic text-stone-200">{current.title}</span>
              </div>
              <span className="text-xs font-medium tracking-widest text-stone-600 tabular-nums">
                {String(lb.index + 1).padStart(2, "0")} / {String(lb.list.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1" style={{ scrollbarWidth: "none" }}>
              {lb.list.map((img, i) => (
                <img
                  key={i}
                  src={`${img.src}?auto=format&fit=crop&w=120&q=60`}
                  alt={img.title}
                  onClick={() => setLb(l => ({ ...l, index: i }))}
                  className={`w-12 h-9 object-cover rounded flex-shrink-0 cursor-pointer transition-all duration-200 ${i === lb.index ? `opacity-100 scale-110 ring-2 ${catRing[active]}` : "opacity-30 hover:opacity-60"}`}
                />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
            @keyframes imgIn  { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }
          `}</style>
        </div>
      )}
    </section>
  );
}