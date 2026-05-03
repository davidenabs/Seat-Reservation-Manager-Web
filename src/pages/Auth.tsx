import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../config/route';
import { AuthLeftPanel } from '../components/auth/AuthLeftPanel';
import { AuthTabs } from '../components/auth/AuthTabs';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export default function Auth() {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'login' | 'register'>(
        location.pathname === ROUTES.REGISTER ? 'register' : 'login'
    );

    // Update active tab based on route changes
    useEffect(() => {
        if (location.pathname === ROUTES.REGISTER) {
            setActiveTab('register');
        } else {
            setActiveTab('login');
        }
    }, [location.pathname]);

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        navigate(tab === 'register' ? ROUTES.REGISTER : ROUTES.LOGIN);
    };

    return (
        <div className='min-h-screen bg-white px-6 md:px-12 py-6 flex flex-col'>
            {/* Header / Logo */}
            <div className="pb-8">
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
                        {/* Tab Navigation */}
                        <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

                        {/* Page Heading */}
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="font-fraunces italic text-[36px] font-light leading-tight mb-2">
                                {activeTab === 'login' ? 'Welcome back.' : 'Join the show.'}
                            </h1>
                            <p className="text-gray-500 text-[15px]">
                                {activeTab === 'login'
                                    ? 'Sign in to access your shows.'
                                    : 'Create your account to access live episodes.'}
                            </p>
                        </div>

                        {/* Special Registration Indicator */}
                        {activeTab === 'register' && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8593C]/5 border border-[#E8593C]/10 rounded-full mb-8">
                                <span className="text-[12px] text-[#993C1D] font-medium">⭐ Monthly plan · ₦6,500/mo</span>
                            </div>
                        )}

                        {/* Forms */}
                        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}

                        {/* Footer Links & Info */}
                        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secured with Encryption
                            </div>
                            <div className="flex gap-6 text-gray-400 text-[12px] font-medium">
                                <Link to="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-gray-600">Terms</Link>
                                <Link to="/help" className="hover:text-gray-600">Help</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
