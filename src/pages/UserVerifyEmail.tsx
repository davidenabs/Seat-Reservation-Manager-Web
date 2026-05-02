import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '../services/authService';
import VirtualNavbar from '../components/VirtualNavbar';
import { toast } from 'sonner';

export default function UserVerifyEmail() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. Token is missing.');
                return;
            }

            try {
                const res = await AuthService.verifyEmail(token);
                // Support returning data directly or via Axios wrapper
                const data = res.data || res;
                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                    toast.success('Email verified! You can now log in.');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed.');
                }
            } catch (err: any) {
                setStatus('error');
                const errMsg = err.response?.data?.message || 'Verification token expired or invalid.';
                setMessage(errMsg);
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] antialiased font-sans relative overflow-hidden flex flex-col justify-center items-center pt-16">
            <VirtualNavbar />

            <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,_rgba(232,89,60,0.12)_0%,_transparent_60%)] pointer-events-none"></div>

            <div className="w-full max-w-[420px] px-6 py-12 relative z-10 text-center">
                <h1 className="font-fraunces italic font-light text-[38px] md:text-[46px] tracking-[-1.5px] text-white mb-6">
                    Email Verification
                </h1>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4">
                            <svg className="animate-spin h-8 w-8 text-[#E8593C]" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <p className="text-[#8E8E93] text-[15px]">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-[#5DCAA5] text-[40px]">✓</div>
                            <p className="text-white text-[16px] font-medium">{message}</p>
                            <p className="text-[#8E8E93] text-[13px]">Redirecting to login...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-[#E8593C] text-[40px]">✕</div>
                            <p className="text-[#E8593C] text-[16px] font-medium">{message}</p>
                            <Link to="/register" className="mt-4 inline-block text-[#E8593C] hover:underline font-medium text-[14px]">
                                Back to Registration
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
