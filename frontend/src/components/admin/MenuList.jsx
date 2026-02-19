import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await API.get("/menu");
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#f5c27a", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-bold" style={{ color: "#aaa" }}>
          Loading menu...
        </p>
      </div>
    );

  if (error)
    return (
      <p className="text-center py-10" style={{ color: "#ef4444" }}>
        Failed to load menu items.
      </p>
    );

  if (!menuItems.length)
    return (
      <p className="text-center py-10" style={{ color: "#aaa" }}>
        No menu items found.
      </p>
    );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#111111", border: "1px solid #1f1f1f" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr
              className="text-[10px] uppercase tracking-[0.2em] font-black"
              style={{
                background: "#161616",
                color: "#555",
                borderBottom: "1px solid #1f1f1f",
              }}
            >
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr
                key={item._id || item.id}
                style={{ borderBottom: "1px solid #1a1a1a" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#161616")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td className="px-6 py-4 text-sm" style={{ color: "#444" }}>
                  {index + 1}
                </td>
                <td
                  className="px-6 py-4 font-bold text-sm"
                  style={{ color: "#f1f1f1" }}
                >
                  {item.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: "rgba(245,194,122,0.1)",
                      color: "#f5c27a",
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-right font-black text-sm"
                  style={{ color: "#34d399" }}
                >
                  ₹{item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}