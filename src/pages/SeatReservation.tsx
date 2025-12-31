import { useState, useEffect } from 'react';
import { ChevronLeft, Ticket } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from '@/components/Header';
import DateSelector from '@/components/DateSelector';
import SeatGrid from '@/components/SeatGrid';
import ReservationForm from '@/components/ReservationForm';
import TheaterPreview from '@/components/TheaterPreview';
import type { ReservationFormData } from '@/schemas/reservationSchema';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingService } from '@/services/bookingService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/route';
import { SettingsService } from '@/services/settingsService';
import type { IReservationPayload } from '@/intefaces/reservation';
import type { ISeat } from '@/intefaces/seats';

const SeatReservationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query for fetching available seats
  const {
    data: seatsResponse,
    isLoading: isLoadingSeats,
    error: seatsError,
    refetch: refetchSeats
  } = useQuery({
    queryKey: ['seats', selectedDate],
    queryFn: () => BookingService.fetchAvailableSeats(selectedDate),
    enabled: !!selectedDate,
    staleTime: 30000,
    gcTime: 300000,
  });

  // Query for fetching settings
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
    refetch: refetchSettings
  } = useQuery({
    queryKey: ['settings'],
    queryFn: () => SettingsService.getSettings(),
    staleTime: 30000,
    gcTime: 300000,
  });

  // Mutation for reserving seats
  const reservationMutation = useMutation({
    mutationFn: (payload: IReservationPayload) => BookingService.reserveSeat(payload),
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
        queryClient.invalidateQueries({ queryKey: ['seats'] });
        toast.success(data.message || 'Reservation successful!');

        // storge booking in the booking_details
        localStorage.setItem("booking_details", JSON.stringify(data));

        // Reset form and go to success page
        setCurrentStep(1);
        setSelectedSeats([]);
        setSelectedDate('');
        navigate(ROUTES.BOOKING_SUCCESS);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Reservation failed. Please try again.');
    },
  });

  // Reset selected seats when date changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedDate]);

  const handleSeatClick = (seat: ISeat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s: ISeat) => s.number === seat.number)) {
      setSelectedSeats(selectedSeats.filter((s: ISeat) => s.number !== seat.number));
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
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    // console.log({ selectedDate: localDate.toISOString() });
    // return;
    const payload = {
      eventDate: localDate.toISOString(),
      seatNumbers: selectedSeats.map((s: ISeat) => s.number),
      seatLabels: selectedSeats.map((s: ISeat) => s.label),
      ...formData
    };

    // Store email for OTP verification
    localStorage.setItem("bookingEmail", formData.email);

    reservationMutation.mutate(payload);
  };

  const seatsData = seatsResponse;

  return (
    <div className="min-h-screen bg-[#EDEDED]">
      <Header />

      <div className="max-w-7xl mx-auto p-8">
        <Button
          variant="ghost"
          onClick={() => {
            if (currentStep === 1) {
              // Navigate to home page
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
                <DateSelector
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  isLoading={isLoadingSettings}
                  error={settingsError}
                  onRetry={refetchSettings}
                  settings={settings!}
                />

                {selectedDate && (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold">Select your seat</h2>
                          {selectedSeats.length > 0 && (
                            <Badge variant="secondary" className="bg-transparent text-[#FD690C] font-bold">
                              {selectedSeats.map(s => s.label).join(', ')}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <SeatGrid
                          seats={seatsData?.allSeats || []}
                          selectedSeats={selectedSeats}
                          onSeatClick={handleSeatClick}
                          isLoading={isLoadingSeats|| isLoadingSettings}
                          error={seatsError|| settingsError}
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
                          Reserve Seat {selectedSeats.length > 0 && `(${selectedSeats.length})`}
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