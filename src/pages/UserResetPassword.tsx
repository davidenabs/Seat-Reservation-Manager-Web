import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import VirtualNavbar from '../components/VirtualNavbar';
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
        <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] antialiased font-sans relative overflow-hidden flex flex-col justify-center items-center pt-16">
            <VirtualNavbar />

            <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,_rgba(232,89,60,0.12)_0%,_transparent_60%)] pointer-events-none"></div>

            <div className="w-full max-w-[420px] px-6 py-12 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="font-fraunces italic font-light text-[38px] md:text-[46px] tracking-[-1.5px] text-white mb-2">
                        New Password
                    </h1>
                    <p className="text-[#8E8E93] text-[14px]">
                        Enter your new secret password below.
                    </p>
                </div>

                {!token ? (
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center">
                        <p className="text-[#E8593C] text-[14px] mb-6">
                            Missing authorization token.
                        </p>
                        <Link to="/forgot-password" data-testid="forgot-pwd-link-retry" className="inline-block text-[#E8593C] hover:underline font-medium">
                            Request Reset
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[12px] font-medium tracking-[0.5px] text-[#C9C9C4] mb-2">
                                NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:border-[#E8593C]/60 focus:ring-1 focus:ring-[#E8593C]/40 focus:outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-medium tracking-[0.5px] text-[#C9C9C4] mb-2">
                                CONFIRM NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:border-[#E8593C]/60 focus:ring-1 focus:ring-[#E8593C]/40 focus:outline-none transition-all"
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
            </div>
        </div>
    );
}
