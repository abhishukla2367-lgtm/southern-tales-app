import { useState } from "react";
import DrumColumn from "./Drumcolumn";

const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export default function TimePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);

  const parse24 = (hhmm) => {
    if (!hhmm) return { hour: 12, minute: 0, period: "AM" };
    const [h, m] = hhmm.split(":").map(Number);
    return {
      hour:   h % 12 === 0 ? 12 : h % 12,
      minute: Math.round(m / 5) * 5 % 60,
      period: h < 12 ? "AM" : "PM",
    };
  };

  const parsed = parse24(value);
  const [tempHour,   setTempHour]   = useState(parsed.hour);
  const [tempMinute, setTempMinute] = useState(parsed.minute);
  const [tempPeriod, setTempPeriod] = useState(parsed.period);

  const openPicker = () => {
    const p = parse24(value);
    setTempHour(p.hour); setTempMinute(p.minute); setTempPeriod(p.period);
    setOpen(true);
  };

  const confirm = () => {
    let h = tempHour;
    if (tempPeriod === "AM") { if (h === 12) h = 0; }
    else { if (h !== 12) h += 12; }
    onChange(`${String(h).padStart(2, "0")}:${String(tempMinute).padStart(2, "0")}`);
    setOpen(false);
  };

  const { hour, minute, period } = parsed;
  const displayLabel = value
    ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`
    : "Select time";

  return (
    <>
      {/* Trigger */}
      <button type="button" onClick={openPicker}
        className={`w-full flex items-center justify-between bg-[#1a1a1a] border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
          ${error ? "border-red-500" : "border-zinc-800 hover:border-zinc-600 focus:border-[#f5c27a]"}`}>
        <span className="flex items-center gap-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="font-mono tracking-wider text-white">{displayLabel}</span>
        </span>
        {value && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md tracking-widest
            ${period === "AM"
              ? "bg-sky-900/60 text-sky-400 border border-sky-800"
              : "bg-orange-900/60 text-orange-400 border border-orange-800"}`}>
            {period}
          </span>
        )}
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="bg-[#161616] border border-zinc-700/80 rounded-2xl shadow-2xl" style={{ width: 300 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-zinc-800">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Pick a time</p>
                <p className="text-2xl font-black font-mono text-white mt-0.5 tracking-tight">
                  {String(tempHour).padStart(2, "0")}
                  <span className="text-zinc-600 mx-1">:</span>
                  {String(tempMinute).padStart(2, "0")}
                  <span className={`ml-2 text-sm font-bold ${tempPeriod === "AM" ? "text-sky-400" : "text-orange-400"}`}>
                    {tempPeriod}
                  </span>
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                className="text-zinc-600 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-all text-sm">
                ✕
              </button>
            </div>

            {/* Drums */}
            <div className="flex items-center justify-center gap-1 px-4 py-3">
              <DrumColumn items={HOURS}   selected={tempHour}   onSelect={setTempHour}   label="Hour" />
              <span className="text-[#f5c27a]/40 font-black text-2xl mt-4">:</span>
              <DrumColumn items={MINUTES} selected={tempMinute} onSelect={setTempMinute} label="Min" />

              {/* AM/PM */}
              <div className="flex flex-col gap-2 mt-5 ml-2">
                {["AM", "PM"].map((p) => (
                  <button key={p} type="button" onClick={() => setTempPeriod(p)}
                    className={`px-3 py-2 rounded-xl text-xs font-black tracking-widest transition-all
                      ${tempPeriod === p
                        ? p === "AM"
                          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                          : "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                        : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 pb-4 pt-2">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm font-bold transition-all">
                Cancel
              </button>
              <button type="button" onClick={confirm}
                className="flex-1 py-2.5 rounded-xl bg-[#f5c27a] hover:bg-[#e0a84a] text-black text-sm font-black tracking-wide transition-all active:scale-95">
                ✔ Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}