import React, { useState, useEffect, useCallback, useRef } from "react";
import { ShoppingBag, Timer, Calendar, IndianRupee, RefreshCw, Wifi, WifiOff } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line,
} from "recharts";
import API from "../../api/axiosConfig";

const REFRESH_INTERVAL = 15000;
const CHART_HEIGHT = 240;

function ChartBox({ children }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
    const ro = new ResizeObserver(() => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full" style={{ height: CHART_HEIGHT }}>
      {width > 0 ? children(width) : null}
    </div>
  );
}

export default function DashboardCards() {
  const [data, setData]               = useState({ todayOrders: 0, pendingOrders: 0, reservations: 0, revenue: 0 });
  const [history, setHistory]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive]           = useState(true);
  const [error, setError]             = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setError(null);
    try {
      const [ordersRes, reservationsRes] = await Promise.allSettled([
        API.get("/orders/admin/all"),
        API.get("/reservations/admin/all"),
      ]);

      let todayOrders = 0, pendingOrders = 0, revenue = 0;
      if (ordersRes.status === "fulfilled") {
        const orders = ordersRes.value.data?.data || ordersRes.value.data || [];
        const today  = new Date().toDateString();
        todayOrders   = orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
        pendingOrders = orders.filter((o) => ["Pending","pending","Processing","processing"].includes(o.status)).length;
        revenue       = orders
          .filter((o) => new Date(o.createdAt).toDateString() === today)
          .reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
      }

      // FIX: date is stored as type:Date in MongoDB (UTC midnight).
      // "2026-02-22" from the form becomes 2026-02-22T00:00:00.000Z in MongoDB.
      // In IST (UTC+5:30), that UTC midnight is actually the previous day at 5:30 AM,
      // so we manually shift by +5:30 before extracting the date string to compare.
      let reservations = 0;
      if (reservationsRes.status === "fulfilled") {
        const res = reservationsRes.value.data?.data || reservationsRes.value.data || [];
        const todayStr = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" in local IST
        const IST_OFFSET = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds
        reservations = res.filter((r) => {
          const d = new Date(r.date || r.createdAt);
          const istDate = new Date(d.getTime() + IST_OFFSET);
          const dateStr = istDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
          return dateStr === todayStr;
        }).length;
      }

      const newData = { todayOrders, pendingOrders, reservations, revenue };
      setData(newData);

      const timestamp = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setHistory((prev) => [...prev, { time: timestamp, ...newData }].slice(-10));
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Could not reach server — showing last known data");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);
  useEffect(() => {
    const interval = setInterval(() => fetchDashboardData(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const stats = [
    { label: "Today's Orders",       value: data.todayOrders,   icon: ShoppingBag,  color: "text-blue-400",    iconBg: "bg-blue-400/10 border border-blue-400/20",    accent: "bg-blue-400",    hover: "hover:border-blue-400/40" },
    { label: "Pending Orders",       value: data.pendingOrders, icon: Timer,         color: "text-[#f5c27a]",   iconBg: "bg-[#f5c27a]/10 border border-[#f5c27a]/20",  accent: "bg-[#f5c27a]",   hover: "hover:border-[#f5c27a]/40" },
    { label: "Today's Reservations", value: data.reservations,  icon: Calendar,      color: "text-violet-400",  iconBg: "bg-violet-400/10 border border-violet-400/20", accent: "bg-violet-400",  hover: "hover:border-violet-400/40" },
    { label: "Today's Revenue",      value: `₹${data.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-emerald-400", iconBg: "bg-emerald-400/10 border border-emerald-400/20", accent: "bg-emerald-400", hover: "hover:border-emerald-400/40" },
  ];

  const barData = [{ name: "Live", Orders: data.todayOrders, Pending: data.pendingOrders, Reservations: data.reservations }];

  const tooltipStyle = {
    contentStyle: { backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#f4f4f5" },
    itemStyle: { color: "#f4f4f5" },
  };

  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-3 w-24 bg-zinc-800 rounded" />
                <div className="h-8 w-16 bg-zinc-800 rounded" />
              </div>
              <div className="h-11 w-11 bg-zinc-800 rounded-xl" />
            </div>
            <div className="mt-5 h-[2px] w-1/3 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes cardIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .stat-card { animation: cardIn 0.4s ease both; }
        @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .live-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
        .recharts-tooltip-wrapper { outline: none !important; }
      `}</style>

      {/* Status bar */}
      <div className="flex items-center gap-2">
        {isLive ? (
          <>
            <span className="live-dot w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live</span>
            <Wifi size={13} className="text-emerald-400" />
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Offline</span>
            <WifiOff size={13} className="text-red-400" />
          </>
        )}
        {lastUpdated && (
          <span className="text-xs text-zinc-400 ml-2">
            Updated {lastUpdated.toLocaleTimeString("en-IN")}
          </span>
        )}
        <span className="text-xs text-zinc-500 ml-1">· auto-refreshes every 15s</span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl px-5 py-3 text-sm font-medium">
          ⚠ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
        {stats.map((item, i) => (
          <div
            key={item.label}
            role="listitem"
            tabIndex={0}
            className={`stat-card p-6 rounded-2xl cursor-default bg-zinc-900 border border-zinc-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f5c27a] focus-visible:outline-offset-2 ${item.hover}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{item.label}</p>
                <p className="text-3xl font-black mt-3 tabular-nums text-zinc-100">{item.value}</p>
              </div>
              <div className={`p-3 rounded-xl flex-shrink-0 ${item.iconBg}`}>
                <item.icon size={20} className={item.color} aria-hidden="true" />
              </div>
            </div>
            <div className={`mt-5 h-[2px] rounded-full w-1/3 opacity-40 ${item.accent}`} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100">Live Snapshot</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-5">Current counts right now</p>
          <ChartBox>
            {(w) => (
              <BarChart width={w} height={CHART_HEIGHT} data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <YAxis stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#d4d4d8" }} />
                <Bar dataKey="Orders"       fill="#60a5fa" radius={[4,4,0,0]} />
                <Bar dataKey="Pending"      fill="#f5c27a" radius={[4,4,0,0]} />
                <Bar dataKey="Reservations" fill="#a78bfa" radius={[4,4,0,0]} />
              </BarChart>
            )}
          </ChartBox>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100">Activity Trend</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-5">Last {history.length} snapshots</p>
          <ChartBox>
            {(w) =>
              history.length < 2 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-500">
                  <RefreshCw size={20} className="animate-spin opacity-40" />
                  <p className="text-sm">Collecting trend data…</p>
                  <p className="text-xs">auto-refreshes every 15s</p>
                </div>
              ) : (
                <LineChart width={w} height={CHART_HEIGHT} data={history} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 9 }} />
                  <YAxis stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#d4d4d8" }} />
                  <Line type="monotone" dataKey="todayOrders"   stroke="#60a5fa" strokeWidth={2} dot={false} name="Orders" />
                  <Line type="monotone" dataKey="pendingOrders" stroke="#f5c27a" strokeWidth={2} dot={false} name="Pending" />
                  <Line type="monotone" dataKey="reservations"  stroke="#a78bfa" strokeWidth={2} dot={false} name="Reservations" />
                </LineChart>
              )
            }
          </ChartBox>
        </div>
      </div>

      {/* Revenue */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-zinc-100">Today's Revenue</h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">Live</span>
        </div>
        <p className="text-xs text-zinc-500 mb-5">From today's completed orders</p>
        <p className="text-5xl font-black text-emerald-400 tabular-nums">
          ₹{data.revenue.toLocaleString("en-IN")}
        </p>
        <div className="mt-4 h-[3px] w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min((data.revenue / 50000) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          {Math.min(Math.round((data.revenue / 50000) * 100), 100)}% of daily target · ₹50,000
        </p>
      </div>
    </div>
  );
}