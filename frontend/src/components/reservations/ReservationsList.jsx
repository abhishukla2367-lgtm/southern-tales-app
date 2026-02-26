import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import EmptyState from "../admin/EmptyState";
import ErrorState from "../admin/ErrorState";
import WalkInModal from "./WalkInModal";
import { STATUS_STYLES, STATUS_OPTIONS, TABLES } from "./Constants";

// ─── Helpers ───────────────────────────────────────────────────────────────────

// Parses "2026-03-09T00:00:00.000Z" or "2026-03-09" → "09 Mar 2026"
const formatDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// Returns stored time string, or derives HH:MM from an ISO date string
const formatTime = (timeField, dateField) => {
  if (timeField) return timeField;
  if (dateField) {
    const d = new Date(dateField);
    if (!isNaN(d)) return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }
  return "—";
};

export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType]     = useState("all");
  const [toast, setToast]               = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resRes, walkinRes] = await Promise.all([
        API.get("/reservations/admin/all"),
        API.get("/reservations/walkin"),
      ]);
      const regular = (resRes.data.data || []).filter((r) => r.type !== "walk-in");
      const walkins = walkinRes.data || [];
      const merged = [...regular, ...walkins].sort(
        (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );
      setReservations(merged);
    } catch (err) {
      console.error("Failed to fetch:", err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const occupiedTableIds = reservations
    .filter((r) => r.status === "Seated" || r.status === "Waiting")
    .map((r) => r.tableNumber)
    .filter(Boolean);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/reservations/${id}/status`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch {
      alert("Failed to update status.");
    }
  };

  const updateTable = async (id, tableNumber) => {
    try {
      await API.patch(`/reservations/${id}/table`, { tableNumber });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, tableNumber } : r)));
    } catch {
      alert("Failed to update table.");
    }
  };

  const handleDelete = async (id) => {
    const record = reservations.find((r) => r._id === id);
    if (record?.status === "Completed") { showToast("Completed records cannot be deleted.", "error"); return; }
    if (!window.confirm("Delete this record?")) return;
    try {
      await API.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      showToast("Record deleted.");
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  const handleWalkinSave = (record) => {
    setReservations((prev) => [record, ...prev]);
    showToast(`Walk-in created for ${record.customerName}`);
  };

  const filtered = reservations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (r.customerName  || "").toLowerCase().includes(q) ||
      (r.customerEmail || "").toLowerCase().includes(q) ||
      (r.phone         || "").toLowerCase().includes(q) ||
      (r._id           || "").toLowerCase().includes(q) ||
      (r.tableNumber   || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchType   = filterType   === "all" || (filterType === "walk-in" ? r.type === "walk-in" : r.type !== "walk-in");
    return matchSearch && matchStatus && matchType;
  });

  const selectBase = "bg-[#111111] border border-[#1f1f1f] hover:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#f5c27a] transition-colors cursor-pointer";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#f5c27a] border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-[#aaa]">Loading reservations…</p>
      </div>
    );

  if (error) return <ErrorState />;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 border rounded-xl px-5 py-3 text-sm font-bold shadow-xl
          ${toast.type === "error" ? "bg-red-900 border-red-600 text-red-300" : "bg-green-900 border-green-600 text-green-300"}`}>
          {toast.type === "error" ? "⚠️" : "✔"} {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          className="flex-1 bg-[#111111] border border-[#1f1f1f] hover:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#f5c27a] transition-colors"
          placeholder="🔍  Search by name, email, phone or table…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select className={selectBase} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="reserved">🌐 Online</option>
          <option value="walk-in">🚶 Walk-in</option>
        </select>
        <select className={selectBase} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#111111]">{s}</option>)}
        </select>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#f5c27a] hover:bg-[#e0a84a] transition-colors text-black font-black px-6 py-2.5 rounded-xl text-sm whitespace-nowrap">
          + Walk-in
        </button>
      </div>

      {/* Table */}
      {!filtered.length ? (
        <EmptyState />
      ) : (
        <div className="rounded-2xl overflow-hidden bg-[#111111] border border-[#1f1f1f]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] font-black bg-[#161616] text-[#aaa] border-b border-[#1f1f1f]">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Guests</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Table</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((res) => {
                  const styles      = STATUS_STYLES[res.status] || { badge: "bg-zinc-800 text-zinc-400 border border-zinc-600", select: "bg-zinc-800 text-zinc-400 border border-zinc-600" };
                  const isCompleted = res.status === "Completed";
                  const isWalkin    = res.type === "walk-in";

                  // ── Clean date & time ──────────────────────────────────────
                  const displayDate = formatDate(res.date);
                  const displayTime = formatTime(res.time, res.date);
                  const [h]         = (displayTime || "0:0").split(":").map(Number);
                  const period      = h < 12 ? "AM" : "PM";

                  // ── Table occupied state ───────────────────────────────────
                  const isOccupied = res.tableNumber && occupiedTableIds.includes(res.tableNumber) && !isCompleted;

                  return (
                    <tr key={res._id} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors"
                      style={{ opacity: isCompleted ? 0.6 : 1 }}>

                      {/* ── Customer ── */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#f1f1f1]">{res.customerName}</p>
                      </td>

                      {/* ── Contact ── */}
                      <td className="px-6 py-4">
                        {res.customerEmail
                          ? <p className="text-xs text-[#aaa]">{res.customerEmail}</p>
                          : res.phone
                            ? <p className="text-xs text-[#aaa] font-mono">{res.phone}</p>
                            : <p className="text-xs italic text-[#444]">No contact</p>}
                      </td>

                      {/* ── Guests ── */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-white bg-zinc-800/50 px-2.5 py-1 rounded-lg border border-zinc-700/50">
                          {res.guests}
                        </span>
                      </td>

                      {/* ── Date & Time ── */}
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-[#f1f1f1]">{displayDate}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono font-black text-[#f5c27a]">{displayTime}</span>
                          <span className={`text-[8px] px-1 rounded-sm font-black ${period === "AM" ? "bg-sky-900/40 text-sky-400" : "bg-orange-900/40 text-orange-400"}`}>
                            {period}
                          </span>
                        </div>
                      </td>

                      {/* ── Table ── */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <select
                            disabled={isCompleted}
                            className={`text-xs font-bold rounded-lg px-2 py-1.5 bg-transparent border border-zinc-800 outline-none transition-colors text-zinc-300
                              ${isCompleted ? "opacity-50 cursor-not-allowed" : "focus:border-zinc-500"}`}
                            value={res.tableNumber || ""}
                            onChange={(e) => updateTable(res._id, e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {TABLES.map((t) => (
                              <option key={t.id} value={t.id} className="bg-[#111111] text-white">
                                {t.id} ({t.capacity}p)
                              </option>
                            ))}
                          </select>
                          {res.tableNumber && (
                            <span className={`w-2.5 h-2.5 rounded-full inline-block ${isOccupied ? "bg-red-500" : "bg-green-500"}`} />
                          )}
                        </div>
                      </td>

                      {/* ── Status ── */}
                      <td className="px-6 py-4">
                        <select
                          disabled={isCompleted}
                          className={`text-[10px] font-black uppercase tracking-wider rounded-lg px-2 py-1.5 outline-none transition-all
                            ${isCompleted ? "opacity-50 cursor-not-allowed" : ""}
                            ${styles.select}`}
                          value={res.status}
                          onChange={(e) => updateStatus(res._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#111111]">
                              {opt.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* ── Type ── */}
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border
                          ${isWalkin
                            ? "bg-orange-900/30 text-orange-400 border-orange-700/50"
                            : "bg-sky-900/30 text-sky-400 border-sky-700/50"}`}>
                          {isWalkin ? "Walk-in" : "Online"}
                        </span>
                      </td>

                      {/* ── Delete ── */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(res._id)}
                          disabled={isCompleted}
                          className={`p-2 rounded-lg transition-all
                            ${isCompleted ? "opacity-30 cursor-not-allowed text-zinc-600" : "text-zinc-600 hover:text-red-400 hover:bg-red-400/10"}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <WalkInModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleWalkinSave}
        occupiedTables={occupiedTableIds}
      />
    </div>
  );
}