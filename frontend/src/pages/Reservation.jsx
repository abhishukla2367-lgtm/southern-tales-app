import React, { useState } from "react";

export default function Reservation() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        if (!form.phone || form.phone.length < 10)
            newErrors.phone = "Valid phone number required";
        if (!form.date) newErrors.date = "Date is required";
        if (!form.time) newErrors.time = "Time is required";
        if (!form.guests) newErrors.guests = "Select number of guests";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        alert("Table reserved successfully!");
        setForm({
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "",
            guests: "",
        });
    };

    return (
        <section id="reservation" className="py-20 bg-black px-6 min-h-screen">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">
                    Book Your Table
                </h2>
                <p className="text-zinc-400 mb-10">
                    Join us for an unforgettable dining experience.
                </p>

                <form
                    autoComplete="off"
                    className="bg-zinc-900 max-w-lg mx-auto p-8 rounded-2xl shadow-2xl border border-white/10 space-y-5 text-left"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <input type="text" name="fakeusernameremembered" autoComplete="username" hidden />
                        <input type="password" name="fakepasswordremembered" autoComplete="new-password" hidden />

                        <label className="block text-sm font-medium mb-1 text-zinc-300">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            autoComplete="new-name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="new-email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="hello@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            autoComplete="new-tel"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="9876543210"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Guests */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Number of Guests
                        </label>
                        <select
                            name="guests"
                            value={form.guests}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="" className="bg-zinc-900">Select number of people</option>
                            <option value="1" className="bg-zinc-900">1 Person</option>
                            <option value="2" className="bg-zinc-900">2 People</option>
                            <option value="3" className="bg-zinc-900">3 People</option>
                            <option value="4" className="bg-zinc-900">4 People</option>
                            <option value="5" className="bg-zinc-900">5 People</option>
                        </select>
                        {errors.guests && (
                            <p className="text-red-500 text-xs mt-1">{errors.guests}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-zinc-300">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                            {errors.date && (
                                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-zinc-300">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                            {errors.time && (
                                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold shadow-md transition-all active:scale-[0.98]"
                    >
                        Confirm Reservation
                    </button>

                    <p className="text-xs text-center text-zinc-500">
                        By clicking reserve, you agree to our terms and conditions.
                    </p>
                </form>
            </div>
        </section>
    );
}