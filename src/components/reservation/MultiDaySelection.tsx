import { X, Ticket } from "lucide-react";
import { format } from "date-fns";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MultiDaySelectionProps {
    selectedDates: string[];
    setSelectedDates: (dates: string[]) => void;
    multipleSeatsQueries: any[];
    activeHall: any;
    onContinue: () => void;
    isContinuing?: boolean;
}

const MultiDaySelection = ({
    selectedDates,
    setSelectedDates,
    multipleSeatsQueries,
    activeHall,
    onContinue,
    isContinuing
}: MultiDaySelectionProps) => {
    return (
        <CardContent className="pt-6">
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
                            className="bg-transparent border border-black/30 text-black/85 font-semibold py-1.5 px-3 flex items-center gap-1 rounded-lg"
                        >
                            <span>
                                {formatted} - {isLoading ? "..." : `${available}/${total}`} seats
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                                className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
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
                onClick={onContinue}
                className="w-full h-[48px] rounded-full"
                size="lg"
                disabled={isContinuing}
            >
                <Ticket fill="" />
                {isContinuing ? "Processing..." : `Continue with ${selectedDates.length} selected day(s)`}
            </Button>
        </CardContent>
    );
};

export default MultiDaySelection;
