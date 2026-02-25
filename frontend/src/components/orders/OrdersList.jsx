import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import EmptyState from "../admin/EmptyState";
import ErrorState from "../admin/ErrorState";
import BillModal from "../admin/BillModal";

const STATUS_STYLES = {
  Pending:    "bg-[#f5c27a]/10 text-[#f5c27a] border border-[#f5c27a]/30",
  Processing: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
  Preparing:  "bg-blue-400/10 text-blue-400 border border-blue-400/30",
  Shipped:    "bg-violet-400/10 text-violet-400 border border-violet-400/30",
  Delivered:  "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30",
  Completed:  "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30",
  Cancelled:  "bg-red-400/10 text-red-400 border border-red-400/30",
};

const STATUS_OPTIONS = ["Pending", "Processing", "Preparing", "Shipped", "Delivered", "Completed", "Cancelled"];

export default function OrdersList() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // for bill modal

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

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Status update failed:", err.message);
      alert("Failed to update order status.");
    }
  };

  // Called when bill is marked as paid — update paymentStatus in list
  const handlePaid = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: "Paid" } : o))
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#f5c27a] border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-[#aaa]">Loading orders...</p>
      </div>
    );

  if (error) return <ErrorState />;
  if (!orders.length) return <EmptyState />;

  return (
    <>
      <div className="rounded-2xl overflow-hidden bg-[#111111] border border-[#1f1f1f]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] font-black bg-[#161616] text-[#aaa] border-b border-[#1f1f1f]">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Bill</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusClass = STATUS_STYLES[order.status] || "bg-zinc-800 text-zinc-400 border border-zinc-600";
                return (
                  <tr
                    key={order._id}
                    className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-6 py-4 text-xs font-black text-[#f5c27a]">
                      #{order._id?.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#f1f1f1]">
                        {order.userId?.name || order.guestName || "Walk-in Guest"}
                      </p>
                      <p className="text-xs mt-0.5 text-[#555]">
                        {order.userId?.email || "—"}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4 text-sm text-[#aaa]">
                      {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-black text-sm text-emerald-400">
                      ₹{order.totalAmount}
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      }`}>
                        {order.paymentStatus || "Unpaid"}
                      </span>
                    </td>

                    {/* Status dropdown */}
                    <td className="px-6 py-4">
                      <select
                        className={`${statusClass} rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer bg-transparent`}
                        value={order.status || "Pending"}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#111111] text-white">{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-[#555]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>

                    {/* Generate Bill */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrderId(order._id)}
                        className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#f5c27a]/30 text-[#f5c27a] hover:bg-[#f5c27a]/10 transition-all"
                      >
                        Bill
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Modal */}
      {selectedOrderId && (
        <BillModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onPaid={handlePaid}
        />
      )}
    </>
  );
}