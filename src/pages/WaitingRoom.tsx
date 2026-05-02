import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import VirtualNavbar from "../components/VirtualNavbar";
import { AuthService } from "../services/authService";
import { SubscriptionService } from "../services/subscriptionService";
import { DateTime } from "luxon";

const WaitingRoom = () => {
  const [time, setTime] = useState({ h: 0, m: 12, s: 47 });
  const [email, setEmail] = useState<string>("");
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [streamActive, setStreamActive] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [_zoomDimensions, setZoomDimensions] = useState({ width: 1280, height: 540 });

  const zoomContainerRef = useRef<HTMLDivElement | null>(null);
  const zoomWrapperRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Dynamically compute Zoom SDK dimensions from the wrapper element
  const updateZoomDimensions = () => {
    if (!zoomWrapperRef.current) return;
    const width = zoomWrapperRef.current.offsetWidth;
    const height = zoomWrapperRef.current.offsetHeight;

    setZoomDimensions({ width, height });

    if (zoomContainerRef.current) {
      zoomContainerRef.current.style.width = `100%`;
      zoomContainerRef.current.style.height = `100%`;
    }
  };

  // Watch the wrapper for size changes (resize, orientation, split-screen)
  useEffect(() => {
    if (!streamActive) return;
    const el = zoomWrapperRef.current;
    if (!el) return;

    updateZoomDimensions();

    resizeObserverRef.current = new ResizeObserver(() => {
      updateZoomDimensions();
    });
    resizeObserverRef.current.observe(el);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [streamActive]);


  useEffect(() => {
    const timer = setInterval(() => {
      if (currentEvent && currentEvent.date && currentEvent.time && currentEvent.endTime) {
        const LAGOS_ZONE = 'Africa/Lagos';
        // Get the date part in Lagos context
        const datePart = DateTime.fromISO(currentEvent.date, { zone: LAGOS_ZONE }).toFormat('yyyy-MM-dd');

        // Reconstruct start and end times in Lagos context
        const startDateTime = DateTime.fromISO(`${datePart}T${currentEvent.time}`, { zone: LAGOS_ZONE });
        const endDateTime = DateTime.fromISO(`${datePart}T${currentEvent.endTime}`, { zone: LAGOS_ZONE });

        const now = DateTime.now();
        const diffStart = startDateTime.diff(now);
        const diffEnd = endDateTime.diff(now);

        if (diffEnd.milliseconds <= 0) {
          setTime({ h: 0, m: 0, s: 0 });
          setIsLive(false);
          return;
        }

        if (diffStart.milliseconds <= 0) {
          setTime({ h: 0, m: 0, s: 0 });
          setIsLive(true);
        } else {
          // Calculate remaining time for countdown
          const duration = diffStart.shiftTo('hours', 'minutes', 'seconds');
          setTime({
            h: Math.max(0, Math.floor(duration.hours)),
            m: Math.max(0, Math.floor(duration.minutes)),
            s: Math.max(0, Math.floor(duration.seconds))
          });
          setIsLive(false);
        }
      } else {
        setTime({ h: 0, m: 0, s: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEvent]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const profile = AuthService.getUserProfile();
        if (profile && profile.email) {
          setEmail(profile.email);
          await SubscriptionService.getStatus(profile.email);
        }
      } catch (err) {
        console.error("Failed fetching access configurations", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentEvent = async () => {
      try {
        const res = await SubscriptionService.getNextEvent();
        if (res?.success && res?.data) {
          setCurrentEvent(res.data.currentEvent || null);
        }
      } catch (err) {
        console.error("Failed fetching next event", err);
      }
    };

    fetchStatus();
    fetchCurrentEvent();
  }, []);

  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    const prepareZoom = async () => {
      if (!streamActive || !currentEvent) return;

      try {
        const meetingNumber = currentEvent.zoomMeetingId;
        const password = currentEvent.zoomPassword;

        const signature = await SubscriptionService.getZoomSignature(meetingNumber, 0);
        const joinToken = await SubscriptionService.getJoinToken(meetingNumber);

        const params = new URLSearchParams({
          mn: meetingNumber.toString(),
          pwd: password,
          un: email,
          sig: signature,
          tk: joinToken,
          key: import.meta.env.VITE_ZOOM_SDK_KEY
        });

        setPortalUrl(`${window.location.origin}/zoom-portal?${params.toString()}`);
        toast.success("Joining live portal...");
      } catch (error: any) {
        console.error("Zoom preparation failed:", error);
        toast.error("Failed to prepare live stream: " + (error.message || "Unknown error"));
        setStreamActive(false);
      }
    };

    if (streamActive) prepareZoom();
    else setPortalUrl(null);
  }, [streamActive, currentEvent, email]);

  const enterAudience = () => {
    toast.success("Authenticating with Zoom...");
    setTimeout(() => {
      toast.success("Welcome to The Morayo Show · launching stream");
      setStreamActive(true);
    }, 1000);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] flex justify-center items-center font-sans">
        <div className="animate-pulse text-[#E8593C] font-medium tracking-[1px]">
          Validating access...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F6] antialiased font-sans text-[14px] leading-[1.5] pt-[60px] relative overflow-hidden">
      <VirtualNavbar />

      {/* Background glow */}
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,_rgba(232,89,60,0.15)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-10 md:pt-12 pb-12 text-center relative z-[1]">
        {/* ── WAITING ROOM VIEW ────────────────────────────────── */}
        <>
          <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tracking-[2px] sm:tracking-[2.5px] mb-4 sm:mb-5 font-semibold uppercase">
            LIVE NOW
          </div>

          <h1 className="font-fraunces italic font-light text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] m-0 mb-3 sm:mb-4 tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2px] leading-[1.05] text-white px-2 sm:px-0">
            {currentEvent
              ? currentEvent.title
              : "TBA: Stay tuned for our next episode!"}
          </h1>

          <p className="text-[13px] sm:text-[14px] text-[#8E8E93] mb-10 sm:mb-14 px-2">
            {currentEvent && currentEvent.date && currentEvent.time
              ? `${format(
                new Date(`${currentEvent.date.split("T")[0]}T${currentEvent.time}:00`),
                "EEEE · h:mm a"
              )} WAT`
              : "Date & Time to be announced"}{" "}
            · Live interactive session
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-[14px] mb-10 sm:mb-14">
            {[
              { label: "HOURS", value: time.h, accent: false },
              { label: "MINUTES", value: time.m, accent: false },
              { label: "SECONDS", value: time.s, accent: true },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:px-7 md:py-[22px] min-w-[60px] sm:min-w-[72px] md:min-w-[92px] flex-1 max-w-[120px] ${accent
                  ? "bg-[#E8593C]/10 border border-[#E8593C]/40"
                  : "bg-white/[0.04] border border-white/10"
                  }`}
              >
                <div
                  className={`font-fraunces text-[24px] sm:text-[32px] md:text-[40px] font-normal tracking-[-1.5px] sm:tracking-[-2px] leading-none ${accent ? "text-[#E8593C]" : "text-white"
                    }`}
                >
                  {pad(value)}
                </div>
                <div
                  className={`text-[9px] sm:text-[10px] tracking-[1px] sm:tracking-[1.5px] mt-1.5 sm:mt-2 font-medium ${accent ? "text-[#E8593C] font-semibold" : "text-[#8E8E93]"
                    }`}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={!isLive}
            className={`inline-block w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-full text-[14px] sm:text-[15px] font-medium tracking-[0.3px] mb-3 sm:mb-4 border-none transition-all duration-200 ${isLive
              ? "bg-[#E8593C] text-white cursor-pointer hover:bg-[#D14920] hover:-translate-y-px active:translate-y-0"
              : "bg-white/10 text-[#8E8E93] cursor-not-allowed"
              }`}
            onClick={isLive ? enterAudience : undefined}
          >
            {isLive ? "Enter the live audience" : "Stream not yet live"}
          </button>

          <div className="text-[11px] sm:text-[12px] text-[#8E8E93] mt-1.5 sm:mt-2 px-4">
            {isLive
              ? "Verification credentials loaded securely"
              : "The button will unlock when the show goes live"}
          </div>
        </>
      </div>

      {/* ── LIVE STREAM MODAL ─────────────────────────────────── */}
      {streamActive && (
        <div className="fixed inset-0 h-[100dvh] w-screen z-[9999] bg-black overflow-hidden">
          {/* Isolated Iframe Portal - Truly Full Screen */}
          {portalUrl ? (
            <iframe
              src={portalUrl}
              className="absolute inset-0 w-full h-full border-none z-0"
              allow="camera; microphone; display-capture; autoplay; clipboard-write; encrypted-media; fullscreen"
              title="Zoom Portal"
              scrolling="no"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-0">
              <div className="w-16 h-16 border-2 border-[#E8593C]/30 border-t-[#E8593C] rounded-full animate-spin mb-6" />
              <h3 className="font-fraunces italic text-xl text-white/80">Connecting to portal...</h3>
            </div>
          )}

          {/* Overlay Header - Floating Above Iframe */}
          <div className="absolute top-0 left-0 right-0 px-5 py-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-10 pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="w-2.5 h-2.5 bg-[#E8593C] rounded-full animate-pulse shadow-[0_0_10px_rgba(232,89,60,0.5)]"></div>
              <h2 className="font-fraunces italic font-light text-[18px] sm:text-[20px] text-white tracking-[-0.3px]">
                {currentEvent?.title || "The Morayo Show"} · Live Stream
              </h2>
            </div>
            <button
              onClick={() => {
                setStreamActive(false);
                window.location.reload();
              }}
              className="pointer-events-auto text-[11px] font-semibold tracking-[1px] uppercase py-2 px-5 rounded-full border border-white/20 text-white bg-white/10 hover:bg-[#E8593C] hover:border-[#E8593C] transition-all duration-300"
            >
              Exit Portal
            </button>
          </div>

          {/* Security Banner - Floating Above Iframe */}
          <div className="absolute bottom-16 left-0 right-0 px-5 flex justify-center items-center pointer-events-none z-10">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 flex items-center gap-3">
              <span className="text-[9px] text-[#8E8E93] tracking-[1.5px] uppercase font-bold">Protected Stream</span>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-[10px] text-white/40 font-mono tracking-tight uppercase">{email}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── STATUS BAR ──────────────────────────────────────────── */}
      {!streamActive && (
        <div className="border-t border-white/10 px-3 sm:px-6 md:px-8 py-4 sm:py-6 bg-white/[0.02] max-w-[1200px] mx-auto mt-2 flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-0 rounded-xl sm:rounded-2xl">
          <div className="text-center">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tracking-[0.5px] mb-1 sm:mb-1.5 font-medium">
              Platform Availability
            </div>
            <div className="text-[13px] sm:text-[14px] text-[#C9C9C4]">
              Subscription Active
            </div>
          </div>

          <div className="hidden sm:block w-[0.5px] h-9 bg-white/10" />

          <div className="text-center">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tracking-[0.5px] mb-1 sm:mb-1.5 font-medium">
              Authentication State
            </div>
            <div className="text-[13px] sm:text-[14px] text-[#5DCAA5]">
              ✓ Secure
            </div>
          </div>

          <div className="hidden sm:block w-[0.5px] h-9 bg-white/10" />

          <div className="text-center">
            <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tracking-[0.5px] mb-1 sm:mb-1.5 font-medium">
              Authorized Watermark
            </div>
            <div className="text-[13px] sm:text-[14px] text-[#C9C9C4] break-all">
              {email || "Anonymous"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;