import WalkInCounter from "../components/WalkInCounter";
import OrdersList from "../components/orders/OrdersList";

export default function LiveOrders() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-black text-[#f1f1f1] uppercase tracking-widest">
            Live Orders
          </h1>
          <p className="text-sm text-[#555] mt-1">
            Manage active orders, walk-in members, and generate bills
          </p>
        </div>

        {/* Walk-in Counter */}
        <WalkInCounter />

        {/* Orders Table */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#555] mb-3">
            All Orders
          </p>
          <OrdersList />
        </div>

      </div>
    </div>
  );
}