import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Logo from "@/assets/tmas-logo-black.png";
import { BookingService } from "@/services/bookingService";
import { toast } from "sonner";
import { ROUTES } from "@/config/route";

interface BookingDetails {
    session: string;
    date: string;
    time: string;
    seat: string;
    location: string;
    bookingId: string;
}

// const BookingService = {
//   cancelReservation: async (ticketId: string) => {
//     // Simulated API call (replace with actual API call)
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return { success: true };
//   },
// };

const CancelReservation = () => {
    const { ticketId, reservationToken } = useParams<{ ticketId: string, reservationToken: string }>();
    const navigate = useNavigate();
    const [bookingDetails, _setBookingDetails] = useState<BookingDetails | null>(null);

    // Load booking details from storage
    useEffect(() => {
        // if (!ticketId && !reservationToken) {
        //     toast.error("No ticket ID provided.");
        //     navigate(ROUTES.HOME);
        // }
    }, [navigate, ticketId, reservationToken]);

    // Mutation for canceling reservation
    const mutation = useMutation({
        mutationFn: ({ ticketId, reservationToken }: { ticketId: string; reservationToken: string }) =>
            BookingService.cancelReservation(ticketId, reservationToken),
        onSuccess: () => {
            toast.success("Reservation Cancelled");
            // Clear storage
            localStorage.removeItem("booking_details");
            localStorage.removeItem("bookingEmail");
            localStorage.removeItem("reservationToken");
            navigate(ROUTES.HOME);
        },
        onError: (error) => {
            toast.error(`Failed to cancel reservation: ${error.message || "Unknown error"}`);
        },
    });

    const handleCancel = () => {
        if (ticketId && reservationToken) {
            mutation.mutate({ ticketId, reservationToken });
        } else {
            toast.error("No ticket ID provided.");
            navigate(ROUTES.HOME);
        }
    };

    const handleGoBack = () => {
        navigate(ROUTES.HOME);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-6">
                        <img src={Logo} alt="TMAS Logo" className="w-36 sm:w-[145.131591796875px]" />
                    </div>
                </div>

                {/* <Button
                    variant="ghost"
                    onClick={handleGoBack}
                    className="mb-2"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Go back
                </Button> */}


                <Card className="border-0 border-t-3 border-t-green-500 shadow-none">

                    <CardHeader className="text-center flex flex-col items-center w-full">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4 animate-pulse">
                            <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Cancel Reservation</h1>
                        <p className="text-gray-600 text-sm">
                            Are you sure you want to cancel your reservation{ticketId ? ` (${ticketId})` : ""}?
                        </p>
                        {bookingDetails && (
                            <p className="text-gray-600 text-sm mt-2">
                                Session: {bookingDetails.session} | Seat: {bookingDetails.seat}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <Button
                                onClick={handleCancel}
                                disabled={mutation.isPending}
                                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-bold"
                            >
                                {mutation.isPending ? "Cancelling..." : "Yes, Cancel Reservation"}
                            </Button>
                            <Button
                                onClick={handleGoBack}
                                disabled={mutation.isPending}
                                variant="outline"
                                className="py-3 border-gray-300 rounded-full"
                            >
                                No, Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Contact support at{" "}
                        <a href="mailto:support@company.com" className="text-blue-800 hover:underline font-medium">
                            support@company.com
                        </a>{" "}
                        for any queries
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CancelReservation;