import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/config/route";
import { type CustomRouteObject } from "@/types/route.type";
import NotFoundPage from "@/pages/NotFoundPage";
import SeatReservationPage from "@/pages/SeatReservation";
import RouteWrapper from "@/components/RouteWrapper";
import BookingTicket from "@/pages/BookingTicket";
import VerifyEmail from "@/pages/VerifyEmail";
import CancelReservation from "@/pages/CancelReservation";

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

const AppRoutes = () => {
    return (
        <Router>
            <Routes>

                {reservationRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <RouteWrapper
                                element={route.element}
                                layout={route.layout}
                                layoutProps={route.layoutProps}
                            />
                        }
                    />
                ))}

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
