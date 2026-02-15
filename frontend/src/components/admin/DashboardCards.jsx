import { ShoppingBag, Timer, Calendar, IndianRupee } from "lucide-react";

const stats = [
    { label: "Today's Orders", value: 24, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Orders", value: 6, icon: Timer, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Reservations", value: 12, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Revenue", value: "₹8,450", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function DashboardCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
                <div key={item.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                            <p className="text-3xl font-black text-slate-900 mt-2">{item.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                            <item.icon size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}