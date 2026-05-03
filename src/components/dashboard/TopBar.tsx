import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getGravatarUrl } from '../../utils/user';
import { ROUTES } from '../../config/route';

interface TopBarProps {
  user: any;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onMenuClick?: () => void;
}

export default function TopBar({ user, onNotificationClick, onProfileClick, onMenuClick }: TopBarProps) {
  const location = useLocation();
  const gravatarUrl = getGravatarUrl(user?.email, 80);

  const getHeaderInfo = () => {
    const path = location.pathname;
    const firstName = user?.name?.split(' ')[0] || 'Member';

    if (path === ROUTES.MEMBER) return { title: 'Home', desc: `Welcome back, ${firstName}` };
    if (path === ROUTES.RESOURCES) return { title: 'Resources', desc: 'Replays, reading lists, community' };
    if (path === ROUTES.TRANSACTIONS) return { title: 'Transactions', desc: 'Your billing and activity history' };
    if (path === ROUTES.PROFILE) return { title: 'Profile', desc: 'Your account & subscription' };
    if (path === ROUTES.SUBSCRIPTION) return { title: 'Membership', desc: 'Choose a plan that fits your lifestyle' };
    
    return { title: 'Dashboard', desc: 'Welcome to your member portal' };
  };

  const { title, desc } = getHeaderInfo();

  return (
    <header className="sticky top-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center z-[90]">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <h1 className="text-[14px] md:text-[16px] font-bold text-gray-900">{title}</h1>
          <p className="text-[11px] md:text-[13px] text-gray-400 font-medium">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile Avatar */}
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 transition-transform group-hover:scale-105">
            <img src={gravatarUrl} alt={user?.name} className="w-full h-full object-cover" />
          </div>
        </button>
      </div>
    </header>
  );
}
