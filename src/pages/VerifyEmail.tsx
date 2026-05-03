import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { toast } from 'sonner';
import { ROUTES } from '../config/route';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            toast.error('Email is missing');
            navigate(ROUTES.LOGIN);
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setLoading(true);
        try {
            const res = await AuthService.verifyEmail(email, code);
            if (res.success) {
                toast.success('Email verified successfully!');
                navigate(ROUTES.LOGIN);
            } else {
                toast.error(res.message || 'Verification failed');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        try {
            const res = await AuthService.resendOtp(email);
            if (res.success) {
                toast.success('Verification code resent!');
                setTimer(60);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend code');
        }
    };

    const formatEmail = (email: string) => {
        if (!email) return '';
        const [user, domain] = email.split('@');
        return `${user.substring(0, 3)}XXXX@${domain}`;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-12 px-6">
            <div className="mb-16">
                <Link to="/">
                    <img src="/tmas-logo-dark.png" alt="TMAS Logo" className="h-12 object-contain" />
                </Link>
            </div>

            <div className="w-full max-w-[500px] bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-100/50 p-10 md:p-14">
                <div className="text-center mb-10">
                    <h1 className="font-fraunces italic text-[32px] font-light mb-4">Check your Mail</h1>
                    <p className="text-gray-500 text-[15px] leading-relaxed">
                        We sent a 6-digit code to <span className="text-gray-900 font-medium">{formatEmail(email)}</span> Enter it below to verify your account.
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-8">
                    <div className="flex justify-between items-center gap-2 md:gap-3">
                        {otp.map((digit, idx) => (
                            <React.Fragment key={idx}>
                                <input
                                    ref={el => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={e => handleKeyDown(idx, e)}
                                    className="w-12 h-14 md:w-14 md:h-16 bg-[#F8F8F6] rounded-xl text-center text-[24px] font-semibold text-gray-900 focus:ring-2 focus:ring-[#E8593C]/20 outline-none transition-all"
                                />
                                {idx === 2 && <div className="w-4 h-[2px] bg-gray-200"></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#E8593C] hover:bg-[#D14920] disabled:bg-[#E8593C]/50 text-white font-semibold rounded-xl transition-all shadow-xl shadow-[#E8593C]/10 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                        {!loading && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </button>

                    <div className="text-center space-y-4">
                        <p className="text-[14px] text-gray-400">
                            Resend code in <span className="text-gray-900 font-bold">0:{timer < 10 ? `0${timer}` : timer}</span>
                        </p>

                        <div className="flex items-center justify-center gap-4 text-[13px] text-gray-400">
                            <span>Didn't get it?</span>
                            <button type="button" onClick={handleResend} disabled={timer > 0} className={`font-medium ${timer === 0 ? 'text-[#E8593C] hover:underline' : 'cursor-not-allowed'}`}>
                                Resend code
                            </button>
                            <span>·</span>
                            <Link to={ROUTES.REGISTER} className="font-medium text-gray-600 hover:text-[#E8593C]">Change email</Link>
                        </div>

                        <div className="pt-4">
                            <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-2 text-[14px] font-bold text-gray-900 hover:text-[#E8593C] transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}