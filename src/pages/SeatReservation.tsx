import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import VirtualNavbar from "@/components/VirtualNavbar";
import ReservationForm from "@/components/ReservationForm";
import TheaterPreview from "@/components/TheaterPreview";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/route";
import EventAndDateSelector from "@/components/EventAndDateSelector";
import MultiDaySelection from "@/components/reservation/MultiDaySelection";
import SingleDaySeatSelection from "@/components/reservation/SingleDaySeatSelection";
import { useSeatReservation } from "@/hooks/useSeatReservation";
import EditBookingOTPModal from "@/components/reservation/EditBookingOTPModal";

const SeatReservationPage = () => {
  const {
    currentStep,
    setCurrentStep,
    selectedDate,
    setSelectedDate,
    selectedDates,
    setSelectedDates,
    selectedSeats,
    setSelectedSeats,
    selectedHallId,
    setSelectedHallId,
    halls,
    activeHall,
    seatsResponse,
    isLoadingSeats,
    seatsError,
    refetchSeats,
    isLoadingHalls,
    multipleSeatsQueries,
    reservationMutation,
    editMutation,
    handleSeatClick,
    handleReserveSeat,
    handleFormSubmit,
    navigate,
    editEmail,
    setEditEmail
  } = useSeatReservation();

  const handleEditVerified = (email: string, bookings: any[]) => {
    setEditEmail(email);
    if (bookings.length > 0) {
      const hallId = bookings[0].hall?._id || bookings[0].hall;
      setSelectedHallId(hallId);
      
      const dates = bookings.map(b => b.eventDate.split('T')[0]);
      setSelectedDates(dates);
      if (dates.length > 0) setSelectedDate(dates[0]);

      // Handle single-day seat pre-selection
      if (bookings[0].seatLabels && bookings[0].seatNumbers) {
        const preselectedSeats = bookings[0].seatLabels.map((label: string, idx: number) => ({
          label,
          number: bookings[0].seatNumbers[idx],
          status: 'selected'
        }));
        setSelectedSeats(preselectedSeats);
      }
      setSelectedDates(dates);
      if (dates.length > 0) setSelectedDate(dates[0]);
    }
  };

  return (
    <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
      <VirtualNavbar />
      <EditBookingOTPModal onVerified={handleEditVerified} />

      <div className="max-w-7xl mx-auto p-8">
        <Button
          variant="ghost"
          onClick={() => {
            if (currentStep === 1) {
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

        {editEmail && (
          <div className="mb-4 p-4 bg-black-50 border border-black-200 rounded-lg">
            <p className="text-black-800 font-medium">Edit Mode Active ({editEmail})</p>
            <p className="text-sm text-black-600">You can add or remove dates from your booking. Once finished, click Continue to confirm changes and regenerate your payment link.</p>
          </div>
        )}

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
                    isEditMode={!!editEmail}
                    onHallChange={(val) => {
                      if (editEmail) return; // Prevent changing hall in edit mode
                      setSelectedHallId(val);
                      setSelectedDate("");
                      setSelectedDates([]);
                      setSelectedSeats([]);
                    }}
                  />
                )}

                {(activeHall?.isMultipleDaysBookingEnabled ? selectedDates.length > 0 : selectedDate) && selectedHallId && (
                  <>
                    <Card>
                      {activeHall?.isMultipleDaysBookingEnabled ? (
                        <MultiDaySelection
                          selectedDates={selectedDates}
                          setSelectedDates={setSelectedDates}
                          multipleSeatsQueries={multipleSeatsQueries}
                          activeHall={activeHall}
                          onContinue={handleReserveSeat}
                          isContinuing={editMutation.isPending}
                        />
                      ) : (
                        <SingleDaySeatSelection
                          selectedSeats={selectedSeats}
                          seatsData={seatsResponse}
                          isLoading={isLoadingSeats || isLoadingHalls}
                          error={seatsError}
                          activeHall={activeHall}
                          onSeatClick={handleSeatClick}
                          onReserve={handleReserveSeat}
                          onRetry={refetchSeats}
                        />
                      )}
                    </Card>
                  </>
                )}
              </>
            )}

            {currentStep === 2 && !editEmail && (
              <ReservationForm
                selectedDate={selectedDate}
                selectedDates={activeHall?.isMultipleDaysBookingEnabled ? selectedDates : undefined}
                selectedSeats={selectedSeats}
                validDates={[]}
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
