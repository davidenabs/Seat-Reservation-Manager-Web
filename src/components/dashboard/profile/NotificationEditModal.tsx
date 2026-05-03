import React, { useState, useEffect } from 'react';
import { X, Loader2, Bell } from 'lucide-react';
import { NotificationService } from '../../../services/notificationService';
import { toast } from 'sonner';
import Toggle from '../../ui/Toggle';

interface NotificationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: any;
  onSuccess: () => void;
}

export default function NotificationEditModal({ isOpen, onClose, preferences, onSuccess }: NotificationEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [localPrefs, setLocalPrefs] = useState<any>({
    reminders: { email: true, sms: true, inApp: true },
    events: { email: true, sms: false, inApp: true },
    billing: { email: true, sms: true, inApp: true }
  });

  useEffect(() => {
    if (preferences && isOpen) {
      setLocalPrefs({
        reminders: preferences.reminders || { email: true, sms: true, inApp: true },
        events: preferences.events || { email: true, sms: false, inApp: true },
        billing: preferences.billing || { email: true, sms: true, inApp: true }
      });
    }
  }, [preferences, isOpen]);

  const handleToggle = (category: string, type: 'email' | 'sms' | 'inApp', value: boolean) => {
    setLocalPrefs({
      ...localPrefs,
      [category]: { ...localPrefs[category], [type]: value }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await NotificationService.updatePreferences(localPrefs);
      if (res.success) {
        toast.success("Preferences updated");
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { key: 'reminders', label: 'Show Reminders', desc: 'Get notified before your booked sessions start.' },
    { key: 'events', label: 'New Episodes', desc: 'Alerts when new show tapings are announced.' },
    { key: 'billing', label: 'Billing Alerts', desc: 'Important updates about your subscription.' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Bell className="w-8 h-8 text-gray-900" />
        </div>

        <h3 className="text-[24px] font-bold text-gray-900 mb-2">Notification Settings</h3>
        <p className="text-gray-500 font-medium text-[15px] mb-8">Choose how you want to be reached</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.key} className="flex flex-col gap-4">
                <div>
                  <h4 className="text-[15px] font-bold text-gray-900">{cat.label}</h4>
                  <p className="text-[13px] text-gray-400">{cat.desc}</p>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center gap-3">
                    <Toggle 
                      enabled={localPrefs[cat.key]?.email} 
                      onChange={(val) => handleToggle(cat.key, 'email', val)} 
                    />
                    <span className="text-[13px] font-medium text-gray-600">Email</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Toggle 
                      enabled={localPrefs[cat.key]?.sms} 
                      onChange={(val) => handleToggle(cat.key, 'sms', val)} 
                    />
                    <span className="text-[13px] font-medium text-gray-600">SMS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-4 rounded-2xl text-[15px] font-bold text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
