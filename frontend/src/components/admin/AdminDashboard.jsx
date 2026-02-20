import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import DashboardCards from "./DashboardCards";
import MenuList from "./MenuList";
import OrdersList from "./OrdersList";
import ReservationsList from "./ReservationsList";
import ReportsPage from "../../pages/admin/ReportsPage";
import WalkInReservation from "./WalkInReservation";
import { AuthContext } from "../../context/AuthContext";
import { Bell, Search, Plus, ChevronDown } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useContext(AuthContext);

  const handleTabChange = (tab) => setActiveTab(tab);

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
        <div className="w-10 h-10 rounded-full border-2 border-[#f5c27a] border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-[#aaa]">Loading dashboard...</p>
      </div>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "menu":         return <MenuList />;
      case "orders":       return <OrdersList />;
      case "reservations": return <ReservationsList />;
      case "walkin":       return <WalkInReservation />;
      case "reports":      return <ReportsPage />;
      default:             return <DashboardCards />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "reports": return "Reports & Analytics";
      case "walkin":  return "Walk-in Reservations";
      default:        return `${activeTab} Overview`;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#0a0a0a] text-[#f1f1f1]">

      {/* Sidebar */}
      <div className="bg-[#111111] border-r border-[#1f1f1f] min-w-[260px]">
        <Sidebar active={activeTab} onChange={handleTabChange} />
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-[#1f1f1f]">
          <div className="flex items-center gap-6 flex-1">

            {/* Logo */}
            <div className="flex items-center gap-3 pr-6 border-r border-[#1f1f1f]">
              <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="/southern-tales-logo.jpeg"
                  alt="Logo"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-[#f5c27a] font-black text-sm">ST</div>';
                  }}
                />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-black text-base tracking-tight block text-[#f1f1f1]">Southern Tales</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#f5c27a]">Management</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={15} />
              <input
                type="text"
                placeholder="Search analytics, orders..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl outline-none bg-[#181818] border border-[#2a2a2a] text-[#ccc] focus:border-[#f5c27a] transition-colors"
              />
            </div>
          </div>

          {/* Right: Bell + User */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full relative bg-[#181818] border border-[#2a2a2a]">
              <Bell size={18} className="text-[#aaa]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl cursor-pointer bg-[#181818] border border-[#2a2a2a]">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 bg-[#f5c27a] text-[#0a0a0a]">
                {user ? getInitials(user.name) : "AD"}
              </div>
              <div className="hidden lg:block leading-none">
                <p className="text-xs font-bold text-[#f1f1f1]">{user?.name || "Admin"}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1 text-[#666]">Owner / Admin</p>
              </div>
              <ChevronDown size={13} className="text-[#555]" />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0a0a0a]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] mb-2 text-[#f5c27a]">
                <span className="w-5 h-[2px] bg-[#f5c27a] inline-block" />
                Admin Management
              </div>
              <h1 className="text-3xl md:text-4xl font-black capitalize tracking-tight text-[#f1f1f1]">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "menu" && (
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#f5c27a] text-[#0a0a0a] hover:bg-[#e0a84a] active:scale-95 transition-all">
                  <Plus size={16} strokeWidth={3} />
                  Add New Item
                </button>
              )}
              {activeTab !== "reports" && activeTab !== "walkin" && (
                <button className="px-5 py-3 rounded-xl text-sm font-bold bg-[#181818] border border-[#2a2a2a] text-[#aaa] hover:border-[#f5c27a] transition-colors">
                  Download Report
                </button>
              )}
            </div>
          </div>

          <div>{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}