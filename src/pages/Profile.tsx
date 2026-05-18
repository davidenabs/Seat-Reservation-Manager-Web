import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../components/dashboard/DashboardLayout';
import { AuthService } from '../services/authService';
import { NotificationService } from '../services/notificationService';
import { SubscriptionService } from '../services/subscriptionService';
import ProfileHeader from '../components/dashboard/profile/ProfileHeader';
import AccountDetails from '../components/dashboard/profile/AccountDetails';
import SubscriptionStatus from '../components/dashboard/profile/SubscriptionStatus';
import NotificationSettings from '../components/dashboard/profile/NotificationSettings';
import ProfileEditModal from '../components/dashboard/profile/ProfileEditModal';
import NotificationEditModal from '../components/dashboard/profile/NotificationEditModal';
import PasswordChangeModal from '../components/dashboard/profile/PasswordChangeModal';
import { SecuritySettings, DangerZone } from '../components/dashboard/profile/SecurityComponents';
import { toast } from 'sonner';
import { AlertTriangle, Info, CreditCard } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, subscription, refreshStatus } = useDashboard();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    type: 'delete' | 'cancel' | 'change_plan' | 'edit' | 'notifications' | 'password' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await NotificationService.getPreferences();
      if (res?.success) setPreferences(res.data);
    } catch (err) {
      console.error("Failed to fetch preferences:", err);
    }
  };

  // const handleUpdatePreference = async (key: string, value: string) => {
  //   const newValue = value.includes('Email') && value.includes('SMS') ? 'Email' : 'Email + SMS';
  //   try {
  //     const res = await NotificationService.updatePreferences({ [key]: newValue });
  //     if (res?.success) {
  //       toast.success("Notification preference updated");
  //       await fetchPreferences();
  //     }
  //   } catch (err) {
  //     toast.error("Failed to update preference");
  //   }
  // };

  const executeAction = async () => {
    setLoading(true);
    try {
      if (modalConfig.type === 'delete') {
        const res = await AuthService.deleteAccount();
        if (res?.success) {
          toast.success("Account deleted. Redirecting...");
          window.location.href = '/login';
        }
      } else if (modalConfig.type === 'cancel') {
        const res = await SubscriptionService.cancelSubscription();
        if (res?.success) {
          toast.success("Subscription cancelled successfully");
          await refreshStatus();
          setModalConfig({ type: null, isOpen: false });
        }
      } else if (modalConfig.type === 'change_plan') {
        navigate('/subscription');
      }
    } catch (err) {
      toast.error(`Action failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'delete' | 'cancel' | 'change_plan' | 'edit' | 'notifications' | 'password') => {
    setModalConfig({ type, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900">Profile</h2>
      </div>

      <ProfileHeader user={user} subscription={subscription} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AccountDetails
          user={user}
          onEdit={() => openModal('edit')}
        />

        <SubscriptionStatus
          subscription={subscription}
          onChangePlan={() => openModal('change_plan')}
          onCancel={() => openModal('cancel')}
        />

        <NotificationSettings
          preferences={preferences}
          onEdit={() => openModal('notifications')}
        />

        <div className="flex flex-col">
          <SecuritySettings onPasswordChange={() => openModal('password')} />
          <DangerZone onDeleteAccount={() => openModal('delete')} />
        </div>
      </div>

      {/* Dynamic Modals */}
      <Modal
        isOpen={modalConfig.isOpen && modalConfig.type === 'delete'}
        onClose={closeModal}
        title="Delete Account?"
        description="This action is permanent and cannot be undone. All your subscription data, attendance history, and preferences will be lost forever."
        icon={AlertTriangle}
        variant="danger"
        confirmLabel="Yes, delete my account"
        onConfirm={executeAction}
        loading={loading}
      />

      <Modal
        isOpen={modalConfig.isOpen && modalConfig.type === 'cancel'}
        onClose={closeModal}
        title="Cancel Subscription?"
        description="You will lose access to all member benefits at the end of your current billing cycle. Are you sure you want to proceed?"
        icon={Info}
        variant="info"
        confirmLabel="Yes, cancel subscription"
        onConfirm={executeAction}
        loading={loading}
      />

      <Modal
        isOpen={modalConfig.isOpen && modalConfig.type === 'change_plan'}
        onClose={closeModal}
        title="Change your plan?"
        description="You'll be redirected to our membership plans page to select a new tier. Your current plan will be clearly marked."
        icon={CreditCard}
        variant="info"
        confirmLabel="Continue to plans"
        onConfirm={executeAction}
        loading={loading}
      />

      <ProfileEditModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'edit'}
        onClose={closeModal}
        user={user}
        onSuccess={refreshStatus}
      />

      <NotificationEditModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'notifications'}
        onClose={closeModal}
        preferences={preferences}
        onSuccess={fetchPreferences}
      />

      <PasswordChangeModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'password'}
        onClose={closeModal}
        user={user}
      />
    </div>
  );
};

export default Profile;
