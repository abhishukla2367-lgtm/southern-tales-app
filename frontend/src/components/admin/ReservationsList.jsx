import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

const statusStyles = {
  Confirmed: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  Completed: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
};

export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#f5c27a", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-bold" style={{ color: "#aaa" }}>
          Loading reservations...
        </p>
      </div>
    );
  if (error) return <ErrorState />;
  if (!reservations.length) return <EmptyState />;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#111111", border: "1px solid #1f1f1f" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr
              className="text-[10px] uppercase tracking-[0.2em] font-black"
              style={{
                background: "#161616",
                color: "#aaa",
                borderBottom: "1px solid #1f1f1f",
              }}
            >
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
              const style = statusStyles[res.status] || { color: "#aaa", bg: "#1a1a1a" };
              return (
                <tr
                  key={res._id}
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#161616")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold" style={{ color: "#f1f1f1" }}>
                      {res.customerName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs" style={{ color: "#aaa" }}>
                      {res.customerEmail}
                    </p>
                    {res.phone && (
                      <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                        {res.phone}
                      </p>
                    )}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-bold"
                    style={{ color: "#aaa" }}
                  >
                    {res.guests}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold" style={{ color: "#aaa" }}>
                      {new Date(res.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                      {res.time}
                    </p>
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-bold"
                    style={{ color: "#f5c27a" }}
                  >
                    {res.tableNumber || "TBD"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {res.status}
                    </span>
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