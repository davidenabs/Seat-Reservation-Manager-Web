import { DateTime } from 'luxon';

interface StatsGridProps {
  subscription: any;
}

export default function StatsGrid({ subscription }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Subscription Stat */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-md transition-shadow">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">Subscription</p>
        <div className="flex items-center gap-2 text-[18px] font-bold text-gray-900 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5DCAA5]"></span>
          {subscription?.status === 'active' ? 'Active' : 'Inactive'}
        </div>
        <p className="text-[12px] text-gray-500 font-medium capitalize">
          {subscription?.tier || 'Monthly'} · renews {DateTime.fromISO(subscription?.currentPeriodEnd?.toString() || '2026-05-27T00:00:00Z').toFormat('LLL d')}
        </p>
      </div>

      {/* Attendance Stat */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-md transition-shadow">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">Shows Attended</p>
        <div className="text-[24px] font-bold text-gray-900 mb-1">12</div>
        <p className="text-[12px] text-gray-500 font-medium truncate">3-show streak · keep going</p>
      </div>

      {/* Seat Stat */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-md transition-shadow">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">Your Seat</p>
        <div className="text-[24px] font-bold text-gray-900 mb-1">A12</div>
        <p className="text-[12px] text-gray-500 font-medium truncate">Front row · priority tier</p>
      </div>
    </div>
  );
}
