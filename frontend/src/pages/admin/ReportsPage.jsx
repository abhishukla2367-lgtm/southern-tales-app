import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";

const TABS = ["Weekly", "Monthly", "Annual"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data: res } = await API.get(`/reports/${activeTab.toLowerCase()}`);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch report:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [activeTab]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg border transition-all ${
              activeTab === tab
                ? "bg-yellow-400 text-black border-yellow-400"
                : "bg-[#111] text-gray-500 border-[#1f1f1f] hover:border-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
          <p className="text-xs font-black tracking-widest text-gray-600">
            LOADING {activeTab.toUpperCase()} REPORT...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl p-8 text-center bg-[#111] border border-[#1f1f1f]">
          <p className="text-sm font-bold text-red-500">
            Failed to load report. Make sure the backend is running.
          </p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data && (
        <div className="space-y-8">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl p-6 bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Total Revenue</p>
              <p className="text-3xl font-black text-emerald-400 mb-1">
                ₹{(data?.totalRevenue || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-600">from confirmed orders</p>
            </div>

            <div className="rounded-2xl p-6 bg-yellow-400/10 border border-yellow-400/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Total Orders</p>
              <p className="text-3xl font-black text-yellow-400 mb-1">
                {data?.totalOrders || 0}
              </p>
              <p className="text-xs text-gray-600">orders placed</p>
            </div>

            <div className="rounded-2xl p-6 bg-blue-400/10 border border-blue-400/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Reservations</p>
              <p className="text-3xl font-black text-blue-400 mb-1">
                {data?.totalReservations || 0}
              </p>
              <p className="text-xs text-gray-600">tables booked</p>
            </div>

            <div className="rounded-2xl p-6 bg-purple-400/10 border border-purple-400/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Avg Order Value</p>
              <p className="text-3xl font-black text-purple-400 mb-1">
                ₹{(data?.avgOrderValue || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-600">per order</p>
            </div>
          </div>

          {/* Top Selling Items */}
          {data.topItems && data.topItems.length > 0 && (
            <div className="rounded-2xl overflow-hidden bg-[#111] border border-[#1f1f1f]">
              <div className="px-6 py-4 border-b border-[#1f1f1f]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  Top Selling Items
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 bg-[#161616] border-b border-[#1f1f1f]">
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Item</th>
                      <th className="px-6 py-3">Qty Sold</th>
                      <th className="px-6 py-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                        <td className="px-6 py-4 text-xs font-black text-gray-700">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-100">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-yellow-400">{item.totalQty} pcs</td>
                        <td className="px-6 py-4 text-sm font-black text-right text-emerald-400">
                          ₹{item.totalRevenue.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Period Breakdown */}
          {data.breakdown && data.breakdown.length > 0 && (
            <div className="rounded-2xl overflow-hidden bg-[#111] border border-[#1f1f1f]">
              <div className="px-6 py-4 border-b border-[#1f1f1f]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  {activeTab === "Weekly"
                    ? "Daily Breakdown"
                    : activeTab === "Monthly"
                    ? "Weekly Breakdown"
                    : "Monthly Breakdown"}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 bg-[#161616] border-b border-[#1f1f1f]">
                      <th className="px-6 py-3">Period</th>
                      <th className="px-6 py-3">Orders</th>
                      <th className="px-6 py-3">Reservations</th>
                      <th className="px-6 py-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.breakdown.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-100">{row.period}</td>
                        <td className="px-6 py-4 text-sm text-yellow-400">{row.orders}</td>
                        <td className="px-6 py-4 text-sm text-blue-400">{row.reservations}</td>
                        <td className="px-6 py-4 text-sm font-black text-right text-emerald-400">
                          ₹{row.revenue.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-xs text-center text-gray-700 pb-4">
            Report generated for {activeTab.toLowerCase()} period •{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}