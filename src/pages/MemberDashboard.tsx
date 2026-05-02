import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import VirtualNavbar from "../components/VirtualNavbar";
import { AuthService } from "../services/authService";
import { SubscriptionService } from "../services/subscriptionService";
import type { ISubscription } from "@/intefaces/subscription";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<ISubscription | null>(null);
  const [nextEvents, setNextEvents] = useState<any[]>([]);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = AuthService.getUserProfile();
    if (profile) {
      setUser(profile);
      fetchStatus(profile.email);
      fetchNextEvent();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNextEvent = async () => {
    try {
      const res = await SubscriptionService.getNextEvent();
      if (res?.success && res.data) {
        setNextEvents(res.data.nextEvents || []);
        setCurrentEvent(res.data.currentEvent || null);
      }
    } catch (err) {
      console.error("Failed to fetch next event:", err);
    }
  };

  const fetchStatus = async (email: string) => {
    try {
      const res = await SubscriptionService.getStatus(email);
      if (res?.success && res?.data?.subscription) {
        setSubscription(res.data.subscription || res.data.data);
      }
    } catch (err) {
      console.error("Subscription status fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const url = subscription?.zoomJoinUrl || "N/A";
    if (url === "N/A") {
      toast.error("No Zoom URL available");
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Personal join link copied");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] flex justify-center items-center font-sans">
        <div className="animate-pulse text-[#E8593C] tracking-[1px] font-medium">
          Loading membership space...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
      <VirtualNavbar />

      <div className="max-w-[980px] mx-auto px-4 md:px-8 py-12 pb-20">
        <div className="mb-8">
          <div className="text-[12px] text-[#8E8E93] tracking-[0.3px] mb-2 font-medium">Welcome back</div>
          <h2 className="font-fraunces italic font-light text-[38px] m-0 text-white tracking-[-1px] leading-[1.1]">
            {user?.name || "Member"}, your seat is reserved.
          </h2>
        </div>

        {subscription?.status === "active" ? (
          <div className="bg-white/[0.02] border border-white/10 text-[#F4F4F6] rounded-[20px] p-6 md:p-8 mb-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-[radial-gradient(circle,_rgba(232,89,60,0.12)_0%,_transparent_70%)] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 md:gap-0 mb-7 relative z-1">
              <div>
                {(() => {
                  const hasEnded = currentEvent?.endTime && currentEvent?.date && 
                                   new Date().getTime() > new Date(`${currentEvent.date.split('T')[0]}T${currentEvent.endTime}:00`).getTime();
                  
                  return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full mb-4 ${hasEnded ? 'bg-white/10' : 'bg-[#E8593C]/15'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${hasEnded ? 'bg-[#8E8E93]' : 'bg-[#E8593C] animate-pulse'}`}></span>
                      <span className={`text-[10px] tracking-[1.2px] font-semibold ${hasEnded ? 'text-[#8E8E93]' : 'text-[#E8593C]'}`}>
                        {hasEnded ? 'EVENT ENDED' : 'NEXT LIVE'}
                      </span>
                    </div>
                  );
                })()}
                <h3 className="font-fraunces not-italic text-[24px] font-normal m-0 mb-2 tracking-[-0.5px] text-white">
                  {currentEvent ? currentEvent.title : "TBA: Stay tuned for our next episode!"}
                </h3>
                <div className="text-[13px] text-[#8E8E93]">
                  {currentEvent && currentEvent.date && currentEvent.time ? `${format(new Date(`${currentEvent.date.split('T')[0]}T${currentEvent.time}:00`), 'EEEE · h:mm a')} WAT` : "Date & Time to be announced"}
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 mb-4 relative z-1">
              <div className="text-[10px] text-[#8E8E93] tracking-[1.2px] mb-2 font-semibold">YOUR PERSONAL JOIN LINK</div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[12px] text-[#C9C9C4] overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                  {subscription.zoomJoinUrl || "Assigning single-use stream portal..."}
                </div>
                <div className="flex gap-2">
                  {(() => {
                    const now = new Date().getTime();
                    const datePart = currentEvent?.date?.split('T')[0];
                    const startTime = currentEvent?.time ? new Date(`${datePart}T${currentEvent.time}:00`).getTime() : 0;
                    const endTime = currentEvent?.endTime ? new Date(`${datePart}T${currentEvent.endTime}:00`).getTime() : 0;
                    const isLiveNow = currentEvent && now >= startTime && now < endTime;

                    return (
                      <>
                        {/* <button
                          className={`text-[11px] px-3 py-1.5 rounded-[7px] cursor-pointer select-none text-[#E8593C] border border-[#E8593C]/40 bg-transparent hover:bg-[#E8593C]/10 transition ${!isLiveNow ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                          onClick={copyLink}
                          disabled={!isLiveNow}
                        >
                          Copy
                        </button> */}
                        <button
                          className={`text-[11px] px-3 py-1.5 rounded-[7px] cursor-pointer select-none bg-[#E8593C] text-white border border-[#E8593C] hover:bg-[#D14920] transition ${!isLiveNow ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                          onClick={() => navigate('/waiting')}
                          disabled={!isLiveNow}
                        >
                          Open ↗
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[12px] text-[#8E8E93] relative z-1">
              <span className="w-[14px] h-[14px] border border-[#8E8E93] rounded-full inline-flex items-center justify-center text-[9px] flex-shrink-0">i</span>
              <span>Tied to your email — sharing won't work. Sign in with <strong>{user?.email}</strong> to join.</span>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/10 rounded-[20px] p-6 md:p-8 mb-6 text-center">
            <h3 className="font-fraunces italic text-[24px] font-normal mb-2 text-white">
              Access Gateway Paused
            </h3>
            <p className="text-[#8E8E93] max-w-[480px] mx-auto mb-6 text-[14px]">
              You do not have an active stream tier. Access immediate interactive features by subscribing safely.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="px-12 py-4 bg-[#E8593C] hover:bg-[#D14920] text-white font-medium rounded-full transition shadow-lg shadow-[#E8593C]/20"
            >
              Subscribe / Enable Stream
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          <div className="bg-white/[0.02] border border-white/10 rounded-[14px] p-[18px]">
            <div className="text-[11px] text-[#8E8E93] tracking-[0.5px] mb-2.5 font-medium">TIER STATUS</div>
            <div className="flex items-center gap-2 text-[16px] text-white font-medium mb-1">
              <span className={`w-[7px] h-[7px] rounded-full ${subscription?.status === 'active' ? 'bg-[#5DCAA5]' : 'bg-[#E8593C]'}`}></span>
              <span className="capitalize">{subscription?.status || 'Inactive'}</span>
            </div>
            <div className="text-[11px] text-[#8E8E93] font-medium uppercase">{subscription?.tier || 'None'}</div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-[14px] p-[18px]">
            <div className="text-[11px] text-[#8E8E93] tracking-[0.5px] mb-2.5 font-medium">SHOW ATTENDED</div>
            <div className="flex items-center gap-2 text-[16px] text-white font-medium mb-1">
              12 <span className="text-[12px] text-[#8E8E93] font-normal">this season
              </span>
            </div>
            <div className="text-[11px] text-[#8E8E93] font-medium">3-show streak · keep going
            </div>
          </div>
        </div>

        <div>
          {nextEvents.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <div className="text-[14px] text-white font-medium">Upcoming this month</div>
              </div>

              {nextEvents.map((event, idx) => (
                <div key={event.id || idx} className="bg-white/[0.02] border border-white/10 rounded-[12px] p-4 flex items-center justify-between transition-all duration-200 cursor-pointer hover:border-[#8E8E93] hover:translate-x-[2px] mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[10px] flex flex-col items-center justify-center shrink-0 bg-[#E8593C]/10">
                      <div className="text-[9px] tracking-[0.5px] font-medium text-[#E8593C]">
                        {format(new Date(event.date), 'MMM').toUpperCase()}
                      </div>
                      <div className="text-[18px] font-medium leading-none mt-[2px] text-[#E8593C]">
                        {format(new Date(event.date), 'dd')}
                      </div>
                    </div>
                    <div>
                      <div className="text-[14px] text-white mb-[3px] font-medium">
                        {event.title}
                      </div>
                      <div className="text-[12px] text-[#8E8E93]">
                        {`${format(new Date(`${event.date.split('T')[0]}T${event.time}:00`), 'EEE · h:mm a')} WAT`} · {event.availableSeats || 0} seats
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] py-[5px] px-[11px] rounded-full inline-flex items-center gap-[6px] whitespace-nowrap bg-[#5DCAA5]/10 text-[#5DCAA5]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#5DCAA5]"></span>
                    Registered
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
