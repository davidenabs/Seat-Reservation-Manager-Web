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
    handleSeatClick,
    handleReserveSeat,
    handleFormSubmit,
    navigate,
  } = useSeatReservation();

  return (
    <div className="min-h-screen bg-morayo-bg text-morayo-ink antialiased font-sans text-[14px] leading-[1.5] pt-[60px]">
      <VirtualNavbar />

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
                          onContinue={() => setCurrentStep(2)}
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

            {currentStep === 2 && (
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
