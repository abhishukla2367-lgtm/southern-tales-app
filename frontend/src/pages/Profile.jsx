import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig"; 

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      // 1. Check if token exists before making the request
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // 2. Updated Path: Must include /auth to match your server.js mounting
        const res = await API.get("/auth/profile");
        setData(res.data);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        // Redirect to login if token is expired (401) or forbidden (403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fcfaf8]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f5c27a] border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Handle case where data might be null despite loading being false
  if (!data || !data.user) return null;

  const { user, orders, reservations } = data;

  return (
    <div className="min-h-screen bg-[#fcfaf8] pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* 1. USER DETAILS SECTION */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-32 bg-[#1f1b16]"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 flex flex-col items-center gap-6 md:flex-row md:items-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#f5c27a] text-4xl font-bold text-[#1f1b16] shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="mb-2 text-center md:text-left">
                <h1 className="text-3xl font-bold text-[#1f1b16]">{user.name}</h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-8 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100/50">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone</p>
                <p className="font-semibold text-gray-700">{user.phone || "Not provided"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100/50">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Address</p>
                <p className="truncate font-semibold text-gray-700">{user.address || "No address saved"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100/50">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Member Since</p>
                <p className="font-semibold text-gray-700">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : "Recently"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* 2. ORDERS SECTION */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1f1b16]">My Recent Orders</h3>
              <span className="rounded-full bg-[#f5c27a]/20 px-3 py-1 text-xs font-bold text-[#eab366]">
                {orders?.length || 0} Total
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders && orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o._id} className="transition-colors hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-mono text-sm font-bold text-gray-600">
                            #{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-[#1f1b16]">
                            ${o.totalAmount?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              o.status?.toLowerCase() === 'delivered' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {o.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-20 text-center text-gray-400">
                          <p className="mb-2 text-3xl">📦</p>
                          <p className="text-sm font-medium">You haven't placed any orders yet.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 3. RESERVATIONS SECTION */}
          <div className="h-fit">
            <h3 className="mb-4 text-xl font-bold text-[#1f1b16]">My Reservations</h3>
            <div className="space-y-4">
              {reservations && reservations.length > 0 ? (
                reservations.map((r) => (
                  <div key={r._id} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-[#f5c27a] hover:shadow-md">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-black text-[#1f1b16]">
                        {new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <span className="rounded-md bg-[#f5c27a]/10 px-2 py-1 text-[10px] font-bold text-[#eab366] uppercase">
                        {r.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1">👥 {r.guests} Guests</span>
                      <span className="text-gray-200">|</span>
                      <span className="flex items-center gap-1">📍 Table {r.tableNumber || "TBD"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center text-gray-400">
                  <p className="mb-2 text-3xl">📅</p>
                  <p className="text-sm font-medium">No upcoming reservations found.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
