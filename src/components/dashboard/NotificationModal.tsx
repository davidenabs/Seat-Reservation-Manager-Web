import { X, Info, Calendar, CreditCard, Loader2, BellOff, Trash2 } from 'lucide-react';
import { useDashboard } from './DashboardLayout';
import { formatRelativeTime } from '../../utils/formatDate';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { 
    notifications, 
    markAllRead, 
    markAsRead, 
    clearAll,
    loading: dashboardLoading 
  } = useDashboard();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return Calendar;
      case 'billing': return CreditCard;
      default: return Info;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[1000]" onClick={onClose} />
      <div className="fixed top-20 right-4 md:right-24 w-full max-w-[340px] md:w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[1001] animate-in fade-in zoom-in slide-in-from-top-4 duration-200 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-[15px]">Notifications</h3>
            {notifications.some(n => !n.isRead) && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button 
                onClick={clearAll}
                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors group"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {dashboardLoading && notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-[13px] font-medium">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400 gap-4 px-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <BellOff className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 mb-1">No notifications yet</p>
                <p className="text-[12px] font-medium text-gray-500">We'll notify you when something important happens.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notif) => {
                const Icon = getIcon(notif.type);
                return (
                  <div 
                    key={notif._id} 
                    onClick={() => markAsRead(notif._id)}
                    className={`p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex gap-3 relative group ${!notif.isRead ? 'bg-blue-50/20' : ''}`}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8593C]"></div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'event' ? 'bg-blue-50 text-blue-500' : 
                      notif.type === 'billing' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={`text-[13px] font-bold text-gray-900 truncate ${!notif.isRead ? 'font-extrabold' : ''}`}>
                          {notif.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                          {formatRelativeTime(notif.createdAt)}
                        </p>
                      </div>
                      <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 flex items-center justify-between bg-gray-50/50 border-t border-gray-50">
            <button 
              onClick={markAllRead}
              className="text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Mark all as read
            </button>
            <button className="text-[12px] font-bold text-[#E8593C] hover:underline">
              View all
            </button>
          </div>
        )}
      </div>
    </>
  );
}
