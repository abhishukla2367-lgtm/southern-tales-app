const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Crect width='52' height='52' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='22' fill='%23444'%3E%F0%9F%8D%BD%EF%B8%8F%3C/text%3E%3C/svg%3E";

export default function MenuTable({ items, onEdit, onDelete, onToggle }) {
  if (!items.length)
    return (
      <p className="text-center py-10 text-sm text-neutral-500">
        No menu items found.
      </p>
    );

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase tracking-[0.2em] font-black text-neutral-600">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item._id || item.id || index}
                className="border-b border-neutral-900 hover:bg-neutral-900 transition-colors"
              >
                {/* # */}
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {index + 1}
                </td>

                {/* Image */}
                <td className="px-6 py-4">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    className="rounded-lg object-cover border border-neutral-800"
                    style={{ width: 52, height: 52 }}
                  />
                </td>

                {/* Name + Description */}
                <td className="px-6 py-4">
                  <div className="font-bold text-sm text-neutral-100">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-neutral-600 mt-0.5 max-w-[280px] truncate">
                      {item.description}
                    </div>
                  )}
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-right font-black text-sm text-emerald-400">
                  ₹{item.price}
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.available
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-red-400/10 text-red-400"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-900 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}