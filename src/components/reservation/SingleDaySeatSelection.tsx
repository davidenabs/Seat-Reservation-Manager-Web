import { Ticket } from "lucide-react";
import { CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SeatGrid from "@/components/SeatGrid";
import type { ISeat } from "@/intefaces/seats";

interface SingleDaySeatSelectionProps {
    selectedSeats: ISeat[];
    seatsData: any;
    isLoading: boolean;
    error: any;
    activeHall: any;
    onSeatClick: (seat: ISeat) => void;
    onReserve: () => void;
    onRetry: () => void;
}

const SingleDaySeatSelection = ({
    selectedSeats,
    seatsData,
    isLoading,
    error,
    activeHall,
    onSeatClick,
    onReserve,
    onRetry
}: SingleDaySeatSelectionProps) => {
    return (
        <>
            <CardHeader>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Select your seat</h2>
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
                    onSeatClick={onSeatClick}
                    isLoading={isLoading}
                    error={error}
                    onRetry={onRetry}
                    seatsData={seatsData}
                    settings={activeHall!}
                />

                <Button
                    onClick={onReserve}
                    disabled={selectedSeats.length === 0}
                    className="w-full h-[48px] rounded-full"
                    size="lg"
                >
                    <Ticket fill="" />
                    Reserve Seat{" "}
                    {selectedSeats.length > 0 && `(${selectedSeats.length})`}
                </Button>
            </CardContent>
        </>
    );
};

export default SingleDaySeatSelection;
