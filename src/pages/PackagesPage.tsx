import { useQuery } from "@tanstack/react-query";
import { HallService } from "@/services/hallService";
import { SeasonalLanding } from "@/components/seasonal/SeasonalLanding";
import { useNavigate } from "react-router-dom";
import VirtualNavbar from "@/components/VirtualNavbar";
import { Button } from "@/components/ui/button";

export default function PackagesPage() {
  const navigate = useNavigate();

  const { data: halls, isLoading } = useQuery({
    queryKey: ["halls"],
    queryFn: () => HallService.getHalls(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
        <VirtualNavbar />
        <div className="min-h-[60vh] flex items-center justify-center font-serif text-xl text-gray-700">
          Loading festive season packages...
        </div>
      </div>
    );
  }

  // Find active hall with seasonal configuration enabled
  const seasonalHall = halls?.find((h) => h.isActive && h.seasonalConfig?.isEnabled);

  if (!seasonalHall) {
    return (
      <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
        <VirtualNavbar />
        <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 lg:p-20">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-3xl font-serif font-bold mb-3 text-black">No Active Seasonal Packages</h2>
            <p className="text-gray-600 mb-8 text-sm">
              There are currently no active seasonal packages available. You can explore our regular tour dates and book your seat below.
            </p>
            <Button
              onClick={() => navigate("/?e=standard")}
              className="px-8 py-5 rounded-full bg-[#E8593C] hover:bg-[#e05a0b] text-white font-medium text-sm transition-colors"
            >
              View Tour Schedule
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SeasonalLanding
      hall={seasonalHall}
      onSwitchToStandard={() => navigate("/?e=standard")}
    />
  );
}
