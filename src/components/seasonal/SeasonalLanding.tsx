import React, { useState } from "react";
import {
  Check,
  Calendar,
  MapPin,
  Users,
  Heart,
  Building2,
  Coffee,
  Gift,
  Camera,
  Tv,
  Phone,
  MessageSquare,
  ChevronRight,
  User,
} from "lucide-react";
import { format } from "date-fns";
import VirtualNavbar from "@/components/VirtualNavbar";
import { Button } from "@/components/ui/button";
import type { IHall, IEventPackage } from "@/services/hallService";
import { PackageBookingModal } from "./PackageBookingModal";

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

  const seasonalConfig = hall.seasonalConfig;

  // Fallback default packages if not configured on the hall
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
      tag: "Best value",
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

  const formatDateRange = (openDate?: string | Date, closeDate?: string | Date) => {
    if (!openDate || !closeDate) return "Dates TBD";
    const start = openDate instanceof Date ? openDate : new Date(openDate);
    const end = closeDate instanceof Date ? closeDate : new Date(closeDate);

    const startMonth = format(start, "MMMM");
    const endMonth = format(end, "MMMM");

    if (startMonth === endMonth) {
      return `${format(start, "MMMM do")} - ${format(end, "do, yyyy")}`;
    }
    return `${format(start, "MMMM do")} - ${format(end, "MMMM do, yyyy")}`;
  };

  return (
    <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
      <VirtualNavbar />

      <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 lg:p-20">
        <div className="max-w-7xl mx-auto">
          {/* Top Switch / Notification Banner */}
          <div className="mb-8 p-4 bg-[#FFF4F0] border border-[#FCD8CF] rounded-2xl flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div>
                <span className="font-semibold text-gray-900">
                  Festive Season Packages are Live!
                </span>
                <p className="text-xs text-gray-600">
                  Special all-inclusive packages for Individuals, Couples, and Corporate teams with VIP perks.
                </p>
              </div>
            </div>
            {onSwitchToStandard && (
              <Button
                onClick={onSwitchToStandard}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-white rounded-full text-xs px-5 h-9"
              >
                View Regular Tour Schedule
              </Button>
            )}
          </div>

          {/* Editorial Header Section */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8593C]/10 text-[#E8593C] border border-[#E8593C]/20">
                {seasonalConfig?.campaignSubtitle || "Festive Season"}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {hall.name} ({hall.city})
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDateRange(hall.reservationOpenDate, hall.reservationCloseDate)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 leading-tight">
              {seasonalConfig?.campaignTitle || "Celebrate the End of the Year Live with Morayo"}
            </h1>
            <p className="text-base text-gray-700 max-w-3xl leading-relaxed">
              Experience The Morayo Show live with our exclusive holiday packages. Enjoy a delicious breakfast, curated festive gift packs, personal photos with Morayo & special guests, and prime studio seating.
            </p>
          </header>

          {/* Event Feature Spotlight (Sells the event while maintaining system theme) */}
          <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF9F5] border border-[#EBE7DF] rounded-2xl p-6 md:p-8">
            <div className="lg:col-span-5 aspect-video rounded-xl overflow-hidden bg-gray-200 shadow-sm relative">
              {hall.featureImage ? (
                <img
                  src={hall.featureImage}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-6 text-center">
                  <Tv className="w-12 h-12 text-[#E8593C] mb-2" />
                  <span className="font-serif font-bold text-gray-800 text-lg">The Morayo Show Studio</span>
                  <span className="text-xs text-gray-500 mt-1">Live Television Broadcast Experience</span>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Studio Broadcast
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#E8593C]">
                  The Live Holiday Experience
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1 mb-2">
                  Step Inside the Joy Tribe Studio
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Be part of national television history. Whether you are celebrating your personal milestones, bringing your partner, or treating your entire team, every festive package is designed to provide an unforgettable VIP morning with Morayo Brown.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EBE7DF]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8593C]/10 text-[#E8593C] flex items-center justify-center shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Breakfast on Set</h4>
                    <p className="text-xs text-gray-500">Delicious breakfast served fresh before the show.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8593C]/10 text-[#E8593C] flex items-center justify-center shrink-0 mt-0.5">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Photos with Morayo</h4>
                    <p className="text-xs text-gray-500">Personal photo session with Morayo & celebrity guests.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8593C]/10 text-[#E8593C] flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Festive Gift Packs</h4>
                    <p className="text-xs text-gray-500">Curated end-of-year gifts prepared for every package holder.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8593C]/10 text-[#E8593C] flex items-center justify-center shrink-0 mt-0.5">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">National TV Seating</h4>
                    <p className="text-xs text-gray-500">Best seats in the house with on-air recognition.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Packages Section */}
          <section className="mb-16" id="packages">
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-black mb-2">
                  Select Your Festive Package
                </h2>
                <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
                  Choose a plan below to reserve your seats for your preferred show date. Seats are automatically allocated together in prime viewing rows.
                </p>
              </div>
              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full self-start md:self-auto flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-[#E8593C]" />
                Smart automatic seat allocation
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {packages.map((pkg) => {
                const isCouples = pkg.id === "couples" || pkg.seatCount === 2;
                const isCorporate = pkg.id === "corporate" || pkg.seatCount >= 10;

                return (
                  <article
                    key={pkg.id}
                    className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all ${isCouples
                        ? "bg-white border-2 border-[#E8593C] shadow-lg"
                        : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                  >
                    {isCouples && (
                      <span className="absolute -top-3.5 left-7 bg-[#E8593C] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                        {pkg.tag || "Best Value · Save ₦10,000"}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E8593C]">
                          {pkg.name}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center">
                          {isCorporate ? (
                            <Building2 className="w-4 h-4 text-gray-700" />
                          ) : isCouples ? (
                            <Heart className="w-4 h-4 text-[#E8593C]" />
                          ) : (
                            <User className="w-4 h-4 text-gray-700" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-6 min-h-[36px]">
                        {pkg.description}
                      </p>

                      <div className="py-4 border-y border-gray-100 mb-6">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-3xl sm:text-4xl font-serif font-bold text-black">
                            ₦{pkg.priceNGN.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {isCorporate
                              ? `/ up to ${pkg.seatCount} people`
                              : isCouples
                                ? `/ couple`
                                : `/ person`}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 mt-1.5 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#E8593C]" />
                          {isCorporate
                            ? `Guaranteed ${pkg.seatCount} contiguous team block seats`
                            : isCouples
                              ? "Guaranteed 2 adjacent seats (side-by-side)"
                              : "1 prime studio seat"}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                            <Check className="w-4 h-4 text-[#E8593C] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleBookPackage(pkg)}
                      className={`w-full rounded-full py-5 font-semibold text-sm transition-all shadow-sm ${isCouples
                          ? "bg-[#E8593C] hover:bg-[#e05a0b] text-white"
                          : "bg-[#E8593C] hover:bg-[#e05a0b] text-white"
                        }`}
                    >
                      {pkg.buttonText || (isCorporate ? "Book for Your Team" : isCouples ? "Book for Two" : "Book for One")}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Quick Help & Assistance Card */}
          <div className="mb-16 p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8593C]">
                Need Help or Have Custom Requests?
              </span>
              <h3 className="text-xl font-serif font-bold text-black mt-1">
                Have questions about our festive packages?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                For corporate invoicing, large groups, or special accommodations, our team is here to assist.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <a
                href="tel:+2348124461291"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold text-xs hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8593C]" />
                Call 08124461291
              </a>
              <a
                href="https://wa.me/2348124461291"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8593C] text-white font-semibold text-xs hover:bg-[#e05a0b] transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Standard System Footer */}
          <footer className="mt-20 pt-8 text-sm font-semibold text-gray-900 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              Sponsorship & Partnership{" "}
              <a href="mailto:mabstudios.production@gmail.com" className="text-[#E8593C] hover:underline">
                mabstudios.production@gmail.com
              </a>{" "}
              / <span className="text-[#E8593C]">08124461291</span>
            </div>
            <div className="text-xs text-gray-500 font-normal">
              Merry Christmas in advance · The Morayo Show
            </div>
          </footer>
        </div>
      </div>

      {/* Package Reservation Dialog */}
      <PackageBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pkg={selectedPackage}
        hall={hall}
      />
    </div>
  );
};
