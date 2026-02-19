import { useState, useEffect } from "react";
import { ShoppingBag, Timer, Calendar, IndianRupee } from "lucide-react";
import API from "../../api/axiosConfig";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    totalReservations: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/dashboard-stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Today's Orders",
      value: loading ? "..." : stats.todayOrders,
      icon: ShoppingBag,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/10 border border-blue-400/20",
      valueColor: "text-white",
      accentColor: "bg-blue-400",
      description: "Orders placed today",
    },
    {
      label: "Pending Orders",
      value: loading ? "..." : stats.pendingOrders,
      icon: Timer,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-400/10 border border-yellow-400/20",
      valueColor: "text-white",
      accentColor: "bg-yellow-400",
      description: "Orders awaiting processing",
    },
    {
      label: "Reservations",
      value: loading ? "..." : stats.totalReservations,
      icon: Calendar,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-400/10 border border-purple-400/20",
      valueColor: "text-white",
      accentColor: "bg-purple-400",
      description: "Active table reservations",
    },
    {
      label: "Revenue",
      value: loading ? "..." : `₹${stats.todayRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-400/10 border border-emerald-400/20",
      valueColor: "text-white",
      accentColor: "bg-emerald-400",
      description: "Total revenue today",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((item, i) => (
        <div
          key={item.label}
          className="p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f] hover:border-[#2a2a2a] hover:-translate-y-1 transition-all duration-200 cursor-default"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {item.label}
              </p>
              <p className="text-3xl font-black mt-3 tabular-nums text-white">
                {item.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl flex-shrink-0 ${item.iconBg}`}>
              <item.icon size={20} className={item.iconColor} aria-hidden="true" />
            </div>
          </div>
          <div className={`mt-5 h-[2px] rounded-full w-1/3 opacity-40 ${item.accentColor}`} />
        </div>
      ))}
    </div>
  );
}