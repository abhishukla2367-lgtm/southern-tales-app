import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, ClipboardList, CalendarDays, LogOut } from "lucide-react";

export default function Sidebar({ active, onChange }) {
    const navigate = useNavigate();

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "menu", label: "Menu Management", icon: Utensils },
        { id: "orders", label: "Live Orders", icon: ClipboardList },
        { id: "reservations", label: "Reservations", icon: CalendarDays },
    ];

    /**
     * Executes the logout sequence. 
     * Navigates to /login which is outside the Admin Layout.
     */
    const handleLogout = () => {
        // Optional: Clear tokens here (e.g., localStorage.removeItem("token"))
        navigate("/login", { replace: true });
    };

    return (
        <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen sticky top-0">
            {/* Header Section */}
            <div className="p-8 flex flex-col items-center border-b border-slate-50 mb-4">
                <h2 className="font-black text-lg tracking-tighter text-slate-900 uppercase">
                    Southern Tales
                </h2>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">
                    Management Suite
                </p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isActive
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout Action */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 font-bold text-sm hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
}