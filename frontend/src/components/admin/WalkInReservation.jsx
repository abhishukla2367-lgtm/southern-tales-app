import { useState, useEffect, useRef, useCallback } from "react";
import API from "../../api/axiosConfig";

// ─── Config ────────────────────────────────────────────────────────────────────
const STATUS = {
  Waiting:   { label: "Waiting",   classes: "bg-amber-900/40 text-amber-400 border border-amber-700" },
  Seated:    { label: "Seated",    classes: "bg-green-900/40 text-green-400 border border-green-700" },
  Completed: { label: "Completed", classes: "bg-slate-800 text-slate-400 border border-slate-600" },
  Cancelled: { label: "Cancelled", classes: "bg-red-900/40 text-red-400 border border-red-700" },
};

const TABLES = Array.from({ length: 20 }, (_, i) => `T-${String(i + 1).padStart(2, "0")}`);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

const BLANK_FORM = {
  customerName: "", phone: "", guests: "", tableNumber: "",
  date: "", time: "", status: "Waiting", specialRequests: "",
};

// ─── Business Hours Validation ─────────────────────────────────────────────────
// Mon–Fri : 07:00 – 22:30
// Sat–Sun : 08:00 – 23:00
const isWithinBusinessHours = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return true; // let other validators catch empty fields
  const date = new Date(dateStr);
  const day  = date.getDay(); // 0 = Sun, 6 = Sat
  const [h, m] = timeStr.split(":").map(Number);
  const totalMinutes = h * 60 + m;

  const isWeekend = day === 0 || day === 6;
  if (isWeekend) {
    return totalMinutes >= 480 && totalMinutes <= 1380; // 8:00–23:00
  } else {
    return totalMinutes >= 420 && totalMinutes <= 1350; // 7:00–22:30
  }
};

