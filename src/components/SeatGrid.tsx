import { Button } from "@/components/ui/button";
import type { SeatsResponse } from "@/services/bookingService";

interface Seat {
  number: number;
  label: string;
  isAvailable: boolean;
}

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  seatsData: SeatsResponse |undefined;
}

const SeatGrid = ({
  seats,
  selectedSeats,
  onSeatClick,
  isLoading,
  error,
  onRetry,
  seatsData
}: SeatGridProps) => {
  const getSeatClass = (seat: Seat) => {
    const baseClass = "w-8 h-8 text-xs font-medium rounded-sm transition-colors flex items-center justify-center border";

    if (!seat.isAvailable) {
      return `${baseClass} bg-[#9CA3AF] text-white cursor-not-allowed border-[#9CA3AF]`;
    }

    if (selectedSeats.find(s => s.number === seat.number)) {
      return `${baseClass} bg-black text-white border-black`;
    }

    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-black/10 border-gray-200 cursor-pointer`;
  };

  if (isLoading) {
    return (
      <p className="text-gray-500 text-center py-8">Loading seats...</p>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-xs mb-4">Error loading seats: {error.message}</p>
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="">

      {/* Stage */}
      <div className="text-center mb-4 ">
        <div className="bg-[#F6F6F6] text-gray-700 py-2 px-4 rounded-lg text-sm">
          STAGE
        </div>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-10 gap-2 mb-6">
        {seats.map((seat) => (
          <button
            key={seat.number}
            onClick={() => onSeatClick(seat)}
            className={getSeatClass(seat)}
            disabled={!seat.isAvailable}
          >
            {seat.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      {seatsData && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg">{seatsData.totalSeats}</div>
              <div className="text-gray-600">Total Seats</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-green-600">{seatsData.availableSeats}</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-red-600">{seatsData.bookedSeats}</div>
              <div className="text-gray-600">Booked</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded-sm"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-black rounded-sm"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#9CA3AF] rounded-sm"></div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selection Info */}
      <div className="text-center mb-4 text-sm text-gray-600">
        {selectedSeats.length === 0 && "Select up to 2 seats"}
        {selectedSeats.length === 1 && "You can select 1 more seat"}
        {selectedSeats.length === 2 && "Maximum seats selected"}
      </div>
    </div>
  );
};

export default SeatGrid;