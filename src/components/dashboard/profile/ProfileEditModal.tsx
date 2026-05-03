import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { PhoneInput } from '../../auth/PhoneInput';
import { CountryDropdown } from '../../auth/CountryDropdown';
import { AuthService } from '../../../services/authService';
import { toast } from 'sonner';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export default function ProfileEditModal({ isOpen, onClose, user, onSuccess }: ProfileEditModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+234');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setCountry(user.country || 'Nigeria');
      
      // Parse phone if possible
      const rawPhone = user.phone || '';
      if (rawPhone.startsWith('+')) {
        // Simple heuristic: find dial code in countries list
        // This is a bit naive but works for display
        setPhone(rawPhone.slice(4)); // fallback
        setDialCode(rawPhone.slice(0, 4));
      } else {
        setPhone(rawPhone);
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthService.updateProfile({
        name,
        phone: `${dialCode}${phone}`,
        country
      });
      if (res.success) {
        toast.success("Profile updated successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-[24px] font-bold text-gray-900 mb-2">Edit Details</h3>
        <p className="text-gray-500 font-medium text-[15px] mb-8">Update your personal information</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#E8593C]/20 transition-all"
              placeholder="First Name Last Name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none opacity-50 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 ml-1">Email cannot be changed</p>
          </div>

          <PhoneInput
            value={phone}
            onChange={setPhone}
            dialCode={dialCode}
            onDialCodeChange={setDialCode}
          />

          <CountryDropdown
            value={country}
            onChange={setCountry}
            onDialCodeChange={setDialCode}
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black py-4 rounded-2xl text-[15px] font-bold text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
