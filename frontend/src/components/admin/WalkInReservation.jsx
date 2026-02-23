import { useState, useEffect, useRef } from "react";
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
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const BLANK_FORM = {
  customerName: "", phone: "", guests: "", tableNumber: "",
  date: "", time: "", status: "Waiting", specialRequests: "",
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, onSave, occupiedTables = [] }) {
  const [form, setForm]                 = useState(BLANK_FORM);
  const [errors, setErrors]             = useState({});
  const [saving, setSaving]             = useState(false);
  const [tableWarning, setTableWarning] = useState("");
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
      setTimeout(() => firstRef.current?.focus(), 80);
    }
  }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Task c: Check if selected table is occupied ──
  const handleTableChange = (value) => {
    set("tableNumber", value);
    if (value && occupiedTables.includes(value)) {
      setTableWarning("This table is occupied, please choose another table number.");
    } else {
      setTableWarning("");
    }
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
    setSaving(true);
    try {
      const payload = {
        customerName:    form.customerName,
        phone:           form.phone,
        guests:          form.guests,
        tableNumber:     form.tableNumber,
        date:            form.date,
        time:            form.time,
        status:          form.status,
        specialRequests: form.specialRequests,
        type:            "walk-in",
      };
      const res = await API.post("/reservations/walkin", payload);
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

  const inputBase =
    "bg-[#1a1a1a] border rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#f5c27a] transition-colors placeholder-zinc-600 w-full";
  const labelBase = "text-xs font-bold uppercase tracking-widest text-[#f5c27a]";

  return (
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
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl leading-none mt-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 grid grid-cols-2 gap-4">
          {/* Guest Name */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className={labelBase}>Guest Name <span className="text-red-400">*</span></label>
            <input
              ref={firstRef}
              className={`${inputBase} ${errors.customerName ? "border-red-500" : "border-zinc-800"}`}
              placeholder="Full name"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
            />
            {errors.customerName && <span className="text-red-400 text-xs">{errors.customerName}</span>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Phone</label>
            <input
              className={`${inputBase} border-zinc-800`}
              placeholder="9876543210 (optional)"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Guests <span className="text-red-400">*</span></label>
            <select
              className={`${inputBase} ${errors.guests ? "border-red-500" : "border-zinc-800"}`}
              value={form.guests}
              onChange={(e) => set("guests", e.target.value)}
            >
              <option value="">Select people</option>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n} className="bg-[#111111]">
                  {n} {n === 1 ? "Person" : "People"}
                </option>
              ))}
            </select>
            {errors.guests && <span className="text-red-400 text-xs">{errors.guests}</span>}
          </div>

          {/* Table — Task c: shows occupied warning */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className={labelBase}>Table</label>
            <select
              className={`${inputBase} ${tableWarning ? "border-red-500" : "border-zinc-800"}`}
              value={form.tableNumber}
              onChange={(e) => handleTableChange(e.target.value)}
            >
              <option value="">— Assign later —</option>
              {TABLES.map((t) => {
                const isOccupied = occupiedTables.includes(t);
                return (
                  <option key={t} value={t} className="bg-[#111111]">
                    {t}{isOccupied ? " — 🔴 Occupied" : " — 🟢 Available"}
                  </option>
                );
              })}
            </select>

            {/* ── Task c: Occupied warning banner with exact required message ── */}
            {tableWarning && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5 mt-1">
                <span className="text-red-400 text-base leading-none">⚠️</span>
                <p className="text-red-400 text-xs font-bold">{tableWarning}</p>
              </div>
            )}
            {errors.tableNumber && !tableWarning && (
              <span className="text-red-400 text-xs">{errors.tableNumber}</span>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Status</label>
            <select
              className={`${inputBase} border-zinc-800`}
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {Object.entries(STATUS).map(([k, v]) => (
                <option key={k} value={k} className="bg-[#111111]">{v.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Date <span className="text-red-400">*</span></label>
            <input
              type="date"
              className={`${inputBase} [color-scheme:dark] ${errors.date ? "border-red-500" : "border-zinc-800"}`}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
            {errors.date && <span className="text-red-400 text-xs">{errors.date}</span>}
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Time <span className="text-red-400">*</span></label>
            <input
              type="time"
              className={`${inputBase} [color-scheme:dark] ${errors.time ? "border-red-500" : "border-zinc-800"}`}
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
            />
            {errors.time && <span className="text-red-400 text-xs">{errors.time}</span>}
          </div>

          {/* Notes */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className={labelBase}>Notes</label>
            <textarea
              rows={3}
              className={`${inputBase} border-zinc-800 resize-none`}
              placeholder="Special requests, allergies, preferences…"
              value={form.specialRequests}
              onChange={(e) => set("specialRequests", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-7 pb-6 pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400 text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!tableWarning}
            className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black transition-colors"
          >
            {saving ? "Saving…" : "✔ Create Reservation"}
          </button>
        </div>
      </div>
    </div>
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

  // ── Task c: derive currently occupied tables from active walk-ins ──
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

  // ── Task b: Status update — blocked server-side & via UI for Completed ──
  const updateStatus = async (id, status) => {
    const record = reservations.find((r) => r._id === id);
    if (record?.status === "Completed") return; // guard
    try {
      await API.patch(`/reservations/${id}/status`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    }
  };

  // ── Task b: Delete — only allowed for non-Completed records ──
  const handleDelete = async (id) => {
    const record = reservations.find((r) => r._id === id);

    // Block delete if record is Completed
    if (record?.status === "Completed") {
      showToast("Completed records cannot be deleted.", "error");
      return;
    }

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
      const matchSearch =
        !q ||
        (r.customerName || "").toLowerCase().includes(q) ||
        (r._id          || "").toLowerCase().includes(q) ||
        (r.tableNumber  || "").toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortKey === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortKey === "name")      return (a.customerName || "").localeCompare(b.customerName || "");
      if (sortKey === "guests")    return (b.guests || 0) - (a.guests || 0);
      return 0;
    });

  const stats = [
    { label: "Total",     value: reservations.length,                                          color: "text-[#f5c27a]" },
    { label: "Seated",    value: reservations.filter((r) => r.status === "Seated").length,     color: "text-green-400" },
    { label: "Waiting",   value: reservations.filter((r) => r.status === "Waiting").length,    color: "text-amber-400" },
    { label: "Completed", value: reservations.filter((r) => r.status === "Completed").length,  color: "text-slate-400" },
  ];

  const selectBase =
    "bg-[#111111] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#f5c27a] transition-colors cursor-pointer";

  return (
    <div className="min-h-screen text-zinc-100 font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 border rounded-xl px-5 py-3 text-sm font-bold shadow-xl transition-all ${
          toast.type === "error"
            ? "bg-red-900 border-red-600 text-red-300"
            : "bg-green-900 border-green-600 text-green-300"
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={selectBase}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k} className="bg-[#111111]">{v.label}</option>
          ))}
        </select>
        <select
          className={selectBase}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="createdAt">Newest First</option>
          <option value="name">Name A–Z</option>
          <option value="guests">Guest Count</option>
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#f5c27a] hover:bg-[#e0a84a] transition-colors text-black font-black px-6 py-2.5 rounded-xl text-sm"
        >
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
                {["Guest", "Phone", "Guests", "Table", "Date", "Time", "Status", "Notes", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest text-zinc-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-zinc-600 text-sm">
                    No walk-in reservations found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  // ── Task b: lock row interactions if Completed ──
                  const isCompleted = r.status === "Completed";

                  return (
                    <tr
                      key={r._id}
                      className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
                      style={{ opacity: isCompleted ? 0.7 : 1 }}
                    >
                      {/* Guest */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-white">{r.customerName}</div>
                        <div className="text-xs text-[#f5c27a] font-mono mt-0.5">walk-in</div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-xs font-mono">
                        {r.phone || "—"}
                      </td>

                      {/* Guests */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-0.5 text-xs font-mono text-zinc-300">
                          👥 {r.guests}
                        </span>
                      </td>

                      {/* Table */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.tableNumber && r.tableNumber !== "TBD" ? (
                          <span className="bg-sky-950 text-sky-400 border border-sky-800 rounded-md px-2.5 py-0.5 text-xs font-mono">
                            {r.tableNumber}
                          </span>
                        ) : (
                          <span className="text-zinc-600">TBD</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-xs font-mono">
                        {r.date
                          ? new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : formatDate(r.createdAt)}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-400 text-xs font-mono">
                        {r.time || formatTime(r.createdAt)}
                      </td>

                      {/* Status
                          ── Task b: static badge for Completed, dropdown for others ── */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isCompleted ? (
                          <span className={`${STATUS["Completed"].classes} rounded-lg px-2.5 py-1 text-xs font-bold inline-flex items-center gap-1`}>
                            ✓ Completed
                          </span>
                        ) : (
                          <select
                            className={`${STATUS[r.status]?.classes} rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer bg-transparent`}
                            value={r.status || "Waiting"}
                            onChange={(e) => updateStatus(r._id, e.target.value)}
                          >
                            {Object.entries(STATUS).map(([k, v]) => (
                              <option key={k} value={k} className="bg-[#111111] text-white">{v.label}</option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3 max-w-xs">
                        <span className="text-zinc-500 text-xs truncate block">{r.specialRequests || "—"}</span>
                      </td>

                      {/* Delete
                          ── Task b: disabled (greyed out, no-drop cursor) for Completed
                                     functional (red hover) for all other statuses      ── */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isCompleted ? (
                          // Locked — Completed records cannot be deleted
                          <button
                            disabled
                            title="Completed records cannot be deleted"
                            className="text-zinc-700 cursor-not-allowed text-base px-2 opacity-40"
                          >
                            🗑
                          </button>
                        ) : (
                          // Active — delete is allowed for non-Completed records
                          <button
                            onClick={() => handleDelete(r._id)}
                            title="Delete record"
                            className="text-zinc-500 hover:text-red-400 text-base px-2 transition-colors"
                          >
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — passes occupiedTables for Task c */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        occupiedTables={occupiedTables}
      />
    </div>
  );
}