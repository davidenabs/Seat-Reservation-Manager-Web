import { X, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getGravatarUrl } from '../../utils/user';
import { ROUTES } from '../../config/route';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const navigate = useNavigate();
  const gravatarUrl = getGravatarUrl(user?.email, 120);

  if (!isOpen) return null;

  const handleLogout = () => {
    AuthService.logout();
    toast.success('Logged out successfully');
    navigate(ROUTES.LOGIN);
    onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: User, label: 'My Profile', desc: 'Account & security', path: ROUTES.PROFILE },
    { icon: CreditCard, label: 'Subscription', desc: 'Manage your plan', path: ROUTES.SUBSCRIPTION },
    { icon: Settings, label: 'Preferences', desc: 'Notification settings', path: ROUTES.PROFILE },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[1000]" onClick={onClose} />
      <div className="fixed top-20 right-8 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[1001] animate-in fade-in zoom-in slide-in-from-top-4 duration-200 overflow-hidden">
        <div className="p-6 text-center border-b border-gray-50 bg-gray-50/50 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white shadow-lg">
            <img src={gravatarUrl} alt={user?.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="font-bold text-gray-900 text-[16px]">{user?.name || 'Member'}</h3>
          <p className="text-[12px] text-gray-500 font-medium">{user?.email}</p>
        </div>

        <div className="p-2">
          {menuItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => handleNavigate(item.path)}
              className="w-full p-3 flex items-center gap-4 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-[#E8593C]">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-gray-900">{item.label}</p>
                <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-50/50 mt-2">
          <button 
            onClick={handleLogout}
            className="w-full p-3 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-500 rounded-2xl border border-gray-100 font-bold text-[13px] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
