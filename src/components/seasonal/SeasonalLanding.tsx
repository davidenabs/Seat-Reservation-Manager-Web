import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Check,
  Calendar,
  Users,
  Heart,
  Building2,
  User,
  Phone,
  MessageSquare,
  ChevronRight,
  Play,
} from "lucide-react";
import { format } from "date-fns";
import type { IHall, IEventPackage } from "@/services/hallService";
import { PackageBookingModal } from "./PackageBookingModal";
import VirtualNavbar from "../VirtualNavbar";
import Footer from "../Footer";

interface SeasonalLandingProps {
  hall: IHall;
  onSwitchToStandard?: () => void;
}

export const SeasonalLanding: React.FC<SeasonalLandingProps> = ({
  hall,
  onSwitchToStandard,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<IEventPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const handleSwitchToStandard = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("e", "standard");
      return next;
    });
    if (onSwitchToStandard) {
      onSwitchToStandard();
    }
  };


  const seasonalConfig = hall.seasonalConfig;
  const hasCustomHeroImage = Boolean(hall.seasonalConfig?.heroImageUrl || hall.featureImage);

  // Fallback default packages matching the festive season tiers
  const defaultPackages: IEventPackage[] = [
    {
      id: "individual",
      name: "Individual",
      description: "Come celebrate with the Joy Tribe.",
      priceNGN: 20000,
      seatCount: 1,
      allocationStrategy: "single",
      features: [
        "Breakfast",
        "Festive gift pack",
        "Photos with Morayo & special guests",
        "Best seats in the house",
      ],
      buttonText: "Book for one",
      isActive: true,
    },
    {
      id: "couples",
      name: "Couples",
      tag: "BEST VALUE",
      description: "Bring your plus-one and save ₦10,000.",
      priceNGN: 30000,
      seatCount: 2,
      allocationStrategy: "adjacent_pair",
      features: [
        "Breakfast for two",
        "Festive gift packs",
        "Photos with Morayo & special guests",
        "Best seats in the house, side by side",
      ],
      buttonText: "Book for two",
      isActive: true,
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Celebrate your team on national TV.",
      priceNGN: 500000,
      seatCount: 25,
      allocationStrategy: "contiguous_block",
      features: [
        "Everything in Individual, for your whole team",
        "Corporate shout-out during the show",
        "On-air recognition of your staff",
        "Team photos with Morayo",
        "Priority seating",
      ],
      buttonText: "Book for your team",
      isActive: true,
    },
  ];

  const packages = seasonalConfig?.packages && seasonalConfig.packages.length > 0
    ? seasonalConfig.packages.filter((p) => p.isActive !== false)
    : defaultPackages;

  const handleBookPackage = (pkg: IEventPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const scrollToPackages = () => {
    const el = document.getElementById("packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (packages.length > 0) {
      handleBookPackage(packages[0]);
    }
  };


  const formatDateShort = (openDate?: string | Date, closeDate?: string | Date) => {
    if (!openDate || !closeDate) return "Dec 1 - 18th";
    try {
      const start = openDate instanceof Date ? openDate : new Date(openDate);
      const end = closeDate instanceof Date ? closeDate : new Date(closeDate);
      return `${format(start, "MMM d")} - ${format(end, "do")}`;
    } catch {
      return "Dec 1 - 18th";
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-[#E8593C]/20 selection:text-[#E8593C]">
      {/* Optional Admin Switch to Standard Schedule */}
      {onSwitchToStandard && (
        <div className="bg-[#FFF4F0] border-b border-[#FCD8CF] px-6 py-2.5 text-xs text-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8593C] animate-pulse" />
            <span>Festive Season Campaign Active · VIP packages available for reservation.</span>
          </div>
          <button
            onClick={handleSwitchToStandard}
            className="text-xs font-semibold text-[#E8593C] hover:underline"
          >
            Switch to Standard Tour Schedule →
          </button>
        </div>
      )}

      <VirtualNavbar scrollToPackages={scrollToPackages} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2]/40 via-white to-white">
        {/* Soft decorative background glow */}
        <div className="absolute top-10 left-0 w-96 h-96 bg-[#FFEBE6] rounded-full blur-3xl opacity-70 -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-16 md:pt-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-['Fraunces',_serif] font-bold text-[#141211] leading-[1.12] tracking-tight mb-6">
              Celebrate the <br className="hidden sm:inline" />
              End of the Year{" "}
              <span className="italic font-normal text-[#E8593C]">Live</span>{" "}
              <br className="hidden sm:inline" />
              with Morayo
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mb-9 font-sans">
              Join Africa's premier daily talk show live in the studio. Experience
              powerful stories, cultural debates, and national conversations with
              Nigeria's &ldquo;Queen of Talk,&rdquo; Morayo Afolabi-Brown.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={scrollToPackages}
                className="bg-[#E8593C] hover:bg-[#D44A2D] text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Book A Seat
              </button>

              <a
                href="https://www.youtube.com/@morayoafolabibrownoffcial"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-transparent hover:bg-gray-50 text-gray-900 border border-gray-900/80 font-medium text-sm sm:text-base px-7 py-3.5 rounded-full transition-all"
              >
                Watch Live on YouTube
              </a>
            </div>
          </div>

          {/* Right Column: Visual Campaign Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[18px] overflow-hidden shadow-2xl bg-[#E3793B] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] group border border-gray-100">
              {/* Background Poster Image */}
              <img
                src={hall.seasonalConfig?.heroImageUrl || hall.featureImage || "/seasonal-hero-card.jpg"}
                alt="The Morayo Show - End of the Year Special"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/festive-banner.jpg";
                }}
              />

              {hasCustomHeroImage ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      Live in-Studio
                    </span>
                  </div>

                  <div className="absolute top-12 sm:top-14 left-4 max-w-[200px]">
                    <h3 className="text-xl sm:text-2xl font-['Fraunces',_serif] font-bold text-white drop-shadow-sm leading-tight">
                      End of the Year Special
                    </h3>
                    <div className="inline-flex items-center gap-1.5 bg-[#E8593C] text-white text-xs font-semibold px-3 py-1 rounded-full mt-2 shadow-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateShort(hall.reservationOpenDate, hall.reservationCloseDate)}</span>
                    </div>
                  </div>

                  <a
                    href="https://www.youtube.com/@morayoafolabibrownoffcial"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white group/play"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/60 flex items-center justify-center shrink-0 group-hover/play:scale-110 group-hover/play:bg-[#E8593C] group-hover/play:border-[#E8593C] transition-all">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white">
                        Watch Full Video
                      </div>
                      <div className="text-[11px] text-white/80 font-mono">
                        youtube.com/@morayoafolabibrownoffcial
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <a
                  href="https://www.youtube.com/@TheMorayoShow"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-10 flex items-end p-4 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Watch The Morayo Show on YouTube"
                >
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    Watch on YouTube
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Select Your Festive Package Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16" id="packages">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-['Fraunces',_serif] font-bold text-[#141211] tracking-tight mb-2">
              Select Your Festive Package
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
              Choose a plan below to reserve your seats for your preferred show date.
              Seats are automatically allocated together in prime viewing rows.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200/90 text-gray-700 text-xs font-medium px-4 py-2 rounded-full self-start md:self-auto flex items-center gap-2 shrink-0">
            <Users className="w-3.5 h-3.5 text-[#E8593C]" />
            <span>Smart automatic seat allocation</span>
          </div>
        </div>

        {/* 3 Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          {packages.map((pkg) => {
            const isCouples = pkg.id === "couples" || pkg.seatCount === 2;
            const isCorporate = pkg.id === "corporate" || pkg.seatCount >= 10;

            return (
              <article
                key={pkg.id}
                className={`rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300 ${isCouples
                  ? "bg-white border-2 border-[#E8593C] shadow-md hover:shadow-xl relative"
                  : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"
                  }`}
              >
                {/* Floating BEST VALUE Badge for Couples */}
                {isCouples && (
                  <span className="absolute -top-3.5 left-8 bg-[#E8593C] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    {pkg.tag || "BEST VALUE"}
                  </span>
                )}

                <div>
                  {/* Category Tag + Circle Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${isCouples ? "text-[#E8593C]" : "text-gray-500"
                        }`}
                    >
                      {pkg.name}
                    </span>

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${isCouples
                        ? "bg-red-50 text-[#E8593C] border border-red-100"
                        : "bg-gray-50 text-gray-600 border border-gray-100"
                        }`}
                    >
                      {isCorporate ? (
                        <Building2 className="w-4 h-4" />
                      ) : isCouples ? (
                        <Heart className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6 min-h-[36px]">
                    {pkg.description}
                  </p>

                  {/* Pricing Block */}
                  <div className="py-4 border-y border-gray-100 mb-6">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-950 font-sans tracking-tight">
                        ₦{pkg.priceNGN.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm font-normal text-gray-500">
                        {isCorporate
                          ? `/ up to ${pkg.seatCount} people`
                          : isCouples
                            ? `/ couple`
                            : `/ person`}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#E8593C] shrink-0" />
                      <span>
                        {isCorporate
                          ? `Guaranteed ${pkg.seatCount} contiguous team block seats`
                          : isCouples
                            ? "Guaranteed 2 adjacent seats (side-by-side)"
                            : "1 prime studio seat"}
                      </span>
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#E8593C] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Button */}
                <button
                  onClick={() => handleBookPackage(pkg)}
                  className="w-full bg-[#E8593C] hover:bg-[#D44A2D] text-white font-medium py-3.5 rounded-full text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>
                    {pkg.buttonText ||
                      (isCorporate
                        ? "Book for your team"
                        : isCouples
                          ? "Book for two"
                          : "Book for one")}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </article>
            );
          })}
        </div>

        {/* Custom Requests / Questions Banner */}
        <div className="mt-14 bg-[#F9F9F8] border border-gray-200/80 rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8593C] mb-2 block">
              Need Help or Have Custom Requests?
            </span>
            <h3 className="text-xl sm:text-2xl font-['Fraunces',_serif] font-bold text-[#141211] mb-1">
              Have questions about our festive packages?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              For corporate invoicing, large groups, or special accommodations, our team is here to assist.
            </p>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap shrink-0">
            <a
              href="tel:08124461291"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-900 font-medium text-xs sm:text-sm hover:bg-gray-50 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#E8593C]" />
              <span>Call 08124461291</span>
            </a>

            <a
              href="https://wa.me/2348124461291?text=Hello,%20I'm%20interested%20in%20The%20Morayo%20Show%20festive%20packages"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8593C] hover:bg-[#D44A2D] text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <Footer scrollToPackages={scrollToPackages} />
      {/* Package Reservation Dialog / Modal */}
      <PackageBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pkg={selectedPackage}
        hall={hall}
      />
    </div>
  );
};
