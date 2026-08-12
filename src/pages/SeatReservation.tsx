import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Ticket, X } from "lucide-react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VirtualNavbar from "@/components/VirtualNavbar";
import SeatGrid from "@/components/SeatGrid";
import ReservationForm from "@/components/ReservationForm";
import TheaterPreview from "@/components/TheaterPreview";
import type { ReservationFormData } from "@/schemas/reservationSchema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingService } from "@/services/bookingService";
import { HallService } from "@/services/hallService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/config/route";
import type { IReservationPayload } from "@/intefaces/reservation";
import type { ISeat } from "@/intefaces/seats";
import EventAndDateSelector from "@/components/EventAndDateSelector";

const SeatReservationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
  const [searchParams] = useSearchParams();
  const initialHallId = searchParams.get("hallId") || "";
  const [selectedHallId, setSelectedHallId] = useState<string>(initialHallId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query for fetching available seats
  const {
    data: seatsResponse,
    isLoading: isLoadingSeats,
    error: seatsError,
    refetch: refetchSeats,
  } = useQuery({
    queryKey: ["seats", selectedDate, selectedHallId],
    queryFn: () => {
      const localDate = new Date(selectedDate);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset()
      );
      const formattedDate = localDate.toISOString().split("T")[0];
      return BookingService.fetchAvailableSeats(formattedDate, selectedHallId);
    },
    enabled: !!selectedDate && !!selectedHallId,
    staleTime: 30000,
    gcTime: 300000,
  });

  // Query for fetching halls
  const {
    data: halls,
    isLoading: isLoadingHalls,
  } = useQuery({
    queryKey: ["halls"],
    queryFn: () => HallService.getHalls(),
  });

  // Default to first hall if none selected
  useEffect(() => {
    if (halls && halls.length > 0 && !selectedHallId) {
      setSelectedHallId(halls[0]._id!);
    }
  }, [halls, selectedHallId]);

  // Derive active hall from the selected hall id
  const activeHall = useMemo(() => {
    if (!halls || !selectedHallId) return undefined;
    return halls.find((h) => h._id === selectedHallId);
  }, [halls, selectedHallId]);

  // Query for fetching available seats for multiple dates
  const multipleSeatsQueries = useQueries({
    queries: selectedDates.map(date => {
      return {
        queryKey: ["seats", date, selectedHallId],
        queryFn: () => {
          const localDate = new Date(date);
          localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
          const formattedDate = localDate.toISOString().split("T")[0];
          return BookingService.fetchAvailableSeats(formattedDate, selectedHallId);
        },
        enabled: activeHall?.isMultipleDaysBookingEnabled && !!date && !!selectedHallId,
        staleTime: 30000,
        gcTime: 300000,
      }
    })
  });

  // Mutation for reserving seats
  const reservationMutation = useMutation({
    mutationFn: (payload: IReservationPayload) =>
      BookingService.reserveSeat(payload),
    onSuccess: (data) => {
      const tempId = data.tempId;
      const reservationToken = data.reservationToken;

      if (tempId) {
        // store token
        localStorage.setItem("reservationToken", reservationToken!);
        // Redirect to OTP verification
        toast.success("Please check your email for verification code.");
        navigate(`/verify/${tempId}`);
      } else {
        // Direct success (no OTP required)
        queryClient.invalidateQueries({ queryKey: ["seats"] });

        if ((data as any).data?.paymentLinkNGN || (data as any).data?.paymentLinkUSD) {
          toast.success("Reservation saved! Please select your payment currency.");
          const bookingDataWithPrices = {
            ...data,
            priceNGN: activeHall?.paymentPriceNGN,
            priceUSD: activeHall?.paymentPriceUSD
          };
          localStorage.setItem("booking_details", JSON.stringify(bookingDataWithPrices));
          navigate(ROUTES.PAYMENT_OPTIONS);
          return;
        }

        toast.success(data.message || "Reservation successful!");

        // storage booking in the booking_details
        // const detailsToStore = data.data ? { ...data.data, success: data.success, message: data.message } : data;
        localStorage.setItem("booking_details", JSON.stringify(data));

        // Reset form and go to success page
        setCurrentStep(1);
        setSelectedSeats([]);
        setSelectedDate("");
        navigate(ROUTES.BOOKING_SUCCESS);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Reservation failed. Please try again.");
    },
  });

  // Reset selected seats when date changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedDate]);

  const handleSeatClick = (seat: ISeat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s: ISeat) => s.number === seat.number)) {
      setSelectedSeats(
        selectedSeats.filter((s: ISeat) => s.number !== seat.number)
      );
    } else if (selectedSeats.length < (activeHall?.maxSeatsPerUser ?? 2)) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReserveSeat = () => {
    if (selectedSeats.length === 0) return;
    setCurrentStep(2);
  };

  const handleFormSubmit = (formData: ReservationFormData) => {
    let payload: any = {
      hallId: selectedHallId,
      ...formData,
    };

    if (activeHall?.isMultipleDaysBookingEnabled) {
      payload.eventDates = selectedDates.map(d => {
        const local = new Date(d);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toISOString();
      });
      payload.seatNumbers = [];
      payload.seatLabels = [];
    } else {
      const localDate = new Date(selectedDate);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      payload.eventDate = localDate.toISOString();
      payload.seatNumbers = selectedSeats.map((s: ISeat) => s.number);
      payload.seatLabels = selectedSeats.map((s: ISeat) => s.label);
    }

    localStorage.setItem("bookingEmail", formData.email);
    reservationMutation.mutate(payload);
  };

  const seatsData = seatsResponse;

  return (
    <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
      <VirtualNavbar />

      <div className="max-w-7xl mx-auto p-8">
        <Button
          variant="ghost"
          onClick={() => {
            if (currentStep === 1) {
              // Navigate to home page
              // go to https://themorayoshow.com/
              // window.location.href = "https://themorayoshow.com/";
              navigate(ROUTES.HOME);
            } else {
              setCurrentStep(1);
            }
          }}
          className="mb-2"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Go back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <>


                {selectedHallId && activeHall && (
                  <EventAndDateSelector
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    selectedDates={selectedDates}
                    onDatesChange={setSelectedDates}
                    isLoading={isLoadingHalls}
                    error={null}
                    onRetry={() => { }}
                    halls={halls!}
                    selectedHallId={selectedHallId}
                    onHallChange={(val) => {
                      setSelectedHallId(val);
                      setSelectedDate(""); // reset date when hall changes
                      setSelectedDates([]); // reset dates
                      setSelectedSeats([]); // reset seats
                    }}
                  />
                )}

                {(activeHall?.isMultipleDaysBookingEnabled ? selectedDates.length > 0 : selectedDate) && selectedHallId && (
                  <>
                    <Card>
                      {activeHall?.isMultipleDaysBookingEnabled ? (
                        <CardContent className="pt-6">

                            {/* Show dismissable badge of the selected dates
                              it should be in this format: Sept. Tue 12th - 10/80 seats,Fri 13th - 3/80 seats, Sat 14th - 10/80 seats and so on
                              it should be dismissable
                            */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {selectedDates.map((date, index) => {
                                const d = new Date(date);
                                const formatted = format(d, "MMM. EEE do");
                                const queryResult = multipleSeatsQueries[index];
                                const available = queryResult?.data?.availableSeats || 0;
                                const total = queryResult?.data?.totalSeats || activeHall?.defaultTotalSeats || 0;
                                const isLoading = queryResult?.isLoading;
                                
                                return (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-transparent border border-[#FD690C]/30 text-[#FD690C] font-semibold py-1.5 px-3 flex items-center gap-1 rounded-lg"
                                  >
                                    <span>
                                      {formatted} - {isLoading ? "..." : `${available}/${total}`} seats
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                                      className="ml-1 hover:bg-[#FD690C]/10 rounded-full p-0.5 transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </Badge>
                                );
                              })}
                            </div>
                           <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6">
                             <h3 className="font-semibold text-orange-900 mb-2">Auto Seat Allocation</h3>
                             <p className="text-orange-800 text-sm">
                               For multiple day bookings, you don't need to manually select a seat. The system will automatically allocate the next available seat for each day you have selected.
                             </p>
                           </div>
                           <Button
                              onClick={() => setCurrentStep(2)}
                              className="w-full h-[48px] rounded-full"
                              size="lg"
                            >
                              <Ticket fill="" />
                              Continue with {selectedDates.length} selected day(s)
                            </Button>
                        </CardContent>
                      ) : (
                        <>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold">
                            Select your seat
                          </h2>
                          {selectedSeats.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-transparent text-[#FD690C] font-bold"
                            >
                              {selectedSeats.map((s) => s.label).join(", ")}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <SeatGrid
                          seats={seatsData?.allSeats || []}
                          selectedSeats={selectedSeats}
                          onSeatClick={handleSeatClick}
                          isLoading={isLoadingSeats || isLoadingHalls}
                          error={seatsError}
                          onRetry={refetchSeats}
                          seatsData={seatsData}
                          settings={activeHall!}
                        />

                        <Button
                          onClick={handleReserveSeat}
                          disabled={selectedSeats.length === 0}
                          className="w-full h-[48px] rounded-full"
                          size="lg"
                        >
                          <Ticket fill="" />
                          Reserve Seat{" "}
                          {selectedSeats.length > 0 &&
                            `(${selectedSeats.length})`}
                        </Button>
                      </CardContent>
                      </>
                      )}
                    </Card>
                  </>
                )}
              </>
            )}

            {currentStep === 2 && (
              <ReservationForm
                selectedDate={selectedDate}
                selectedDates={activeHall?.isMultipleDaysBookingEnabled ? selectedDates : undefined}
                selectedSeats={selectedSeats}
                validDates={[]} // Empty array since not needed for form
                hallName={activeHall?.name}
                onSubmit={handleFormSubmit}
                isSubmitting={reservationMutation.isPending}
              />
            )}
          </div>

          {/* Right Column - Theater Preview */}
          <div>
            <TheaterPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatReservationPage;
