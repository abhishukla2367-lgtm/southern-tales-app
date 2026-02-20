import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

const STATUS_STYLES = {
  Confirmed: { badge: "bg-emerald-900/40 text-emerald-400 border border-emerald-700", select: "bg-emerald-900/40 text-emerald-400 border border-emerald-700" },
  Cancelled:  { badge: "bg-red-900/40 text-red-400 border border-red-700",           select: "bg-red-900/40 text-red-400 border border-red-700" },
  Completed:  { badge: "bg-blue-900/40 text-blue-400 border border-blue-700",         select: "bg-blue-900/40 text-blue-400 border border-blue-700" },
  Waiting:    { badge: "bg-amber-900/40 text-amber-400 border border-amber-700",      select: "bg-amber-900/40 text-amber-400 border border-amber-700" },
  Seated:     { badge: "bg-violet-900/40 text-violet-400 border border-violet-700",   select: "bg-violet-900/40 text-violet-400 border border-violet-700" },
};

const STATUS_OPTIONS = ["Confirmed", "Waiting", "Seated", "Completed", "Cancelled"];

export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await API.get("/reservations/admin/all");
        setReservations(data.data);
      } catch (err) {
        console.error("Failed to fetch reservations:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/reservations/${id}/status`, { status });
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Status update failed:", err.message);
      alert("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#f5c27a] border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-[#aaa]">Loading reservations...</p>
      </div>
    );

  if (error) return <ErrorState />;
  if (!reservations.length) return <EmptyState />;

  return (
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
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const styles  = STATUS_STYLES[res.status] || { badge: "bg-zinc-800 text-zinc-400 border border-zinc-600", select: "bg-zinc-800 text-zinc-400 border border-zinc-600" };
              const isWalkIn = res.type === "walk-in";

              return (
                <tr
                  key={res._id}
                  className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#f1f1f1]">{res.customerName}</p>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    {res.customerEmail ? (
                      <p className="text-xs text-[#aaa]">{res.customerEmail}</p>
                    ) : (
                      <p className="text-xs italic text-[#444]">No email</p>
                    )}
                    {res.phone && (
                      <p className="text-xs mt-0.5 text-[#555]">{res.phone}</p>
                    )}
                  </td>

                  {/* Guests */}
                  <td className="px-6 py-4 text-sm font-bold text-[#aaa]">
                    {res.guests}
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-[#aaa]">
                      {new Date(res.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                    <p className="text-xs mt-0.5 text-[#555]">{res.time}</p>
                  </td>

                  {/* Table */}
                  <td className="px-6 py-4 text-sm font-bold text-[#f5c27a]">
                    {res.tableNumber || "TBD"}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      isWalkIn
                        ? "bg-[#f5c27a]/10 text-[#f5c27a] border border-[#f5c27a]/30"
                        : "bg-blue-400/10 text-blue-400 border border-blue-400/30"
                    }`}>
                      {isWalkIn ? "Walk-in" : "Online"}
                    </span>
                  </td>

                  {/* Status — inline editable dropdown */}
                  <td className="px-6 py-4">
                    <select
                      className={`${styles.select} rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer bg-transparent`}
                      value={res.status || "Confirmed"}
                      onChange={(e) => updateStatus(res._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#111111] text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}