// ─── Outside Hours Popup ───────────────────────────────────────────────────────
function OutOfHoursPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="bg-[#111111] border border-zinc-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease]">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />

        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-2 px-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-900/30 border border-amber-700/50 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              className="text-amber-400">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl font-black text-white tracking-tight text-center">
            Outside Business Hours
          </h2>
          <p className="text-zinc-400 text-sm text-center mt-2 leading-relaxed">
            Reservations can only be made during our operating hours. Please choose a time within the schedule below.
          </p>
        </div>

        {/* Hours card */}
        <div className="mx-8 mt-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Operating Hours
            </p>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {/* Mon–Fri row */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-900/40 border border-sky-800/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-sky-400">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Monday – Friday</p>
                  <p className="text-zinc-500 text-xs font-mono">Weekdays</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sky-400 font-mono font-black text-sm">7:00 AM – 10:30 PM</p>
              </div>
            </div>

            {/* Sat–Sun row */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-900/40 border border-violet-800/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-violet-400">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Saturday – Sunday</p>
                  <p className="text-zinc-500 text-xs font-mono">Weekends</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-violet-400 font-mono font-black text-sm">8:00 AM – 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#f5c27a] hover:bg-[#e0a84a] text-black font-black text-sm tracking-wide transition-colors"
          >
            ← Choose a Different Time
          </button>
          <p className="text-center text-zinc-600 text-xs">
            Need help? Contact the restaurant directly.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Drum Column ───────────────────────────────────────────────────────────────
const ITEM_H    = 48;
const VISIBLE   = 5;
const PAD_COUNT = Math.floor(VISIBLE / 2);

function DrumColumn({ items, selected, onSelect, label }) {
  const listRef     = useRef(null);
  const scrollTimer = useRef(null);

  const scrollToIndex = useCallback((idx, behavior = "smooth") => {
    listRef.current?.scrollTo({ top: idx * ITEM_H, behavior });
  }, []);

  useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx !== -1) scrollToIndex(idx, "instant");
  }, [selected, items, scrollToIndex]);

  const handleScroll = () => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      if (!listRef.current) return;
      const snapped = Math.round(listRef.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, snapped));
      scrollToIndex(clamped, "smooth");
      onSelect(items[clamped]);
    }, 120);
  };

  const containerH = ITEM_H * VISIBLE;
  const paddingV   = ITEM_H * PAD_COUNT;

  return (
    <div className="flex flex-col items-center" style={{ width: 88 }}>
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">{label}</span>

      <div className="relative rounded-2xl overflow-hidden" style={{ height: containerH, width: "100%" }}>
        {/* Fade top */}
        <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
          style={{ height: paddingV, background: "linear-gradient(to bottom, #161616 0%, transparent 100%)" }} />

        {/* Selection band */}
        <div className="absolute inset-x-0 z-10 pointer-events-none mx-2 rounded-xl"
          style={{
            top: paddingV, height: ITEM_H,
            background: "rgba(245,194,122,0.07)",
            border: "1.5px solid rgba(245,194,122,0.3)",
            boxShadow: "0 0 12px rgba(245,194,122,0.08)",
          }} />

        {/* Fade bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{ height: paddingV, background: "linear-gradient(to top, #161616 0%, transparent 100%)" }} />

        {/* Scroll list */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingTop: paddingV,
            paddingBottom: paddingV,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, i) => {
            const isSel = item === selected;
            return (
              <div
                key={item}
                onClick={() => { onSelect(item); scrollToIndex(i, "smooth"); }}
                className="flex items-center justify-center cursor-pointer"
                style={{ height: ITEM_H }}
              >
                <span
                  className="font-mono font-black transition-all duration-200 select-none"
                  style={{
                    fontSize:   isSel ? 26 : 16,
                    color:      isSel ? "#f5c27a" : "#3f3f46",
                    textShadow: isSel ? "0 0 20px rgba(245,194,122,0.4)" : "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  {String(item).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Time Picker ───────────────────────────────────────────────────────────────
const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function TimePicker({ value, onChange, error }) {
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

  const display = value
    ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    : "Select time";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between bg-[#1a1a1a] border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
          ${error ? "border-red-500" : "border-zinc-800 hover:border-zinc-600 focus:border-[#f5c27a]"}`}
      >
        <span className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={value ? "text-[#f5c27a]" : "text-zinc-600"}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className={`font-mono tracking-wider ${value ? "text-white" : "text-zinc-600"}`}>
            {display}
          </span>
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

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="bg-[#161616] border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden"
            style={{ width: 340 }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Pick a Time</p>
                <p className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
                  {String(hour).padStart(2, "0")}
                  <span className="text-zinc-500 mx-1">:</span>
                  {String(minute).padStart(2, "0")}
                  <span className={`ml-3 text-base font-black ${period === "AM" ? "text-sky-400" : "text-orange-400"}`}>
                    {period}
                  </span>
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                className="text-zinc-600 hover:text-zinc-300 transition-colors text-lg leading-none mt-1">
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 px-6 py-5">
              <DrumColumn items={HOURS}   selected={hour}   onSelect={setHour}   label="Hour" />
              <span className="text-[#f5c27a]/60 font-black text-3xl pb-1 self-center mt-6">:</span>
              <DrumColumn items={MINUTES} selected={minute} onSelect={setMinute} label="Minute" />

              <div className="flex flex-col gap-3 mt-6 ml-1">
                {["AM", "PM"].map((p) => (
                  <button key={p} type="button" onClick={() => setPeriod(p)}
                    className={`w-14 py-3 rounded-2xl text-xs font-black tracking-widest transition-all duration-150
                      ${period === p
                        ? p === "AM"
                          ? "bg-sky-500 text-white shadow-xl shadow-sky-500/30 scale-105"
                          : "bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-105"
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

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, onSave, occupiedTables = [] }) {
  const [form, setForm]                     = useState(BLANK_FORM);
  const [errors, setErrors]                 = useState({});
  const [saving, setSaving]                 = useState(false);
  const [tableWarning, setTableWarning]     = useState("");
  const [showHoursPopup, setShowHoursPopup] = useState(false);
  const firstRef = useRef();

  useEffect(() => {
    if (open) {
      const now = new Date();
      setForm({
        ...BLANK_FORM,
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().slice(0, 5),
      });
      setErrors({});
      setTableWarning("");
      setShowHoursPopup(false);
      setTimeout(() => firstRef.current?.focus(), 80);
    }
  }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTableChange = (value) => {
    set("tableNumber", value);
    setTableWarning(
      value && occupiedTables.includes(value)
        ? "This table is occupied, please choose another table number."
        : ""
    );
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim())       e.customerName = "Guest name is required";
    if (!form.guests || form.guests < 1) e.guests       = "Select number of guests";
    if (!form.date)                      e.date         = "Date is required";
    if (!form.time)                      e.time         = "Time is required";
    if (tableWarning)                    e.tableNumber  = tableWarning;
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);

    // ── Business hours check ──
    if (!isWithinBusinessHours(form.date, form.time)) {
      setShowHoursPopup(true);
      return;
    }

    setSaving(true);
    try {
      const res = await API.post("/reservations/walkin", {
        customerName: form.customerName, phone: form.phone,
        guests: form.guests, tableNumber: form.tableNumber,
        date: form.date, time: form.time,
        status: form.status, specialRequests: form.specialRequests,
        type: "walk-in",
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Walk-in error:", err);
      alert(err.response?.data?.message || "Failed to create reservation.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const inputBase = "bg-[#1a1a1a] border rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#f5c27a] transition-colors placeholder-zinc-600 w-full";
  const labelBase = "text-xs font-bold uppercase tracking-widest text-[#f5c27a]";

  return (
    <>
      {/* Out-of-hours popup sits above the modal */}
      {showHoursPopup && <OutOfHoursPopup onClose={() => setShowHoursPopup(false)} />}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl">

          {/* Header */}
          <div className="flex justify-between items-start px-7 pt-6 pb-5 border-b border-zinc-800">
            <div>
              <p className="text-xs tracking-widest text-[#f5c27a] font-mono uppercase">Walk-in</p>
              <h2 className="text-2xl font-black text-white mt-1 tracking-tight">New Reservation</h2>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl leading-none mt-1 transition-colors">✕</button>
          </div>

          {/* Body */}
          <div className="px-7 py-6 grid grid-cols-2 gap-4">

            {/* Guest Name */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className={labelBase}>Guest Name <span className="text-red-400">*</span></label>
              <input ref={firstRef}
                className={`${inputBase} ${errors.customerName ? "border-red-500" : "border-zinc-800"}`}
                placeholder="Full name" value={form.customerName}
                onChange={(e) => set("customerName", e.target.value)} />
              {errors.customerName && <span className="text-red-400 text-xs">{errors.customerName}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Phone</label>
              <input className={`${inputBase} border-zinc-800`} placeholder="9876543210 (optional)"
                value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>

            {/* Guests */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Guests <span className="text-red-400">*</span></label>
              <select className={`${inputBase} ${errors.guests ? "border-red-500" : "border-zinc-800"}`}
                value={form.guests} onChange={(e) => set("guests", e.target.value)}>
                <option value="">Select people</option>
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <option key={n} value={n} className="bg-[#111111]">{n} {n === 1 ? "Person" : "People"}</option>
                ))}
              </select>
              {errors.guests && <span className="text-red-400 text-xs">{errors.guests}</span>}
            </div>

            {/* Table */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className={labelBase}>Table</label>
              <select className={`${inputBase} ${tableWarning ? "border-red-500" : "border-zinc-800"}`}
                value={form.tableNumber} onChange={(e) => handleTableChange(e.target.value)}>
                <option value="">— Assign later —</option>
                {TABLES.map((t) => (
                  <option key={t} value={t} className="bg-[#111111]">
                    {t}{occupiedTables.includes(t) ? " — 🔴 Occupied" : " — 🟢 Available"}
                  </option>
                ))}
              </select>
              {tableWarning && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5 mt-1">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-red-400 text-xs font-bold">{tableWarning}</p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Status</label>
              <select className={`${inputBase} border-zinc-800`} value={form.status}
                onChange={(e) => set("status", e.target.value)}>
                {Object.entries(STATUS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#111111]">{v.label}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Date <span className="text-red-400">*</span></label>
              <input type="date"
                className={`${inputBase} [color-scheme:dark] ${errors.date ? "border-red-500" : "border-zinc-800"}`}
                value={form.date} onChange={(e) => set("date", e.target.value)} />
              {errors.date && <span className="text-red-400 text-xs">{errors.date}</span>}
            </div>

            {/* Time */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className={labelBase}>Time <span className="text-red-400">*</span></label>
              <TimePicker
                value={form.time}
                onChange={(t) => { set("time", t); setErrors((e) => ({ ...e, time: undefined })); }}
                error={errors.time}
              />
              {errors.time && <span className="text-red-400 text-xs">{errors.time}</span>}
              {/* Inline business hours hint */}
              <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
                Mon–Fri: 7:00 AM – 10:30 PM &nbsp;·&nbsp; Sat–Sun: 8:00 AM – 11:00 PM
              </p>
            </div>

            {/* Notes */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className={labelBase}>Notes</label>
              <textarea rows={3}
                className={`${inputBase} border-zinc-800 resize-none`}
                placeholder="Special requests, allergies, preferences…"
                value={form.specialRequests} onChange={(e) => set("specialRequests", e.target.value)} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-7 pb-6 pt-2 border-t border-zinc-800">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400 text-sm font-bold transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !!tableWarning}
              className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black transition-colors">
              {saving ? "Saving…" : "✔ Create Reservation"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WalkInReservation() {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal]       = useState(false);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey]           = useState("createdAt");
  const [toast, setToast]               = useState(null);
  const [loading, setLoading]           = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reservations/walkin");
      setReservations(res.data);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const occupiedTables = reservations
    .filter((r) => r.status === "Seated" || r.status === "Waiting")
    .map((r) => r.tableNumber)
    .filter(Boolean);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (record) => {
    setReservations((prev) => [record, ...prev]);
    showToast(`Reservation created for ${record.customerName}`);
  };

  const updateStatus = async (id, status) => {
    const record = reservations.find((r) => r._id === id);
    if (record?.status === "Completed") return;
    try {
      await API.patch(`/reservations/${id}/status`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    const record = reservations.find((r) => r._id === id);
    if (record?.status === "Completed") { showToast("Completed records cannot be deleted.", "error"); return; }
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await API.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      showToast("Record deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete record.", "error");
    }
  };

  const filtered = reservations
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (r.customerName || "").toLowerCase().includes(q) ||
        (r._id          || "").toLowerCase().includes(q) ||
        (r.tableNumber  || "").toLowerCase().includes(q);
      return matchSearch && (filterStatus === "all" || r.status === filterStatus);
    })
    .sort((a, b) => {
      if (sortKey === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortKey === "name")      return (a.customerName || "").localeCompare(b.customerName || "");
      if (sortKey === "guests")    return (b.guests || 0) - (a.guests || 0);
      return 0;
    });

  const stats = [
    { label: "Total",     value: reservations.length,                                         color: "text-[#f5c27a]" },
    { label: "Seated",    value: reservations.filter((r) => r.status === "Seated").length,    color: "text-green-400" },
    { label: "Waiting",   value: reservations.filter((r) => r.status === "Waiting").length,   color: "text-amber-400" },
    { label: "Completed", value: reservations.filter((r) => r.status === "Completed").length, color: "text-slate-400" },
  ];

  const selectBase = "bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#f5c27a] transition-colors cursor-pointer";

  return (
    <div className="min-h-screen text-zinc-100 font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 border rounded-xl px-5 py-3 text-sm font-bold shadow-xl ${
          toast.type === "error" ? "bg-red-900 border-red-600 text-red-300" : "bg-green-900 border-green-600 text-green-300"
        }`}>
          {toast.type === "error" ? "⚠️" : "✔"} {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#111111] border border-zinc-800 rounded-xl px-5 py-4">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          className="flex-1 bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#f5c27a] transition-colors"
          placeholder="🔍  Search by name, ID or table…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select className={selectBase} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k} className="bg-[#111111]">{v.label}</option>
          ))}
        </select>
        <select className={selectBase} value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="createdAt">Newest First</option>
          <option value="name">Name A–Z</option>
          <option value="guests">Guest Count</option>
        </select>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#f5c27a] hover:bg-[#e0a84a] transition-colors text-black font-black px-6 py-2.5 rounded-xl text-sm">
          + Walk-in
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#f5c27a] border-t-transparent animate-spin" />
            <p className="text-sm text-zinc-500 font-bold">Loading reservations…</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Guest","Phone","Guests","Table","Date","Time","Status","Notes",""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-zinc-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-zinc-600 text-sm">No walk-in reservations found</td></tr>
              ) : filtered.map((r) => {
                const isCompleted = r.status === "Completed";
                return (
                  <tr key={r._id} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
                    style={{ opacity: isCompleted ? 0.7 : 1 }}>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-white">{r.customerName}</div>
                      <div className="text-xs text-[#f5c27a] font-mono mt-0.5">walk-in</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-xs font-mono">{r.phone || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-0.5 text-xs font-mono text-zinc-300">👥 {r.guests}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.tableNumber && r.tableNumber !== "TBD"
                        ? <span className="bg-sky-950 text-sky-400 border border-sky-800 rounded-md px-2.5 py-0.5 text-xs font-mono">{r.tableNumber}</span>
                        : <span className="text-zinc-600">TBD</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-xs font-mono">
                      {r.date ? new Date(r.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-mono">
  {(() => {
    const timeStr = r.time || formatTime(r.createdAt);
    const [h, m] = timeStr.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    return (
      <span className="flex items-center gap-1.5">
        <span className="text-zinc-400">{timeStr}</span>
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-widest
          ${period === "AM"
            ? "bg-sky-900/60 text-sky-400 border border-sky-800"
            : "bg-orange-900/60 text-orange-400 border border-orange-800"}`}>
          {period}
        </span>
      </span>
    );
  })()}
</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isCompleted ? (
                        <span className={`${STATUS["Completed"].classes} rounded-lg px-2.5 py-1 text-xs font-bold inline-flex items-center gap-1`}>✓ Completed</span>
                      ) : (
                        <select
                          className={`${STATUS[r.status]?.classes} rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer bg-transparent`}
                          value={r.status || "Waiting"} onChange={(e) => updateStatus(r._id, e.target.value)}>
                          {Object.entries(STATUS).map(([k, v]) => (
                            <option key={k} value={k} className="bg-[#111111] text-white">{v.label}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-zinc-500 text-xs truncate block">{r.specialRequests || "—"}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isCompleted ? (
                        <div title="Completed records cannot be deleted"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 cursor-not-allowed opacity-30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </div>
                      ) : (
                        <button onClick={() => handleDelete(r._id)} title="Delete record"
                          className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-red-950/60 hover:border-red-700/70 active:scale-90 transition-all duration-150">
                          <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 ring-1 ring-red-500/30 group-hover:animate-ping transition-opacity duration-150 pointer-events-none" />
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="text-zinc-500 group-hover:text-red-400 transition-colors duration-150">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} onSave={handleSave} occupiedTables={occupiedTables} />
    </div>
  );
}