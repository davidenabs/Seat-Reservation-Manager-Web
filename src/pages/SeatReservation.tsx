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
import { BookingService, type ReservationPayload } from '@/services/bookingService';
import { useNavigate } from 'react-router-dom';

const SeatReservationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

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

  // Mutation for reserving seats
  const reservationMutation = useMutation({
    mutationFn: (payload: ReservationPayload) => BookingService.reserveSeat(payload),
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

        // Reset form and go to success page
        setCurrentStep(1);
        setSelectedSeats([]);
        setSelectedDate('');
        // navigate(ROUTES.BOOKING_SUCCESS);
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

  const handleSeatClick = (seat: { isAvailable: any; number: any; }) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s: { number: any; }) => s.number === seat.number)) {
      setSelectedSeats(selectedSeats.filter((s: { number: any; }) => s.number !== seat.number));
    } else if (selectedSeats.length < 2) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReserveSeat = () => {
    if (selectedSeats.length === 0) return;
    setCurrentStep(2);
  };

  const handleFormSubmit = (formData: ReservationFormData) => {
    const payload = {
      eventDate: new Date(selectedDate).toISOString(),
      seatNumbers: selectedSeats.map((s: { number: any; }) => s.number),
      seatLabels: selectedSeats.map((s: { label: any; }) => s.label),
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
                  validDates={[]} // Empty array since date picker handles validation internally
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
                          isLoading={isLoadingSeats}
                          error={seatsError}
                          onRetry={refetchSeats}
                          seatsData={seatsData}
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