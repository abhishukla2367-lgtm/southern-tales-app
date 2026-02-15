export default function SkeletonCard() {
  return (
    <div className="bg-white p-4 rounded-xl animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
      <div className="h-6 w-16 bg-gray-300 rounded"></div>
    </div>
  );
}
