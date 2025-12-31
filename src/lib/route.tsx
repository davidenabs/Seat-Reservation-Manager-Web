import SeatReservationPage from "@/pages/SeatReservation";
import BookingTicket from "@/pages/BookingTicket";
import VerifyEmail from "@/pages/VerifyEmail";
import CancelReservation from "@/pages/CancelReservation";
import type { CustomRouteObject } from "@/types/route.type";
import { ROUTES } from "@/config/route";

export const reservationRoutes: CustomRouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <SeatReservationPage />,
    },
    {
        path: ROUTES.BOOKING_SUCCESS,
        element: <BookingTicket />,
    },
    {
        path: ROUTES.VERIFY,
        element: <VerifyEmail />,
    },
    {
        path: ROUTES.CANCEL,
        element: <CancelReservation />,
    }
];
