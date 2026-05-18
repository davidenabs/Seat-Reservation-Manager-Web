import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { AuthLeftPanel } from '../components/auth/AuthLeftPanel';
import { toast } from 'sonner';

export default function UserResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error('Reset token is missing. Please request a new one.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await AuthService.resetPassword(token, newPassword);
            if (res.success) {
                toast.success('Password updated! Please log in.');
                navigate('/login');
            } else {
                toast.error(res.message || 'Update failed');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Token expired or unauthorized');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-white px-6 md:px-12 py-6 flex flex-col'>
            {/* Header / Logo */}
            <div className="pb-8 text-center lg:text-left">
                <Link to="/">
                    <img src="/tmas-logo-dark.png" alt="TMAS Logo" className="h-10 md:h-12 object-contain" />
                </Link>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Left Panel - Visual Storytelling */}
                <AuthLeftPanel />

                {/* Right Panel - Auth Content */}
                <div className="flex-1 flex flex-col items-center justify-center py-8">
                    <div className="w-full max-w-[460px]">
                        
                        {/* Page Heading */}
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="font-fraunces italic text-[36px] font-light leading-tight mb-2">
                                New password.
                            </h1>
                            <p className="text-gray-500 text-[15px]">
                                Choose a strong, secret password to protect your account.
                            </p>
                        </div>

                        {!token ? (
                            <div className="flex flex-col gap-6 text-center lg:text-left">
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[14px]">
                                    Reset token is missing or has expired.
                                </div>
                                <Link to="/forgot-password" global-link="true" className="w-full py-4 bg-[#E8593C] text-white font-medium text-center text-[15px] rounded-xl transition-all shadow-lg shadow-[#E8593C]/20 hover:bg-[#D14920]">
                                    Request New Link
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold tracking-[1px] text-gray-400 uppercase mb-2">
                                        NEW PASSWORD
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 focus:border-[#E8593C]/60 focus:ring-1 focus:ring-[#E8593C]/40 focus:outline-none transition-all placeholder:text-gray-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-[1px] text-gray-400 uppercase mb-2">
                                        CONFIRM NEW PASSWORD
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 focus:border-[#E8593C]/60 focus:ring-1 focus:ring-[#E8593C]/40 focus:outline-none transition-all placeholder:text-gray-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#E8593C] hover:bg-[#D14920] disabled:bg-[#E8593C]/50 disabled:cursor-not-allowed text-white font-medium text-[15px] rounded-xl transition-all shadow-lg shadow-[#E8593C]/20"
                                >
                                    {loading ? 'Saving...' : 'Update Password'}
                                </button>
                            </form>
                        )}

                        {/* Footer Links & Info */}
                        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secured with Encryption
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
