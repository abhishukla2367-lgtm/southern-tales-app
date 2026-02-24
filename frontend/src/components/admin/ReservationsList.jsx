import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

const STATUS_STYLES = {
  Cancelled:  { badge: "bg-red-900/40 text-red-400 border border-red-700",           select: "bg-red-900/40 text-red-400 border border-red-700" },
  Completed:  { badge: "bg-blue-900/40 text-blue-400 border border-blue-700",         select: "bg-blue-900/40 text-blue-400 border border-blue-700" },
  Waiting:    { badge: "bg-amber-900/40 text-amber-400 border border-amber-700",      select: "bg-amber-900/40 text-amber-400 border border-amber-700" },
  Seated:     { badge: "bg-violet-900/40 text-violet-400 border border-violet-700",   select: "bg-violet-900/40 text-violet-400 border border-violet-700" },
};

// Confirmed removed — Completed is locked once set
const STATUS_OPTIONS = ["Waiting", "Seated", "Completed", "Cancelled"];

// ─── Table Config (same as WalkInReservation) ──────────────────────────────────
const TABLE_TYPES = {
  Window:   { label: "Window",   emoji: "🪟", color: "text-sky-400 bg-sky-900/40 border-sky-800" },
  Corner:   { label: "Corner",   emoji: "📐", color: "text-violet-400 bg-violet-900/40 border-violet-800" },
  Outdoor:  { label: "Outdoor",  emoji: "🌿", color: "text-green-400 bg-green-900/40 border-green-800" },
  Booth:    { label: "Booth",    emoji: "🛋️", color: "text-amber-400 bg-amber-900/40 border-amber-800" },
  Bar:      { label: "Bar",      emoji: "🍸", color: "text-pink-400 bg-pink-900/40 border-pink-800" },
  Standard: { label: "Standard", emoji: "🪑", color: "text-zinc-400 bg-zinc-800 border-zinc-700" },
};

const TABLES = [
  { id: "T-01", capacity: 2, type: "Window"   },
  { id: "T-02", capacity: 2, type: "Window"   },
  { id: "T-03", capacity: 4, type: "Window"   },
  { id: "T-04", capacity: 4, type: "Corner"   },
  { id: "T-05", capacity: 4, type: "Corner"   },
  { id: "T-06", capacity: 6, type: "Outdoor"  },
  { id: "T-07", capacity: 6, type: "Outdoor"  },
  { id: "T-08", capacity: 4, type: "Booth"    },
  { id: "T-09", capacity: 4, type: "Booth"    },
  { id: "T-10", capacity: 2, type: "Bar"      },
  { id: "T-11", capacity: 2, type: "Bar"      },
  { id: "T-12", capacity: 4, type: "Standard" },
  { id: "T-13", capacity: 4, type: "Standard" },
  { id: "T-14", capacity: 4, type: "Standard" },
  { id: "T-15", capacity: 6, type: "Standard" },
  { id: "T-16", capacity: 6, type: "Standard" },
  { id: "T-17", capacity: 8, type: "Standard" },
  { id: "T-18", capacity: 8, type: "Corner"   },
  { id: "T-19", capacity: 2, type: "Window"   },
  { id: "T-20", capacity: 6, type: "Outdoor"  },
];

export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await API.get("/reservations/admin/all");
        setReservations(data.data.filter((r) => r.type !== "walk-in"));
      } catch (err) {
        console.error("Failed to fetch reservations:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Which table IDs are currently occupied
  const occupiedTableIds = reservations
    .filter((r) => r.status === "Seated" || r.status === "Waiting")
    .map((r) => r.tableNumber)
    .filter(Boolean);

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

  const updateTable = async (id, tableNumber) => {
    try {
      await API.patch(`/reservations/${id}/table`, { tableNumber });
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, tableNumber } : r))
      );
    } catch (err) {
      console.error("Table update failed:", err.message);
      alert("Failed to update table.");
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
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const styles      = STATUS_STYLES[res.status] || { badge: "bg-zinc-800 text-zinc-400 border border-zinc-600", select: "bg-zinc-800 text-zinc-400 border border-zinc-600" };
              const isCompleted = res.status === "Completed";

              // ── Time + AM/PM ──
              const timeStr  = res.time || "";
              const [h]      = timeStr.split(":").map(Number);
              const period   = h < 12 ? "AM" : "PM";

              // ── Table info ──
              const tableInfo = TABLES.find((t) => t.id === res.tableNumber);
              const typeInfo  = tableInfo ? TABLE_TYPES[tableInfo.type] : null;

              return (
                <tr
                  key={res._id}
                  className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors"
                  style={{ opacity: isCompleted ? 0.75 : 1 }}
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

                  {/* Date & Time — with AM/PM badge */}
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-[#aaa]">
                      {new Date(res.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                    {timeStr ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#555] font-mono">{timeStr}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-widest border
                          ${period === "AM"
                            ? "bg-sky-900/60 text-sky-400 border-sky-800"
                            : "bg-orange-900/60 text-orange-400 border-orange-800"}`}>
                          {period}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs mt-0.5 text-[#444] italic">No time set</p>
                    )}
                  </td>

                  {/* Table — dropdown + type tag */}
                  <td className="px-6 py-4">
                    {isCompleted ? (
                      /* Completed — show static display only */
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-[#f5c27a]">
                          {res.tableNumber || "TBD"}
                        </span>
                        {typeInfo && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block w-fit ${typeInfo.color}`}>
                            {typeInfo.emoji} {typeInfo.label}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <select
                          className="bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-600 focus:border-[#f5c27a] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none cursor-pointer transition-colors"
                          value={res.tableNumber || ""}
                          onChange={(e) => updateTable(res._id, e.target.value)}
                        >
                          <option value="">TBD</option>
                          {TABLES.map((t) => {
                            const isOccupied = occupiedTableIds.includes(t.id) && t.id !== res.tableNumber;
                            const ti         = TABLE_TYPES[t.type];
                            return (
                              <option key={t.id} value={t.id} className="bg-[#111111]">
                                {t.id}  {isOccupied ? "🔴" : "🟢"}
                              </option>
                            );
                          })}
                        </select>

                        {/* Type tag shown below dropdown once a table is selected */}
                        {typeInfo && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block w-fit ${typeInfo.color}`}>
                            {typeInfo.emoji} {typeInfo.label} · {tableInfo.capacity} seats
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Status — locked as static badge when Completed */}
                  <td className="px-6 py-4">
                    {isCompleted ? (
                      <span className={`${styles.badge} px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5`}>
                        ✓ Completed
                      </span>
                    ) : (
                      <select
                        className={`${styles.select} rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer bg-transparent`}
                        value={res.status || "Waiting"}
                        onChange={(e) => updateStatus(res._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#111111] text-white">{s}</option>
                        ))}
                      </select>
                    )}
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