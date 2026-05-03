import React from 'react';

interface AuthTabsProps {
    activeTab: 'login' | 'register';
    onTabChange: (tab: 'login' | 'register') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="mb-10 relative flex justify-center gap-16 border-b border-gray-100">
            <button 
                onClick={() => onTabChange('register')} 
                className={`pb-4 text-[15px] font-medium transition-colors ${activeTab === 'register' ? 'text-gray-900' : 'text-gray-400'}`}
            >
                Create account
            </button>
            <button 
                onClick={() => onTabChange('login')} 
                className={`pb-4 text-[15px] font-medium transition-colors ${activeTab === 'login' ? 'text-gray-900' : 'text-gray-400'}`}
            >
                Sign in
            </button>
            <div className={`absolute bottom-0 h-[2px] bg-[#E8593C] transition-all duration-300 ${
                activeTab === 'register' 
                    ? 'left-[calc(50%-145px)] w-[120px]' 
                    : 'left-[calc(50%+25px)] w-[80px]'
            }`} />
        </div>
    );
};
