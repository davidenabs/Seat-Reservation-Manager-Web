import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { AuthService } from '../../services/authService';
import { ROUTES } from '../../config/route';
import { PhoneInput } from './PhoneInput';
import { CountryDropdown } from './CountryDropdown';

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dialCode, setDialCode] = useState('+234');
    const [country, setCountry] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !phone || !country) {
            toast.error('Please fill out all fields');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (!agreeTerms) {
            toast.error('Please agree to the Terms of Service');
            return;
        }
        setLoading(true);
        try {
            const res = await AuthService.register({
                name,
                email,
                password,
                phone: `${dialCode}${phone}`,
                country
            });
            if (res.success) {
                toast.success('Registration successful! Please verify your email.');
                navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(res.message || 'Registration failed');
            }
        } catch (err: any) {
            toast.error(err?.message || err.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        try {
            const res = await AuthService.googleLogin(credentialResponse.credential!);
            if (res.success) {
                toast.success('Welcome!');
                navigate(ROUTES.MEMBER);
            }
        } catch (err) {
            toast.error('Google registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#E8593C]/20 transition-all"
                    placeholder="you@example.com"
                    required
                />
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

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#E8593C]/20"
                        placeholder="Create a strong password"
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`w-full bg-[#F8F8F6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 ${confirmPassword && password !== confirmPassword ? 'ring-red-100 ring-2' : 'focus:ring-[#E8593C]/20'}`}
                        placeholder="Repeat your password"
                        required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-gray-400">
                        {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                {confirmPassword && password !== confirmPassword && <p className="text-[11px] text-red-500 font-medium ml-1">Passwords do not match</p>}
            </div>

            <div className="flex items-start gap-3 py-1">
                <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#E8593C] focus:ring-[#E8593C]/20 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[13px] text-gray-500 cursor-pointer select-none leading-tight">
                    I agree to the <Link to="/terms" className="text-[#E8593C] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#E8593C] hover:underline">Privacy Policy</Link>
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#E8593C] hover:bg-[#D14920] disabled:bg-[#E8593C]/50 text-white font-semibold rounded-xl transition-all shadow-xl shadow-[#E8593C]/10 flex items-center justify-center gap-2"
            >
                {loading ? 'Processing...' : 'Create account'}
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
