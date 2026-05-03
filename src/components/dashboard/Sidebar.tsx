import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../config/route';
import {
  Home,
  BookOpen,
  CreditCard,
  User,
  X
} from 'lucide-react';
import { getGravatarUrl } from '../../utils/user';

interface SidebarProps {
  user: any;
  subscription: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, subscription, isOpen, onClose }: SidebarProps) {
  const navLinks = [
    { to: ROUTES.MEMBER, label: 'Home', icon: Home },
    { to: '/resources', label: 'Resources', icon: BookOpen, badge: 3 },
    { to: ROUTES.TRANSACTIONS, label: 'Transactions', icon: CreditCard },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-[1001] transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-8 mb-4 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex flex-col items-center" onClick={onClose}>
            <img src="/tmas-logo-dark.png" alt="TMAS Logo" className="h-10 object-contain mb-1" />
            <div className="text-[10px] tracking-[2.5px] text-gray-400 font-medium">SHOW · MEMBER</div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                  ? 'bg-[#E8593C] text-white shadow-lg shadow-[#E8593C]/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[16px] ${isActive ? 'bg-white' : 'bg-[#F7F6F3]'}`}>
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-[#E8593C]' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-[14px] font-medium">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#E8593C]' : 'bg-[#E8593C] text-white'}`}>
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
              <img 
                src={getGravatarUrl(user?.email, 80)} 
                alt={user?.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-gray-900 truncate">
                {user?.name || 'Member'}
              </p>
              <p className="text-[11px] text-gray-500 capitalize">
                {subscription?.tier || 'Free'} · {subscription?.status || 'inactive'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
