import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { AuthService } from '../../../services/authService';
import { toast } from 'sonner';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function PasswordChangeModal({ isOpen, onClose, user }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  if (!isOpen) return null;

  // Google users cannot change password
  if (user?.authProvider === 'google') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] max-w-md w-full p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900"><X className="w-5 h-5" /></button>
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-2">Google Account</h3>
          <p className="text-gray-500 font-medium text-[15px] mb-8 leading-relaxed">
            Your account is managed via Google. To change your password, please visit your Google Account settings.
          </p>
          <button onClick={onClose} className="w-full bg-black py-4 rounded-2xl text-[15px] font-bold text-white">Got it</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully");
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err: any) {
      // toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-md w-full p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900"><X className="w-5 h-5" /></button>
        
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-gray-900" />
        </div>

        <h3 className="text-[24px] font-bold text-gray-900 mb-2">Change Password</h3>
        <p className="text-gray-500 font-medium text-[15px] mb-8">Secure your account with a new password</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                {showCurrent ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5"
                placeholder="At least 6 characters"
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                {showNew ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 ${confirmPassword && newPassword !== confirmPassword ? 'ring-red-100 ring-2' : 'focus:ring-black/5'}`}
              placeholder="Repeat your new password"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-4 rounded-2xl text-[15px] font-bold text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
