import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import VirtualNavbar from '../components/VirtualNavbar';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

export default function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter your email and password');
            return;
        }

        setLoading(true);
        try {
            const res = await AuthService.login({ email, password });
            if (res.success) {
                toast.success('Welcome back to The Morayo Show!');
                // Check access next? Let's assume valid for now or route to trial subscription page if no tier
                navigate('/member');
            } else {
                toast.error(res.message || 'Authentication failed');
            }
        } catch (err: any) {
            if (err.response?.status === 403) {
                toast.error('Email verification required. Check your inbox.');
            } else {
                toast.error(err.response?.data?.message || 'Authentication failed securely');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] antialiased font-sans relative overflow-hidden flex flex-col justify-center items-center pt-16">
            <VirtualNavbar />

            {/* Background visual enhancements */}
            <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,_rgba(232,89,60,0.12)_0%,_transparent_60%)] pointer-events-none"></div>

            <div className="w-full max-w-[420px] px-6 py-12 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="font-fraunces italic font-light text-[38px] md:text-[46px] tracking-[-1.5px] text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-[#8E8E93] text-[14px]">
                        Please log in to continue streaming.
                    </p>
                </div>

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

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[12px] font-medium tracking-[0.5px] text-[#C9C9C4]">
                                PASSWORD
                            </label>
                            <Link to="/forgot-password" data-testid="forgot-pwd-link" className="text-[12px] text-[#E8593C] hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Log In'
                        )}
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10"></span>
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase tracking-[1px] font-semibold">
                            <span className="bg-[#0B0B0F] px-4 text-[#8E8E93]">OR CONTINUE WITH</span>
                        </div>
                    </div>

                    <div className="flex justify-center w-full">
                        <div className="w-full">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        setLoading(true);
                                        try {
                                            const res = await AuthService.googleLogin(credentialResponse.credential);
                                            if (res.success) {
                                                toast.success('Google Login successful!');
                                                navigate('/member');
                                            } else {
                                                toast.error(res.message || 'Google Login failed');
                                            }
                                        } catch (err: any) {
                                            toast.error(err.response?.data?.message || 'Google authentication failed');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                                onError={() => {
                                    toast.error('Google Login failed');
                                }}
                                theme="filled_black"
                                shape="pill"
                                width="372px" // Matches the container roughly
                            />
                        </div>
                    </div>
                </form>

                <div className="text-center mt-8 text-[14px] text-[#8E8E93]">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#E8593C] hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
