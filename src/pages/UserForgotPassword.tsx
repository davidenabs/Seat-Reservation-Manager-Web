import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import VirtualNavbar from '../components/VirtualNavbar';
import { toast } from 'sonner';

export default function UserForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

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
            } else {
                toast.error(res.message || 'Action failed');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Internal routing error');
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
                        Reset Access
                    </h1>
                    <p className="text-[#8E8E93] text-[14px]">
                        Provide your account email below.
                    </p>
                </div>

                {sent ? (
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center">
                        <div className="text-[#5DCAA5] text-[40px] mb-4">✓</div>
                        <h3 className="text-[18px] font-medium mb-2">Email Sent</h3>
                        <p className="text-[#8E8E93] text-[14px] mb-6">
                            We've emailed instructions to <strong>{email}</strong>.
                        </p>
                        <Link to="/login" className="inline-block text-[#E8593C] hover:underline font-medium">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[12px] font-medium tracking-[0.5px] text-[#C9C9C4] mb-2">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white focus:border-[#E8593C]/60 focus:ring-1 focus:ring-[#E8593C]/40 focus:outline-none transition-all"
                                placeholder="jane@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#E8593C] hover:bg-[#D14920] disabled:bg-[#E8593C]/50 disabled:cursor-not-allowed text-white font-medium text-[15px] rounded-xl transition-all shadow-lg shadow-[#E8593C]/20"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {!sent && (
                    <div className="text-center mt-8 text-[14px] text-[#8E8E93]">
                        Remember your password?{' '}
                        <Link to="/login" className="text-[#E8593C] hover:underline font-medium">
                            Log in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
