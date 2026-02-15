import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardCards from "./DashboardCards";
import MenuList from "./MenuList";
import OrdersList from "./OrdersList";
import ReservationsList from "./ReservationsList";
import { Bell, Search, Plus, ChevronDown, User, LogOut, Settings, LogIn } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    // Simulated authentication state
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const renderContent = () => {
        switch (activeTab) {
            case "menu": return <MenuList />;
            case "orders": return <OrdersList />;
            case "reservations": return <ReservationsList />;
            default: return <DashboardCards />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
            <Sidebar active={activeTab} onChange={setActiveTab} />

            <div className="flex-1 flex flex-col">
                {/* Modern Professional Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 px-8 flex justify-between items-center sticky top-0 z-30">

                    {/* Left: Brand Identity & Search */}
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center gap-3 pr-8 border-r border-slate-200">
                            {/* Branded Logo from Southern Tales */}
                            <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-slate-100 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                                <img
                                    src="/southern-tales-logo.jpeg"
                                    alt="Southern Tales Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="hidden sm:block leading-none">
                                <span className="font-black text-lg tracking-tight text-slate-800 block">Southern Tales</span>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Management</span>
                            </div>
                        </div>

                        <div className="relative w-full max-w-md hidden md:block group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search analytics, orders..."
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right: Conditional Profile or Login Button */}
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all relative group">
                                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                                </button>

                                <div className="h-8 w-px bg-slate-200 mx-2" />

                                {/* Professional Profile Section */}
                                <div
                                    onClick={() => setIsLoggedIn(false)} // For demo toggle
                                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer group"
                                >
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-sm overflow-hidden group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            AS
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                    </div>

                                    <div className="text-left hidden lg:block leading-none">
                                        <p className="text-[13px] font-bold text-slate-800 tracking-tight">Aryan M Shivgunde</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Owner / Admin</p>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400 mx-2 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsLoggedIn(true)}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                <LogIn size={18} />
                                Login to Dashboard
                            </button>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-8 lg:p-12 max-w-7xl w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                <span className="w-6 h-[2px] bg-indigo-600"></span>
                                Admin Management
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tight">
                                {activeTab} Overview
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {activeTab === "menu" && (
                                <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
                                    <Plus size={18} strokeWidth={3} />
                                    Add New Item
                                </button>
                            )}
                            <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                                Download Report
                            </button>
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}