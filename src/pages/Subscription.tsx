import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import VirtualNavbar from "../components/VirtualNavbar";

import { useState } from "react";
import { AuthService } from "../services/authService";
import { SubscriptionService } from "../services/subscriptionService";

const Subscription = () => {
  const navigate = useNavigate();
  const [_loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  const selectPlan = async (plan: string) => {
    const user = AuthService.getUserProfile();
    if (!user) {
        toast.error("Please log in to subscribe");
        navigate('/login');
        return;
    }

    setLoading(true);
    toast.loading(`Initializing secure checkout...`, { id: 'payment-toast' });

    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let response;
        if (currency === 'NGN') {
            response = await SubscriptionService.initializePaystack(user.email, user.id, plan, timezone);
        } else {
            response = await SubscriptionService.initializeStripe(user.email, user.id, plan, timezone);
        }
        
        if (response.success && response.data) {
            toast.success(`Redirecting to payment gateway...`, { id: 'payment-toast' });
            // Redirect to Stripe Checkout or Paystack URL
            const redirectUrl = response.data.authorizationUrl || response.data.url;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                toast.error("Failed to retrieve checkout session", { id: 'payment-toast' });
            }
        } else {
            toast.error(response.message || "Payment initialization failed", { id: 'payment-toast' });
            setLoading(false);
        }
    } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
            // User already has this plan active — send them to their dashboard
            toast.error(message || "You already have this plan active.", { id: 'payment-toast' });
            setTimeout(() => navigate('/member'), 1500);
        } else {
            toast.error(message || "An error occurred during checkout initialization", { id: 'payment-toast' });
        }
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
      <VirtualNavbar />

      <div className="px-8 pt-24 pb-12 text-center relative">
        <div className="inline-flex items-center gap-2 px-[14px] py-1.5 bg-[#E8593C]/8 border border-[#E8593C]/20 rounded-full mb-7">
          <span className="w-1.5 h-1.5 bg-morayo-coral rounded-full animate-pulse"></span>
          <span className="text-[12px] text-[#993C1D] tracking-[0.3px]">Season 4 — virtual audience now open</span>
        </div>
        <h1 className="font-fraunces italic font-light text-[44px] md:text-[72px] leading-none m-0 mb-5 text-morayo-ink tracking-[-1.5px] md:tracking-[-2.5px]">
          A seat <span className="text-morayo-coral italic">in the room.</span>
        </h1>
        <p className="text-[16px] text-morayo-muted max-w-[460px] mx-auto mb-10 leading-[1.6]">
          Join the live taping of The Morayo Show from anywhere in the world. Real conversations, real guests, real-time.
        </p>

        <div className="flex justify-center mb-10">
            <div className="inline-flex bg-morayo-surface border border-morayo-hairline rounded-full p-1">
                <button 
                    onClick={() => setCurrency('NGN')}
                    className={`px-6 py-2 rounded-full text-[13px] font-medium transition-all ${currency === 'NGN' ? 'bg-morayo-ink text-white shadow-md' : 'text-morayo-muted hover:text-morayo-ink'}`}
                >
                    NGN (₦)
                </button>
                <button 
                    onClick={() => setCurrency('USD')}
                    className={`px-6 py-2 rounded-full text-[13px] font-medium transition-all ${currency === 'USD' ? 'bg-morayo-ink text-white shadow-md' : 'text-morayo-muted hover:text-morayo-ink'}`}
                >
                    USD ($)
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-[980px] mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Weekly Plan */}
          <div 
            className="bg-morayo-surface border border-morayo-hairline rounded-[18px] px-7 py-8 relative transition-all duration-250 ease-in-out cursor-pointer hover:border-morayo-ink hover:-translate-y-0.5"
            onClick={() => selectPlan('weekly')}
          >
            <div className="text-[11px] text-morayo-muted-2 tracking-[1.8px] mb-[18px] font-medium">WEEKLY</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-fraunces not-italic text-[44px] text-morayo-ink font-normal tracking-[-2px] leading-none">
                {currency === 'NGN' ? '₦2.5k' : '$2'}
              </span>
              <span className="text-[13px] text-morayo-muted-2">/ week</span>
            </div>
            <div className="text-[13px] text-morayo-muted-2 mb-6">Billed weekly</div>
            <div className="h-[0.5px] bg-morayo-hairline my-5"></div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-muted-2 rounded-full"></span> One live show access
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-muted-2 rounded-full"></span> Cancel anytime
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-muted-2 rounded-full"></span> Email reminders
            </div>
            <div className="mt-7 p-3 text-center border border-morayo-ink rounded-xl text-[13px] text-morayo-ink font-medium cursor-pointer transition-all duration-200 select-none hover:bg-morayo-ink hover:text-white">
              Choose weekly
            </div>
          </div>

          {/* Monthly Plan (Featured) */}
          <div 
            className="bg-morayo-surface border-[1.5px] border-morayo-crimson rounded-[18px] px-7 py-8 relative transition-all duration-250 ease-in-out cursor-pointer hover:-translate-y-0.5"
            onClick={() => selectPlan('monthly')}
          >
            <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-morayo-crimson text-white text-[10px] px-3 py-[5px] rounded-full tracking-[1.2px] font-medium">
              MOST POPULAR
            </div>
            <div className="text-[11px] text-morayo-crimson tracking-[1.8px] mb-[18px] font-medium">MONTHLY</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-fraunces not-italic text-[44px] text-morayo-ink font-normal tracking-[-2px] leading-none">
                {currency === 'NGN' ? '₦6.5k' : '$5'}
              </span>
              <span className="text-[13px] text-morayo-muted-2">/ month</span>
            </div>
            <div className="text-[13px] text-morayo-muted-2 mb-6">Billed monthly</div>
            <div className="h-[0.5px] bg-morayo-hairline my-5"></div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-crimson rounded-full"></span> All live shows monthly
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-crimson rounded-full"></span> Replay archive access
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-crimson rounded-full"></span> Member-only Q&amp;A
            </div>
            <div className="mt-7 p-3 text-center bg-morayo-crimson border border-morayo-crimson text-white rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 select-none hover:bg-morayo-crimson-deep hover:border-morayo-crimson-deep">
              Choose monthly
            </div>
          </div>

          {/* Annual Plan */}
          <div 
            className="bg-morayo-surface border border-morayo-hairline rounded-[18px] px-7 py-8 relative transition-all duration-250 ease-in-out cursor-pointer hover:border-morayo-ink hover:-translate-y-0.5"
            onClick={() => selectPlan('annual')}
          >
            <div className="text-[11px] text-morayo-muted-2 tracking-[1.8px] mb-[18px] font-medium">ANNUAL</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-fraunces not-italic text-[44px] text-morayo-ink font-normal tracking-[-2px] leading-none">
                {currency === 'NGN' ? '₦70k' : '$50'}
              </span>
              <span className="text-[13px] text-morayo-muted-2">/ year</span>
            </div>
            <div className="text-[13px] text-morayo-muted-2 mb-6">Billed annually</div>
            <div className="h-[0.5px] bg-morayo-hairline my-5"></div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-muted-2 rounded-full"></span> Everything in monthly
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-muted-2 rounded-full"></span> Save 16% annually
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-morayo-ink-2 mb-3">
              <span className="w-1 h-1 bg-morayo-muted-2 rounded-full"></span> Priority seat allocation
            </div>
            <div className="mt-7 p-3 text-center border border-morayo-ink rounded-xl text-[13px] text-morayo-ink font-medium cursor-pointer transition-all duration-200 select-none hover:bg-morayo-ink hover:text-white">
              Choose annual
            </div>
          </div>

        </div>
        <div className="text-center mt-8 text-[12px] text-morayo-muted-2">
          Pricing auto-detected by region · Secured by Paystack &amp; Stripe
        </div>
      </div>
    </div>
  );
};

export default Subscription;
