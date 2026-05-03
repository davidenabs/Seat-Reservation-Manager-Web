
export function SecuritySettings({ onPasswordChange }: { onPasswordChange: () => void }) {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm h-ull">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="text-[15px] font-bold text-gray-900">Security</h3>
      </div>
      <div className="divide-y divide-gray-50">
        <div className="px-6 py-4 flex items-center justify-between group">
          <div className="flex-1">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1px] mb-1">Password</p>
            <p className="text-[14px] font-medium text-gray-900 tracking-[2px]">••••••••</p>
          </div>
          <button 
            onClick={onPasswordChange}
            className="text-[12px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
          >
            Change
          </button>
        </div>
        <div className="px-6 py-4 flex items-center justify-between group">
          <div className="flex-1">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1px] mb-1">2FA</p>
            <p className="text-[14px] font-medium text-yellow-600">Not enabled</p>
          </div>
          <button className="text-[12px] font-bold text-gray-300 cursor-not-allowed">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}

export function DangerZone({ onDeleteAccount }: { onDeleteAccount: () => void }) {
  return (
    <div className="bg-white border border-red-100 rounded-[24px] overflow-hidden shadow-sm mt-6">
      <div className="px-6 py-4 bg-red-50/30 border-b border-red-50">
        <h3 className="text-[13px] font-bold text-red-600 uppercase tracking-[1px]">Danger Zone</h3>
      </div>
      <div className="px-6 py-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-center sm:text-left">
          <p className="text-[14px] font-bold text-gray-900">Delete account</p>
          <p className="text-[12px] text-gray-500 font-medium">This will permanently remove all your data.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={onDeleteAccount}
            className="flex-1 sm:flex-none bg-red-600 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-red-700 transition-all"
          >
            Delete account
          </button>
          <button className="flex-1 sm:flex-none bg-gray-50 px-6 py-2.5 rounded-xl text-[13px] font-bold text-gray-500 hover:bg-gray-100 transition-all">
            Export data
          </button>
        </div>
      </div>
    </div>
  );
}
