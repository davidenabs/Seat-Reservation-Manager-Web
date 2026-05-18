import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { SubscriptionService } from "../services/subscriptionService";
import { useDashboard } from "../components/dashboard/DashboardLayout";
import { RefreshCw, Video, Filter } from "lucide-react";
import StatCard from "../components/dashboard/transactions/StatCard";
import Pagination from "../components/ui/Pagination";

const Transactions = () => {
  const { user } = useDashboard();
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'subscription' | 'show_access'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  // Simple cache to store pages
  const cache = useRef<Record<string, any>>({});

  useEffect(() => {
    fetchBillingHistory();
  }, [currentPage, filter]);

  const fetchBillingHistory = async () => {
    const cacheKey = `${filter}-${currentPage}`;
    
    // Check cache
    if (cache.current[cacheKey]) {
      setBillingData(cache.current[cacheKey]);
      setTotalPages(cache.current[cacheKey].pagination?.totalPages || 1);
      return;
    }

    // If we have data, only show list loading, otherwise full page loading
    if (billingData) {
      setListLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await SubscriptionService.getBillingHistory(currentPage, limit);
      if (res?.success) {
        setBillingData(res.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
        // Save to cache
        cache.current[cacheKey] = res.data;
      }
    } catch (err) {
      console.error("Failed to fetch billing history:", err);
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  };

  const filteredHistory = billingData?.history?.filter((item: any) => {
    if (filter === 'all') return true;
    return item.type === filter;
  }) || [];

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

  const getAccruedSpent = () => {
    // If no active plan, just show total spent from transactions
    if (!billingData?.stats?.activePlan || !user?.createdAt) {
      return billingData?.stats?.totalSpent || 0;
    }
    
    const registrationDate = DateTime.fromISO(user.createdAt);
    const now = DateTime.now();
    // Calculate days since registration (at least 1 day)
    const daysSinceRegistration = Math.max(1, Math.floor(now.diff(registrationDate, 'days').days));
    
    const amount = billingData.stats.activePlan.amount;
    const tier = billingData.stats.activePlan.tier?.toLowerCase() || '';
    
    let dailyRate = 0;
    if (tier.includes('weekly')) dailyRate = amount / 7;
    else if (tier.includes('monthly')) dailyRate = amount / 30;
    else if (tier.includes('annual') || tier.includes('year')) dailyRate = amount / 365;
    
    return daysSinceRegistration * dailyRate;
  };

  const accruedValue = getAccruedSpent();
  const currencySymbol = billingData?.stats?.activePlan?.currency || '₦';

  return (
    <div className="p-4 md:p-8 flex-1">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10">
        <StatCard 
          label="Total Spent"
          value={`${currencySymbol}${accruedValue.toFixed(2).replace(/\.00$/, '')}`}
          subValue={`Since ${sinceDate}`}
          loading={loading}
        />

        <StatCard 
          label="Active Plan"
          value={billingData?.stats?.activePlan?.tier?.split('_')[0] || 'None'}
          subValue={billingData?.stats?.activePlan ? `${billingData.stats.activePlan.currency}${billingData.stats.activePlan.amount?.toLocaleString()} · renews ${billingData.stats.activePlan.renewsAt ? DateTime.fromISO(billingData.stats.activePlan.renewsAt).toFormat('LLL d') : 'N/A'}` : 'No active plan'}
          loading={loading}
        />

        <StatCard 
          label="Shows Accessed"
          value={billingData?.stats?.showsAccessed || '0'}
          subValue="This season"
          loading={loading}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'subscription', 'show_access'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setFilter(t);
              setCurrentPage(1); // Reset to first page on filter change
            }}
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
        {loading || listLoading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
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
              <div className="flex items-center sm:justify-end gap-3 sm:gap-4 shrink-0 pl-14 sm:pl-0">
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
                  <div className="text-left sm:text-right">
                    <p className="text-[14px] font-bold text-gray-900">{item.currency}{item.amount * 100}</p>
                    {/* <p className="text-[10px] text-gray-400 font-medium">≈ $5.00</p> */}
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

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </div>
  );
};

export default Transactions;
