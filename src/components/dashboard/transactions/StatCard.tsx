interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  loading?: boolean;
}

export default function StatCard({ label, value, subValue, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 animate-pulse">
        <div className="h-3 w-20 bg-gray-100 rounded mb-4" />
        <div className="h-8 w-32 bg-gray-100 rounded mb-1" />
        <div className="h-4 w-40 bg-gray-50 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">{label}</p>
      <div className="text-[28px] font-bold text-gray-900 mb-1 leading-tight">
        {value}
      </div>
      {subValue && (
        <p className="text-[12px] text-gray-500 font-medium">{subValue}</p>
      )}
    </div>
  );
}
