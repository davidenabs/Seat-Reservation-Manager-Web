import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronRight, Loader2, Plus, Trash2, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingService } from "@/services/bookingService";
import type { IEventPackage, IHall } from "@/services/hallService";
import { ROUTES } from "@/config/route";

interface PackageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: IEventPackage | null;
  hall: IHall;
}

export const PackageBookingModal: React.FC<PackageBookingModalProps> = ({
  isOpen,
  onClose,
  pkg,
  hall,
}) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [ageRange, setAgeRange] = useState<"18-25" | "26-35" | "36-45" | "46-55" | "55+">("26-35");
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  // Optional attendees
  const [attendees, setAttendees] = useState<{ name: string; email: string }[]>([]);
  const [showAttendees, setShowAttendees] = useState(false);

  // Calculate eligible weekday dates between reservationOpenDate and reservationCloseDate
  const availableDates = useMemo(() => {
    if (!hall.reservationOpenDate || !hall.reservationCloseDate) return [];

    const start = new Date(hall.reservationOpenDate);
    const end = new Date(hall.reservationCloseDate);
    const dates: string[] = [];

    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      // Weekdays: Monday(1) to Friday(5)
      if (day >= 1 && day <= 5) {
        dates.push(current.toISOString().split("T")[0]);
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }, [hall.reservationOpenDate, hall.reservationCloseDate]);

  // Set default selected date
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Fetch available seats for selected date
  const { data: seatsData, isLoading: isLoadingSeats } = useQuery({
    queryKey: ["seats", selectedDate, hall._id],
    queryFn: () => BookingService.fetchAvailableSeats(selectedDate, hall._id),
    enabled: !!selectedDate && !!hall._id && isOpen,
  });

  const reservationMutation = useMutation({
    mutationFn: (payload: any) => BookingService.reserveSeat(payload),
    onSuccess: (data: any, variables: any) => {
      onClose();
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
            priceNGN: pkg?.priceNGN || 0,
            priceUSD: pkg?.priceUSD || 0,
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

  if (!pkg) return null;

  const handleAddAttendee = () => {
    if (attendees.length < pkg.seatCount - 1) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Please select an event date");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required contact fields");
      return;
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    const payload = {
      hallId: hall._id,
      packageId: pkg.id,
      eventDate: new Date(selectedDate).toISOString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender,
      ageRange,
      agreeToTerms: true,
      attendees: attendees.filter((a) => a.name.trim() !== ""),
    };

    reservationMutation.mutate(payload);
  };

  const availableSeatsCount = seatsData?.availableSeats ?? hall.defaultTotalSeats;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-white text-gray-900 rounded-2xl border border-gray-100 shadow-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[#FFF4F0] text-[#E8593C] border border-[#FCD8CF]">
              {pkg.name} Package
            </span>
            {pkg.tag && (
              <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[#E8593C] text-white">
                {pkg.tag}
              </span>
            )}
          </div>
          <DialogTitle className="text-2xl font-serif font-bold text-black">
            Reserve Your Seats
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {pkg.description} · <span className="font-semibold text-gray-900">₦{pkg.priceNGN.toLocaleString()}</span> for {pkg.seatCount} {pkg.seatCount === 1 ? "seat" : "seats"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Date Picker */}
          <div>
            <Label className="block text-sm font-semibold text-gray-900 mb-2">
              Choose Event Date
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full h-12 rounded-xl border border-gray-300 focus:ring-[#E8593C]">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((dateStr) => {
                  const d = new Date(dateStr);
                  return (
                    <SelectItem key={dateStr} value={dateStr}>
                      {format(d, "EEEE, MMMM do, yyyy")}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
              <span>
                {isLoadingSeats ? "Checking seat capacity..." : `${availableSeatsCount} seats available on this date`}
              </span>
              <span className="text-[#E8593C] font-semibold">
                {pkg.seatCount} seats will be reserved
              </span>
            </div>
          </div>

          {/* Package Perks Summary */}
          <div className="bg-[#FFF4F0] border border-[#FCD8CF] rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider font-bold text-[#E8593C] mb-2">
              Package Inclusions
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
              {pkg.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8593C] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Booker Info */}
          <div className="space-y-4">
            <div className="font-semibold text-sm text-gray-900 border-b pb-1">
              Primary Booker Details
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
                  className="rounded-xl border-gray-300 mt-1 focus-visible:ring-[#E8593C]"
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
                  className="rounded-xl border-gray-300 mt-1 focus-visible:ring-[#E8593C]"
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
                  className="rounded-xl border-gray-300 mt-1 focus-visible:ring-[#E8593C]"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700">Gender *</Label>
                <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                  <SelectTrigger className="rounded-xl border-gray-300 mt-1 focus:ring-[#E8593C] w-full">
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
                  <SelectTrigger className="rounded-xl border-gray-300 mt-1 focus:ring-[#E8593C] w-full">
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
          </div>

          {/* Optional Guest / Colleague Names for multi-seat packages */}
          {pkg.seatCount > 1 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#E8593C]" />
                    Additional Guest Names (Optional)
                  </div>
                  <p className="text-xs text-gray-500">
                    Add guest names for separate entry passes or ticket badges.
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
                <div className="space-y-3 pt-2">
                  {attendees.map((att, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Guest ${idx + 1} Name`}
                        value={att.name}
                        onChange={(e) => handleAttendeeChange(idx, "name", e.target.value)}
                        className="rounded-xl text-xs h-9 bg-white"
                      />
                      <Input
                        placeholder="Guest Email (Optional)"
                        value={att.email}
                        onChange={(e) => handleAttendeeChange(idx, "email", e.target.value)}
                        className="rounded-xl text-xs h-9 bg-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-500 hover:text-red-700"
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
                      className="text-xs text-[#E8593C] hover:text-[#e05a0b] p-0"
                      onClick={handleAddAttendee}
                    >
                      + Add another guest (up to {pkg.seatCount - 1})
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Terms Agreement */}
          <div className="flex items-start gap-2 pt-1">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
              className="data-[state=checked]:bg-[#E8593C] data-[state=checked]:border-[#E8593C] mt-0.5"
            />
            <Label htmlFor="terms" className="text-xs text-gray-600 leading-snug cursor-pointer">
              I agree to the Terms & Conditions and understand that seats for this package will be automatically allocated upon payment completion.
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={reservationMutation.isPending}
            className="w-full py-4 text-sm font-semibold rounded-full bg-[#E8593C] hover:bg-[#e05a0b] text-white shadow-sm transition-all"
          >
            {reservationMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Reserving Your Package...
              </>
            ) : (
              <>
                Proceed to Pay ₦{pkg.priceNGN.toLocaleString()}
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
