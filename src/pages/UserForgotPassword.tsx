import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { AuthLeftPanel } from '../components/auth/AuthLeftPanel';
import { toast } from 'sonner';

export default function UserForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email address is required');
            return;
        }

        setLoading(true);
        try {
            const res = await AuthService.forgotPassword(email);
            if (res.success) {
                toast.success('Password reset link sent securely!');
                setSent(true);
                setCountdown(60);
            } else {
                toast.error(res.message || 'Action failed');
            }
        } catch (err: any) {
            toast.error(err?.message || err?.message || err.response?.data?.message || 'Internal routing error');
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
                                {sent ? 'Check your inbox.' : 'Reset access.'}
                            </h1>
                            <p className="text-gray-500 text-[15px]">
                                {sent
                                    ? `We've emailed instructions to ${email}.`
                                    : 'Provide your account email below to recover your account.'}
                            </p>
                        </div>

                        {sent ? (
                            <div className="flex flex-col gap-4">
                                <Link to="/login" className="w-full py-4 bg-[#E8593C] text-white font-medium text-center text-[15px] rounded-xl transition-all shadow-lg shadow-[#E8593C]/20 hover:bg-[#D14920]">
                                    Back to Login
                                </Link>
                                <button
                                    onClick={() => setSent(false)}
                                    disabled={countdown > 0}
                                    className={`text-[14px] font-medium transition-colors ${countdown > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-[#E8593C]'}`}
                                >
                                    {countdown > 0 ? `Resend email in ${countdown}s` : "Didn't get the email? Try again"}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold tracking-[1px] text-gray-400 uppercase mb-2">
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 focus:border-[#E8593C]/60 focus:ring-1 focus:ring-[#E8593C]/40 focus:outline-none transition-all placeholder:text-gray-300"
                                        placeholder="jane@example.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || countdown > 0}
                                    className="w-full py-4 bg-[#E8593C] hover:bg-[#D14920] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium text-[15px] rounded-xl transition-all shadow-lg shadow-[#E8593C]/20"
                                >
                                    {loading ? 'Sending...' : countdown > 0 ? `Try again in ${countdown}s` : 'Send Reset Link'}
                                </button>

                                <div className="text-center lg:text-left">
                                    <Link to="/login" className="text-gray-400 hover:text-gray-600 text-[14px] font-medium">
                                        ← Back to Login
                                    </Link>
                                </div>
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
