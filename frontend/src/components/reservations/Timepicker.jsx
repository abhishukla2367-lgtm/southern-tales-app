import { useState } from "react";
import DrumColumn from "./Drumcolumn";

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export default function TimePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);

  const parse = (hhmm) => {
    if (!hhmm) return { hour: 0, minute: 0 };
    const [h, m] = hhmm.split(":").map(Number);
    return { hour: h || 0, minute: m || 0 };
  };

  const { hour, minute } = parse(value);
  const period = hour < 12 ? "AM" : "PM";

  const setHour   = (h) => onChange(`${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  const setMinute = (m) => onChange(`${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  const setPeriod = (p) => {
    if (p === "AM" && hour >= 12) setHour(hour - 12);
    else if (p === "PM" && hour < 12) setHour(hour + 12);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between bg-[#1a1a1a] border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
          ${error ? "border-red-500" : "border-zinc-800 hover:border-zinc-600 focus:border-[#f5c27a]"}`}>
        <span className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={value ? "text-[#f5c27a]" : "text-zinc-600"}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className={`font-mono tracking-wider ${value ? "text-white" : "text-zinc-600"}`}>
            {value || "Select time"}
          </span>
        </span>
        {value && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md tracking-widest
            ${period === "AM" ? "bg-sky-900/60 text-sky-400 border border-sky-800" : "bg-orange-900/60 text-orange-400 border border-orange-800"}`}>
            {period}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="bg-[#161616] border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden" style={{ width: 340 }}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Pick a Time</p>
                <p className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
                  {String(hour).padStart(2, "0")}<span className="text-zinc-500 mx-1">:</span>{String(minute).padStart(2, "0")}
                  <span className={`ml-3 text-base font-black ${period === "AM" ? "text-sky-400" : "text-orange-400"}`}>{period}</span>
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors text-lg">✕</button>
            </div>
            <div className="flex items-center justify-center gap-3 px-6 py-5">
              <DrumColumn items={HOURS}   selected={hour}   onSelect={setHour}   label="Hour" />
              <span className="text-[#f5c27a]/60 font-black text-3xl self-center mt-6">:</span>
              <DrumColumn items={MINUTES} selected={minute} onSelect={setMinute} label="Minute" />
              <div className="flex flex-col gap-3 mt-6 ml-1">
                {["AM", "PM"].map((p) => (
                  <button key={p} type="button" onClick={() => setPeriod(p)}
                    className={`w-14 py-3 rounded-2xl text-xs font-black tracking-widest transition-all duration-150
                      ${period === p
                        ? p === "AM" ? "bg-sky-500 text-white shadow-xl shadow-sky-500/30 scale-105" : "bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-105"
                        : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-1">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm font-bold transition-colors">
                Cancel
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#f5c27a] hover:bg-[#e0a84a] text-black text-sm font-black tracking-wide transition-colors">
                ✔ Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}