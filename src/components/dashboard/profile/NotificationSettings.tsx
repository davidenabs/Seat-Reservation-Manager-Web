interface NotificationSettingsProps {
  preferences: any;
  onEdit: () => void;
}

export default function NotificationSettings({ preferences, onEdit }: NotificationSettingsProps) {
  const getChannels = (pref: any) => {
    if (!pref) return 'Email';
    const channels = [];
    if (pref.email) channels.push('Email');
    if (pref.sms) channels.push('SMS');
    return channels.length > 0 ? channels.join(' + ') : 'None';
  };

  const settings = [
    { label: 'Show reminders', value: getChannels(preferences?.reminders), key: 'reminders' },
    { label: 'New episodes', value: getChannels(preferences?.events), key: 'events' },
    { label: 'Billing alerts', value: getChannels(preferences?.billing), key: 'billing' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="text-[15px] font-bold text-gray-900">Notifications</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {settings.map((item) => (
          <div key={item.label} className="px-6 py-4 grid grid-cols-3 items-center justify- group">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1px] mb-1">{item.label}</p>
            <p className="text-[14px] font-medium text-gray-900">{item.value}</p>
            <button
              onClick={onEdit}
              className="text-[12px] font-bold text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
