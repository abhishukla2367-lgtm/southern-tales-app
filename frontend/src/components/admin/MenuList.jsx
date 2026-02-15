export default function MenuList() {
    const menuItems = [
        { id: 1, name: "Paneer Butter Masala", price: 320, category: "Main Course" },
        { id: 2, name: "Chicken Tikka Masala", price: 380, category: "Main Course" },
        { id: 3, name: "Veg Biryani", price: 260, category: "Rice" },
        // ... rest of your items
    ];

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-[0.15em] font-black border-b border-slate-200">
                        <th className="px-6 py-4">Item Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Price</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                            <td className="px-6 py-4">
                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-black text-indigo-600">₹{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}