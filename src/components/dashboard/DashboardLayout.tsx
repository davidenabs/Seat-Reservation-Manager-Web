import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { SubscriptionService } from '../../services/subscriptionService';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationModal from './NotificationModal';
import ProfileModal from './ProfileModal';

interface DashboardContextType {
  user: any;
  subscription: any;
  loading: boolean;
  refreshStatus: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardLayout');
  return context;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchStatus = async (email: string) => {
    try {
      const res = await SubscriptionService.getStatus(email);
      if (res?.success && res?.data?.subscription) {
        setSubscription(res.data.subscription);
        if (res.data.subscription.status !== 'active') {
          navigate('/subscription');
        }
      } else {
        navigate('/subscription');
      }
    } catch (err) {
      console.error("Subscription status fetch failed:", err);
      navigate('/subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const profile = AuthService.getUserProfile();
    if (profile) {
      setUser(profile);
      fetchStatus(profile.email);
    } else {
      navigate('/login');
    }
  }, []);

  const refreshStatus = async () => {
    try {
      const res = await AuthService.getProfile();
      if (res?.success && res.data) {
        setUser(res.data);
        await fetchStatus(res.data.email);
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center font-sans">
        <div className="animate-pulse text-[#E8593C] tracking-[1px] font-medium">
          Loading membership space...
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ user, subscription, loading, refreshStatus }}>
      <div className="min-h-screen bg-[#F9FAFB] flex font-sans antialiased text-gray-900">
        <Sidebar 
          user={user} 
          subscription={subscription} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative">
          <TopBar
            user={user}
            onNotificationClick={() => setIsNotificationOpen(true)}
            onProfileClick={() => setIsProfileOpen(true)}
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {children}
        </main>

        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
        />
      </div>
    </DashboardContext.Provider>
  );
}
