import { ShoppingBag, Timer, Calendar, IndianRupee } from "lucide-react";

const stats = [
  {
    label: "Today's Orders",
    value: 24,
    icon: ShoppingBag,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    description: "Orders placed today",
  },
  {
    label: "Pending Orders",
    value: 6,
    icon: Timer,
    color: "#f5c27a",
    bg: "rgba(245,194,122,0.08)",
    border: "rgba(245,194,122,0.2)",
    description: "Orders awaiting processing",
  },
  {
    label: "Reservations",
    value: 12,
    icon: Calendar,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    description: "Active table reservations",
  },
  {
    label: "Revenue",
    value: "₹8,450",
    icon: IndianRupee,
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    description: "Total revenue today",
  },
];

export default function DashboardCards() {
  return (
    <>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card {
          animation: cardIn 0.4s ease both;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
        }
        .stat-card:focus-visible {
          outline: 2px solid #f5c27a;
          outline-offset: 3px;
        }
      `}</style>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        role="list"
        aria-label="Dashboard statistics"
      >
        {stats.map((item, i) => (
          <div
            key={item.label}
            role="listitem"
            tabIndex={0}
            aria-label={`${item.label}: ${item.value}. ${item.description}`}
            className="stat-card p-6 rounded-2xl cursor-default"
            style={{
              background: "#111111",
              border: `1px solid #1f1f1f`,
              animationDelay: `${i * 80}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = item.border;
              e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}18`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1f1f1f";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#aaa" }}
                >
                  {item.label}
                </p>
                <p
                  className="text-3xl font-black mt-3 tabular-nums"
                  style={{ color: "#f1f1f1" }}
                >
                  {item.value}
                </p>
              </div>
              <div
                className="p-3 rounded-xl flex-shrink-0 transition-transform duration-200"
                style={{ background: item.bg, border: `1px solid ${item.border}` }}
              >
                <item.icon size={20} style={{ color: item.color }} aria-hidden="true" />
              </div>
            </div>

            {/* Subtle bottom accent bar */}
            <div
              className="mt-5 h-[2px] rounded-full w-1/3 transition-all duration-300"
              style={{ background: item.color, opacity: 0.4 }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
