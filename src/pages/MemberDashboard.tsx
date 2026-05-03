import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { SubscriptionService } from "../services/subscriptionService";
import { useDashboard } from "../components/dashboard/DashboardLayout";

// Home Components
import WelcomeHeader from "../components/dashboard/home/WelcomeHeader";
import FeaturedEventCard from "../components/dashboard/home/FeaturedEventCard";
import StatsGrid from "../components/dashboard/home/StatsGrid";
import UpcomingShowsList from "../components/dashboard/home/UpcomingShowsList";
import AdBanner from "../components/dashboard/home/AdBanner";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { user, subscription } = useDashboard();
  const [nextEvents, setNextEvents] = useState<any[]>([]);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const updateCountdown = useCallback(() => {
    if (!currentEvent || !currentEvent.date || !currentEvent.time) return;

    const LAGOS_ZONE = 'Africa/Lagos';
    const datePart = DateTime.fromISO(currentEvent.date, { zone: LAGOS_ZONE }).toFormat('yyyy-MM-dd');
    const target = DateTime.fromISO(`${datePart}T${currentEvent.time}`, { zone: LAGOS_ZONE });
    const now = DateTime.now().setZone(LAGOS_ZONE);

    const diff = target.diff(now, ['days', 'hours', 'minutes']);

    if (diff.as('milliseconds') <= 0) {
      setTimeLeft("LIVE NOW");
    } else {
      setTimeLeft(`${Math.floor(diff.days)}d ${Math.floor(diff.hours)}h`);
    }
  }, [currentEvent]);

  useEffect(() => {
    fetchNextEvent();
  }, []);

  useEffect(() => {
    const interval = setInterval(updateCountdown, 60000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [updateCountdown]);

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

  const formatEventTimeLong = (event: any) => {
    if (!event || !event.date || !event.time) return "Date & Time to be announced";
    const datePart = DateTime.fromISO(event.date, { zone: 'Africa/Lagos' }).toFormat('yyyy-MM-dd');
    const lagosDateTime = DateTime.fromISO(`${datePart}T${event.time}`, { zone: 'Africa/Lagos' });
    return lagosDateTime.setZone('local').toFormat('cccc, LLLL d · h:mm a ZZZZ');
  };

  const getGreeting = () => {
    const hour = DateTime.now().setZone('Africa/Lagos').hour;
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 md:p-8 flex-1">
      <WelcomeHeader user={user} getGreeting={getGreeting} />

      <div className="flex gap-8 items-start">
        <div className="flex-1 space-y-6">
          <FeaturedEventCard 
            currentEvent={currentEvent}
            timeLeft={timeLeft}
            subscription={subscription}
            formatEventTimeLong={formatEventTimeLong}
            onEnter={() => navigate('/waiting')}
          />

          <StatsGrid subscription={subscription} />

          <UpcomingShowsList nextEvents={nextEvents} />
        </div>

        <AdBanner />
      </div>
    </div>
  );
};

export default MemberDashboard;
