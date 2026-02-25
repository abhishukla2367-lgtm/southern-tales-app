import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";

export default function BillModal({ orderId, onClose, onPaid }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    API.get(`/bill/${orderId}`)
      .then(({ data }) => setBill(data))
      .catch(() => alert("Failed to load bill"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleMarkPaid = async () => {
    setPaying(true);
    try {
      await API.patch(`/bill/${orderId}/pay`);
      setBill((prev) => ({ ...prev, paymentStatus: "Paid" }));
      onPaid?.(orderId);
    } catch (err) {
      console.error("Pay error:", err);
      alert("Failed to mark as paid");
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-sm font-black text-[#f1f1f1] uppercase tracking-widest">
            Generate Bill
          </h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-2 border-[#f5c27a] border-t-transparent animate-spin" />
            </div>
          ) : bill ? (
            <>
              {/* Customer Info */}
              <div className="mb-4">
                <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Customer</p>
                <p className="text-sm font-bold text-[#f1f1f1]">{bill.customer.name}</p>
                <p className="text-xs text-[#555]">{bill.customer.email}</p>
                <p className="text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    bill.orderType === "walkin"
                      ? "bg-[#f5c27a]/10 text-[#f5c27a]"
                      : "bg-blue-400/10 text-blue-400"
                  }`}>
                    {bill.orderType === "walkin" ? "Walk-in" : "Delivery"}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div className="border border-[#1f1f1f] rounded-xl overflow-hidden mb-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#161616] text-[#555] text-[10px] uppercase tracking-widest">
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.items.map((item, i) => (
                      <tr key={i} className="border-t border-[#1a1a1a] text-sm">
                        <td className="px-4 py-2 text-[#f1f1f1]">{item.name}</td>
                        <td className="px-4 py-2 text-center text-[#aaa]">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-[#aaa]">₹{item.price}</td>
                        <td className="px-4 py-2 text-right font-bold text-[#f1f1f1]">₹{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-sm mb-5">
                <div className="flex justify-between text-[#aaa]">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#aaa]">
                  <span>GST (5%)</span>
                  <span>₹{bill.tax}</span>
                </div>
                <div className="flex justify-between font-black text-base text-emerald-400 border-t border-[#1f1f1f] pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{bill.total}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-[#555]">Payment Status</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  bill.paymentStatus === "Paid"
                    ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30"
                    : "bg-red-400/10 text-red-400 border border-red-400/30"
                }`}>
                  {bill.paymentStatus}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl border border-[#2a2a2a] text-[#aaa] text-sm font-bold hover:border-[#f5c27a]/30 hover:text-[#f5c27a] transition-all"
                >
                  Print
                </button>
                {bill.paymentStatus !== "Paid" && (
                  <button
                    onClick={handleMarkPaid}
                    disabled={paying}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-sm font-bold hover:bg-emerald-400/20 disabled:opacity-50 transition-all"
                  >
                    {paying ? "Processing..." : "Mark as Paid"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-[#555] py-10">Bill not found</p>
          )}
        </div>
      </div>
    </div>
  );
}