import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import VirtualNavbar from "../components/VirtualNavbar";

import { useState, useEffect } from "react";
import { AuthService } from "../services/authService";
import { SubscriptionService } from "../services/subscriptionService";

const Subscription = () => {
  const navigate = useNavigate();
  const [_loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  const isPaused = true; // Set to true to show the paused state

  // if the url has redirect=dashboard, and  redirect to dashboard after successful payment
  // const urlParams = new URLSearchParams(window.location.search);
  // const redirect = urlParams.get('redirect');

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      const user = AuthService.getUserProfile();
      if (user) {
        try {
          const res = await SubscriptionService.getStatus(user.email);
          if (res?.success && res.data?.subscription) {
            setCurrentTier(res.data.subscription.tier);
          }
          // if (redirect === 'dashboard') {
          //   // toast.success(`Payment successful`);
          //   navigate('/member');
          // }
        } catch (err) {
          console.error("Failed to fetch current plan:", err);
        }
      }
    };
    fetchCurrentPlan();
  }, []);

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
        response = await SubscriptionService.initializeFlutterwave(user.email, user.id, plan, timezone);
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
    <div className=" bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5]">
      <VirtualNavbar />

      <div className="px-8 pt-24 pb-12 text-center relative">
        <div className="inline-flex items-center gap-2 px-[14px] py-1.5 bg-[#E8593C]/8 border border-[#E8593C]/20 rounded-full mb-7">
          <span className="w-1.5 h-1.5 bg-morayo-coral rounded-full animate-pulse"></span>
          <span className="text-[12px] text-[#993C1D] tracking-[0.3px]">Season 4 — virtual audience now open</span>
        </div>
        <h1 className="font-fraunces italic font-light text-[44px] md:text-[72px] leading-none m-0 mb-5 text-morayo-ink tracking-[-1.5px] md:tracking-[-2.5px]">
          Your seat <span className="text-morayo-coral italic"><br />in the room.</span>
        </h1>
        <p className="text-[16px] text-morayo-muted max-w-[460px] mx-auto mb-10 leading-[1.6]">
          Join the live taping of The Morayo Show from anywhere in the world. Real conversations, real guests, real-time.
        </p>

        {!isPaused && (
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
        )}
      </div>

      <div className="max-w-[980px] mx-auto px-4 md:px-8 pb-20">
        {isPaused ? (
          <div className="bg-morayo-surface border border-morayo-hairline rounded-[24px] p-10 md:p-16 text-center max-w-2xl mx-auto shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-morayo-coral to-[#E8593C]"></div>
            <div className="w-16 h-16 bg-[#E8593C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-morayo-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-fraunces text-3xl md:text-4xl text-morayo-ink mb-4 font-light tracking-tight">Subscriptions Paused</h2>
            <p className="text-morayo-muted text-[16px] leading-relaxed mb-8">
              Our virtual audience subscription service is temporarily on hold. We are preparing something special and will be reopening very soon. Thank you for your patience!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-morayo-ink text-white rounded-full text-[13px] font-medium hover:bg-opacity-90 transition-colors"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Weekly Plan */}
          <div
            className={`bg-morayo-surface border border-morayo-hairline rounded-[18px] px-7 py-8 relative transition-all duration-250 ease-in-out cursor-pointer ${currentTier?.startsWith('weekly')
                ? 'opacity-50 grayscale-[0.5] pointer-events-none'
                : 'hover:border-morayo-ink hover:-translate-y-0.5'
              }`}
            onClick={() => selectPlan('weekly')}
          >
            {currentTier?.startsWith('weekly') && (
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[10px] px-3 py-[5px] rounded-full tracking-[1.2px] font-medium">
                CURRENT PLAN
              </div>
            )}
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
            className={`bg-morayo-surface border-[1.5px] border-morayo-crimson rounded-[18px] px-7 py-8 relative transition-all duration-250 ease-in-out cursor-pointer ${currentTier?.startsWith('monthly')
                ? 'opacity-50 grayscale-[0.5] pointer-events-none'
                : 'hover:-translate-y-0.5'
              }`}
            onClick={() => selectPlan('monthly')}
          >
            {currentTier?.startsWith('monthly') ? (
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[10px] px-3 py-[5px] rounded-full tracking-[1.2px] font-medium">
                CURRENT PLAN
              </div>
            ) : (
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-morayo-crimson text-white text-[10px] px-3 py-[5px] rounded-full tracking-[1.2px] font-medium">
                MOST POPULAR
              </div>
            )}
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
            className={`bg-morayo-surface border border-morayo-hairline rounded-[18px] px-7 py-8 relative transition-all duration-250 ease-in-out cursor-pointer ${currentTier?.startsWith('annual')
                ? 'opacity-50 grayscale-[0.5] pointer-events-none'
                : 'hover:border-morayo-ink hover:-translate-y-0.5'
              }`}
            onClick={() => selectPlan('annual')}
          >
            {currentTier?.startsWith('annual') && (
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[10px] px-3 py-[5px] rounded-full tracking-[1.2px] font-medium">
                CURRENT PLAN
              </div>
            )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Subscription;
