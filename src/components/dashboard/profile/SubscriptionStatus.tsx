import { DateTime } from 'luxon';

interface SubscriptionStatusProps {
  subscription: any;
  onChangePlan: () => void;
  onCancel: () => void;
}

export default function SubscriptionStatus({ subscription, onChangePlan, onCancel }: SubscriptionStatusProps) {
  const details = [
    { label: 'Plan', value: subscription?.tier?.split('_')[0] || 'Monthly', color: 'text-gray-900' },
    { label: 'Status', value: subscription?.status || 'Inactive', color: 'text-[#5DCAA5]' },
    { label: 'Renews', value: subscription?.currentPeriodEnd ? DateTime.fromISO(subscription.currentPeriodEnd).toFormat('MMMM d, yyyy') : 'N/A', color: 'text-gray-900' },
    { label: 'Payment', value: `${subscription?.provider || 'N/A'} · ₦${subscription?.tier?.includes('monthly') ? '6,500' : '2,500'}` || 'N/A', color: 'text-gray-900' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="text-[15px] font-bold text-gray-900">Subscription</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {details.map((item) => (
          <div key={item.label} className="px-6 py-4 flex items-center justify-between">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1px]">{item.label}</p>
            <p className={`text-[14px] font-bold capitalize ${item.color}`}>{item.value}</p>
          </div>
        ))}
        <div className="px-6 py-6 flex gap-3">
          <button
            onClick={onChangePlan}
            className="flex-1 bg-white border border-gray-100 py-2.5 rounded-xl text-[13px] font-bold text-gray-900 hover:bg-gray-50 transition-all"
          >
            Change plan
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-black py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
