import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { SubscriptionService } from '../../services/subscriptionService';
import { NotificationService } from '../../services/notificationService';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationModal from './NotificationModal';
import ProfileModal from './ProfileModal';

interface DashboardContextType {
  user: any;
  subscription: any;
  loading: boolean;
  refreshStatus: () => Promise<void>;
  notifications: any[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
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
  
  // Notification states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollingInterval = useRef<any>(null);

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

  const fetchNotifications = async () => {
    try {
      const res = await NotificationService.getNotifications({ limit: 10 });
      if (res.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await NotificationService.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const clearAll = async () => {
    try {
      const res = await NotificationService.clearAll();
      if (res.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to clear all:", err);
    }
  };

  useEffect(() => {
    const profile = AuthService.getUserProfile();
    if (profile) {
      setUser(profile);
      fetchStatus(profile.email);
      fetchNotifications();
      
      // Background polling every 5 minutes
      pollingInterval.current = setInterval(fetchNotifications, 5 * 60 * 1000);
    } else {
      navigate('/login');
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const refreshStatus = async () => {
    try {
      const res = await AuthService.getProfile();
      if (res?.success && res.data) {
        setUser(res.data);
        await fetchStatus(res.data.email);
        await fetchNotifications();
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
    <DashboardContext.Provider value={{ 
      user, 
      subscription, 
      loading, 
      refreshStatus,
      notifications,
      unreadCount,
      markAllRead,
      markAsRead,
      clearAll,
      fetchNotifications
    }}>
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
