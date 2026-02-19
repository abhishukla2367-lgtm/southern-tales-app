import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import DashboardCards from "./DashboardCards";
import MenuList from "./MenuList";
import OrdersList from "./OrdersList";
import ReservationsList from "./ReservationsList";
import ReportsPage from "../../pages/admin/ReportsPage";
import { AuthContext } from "../../context/AuthContext";
import { Bell, Search, Plus, ChevronDown } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tabLoading, setTabLoading] = useState(false);
  const { user, loading } = useContext(AuthContext);

  const handleTabChange = (tab) => {
    setTabLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTabLoading(false);
    }, 600);
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0a" }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "#f5c27a", borderTopColor: "transparent" }} />
        <p className="text-sm font-bold" style={{ color: "#aaa" }}>Loading dashboard...</p>
      </div>
    );

  const renderContent = () => {
    if (tabLoading)
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: "#f5c27a", borderTopColor: "transparent" }} />
          <p className="text-sm font-bold" style={{ color: "#aaa" }}>Loading...</p>
        </div>
      );

    switch (activeTab) {
      case "menu":         return <MenuList />;
      case "orders":       return <OrdersList />;
      case "reservations": return <ReservationsList />;
      case "reports":      return <ReportsPage />;
      default:             return <DashboardCards />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans" style={{ background: "#0a0a0a", color: "#f1f1f1" }}>

      {/* Sidebar */}
      <div style={{ background: "#111111", borderRight: "1px solid #1f1f1f", minWidth: "260px" }}>
        <Sidebar active={activeTab} onChange={handleTabChange} />
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header
          className="h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30"
          style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-3 pr-6" style={{ borderRight: "1px solid #1f1f1f" }}>
              <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="/southern-tales-logo.jpeg"
                  alt="Logo"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML =
                      '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a1a;color:#f5c27a;font-weight:900;font-size:14px;">ST</div>';
                  }}
                />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-black text-base tracking-tight block" style={{ color: "#f1f1f1" }}>Southern Tales</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: "#f5c27a" }}>Management</span>
              </div>
            </div>

            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: "#555" }} />
              <input
                type="text"
                placeholder="Search analytics, orders..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
                style={{ background: "#181818", border: "1px solid #2a2a2a", color: "#ccc" }}
                onFocus={(e) => (e.target.style.borderColor = "#f5c27a")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              />
            </div>
          </div>

          {/* Right side — Bell + User only, NO logout button */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full relative transition-all"
              style={{ background: "#181818", border: "1px solid #2a2a2a" }}
            >
              <Bell size={18} style={{ color: "#aaa" }} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
            </button>

            <div
              className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl cursor-pointer"
              style={{ background: "#181818", border: "1px solid #2a2a2a" }}
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: "#f5c27a", color: "#0a0a0a" }}
              >
                {user ? getInitials(user.name) : "AD"}
              </div>
              <div className="hidden lg:block leading-none">
                <p className="text-xs font-bold" style={{ color: "#f1f1f1" }}>{user?.name || "Admin"}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: "#666" }}>Owner / Admin</p>
              </div>
              <ChevronDown size={13} style={{ color: "#555" }} />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ background: "#0a0a0a" }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: "#f5c27a" }}>
                <span className="w-5 h-[2px]" style={{ background: "#f5c27a", display: "inline-block" }} />
                Admin Management
              </div>
              <h1 className="text-3xl md:text-4xl font-black capitalize tracking-tight" style={{ color: "#f1f1f1" }}>
                {activeTab === "reports" ? "Reports & Analytics" : `${activeTab} Overview`}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "menu" && (
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                  style={{ background: "#f5c27a", color: "#0a0a0a" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#e0a84a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f5c27a")}
                >
                  <Plus size={16} strokeWidth={3} />
                  Add New Item
                </button>
              )}
              {activeTab !== "reports" && (
                <button
                  className="px-5 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#181818", border: "1px solid #2a2a2a", color: "#aaa" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#f5c27a")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
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