import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Ticket } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VirtualNavbar from "@/components/VirtualNavbar";
import DateSelector from "@/components/DateSelector";
import SeatGrid from "@/components/SeatGrid";
import ReservationForm from "@/components/ReservationForm";
import TheaterPreview from "@/components/TheaterPreview";
import type { ReservationFormData } from "@/schemas/reservationSchema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingService } from "@/services/bookingService";
import { HallService, } from "@/services/hallService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/config/route";
import type { IReservationPayload } from "@/intefaces/reservation";
import type { ISeat } from "@/intefaces/seats";
import type { ISettings } from "@/intefaces/settings";

const SeatReservationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
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
      setSelectedHallId(halls[0]._id);
    }
  }, [halls, selectedHallId]);

  // Derive settings from the selected hall
  const settings = useMemo(() => {
    if (!halls || !selectedHallId) return undefined;
    const hall = halls.find((h) => h._id === selectedHallId);
    return hall as unknown as ISettings;
  }, [halls, selectedHallId]);

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
    } else if (selectedSeats.length < (settings?.maxSeatsPerUser ?? 2)) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReserveSeat = () => {
    if (selectedSeats.length === 0) return;
    setCurrentStep(2);
  };

  const handleFormSubmit = (formData: ReservationFormData) => {
    const localDate = new Date(selectedDate);
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    // console.log({ selectedDate: localDate.toISOString() });
    // return;
    const payload = {
      eventDate: localDate.toISOString(),
      seatNumbers: selectedSeats.map((s: ISeat) => s.number),
      seatLabels: selectedSeats.map((s: ISeat) => s.label),
      hallId: selectedHallId,
      ...formData,
    };

    // Store email for OTP verification
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


                {selectedHallId && settings && (
                  <DateSelector
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    isLoading={isLoadingHalls}
                    error={null}
                    onRetry={() => {}}
                    settings={settings}
                    halls={halls!}
                    selectedHallId={selectedHallId}
                    onHallChange={(val) => {
                      setSelectedHallId(val);
                      setSelectedDate(""); // reset date when hall changes
                      setSelectedSeats([]); // reset seats
                    }}
                  />
                )}

                {selectedDate && selectedHallId && (
                  <>
                    <Card>
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
                          settings={settings!}
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
                    </Card>
                  </>
                )}
              </>
            )}

            {currentStep === 2 && (
              <ReservationForm
                selectedDate={selectedDate}
                selectedSeats={selectedSeats}
                validDates={[]} // Empty array since not needed for form
                hallName={settings?.name}
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
