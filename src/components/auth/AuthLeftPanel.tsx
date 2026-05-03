import React from 'react';

export const AuthLeftPanel: React.FC = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 h-[calc(100vh-140px)] sticky top-10">
            <div className="relative w-full h-full rounded-[32px] overflow-hidden group">
                <img src="/auth-image.jpg" alt="Auth" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <h2 className="font-fraunces text-white text-[42px] leading-[1.1] font-light mb-4">
                        <span className="italic">Real</span> conversations.<br />
                        <span className="italic">Real</span> guests.<br />
                        <span className="text-[#E8593C] italic font-medium">Real-time.</span>
                    </h2>
                    <p className="text-white/70 text-[13px] tracking-[1.5px] font-semibold uppercase mb-8">JOIN 50k+ MEMBERS WATCHING LIVE</p>
                    <div className="flex gap-8 border-t border-white/20 pt-8">
                        <div><p className="text-white text-[28px] font-fraunces">46</p><p className="text-white/50 text-[10px] tracking-wider uppercase">Episodes</p></div>
                        <div><p className="text-white text-[28px] font-fraunces">80</p><p className="text-white/50 text-[10px] tracking-wider uppercase">Seats/Show</p></div>
                        <div><p className="text-white text-[28px] font-fraunces">₦6,500</p><p className="text-white/50 text-[10px] tracking-wider uppercase">Per Month</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
