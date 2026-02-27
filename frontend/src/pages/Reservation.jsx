import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

// ✅ Match these to your actual table IDs — same as Constants.js TABLE_IDS
const TABLE_IDS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12","T13","T14","T15","T16","T17","T18","T19","T20"];

export default function Reservation() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        customerName:  "",
        customerEmail: "",
        phone:         "",
        date:          "",
        time:          "",
        guests:        "",
        tableNumber:   "",
    });

    const [errors, setErrors]           = useState({});
    const [submitting, setSubmitting]   = useState(false);
    const [occupiedTables, setOccupiedTables] = useState([]);
    const [tableWarning, setTableWarning]     = useState("");

    // Fetch occupied tables on mount
    useEffect(() => {
        API.get("/reservations/occupied-tables")
            .then((res) => setOccupiedTables(res.data?.occupiedTables || []))
            .catch(() => {}); // fail silently — availability display is non-critical
    }, []);

    const nameMap = {
        "ux_user_fullname":      "customerName",
        "ux_user_contact_email": "customerEmail",
        "ux_user_phone_num":     "phone",
        "ux_booking_date":       "date",
        "ux_booking_time":       "time",
        "ux_guest_count":        "guests",
    };

    const handleChange = (e) => {
        const actualKey = nameMap[e.target.name] || e.target.name;
        setForm({ ...form, [actualKey]: e.target.value });
    };

    const handleTableChange = (value) => {
        setForm((f) => ({ ...f, tableNumber: value }));
        setTableWarning(
            value && occupiedTables.includes(value)
                ? "This table is currently occupied. Please choose another."
                : ""
        );
    };

    const validate = () => {
        const newErrors = {};
        if (!form.customerName)
            newErrors.customerName = "Name is required";
        if (!form.customerEmail || !/^\S+@\S+\.\S+$/.test(form.customerEmail))
            newErrors.customerEmail = "Valid email required";
        if (!form.phone || !/^\d{10}$/.test(form.phone))
            newErrors.phone = "10-digit phone number required";
        if (!form.date)
            newErrors.date = "Date is required";
        if (!form.time)
            newErrors.time = "Time is required";
        if (!form.guests)
            newErrors.guests = "Select number of guests";
        if (tableWarning)
            newErrors.tableNumber = tableWarning;
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Login required to reserve a table");
            navigate("/login");
            return;
        }

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            await API.post("/reservations", form);
            alert("Table reserved successfully!");
            setForm({
                customerName: "", customerEmail: "", phone: "",
                date: "", time: "", guests: "", tableNumber: "",
            });
            setErrors({});
            navigate("/");
        } catch (err) {
            console.error("Reservation Error:", err);
            alert(err.response?.data?.message || "Failed to book table.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = "w-full bg-[#1a1a1a] border border-zinc-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#f5c27a] outline-none transition-all placeholder:text-zinc-600";
    const labelCls = "block text-sm font-bold mb-1 text-[#f5c27a]";

    return (
        <section id="reservation" className="py-20 mt-16 bg-black px-6 min-h-screen">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">Book Your Table</h2>
                <p className="text-zinc-400 mb-10">Join us for an unforgettable dining experience.</p>

                <form
                    autoComplete="off"
                    role="presentation"
                    className="bg-[#111111] max-w-lg mx-auto p-8 rounded-2xl shadow-2xl border border-zinc-800 space-y-5 text-left"
                    onSubmit={handleSubmit}
                >
                    {/* HONEYPOT */}
                    <input type="text"  name="name"  style={{ display: "none" }} tabIndex="-1" autoComplete="off" />
                    <input type="email" name="email" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

                    {/* Full Name */}
                    <div>
                        <label className={labelCls}>Full Name</label>
                        <input
                            type="text" name="ux_user_fullname" autoComplete="new-password"
                            value={form.customerName} onChange={handleChange}
                            className={inputCls} placeholder="Your Name"
                        />
                        {errors.customerName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.customerName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelCls}>Email Address</label>
                        <input
                            type="email" name="ux_user_contact_email" autoComplete="new-password"
                            value={form.customerEmail} onChange={handleChange}
                            className={inputCls} placeholder="hello@example.com"
                        />
                        {errors.customerEmail && <p className="text-red-400 text-xs mt-1 font-medium">{errors.customerEmail}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelCls}>Phone Number</label>
                        <input
                            type="tel" name="ux_user_phone_num" autoComplete="new-password"
                            value={form.phone} onChange={handleChange}
                            className={inputCls} placeholder="9876543210"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Guests */}
                    <div>
                        <label className={labelCls}>Number of Guests</label>
                        <select
                            name="ux_guest_count" value={form.guests}
                            onChange={handleChange} autoComplete="off"
                            className="w-full bg-[#1a1a1a] border border-zinc-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#f5c27a] outline-none"
                        >
                            <option value="" className="bg-[#111111]">Select people</option>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num} className="bg-[#111111]">
                                    {num} {num === 1 ? "Person" : "People"}
                                </option>
                            ))}
                        </select>
                        {errors.guests && <p className="text-red-400 text-xs mt-1 font-medium">{errors.guests}</p>}
                    </div>

                    {/* Table Number */}
                    <div>
                        <label className={labelCls}>
                            Preferred Table <span className="text-zinc-500 font-normal text-xs">(optional)</span>
                        </label>
                        <select
                            name="tableNumber"
                            value={form.tableNumber}
                            onChange={(e) => handleTableChange(e.target.value)}
                            autoComplete="off"
                            className={`w-full bg-[#1a1a1a] border ${tableWarning ? "border-red-500" : "border-zinc-800"} text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#f5c27a] outline-none`}
                        >
                            <option value="" className="bg-[#111111]">— No preference —</option>
                            {TABLE_IDS.map((t) => (
                                <option key={t} value={t} className="bg-[#111111]">
                                    {t}{occupiedTables.includes(t) ? " — 🔴 Occupied" : " — 🟢 Available"}
                                </option>
                            ))}
                        </select>
                        {tableWarning && (
                            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2 mt-2">
                                <span>⚠️</span>
                                <p className="text-red-400 text-xs font-bold">{tableWarning}</p>
                            </div>
                        )}
                        {errors.tableNumber && !tableWarning && (
                            <p className="text-red-400 text-xs mt-1 font-medium">{errors.tableNumber}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Date</label>
                            <input
                                type="date" name="ux_booking_date" autoComplete="off"
                                value={form.date} onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full bg-[#1a1a1a] border border-zinc-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#f5c27a] outline-none [color-scheme:dark]"
                            />
                            {errors.date && <p className="text-red-400 text-xs mt-1 font-medium">{errors.date}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Time</label>
                            <input
                                type="time" name="ux_booking_time" autoComplete="off"
                                value={form.time} onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-zinc-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#f5c27a] outline-none [color-scheme:dark]"
                            />
                            {errors.time && <p className="text-red-400 text-xs mt-1 font-medium">{errors.time}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !!tableWarning}
                        className={`w-full ${
                            submitting || tableWarning ? "bg-zinc-700 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-500"
                        } text-white py-3 rounded-lg font-black shadow-lg transition-all active:scale-[0.98] uppercase tracking-wider`}
                    >
                        {submitting ? "Booking..." : "Confirm Reservation"}
                    </button>
                </form>
            </div>
        </section>
    );
}