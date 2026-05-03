import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { SubscriptionService } from "../services/subscriptionService";
import { useDashboard } from "../components/dashboard/DashboardLayout";
import { RefreshCw, Video, Filter } from "lucide-react";

const Transactions = () => {
  const { user } = useDashboard();
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'subscription' | 'show_access'>('all');

  useEffect(() => {
    fetchBillingHistory();
  }, []);

  const fetchBillingHistory = async () => {
    try {
      const res = await SubscriptionService.getBillingHistory();
      if (res?.success) {
        setBillingData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch billing history:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = billingData?.history?.filter((item: any) => {
    if (filter === 'all') return true;
    return item.type === filter;
  }) || [];

  const StatSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 animate-pulse">
      <div className="h-3 w-20 bg-gray-100 rounded mb-4" />
      <div className="h-8 w-32 bg-gray-100 rounded mb-1" />
      <div className="h-4 w-40 bg-gray-50 rounded" />
    </div>
  );

  const RowSkeleton = () => (
    <div className="p-4 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-4 w-full">
        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/4 bg-gray-50 rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
  );

  // Dynamic "Since" date
  const sinceDate = user?.createdAt 
    ? DateTime.fromISO(user.createdAt).toFormat('LLL yyyy') 
    : 'Jan 2026';

  return (
    <div className="p-4 md:p-8 flex-1">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">Total Spent</p>
              <div className="text-[28px] font-bold text-gray-900 mb-1">
                ₦{billingData?.stats?.totalSpent?.toLocaleString() || '0'}
              </div>
              <p className="text-[12px] text-gray-500 font-medium">Since {sinceDate}</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">Active Plan</p>
              <div className="text-[24px] font-bold text-gray-900 mb-1 capitalize">
                {billingData?.stats?.activePlan?.tier?.split('_')[0] || 'None'}
              </div>
              <p className="text-[12px] text-gray-500 font-medium">
                {billingData?.stats?.activePlan?.currency}{billingData?.stats?.activePlan?.amount?.toLocaleString()} · renews {billingData?.stats?.activePlan?.renewsAt ? DateTime.fromISO(billingData?.stats?.activePlan.renewsAt).toFormat('LLL d') : 'N/A'}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-4">Shows Accessed</p>
              <div className="text-[28px] font-bold text-gray-900 mb-1">
                {billingData?.stats?.showsAccessed || '0'}
              </div>
              <p className="text-[12px] text-gray-500 font-medium">This season</p>
            </div>
          </>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'subscription', 'show_access'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
              filter === t 
              ? 'bg-gray-900 text-white' 
              : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'
            }`}
          >
            {t.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item: any) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'subscription' ? 'bg-[#F7F6F3] text-gray-600' : 'bg-red-50 text-[#E8593C]'
                }`}>
                  {item.type === 'subscription' ? <RefreshCw className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 truncate">{item.title}</p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    {DateTime.fromISO(item.date).toFormat('LLL d, yyyy')} · {item.meta}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.5px] ${
                  item.status === 'successful' || item.status === 'included'
                    ? 'bg-green-50 text-[#5DCAA5]'
                    : item.status === 'failed'
                    ? 'bg-red-50 text-red-500'
                    : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {item.status}
                </span>
                {item.amount > 0 && (
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-gray-900">{item.currency}{item.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-medium">≈ $5.00</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No activity found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
