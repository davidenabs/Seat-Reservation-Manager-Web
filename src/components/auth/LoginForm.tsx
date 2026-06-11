import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { AuthService } from '../../services/authService';
import { ROUTES } from '../../config/route';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                toast.success('Welcome back!');
                navigate(ROUTES.MEMBER);
            } else {
                toast.error(res.message || 'Authentication failed');
            }
        } catch (err: any) {
            toast.error(err?.message || err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        try {
            const res = await AuthService.googleLogin(credentialResponse.credential!);
            if (res.success) {
                toast.success('Welcome back!');
                navigate(ROUTES.MEMBER);
            }
        } catch (err) {
            toast.error('Google login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#E8593C]/20 transition-all"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                    <Link to={ROUTES.FORGOT_PASSWORD} className="text-[11px] text-gray-400 hover:text-[#E8593C]">Forgot password?</Link>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#E8593C]/20"
                        placeholder="Your password"
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#E8593C] hover:bg-[#D14920] disabled:bg-[#E8593C]/50 text-white font-semibold rounded-xl transition-all shadow-xl shadow-[#E8593C]/10 flex items-center justify-center gap-2"
            >
                {loading ? 'Processing...' : 'Sign in'}
                {!loading && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
            </button>

            <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <span className="relative bg-white px-4 text-gray-400 text-[13px] font-medium">or</span>
            </div>

            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google failed')}
                    theme="outline" shape="pill" width="460px"
                />
            </div>
        </form>
    );
};
