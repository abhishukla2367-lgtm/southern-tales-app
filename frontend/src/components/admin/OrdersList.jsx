import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

const statusStyles = {
  Pending:    { color: "#f5c27a", bg: "rgba(245,194,122,0.1)" },
  Processing: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  Preparing:  { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  Shipped:    { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  Delivered:  { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Completed:  { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Cancelled:  { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/admin/all");
        setOrders(data.orders || data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#f5c27a", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-bold" style={{ color: "#aaa" }}>
          Loading orders...
        </p>
      </div>
    );
  if (error) return <ErrorState />;
  if (!orders.length) return <EmptyState />;

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
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const style = statusStyles[order.status] || { color: "#aaa", bg: "#1a1a1a" };
              return (
                <tr
                  key={order._id}
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#161616")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    className="px-6 py-4 text-xs font-black"
                    style={{ color: "#f5c27a" }}
                  >
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold" style={{ color: "#f1f1f1" }}>
                      {order.userId?.name || "Guest"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                      {order.userId?.email || "—"}
                    </p>
                  </td>
                  <td
                    className="px-6 py-4 text-sm"
                    style={{ color: "#aaa" }}
                  >
                    {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td
                    className="px-6 py-4 font-black text-sm"
                    style={{ color: "#34d399" }}
                  >
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-xs"
                    style={{ color: "#555" }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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