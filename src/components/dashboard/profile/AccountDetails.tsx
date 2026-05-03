
interface AccountDetailsProps {
  user: any;
  onEdit: () => void;
}

export default function AccountDetails({ user, onEdit }: AccountDetailsProps) {
  const details = [
    { label: 'Full name', value: user?.name, field: 'name' },
    { label: 'Email', value: user?.email, field: 'email', disabled: true },
    { label: 'Phone', value: user?.phone || 'Not set', field: 'phone' },
    { label: 'Country', value: user?.country || 'Nigeria', field: 'country' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="text-[15px] font-bold text-gray-900">Account details</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {details.map((item) => (
          <div key={item.label} className="px-6 py-4 grid grid-cols-3 items-center justify- group">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1px] mb-1">{item.label}</p>
            <p className="text-[14px] font-medium text-gray-900">{item.value}</p>
            {!item.disabled && (
              <button
                onClick={onEdit}
                className="text-[12px] font-bold text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
