import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import VirtualNavbar from "@/components/VirtualNavbar";
import Footer from "@/components/Footer";
import { GuestSpotlight } from "@/components/GuestSpotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BookingService } from "@/services/bookingService";
import { HallService, type IEventPackage } from "@/services/hallService";
import { ROUTES } from "@/config/route";

const DEFAULT_PACKAGES: IEventPackage[] = [
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

export default function PackageBookingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hallIdParam = searchParams.get("hallId");
  const packageIdParam = searchParams.get("packageId");

  const { data: halls, isLoading: isLoadingHalls } = useQuery({
    queryKey: ["halls"],
    queryFn: () => HallService.getHalls(),
  });

  const hall = useMemo(() => {
    if (!halls || halls.length === 0) return undefined;
    if (hallIdParam) {
      const matched = halls.find((h) => h._id === hallIdParam);
      if (matched) return matched;
    }
    return halls.find((h) => h.isActive && h.seasonalConfig?.isEnabled);
  }, [halls, hallIdParam]);

  const packages = useMemo(() => {
    const cfgPackages = hall?.seasonalConfig?.packages;
    if (cfgPackages && cfgPackages.length > 0) {
      return cfgPackages.filter((p) => p.isActive !== false);
    }
    return DEFAULT_PACKAGES;
  }, [hall]);

  const pkg = useMemo(() => {
    if (packageIdParam) {
      const found = packages.find((p) => p.id === packageIdParam);
      if (found) return found;
    }
    return packages[0] || null;
  }, [packages, packageIdParam]);

  const isMultiple = !!hall?.isMultipleDaysBookingEnabled;

  // Date selection state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Booker form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [ageRange, setAgeRange] = useState<"18-25" | "26-35" | "36-45" | "46-55" | "55+">("26-35");
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  // Optional attendees
  const [attendees, setAttendees] = useState<{ name: string; email: string }[]>([]);
  const [showAttendees, setShowAttendees] = useState(false);

  // Date range & working days rules matching EventAndDateSelector
  const minDate = useMemo(() => {
    if (!hall?.reservationOpenDate) return null;
    const d = new Date(hall.reservationOpenDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [hall?.reservationOpenDate]);

  const maxDate = useMemo(() => {
    if (!hall?.reservationCloseDate) return null;
    const d = new Date(hall.reservationCloseDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [hall?.reservationCloseDate]);

  const workingDays: number[] = useMemo(() => {
    if (Array.isArray(hall?.workingDays) && hall.workingDays.length > 0) {
      return hall.workingDays.map(Number);
    }
    return [1, 2, 3, 4, 5];
  }, [hall?.workingDays]);

  const blockedTimestamps = useMemo(() => {
    return (hall?.blockedDates || []).map((d) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return dt.getTime();
    });
  }, [hall?.blockedDates]);

  const isDateDisabled = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);

    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    if (!workingDays.includes(date.getDay())) return true;
    if (blockedTimestamps.includes(normalized.getTime())) return true;

    return false;
  };

  const firstEnabledDate = useMemo(() => {
    let cursor = minDate ? new Date(minDate) : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    cursor.setHours(0, 0, 0, 0);
    if (cursor < today) cursor = new Date(today);

    const lastDate = maxDate
      ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0)
      : undefined;

    for (
      let i = 0;
      (!lastDate || cursor <= lastDate) && i < 366;
      cursor.setDate(cursor.getDate() + 1), i++
    ) {
      if (!isDateDisabled(cursor)) {
        return new Date(cursor);
      }
    }
    return minDate || today;
  }, [minDate, maxDate, workingDays, blockedTimestamps]);

  // Pre-select the first available date once hall loads
  useEffect(() => {
    if (!hall || !firstEnabledDate) return;
    const iso = format(firstEnabledDate, "yyyy-MM-dd");
    if (!isMultiple && !selectedDate) {
      setSelectedDate(iso);
    } else if (isMultiple && selectedDates.length === 0) {
      setSelectedDates([iso]);
    }
  }, [hall, firstEnabledDate, isMultiple]);

  // Fetch seat availability for active date(s)
  const datesToQuery = isMultiple ? selectedDates : selectedDate ? [selectedDate] : [];

  const seatQueries = useQueries({
    queries: datesToQuery.map((dateStr) => ({
      queryKey: ["seats", dateStr, hall?._id],
      queryFn: () => BookingService.fetchAvailableSeats(dateStr, hall?._id),
      enabled: !!dateStr && !!hall?._id,
      staleTime: 30000,
    })),
  });

  // Reset extra attendees if user switches to a smaller package
  useEffect(() => {
    if (pkg && attendees.length > Math.max(0, pkg.seatCount - 1)) {
      setAttendees((prev) => prev.slice(0, Math.max(0, pkg.seatCount - 1)));
    }
  }, [pkg?.id, pkg?.seatCount]);

  // Computed counts & dynamic pricing
  const numDays = isMultiple ? selectedDates.length : selectedDate ? 1 : 0;
  const unitPriceNGN = pkg?.priceNGN || 0;
  const unitPriceUSD = pkg?.priceUSD || 0;
  const totalPriceNGN = unitPriceNGN * numDays;
  const totalPriceUSD = unitPriceUSD * numDays;

  const reservationMutation = useMutation({
    mutationFn: (payload: any) => BookingService.reserveSeat(payload),
    onSuccess: (data: any, variables: any) => {
      if (data) {
        if (data.requiresOTP) {
          localStorage.setItem("bookingEmail", variables.email);
          if (data.reservationToken) {
            localStorage.setItem("reservationToken", data.reservationToken);
          }
          toast.success(data.message || "Please verify your email.");
          navigate(ROUTES.VERIFY.replace(":tempId", data.tempId));
          return;
        }

        if (data.requiresPayment || data.paymentLinkNGN) {
          const bookingDataWithPrices = {
            ...data,
            priceNGN: data.priceNGN ?? totalPriceNGN,
            priceUSD: data.priceUSD ?? totalPriceUSD,
            packageDetails: pkg,
          };
          localStorage.setItem("booking_details", JSON.stringify(bookingDataWithPrices));
          navigate(ROUTES.PAYMENT_OPTIONS);
          return;
        }

        toast.success(data.message || "Reservation successful!");
        localStorage.setItem("booking_details", JSON.stringify(data));
        navigate(ROUTES.BOOKING_SUCCESS);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || "Reservation failed. Please try again.");
    },
  });

  const handleSingleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setIsCalendarOpen(false);
  };

  const handleMultipleDatesSelect = (dates: Date[] | undefined) => {
    const formatted = (dates || [])
      .map((d) => format(d, "yyyy-MM-dd"))
      .sort();
    setSelectedDates(Array.from(new Set(formatted)));
  };

  const handleRemoveDate = (dateStr: string) => {
    setSelectedDates((prev) => prev.filter((d) => d !== dateStr));
  };

  const handleAddAttendee = () => {
    if (pkg && attendees.length < pkg.seatCount - 1) {
      setAttendees([...attendees, { name: "", email: "" }]);
    }
  };

  const handleAttendeeChange = (index: number, field: "name" | "email", val: string) => {
    const updated = [...attendees];
    updated[index][field] = val;
    setAttendees(updated);
  };

  const handleRemoveAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleSwitchPackage = (newPkgId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("packageId", newPkgId);
      if (hall?._id) next.set("hallId", hall._id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hall || !pkg) return;

    if (numDays === 0) {
      toast.error(isMultiple ? "Please select at least one event date" : "Please select an event date");
      return;
    }

    // Check seat capacity for each selected date
    for (let i = 0; i < datesToQuery.length; i++) {
      const q = seatQueries[i];
      if (q?.data && typeof q.data.availableSeats === "number" && q.data.availableSeats < pkg.seatCount) {
        toast.error(
          `Only ${q.data.availableSeats} seat(s) left on ${format(new Date(datesToQuery[i]), "MMM do, yyyy")}. This package requires ${pkg.seatCount} seat(s).`
        );
        return;
      }
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required contact fields");
      return;
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    const basePayload: any = {
      hallId: hall._id,
      packageId: pkg.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender,
      ageRange,
      agreeToTerms: true,
      attendees: attendees.filter((a) => a.name.trim() !== ""),
    };

    if (isMultiple) {
      basePayload.eventDates = selectedDates.map((d) => new Date(d).toISOString());
    } else {
      basePayload.eventDate = new Date(selectedDate).toISOString();
    }

    reservationMutation.mutate(basePayload);
  };

  if (isLoadingHalls) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <VirtualNavbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin text-[#E8593C]" />
            <span>Loading package details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hall || !pkg) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <VirtualNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            The festive package or event you requested is currently unavailable.
          </p>
          <Button
            onClick={() => navigate("/?e=festive")}
            className="rounded-full bg-[#E8593C] hover:bg-[#D44A2D] text-white px-6"
          >
            Back to Festive Packages
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const initialFocusDate = firstEnabledDate
    ? new Date(firstEnabledDate.getFullYear(), firstEnabledDate.getMonth(), 1)
    : undefined;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-gray-900 font-sans antialiased flex flex-col">
      <VirtualNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate("/?e=festive")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E8593C] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Festive Packages</span>
        </button>

        {/* Page Title & Package Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#FFF4F0] text-[#E8593C] border border-[#FCD8CF]">
                <Sparkles className="w-3 h-3" />
                {pkg.name} Package
              </span>
              {pkg.tag && (
                <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#E8593C] text-white">
                  {pkg.tag}
                </span>
              )}
              {isMultiple && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                  Multi-Day Booking Enabled
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-['Fraunces',_serif] font-bold text-[#141211] tracking-tight">
              Reserve Your Seats
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {hall.name} · {pkg.description}
            </p>
          </div>

          {/* Quick Package Switcher */}
          {packages.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {packages.map((p) => {
                const active = p.id === pkg.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSwitchPackage(p.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                      active
                        ? "bg-[#E8593C] text-white border-[#E8593C] shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#E8593C]/50"
                    )}
                  >
                    {p.name} (₦{p.priceNGN.toLocaleString()})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Event Date(s) */}
            <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    1. {isMultiple ? "Choose Event Date(s)" : "Choose Event Date"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isMultiple
                      ? "Select one or more dates to attend. Total price adjusts automatically per day."
                      : "Select your preferred show date."}
                  </p>
                </div>
              </div>

              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal rounded-xl border-gray-300 h-12 px-4 hover:bg-gray-50"
                  >
                    <CalendarIcon className="mr-2.5 h-4 w-4 text-[#E8593C] shrink-0" />
                    <span className="flex-1 truncate text-sm">
                      {isMultiple
                        ? selectedDates.length > 0
                          ? `${selectedDates.length} ${selectedDates.length === 1 ? "day" : "days"} selected`
                          : "Select one or more dates"
                        : selectedDate
                          ? format(new Date(selectedDate), "EEEE, MMMM do, yyyy")
                          : "Select an event date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {isMultiple ? (
                    <CalendarComponent
                      mode="multiple"
                      selected={selectedDates.map((d) => new Date(d))}
                      onSelect={handleMultipleDatesSelect}
                      disabled={isDateDisabled}
                      initialFocus
                      defaultMonth={initialFocusDate}
                    />
                  ) : (
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate ? new Date(selectedDate) : undefined}
                      onSelect={handleSingleDateSelect}
                      disabled={isDateDisabled}
                      initialFocus
                      defaultMonth={initialFocusDate}
                    />
                  )}
                </PopoverContent>
              </Popover>

              {/* Selected Date Chips + Per-Date Availability */}
              {datesToQuery.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {datesToQuery.map((dateStr, idx) => {
                      const q = seatQueries[idx];
                      const available = q?.data?.availableSeats ?? hall.defaultTotalSeats;
                      const total = q?.data?.totalSeats ?? hall.defaultTotalSeats;
                      const isLow = typeof available === "number" && available < pkg.seatCount;

                      return (
                        <Badge
                          key={dateStr}
                          variant="secondary"
                          className={cn(
                            "py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-2 border",
                            isLow
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-[#FFF4F0]/60 border-[#FCD8CF] text-gray-800"
                          )}
                        >
                          <span>
                            {format(new Date(dateStr), "EEE, MMM d")} ·{" "}
                            {q?.isLoading ? "..." : `${available}/${total} seats`}
                          </span>
                          {isMultiple && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDate(dateStr)}
                              className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                              aria-label={`Remove ${dateStr}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className="text-[#E8593C] font-semibold">
                      {pkg.seatCount} {pkg.seatCount === 1 ? "seat" : "seats"}
                    </span>{" "}
                    will be automatically allocated {isMultiple ? "for each selected day" : "on this date"}.
                  </p>
                </div>
              )}

              <GuestSpotlight hall={hall} selectedDates={datesToQuery} className="mt-4" />
            </section>

            {/* Step 2: Primary Booker Info */}
            <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">2. Primary Booker Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your tickets and payment confirmation will be sent to this contact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="booker-name" className="text-xs font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="booker-name"
                    placeholder="e.g. Joy Adeyemi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-gray-300 mt-1 h-11 focus-visible:ring-[#E8593C]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="booker-email" className="text-xs font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="booker-email"
                    type="email"
                    placeholder="joy@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-gray-300 mt-1 h-11 focus-visible:ring-[#E8593C]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="booker-phone" className="text-xs font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="booker-phone"
                    placeholder="+234..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border-gray-300 mt-1 h-11 focus-visible:ring-[#E8593C]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">Gender *</Label>
                  <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                    <SelectTrigger className="rounded-xl border-gray-300 mt-1 h-11 focus:ring-[#E8593C] w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">Age Range *</Label>
                  <Select value={ageRange} onValueChange={(val: any) => setAgeRange(val)}>
                    <SelectTrigger className="rounded-xl border-gray-300 mt-1 h-11 focus:ring-[#E8593C] w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25</SelectItem>
                      <SelectItem value="26-35">26-35</SelectItem>
                      <SelectItem value="36-45">36-45</SelectItem>
                      <SelectItem value="46-55">46-55</SelectItem>
                      <SelectItem value="55+">55+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Step 3: Optional Additional Guests */}
            {pkg.seatCount > 1 && (
              <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#E8593C]" />
                      Additional Guest Names (Optional)
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Add guest names for separate entry passes or ticket badges (up to {pkg.seatCount - 1}).
                    </p>
                  </div>
                  {!showAttendees && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full border-[#E8593C]/30 text-[#E8593C] hover:bg-[#FFF4F0]"
                      onClick={() => {
                        setShowAttendees(true);
                        if (attendees.length === 0) handleAddAttendee();
                      }}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Guest
                    </Button>
                  )}
                </div>

                {showAttendees && (
                  <div className="space-y-3 pt-3">
                    {attendees.map((att, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <Input
                          placeholder={`Guest ${idx + 1} Name`}
                          value={att.name}
                          onChange={(e) => handleAttendeeChange(idx, "name", e.target.value)}
                          className="rounded-xl text-xs h-10 bg-gray-50/50"
                        />
                        <Input
                          placeholder="Guest Email (Optional)"
                          value={att.email}
                          onChange={(e) => handleAttendeeChange(idx, "email", e.target.value)}
                          className="rounded-xl text-xs h-10 bg-gray-50/50"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-red-500 hover:text-red-700 self-end sm:self-center"
                          onClick={() => handleRemoveAttendee(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    {attendees.length < pkg.seatCount - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[#E8593C] hover:text-[#D44A2D] p-0"
                        onClick={handleAddAttendee}
                      >
                        + Add another guest (up to {pkg.seatCount - 1})
                      </Button>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Terms Agreement (Mobile & Desktop) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                className="data-[state=checked]:bg-[#E8593C] data-[state=checked]:border-[#E8593C] mt-0.5"
              />
              <Label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                I agree to the Terms & Conditions and understand that seats for this package will be automatically allocated upon payment completion.
              </Label>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Checkout CTA */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900">Booking Summary</h2>
                <p className="text-xs text-gray-500 mt-0.5">{pkg.name} Package · {hall.name}</p>
              </div>

              {/* Package Inclusions */}
              <div className="bg-[#FFF4F0] border border-[#FCD8CF] rounded-xl p-4">
                <div className="text-xs uppercase tracking-wider font-bold text-[#E8593C] mb-2.5">
                  Package Inclusions
                </div>
                <ul className="space-y-2 text-xs text-gray-700">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E8593C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Package rate (per day)</span>
                  <span className="font-medium text-gray-900">₦{unitPriceNGN.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Seats per day</span>
                  <span className="font-medium text-gray-900">
                    {pkg.seatCount} {pkg.seatCount === 1 ? "seat" : "seats"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Selected days</span>
                  <span className="font-medium text-gray-900">
                    {numDays} {numDays === 1 ? "day" : "days"}
                  </span>
                </div>
                {numDays > 1 && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Calculation</span>
                    <span>
                      ₦{unitPriceNGN.toLocaleString()} × {numDays} days
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#E8593C]">
                    ₦{totalPriceNGN.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={reservationMutation.isPending || numDays === 0}
                className="w-full h-12 text-sm font-semibold rounded-full bg-[#E8593C] hover:bg-[#D44A2D] text-white shadow-sm transition-all"
              >
                {reservationMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Reserving Your Package...
                  </>
                ) : numDays === 0 ? (
                  "Select at least 1 date"
                ) : (
                  <>
                    {totalPriceNGN > 0
                      ? `Proceed to Pay ₦${totalPriceNGN.toLocaleString()}`
                      : "Complete Reservation"}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}
