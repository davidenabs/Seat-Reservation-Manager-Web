import { useQuery } from "@tanstack/react-query";
import { HallService } from "@/services/hallService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import VirtualNavbar from "@/components/VirtualNavbar";
import { SeasonalLanding } from "@/components/seasonal/SeasonalLanding";
import { Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

const HomePage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const eventParam = searchParams.get("e");

    const { data: halls, isLoading } = useQuery({
        queryKey: ["halls"],
        queryFn: () => HallService.getHalls(),
    });


    const seasonalHall = halls?.find((h) => h.isActive && h.seasonalConfig?.isEnabled);

    // By default, the standard schedule is active.
    // The festive landing page is shown only when ?e=festive (or ?e=seasonal).
    const showSeasonal = !isLoading && !!seasonalHall && (eventParam === "festive" || eventParam === "seasonal");

    const handleSwitchToStandard = () => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("e", "standard");
            return next;
        });
    };

    const handleSwitchToFestive = () => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("e", "festive");
            return next;
        });
    };

    // const scrollToTours = () => {
    //     const el = document.getElementById("tours");
    //     if (el) {
    //         el.scrollIntoView({ behavior: "smooth" });
    //     }
    // };

    // If seasonal mode is enabled and user hasn't explicitly clicked to view standard schedule,
    // render the seasonal landing page replacing the homepage!
    if (showSeasonal) {
        return (
            <SeasonalLanding
                hall={seasonalHall}
                onSwitchToStandard={handleSwitchToStandard}
            />
        );
    }

    const formatDateRange = (openDate?: string | Date, closeDate?: string | Date) => {
        if (!openDate || !closeDate) return "Dates TBD";
        const start = openDate instanceof Date ? openDate : new Date(openDate);
        const end = closeDate instanceof Date ? closeDate : new Date(closeDate);

        const startMonth = format(start, "MMMM");
        const endMonth = format(end, "MMMM");

        if (startMonth === endMonth) {
            return `${format(start, "MMMM do")} - ${format(end, "do")}`;
        }
        return `${format(start, "MMMM do")} - ${format(end, "MMMM do")}`;
    };

    return (
        <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt60px]">
             {/* Top Announcement Bar when Festive Season is live */}
            {seasonalHall && (
                <div className="bg-[#FFF4F0] border-b border-[#FCD8CF] px-6 py-2.5 text-xs text-gray-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#E8593C]" />
                        <span>Festive Season Packages are Live! Special packages for Individuals, Couples, and Companies with VIP perks.</span>
                    </div>
                    <button
                        onClick={handleSwitchToFestive}
                        className="text-xs font-semibold text-[#E8593C] hover:underline flex items-center gap-1 shrink-0"
                    >
                        View Festive Packages →
                    </button>
                </div>
            )}

            <VirtualNavbar />
            <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 lg:p-20">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
                            The Morayo Show Tour
                        </h1>
                        <p className="text-base text-gray-700 max-w-3xl leading-relaxed">
                            Experience The Morayo Show live as it brings compelling conversations, inspiring guests, and unforgettable moments to audiences in Lagos, Abuja, Ibadan and Many more.
                        </p>
                    </header>

                    {isLoading ? (
                        <div className="flex space-x-4 animate-pulse">
                            <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-2xl"></div>
                            <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-2xl hidden md:block"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {halls?.map((hall) => !hall.seasonalConfig?.isEnabled && (
                                <div key={hall._id} className="flex flex-col group">
                                    <div className="rounded-lg overflow-hidden shadow-sm aspect-video bg-gray-100 mb-6 cursor-pointer transform transition-transform group-hover:scale-[1.02]" onClick={() => navigate(`/reserve?hallId=${hall._id}`)}>
                                        {hall.featureImage ? (
                                            <img
                                                src={hall.featureImage}
                                                alt={hall.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image Available
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold font-serif mb-2">{hall.name}</h3>
                                    <p className="text-gray-600 mb-2">
                                        {formatDateRange(hall.reservationOpenDate, hall.reservationCloseDate)}
                                    </p>
                                    {hall.isPaymentEnabled ? (
                                        <p className="text-gray-900 font-semibold mb-6">
                                            Cost: ₦{hall.paymentPriceNGN?.toLocaleString() || "0"}
                                        </p>
                                    ) : (
                                        <p className="text-emerald-600 font-semibold mb-6">
                                            Free Registration
                                        </p>
                                    )}
                                    <div>
                                        <Button
                                            onClick={() => navigate(`/reserve?hallId=${hall._id}`)}
                                            className="bg-[#E8593C] hover:bg-[#e05a0b] text-white rounded-full px-8 py-5 font-medium transition-colors"
                                        >
                                            Book Your Seat
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-24 pt-8 text-sm font-semibold text-gray-900 border-t border-gray-100">
                        Sponsorship & Partnership{" "}
                        <a href="mailto:mabstudios.production@gmail.com" className="text-[#E8593C] hover:underline">
                            mabstudios.production@gmail.com
                        </a>{" "}
                        / <span className="text-[#E8593C]">08124461291</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
