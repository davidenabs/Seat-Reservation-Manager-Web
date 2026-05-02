import SeatReservationPage from "@/pages/SeatReservation";
import BookingTicket from "@/pages/BookingTicket";
import VerifyEmail from "@/pages/VerifyEmail";
import CancelReservation from "@/pages/CancelReservation";
import Subscription from "@/pages/Subscription";
import MemberDashboard from "@/pages/MemberDashboard";
import WaitingRoom from "@/pages/WaitingRoom";
import UserLogin from "@/pages/UserLogin";
import UserRegister from "@/pages/UserRegister";
import UserForgotPassword from "@/pages/UserForgotPassword";
import UserResetPassword from "@/pages/UserResetPassword";
import UserVerifyEmail from "@/pages/UserVerifyEmail";
import ZoomPortal from "@/pages/ZoomPortal";
import type { CustomRouteObject } from "@/types/route.type";
import { ROUTES } from "@/config/route";
import RouteGuard from "@/components/RouteGuard";

export const reservationRoutes: CustomRouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <SeatReservationPage />,
    },
    {
        path: ROUTES.MEMBER,
        element: <RouteGuard><MemberDashboard /></RouteGuard>,
    },
    {
        path: ROUTES.WAITING,
        element: <RouteGuard><WaitingRoom /></RouteGuard>,
    },
    {
        path: ROUTES.RESERVE,
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
    },
    {
        path: ROUTES.LOGIN,
        element: <UserLogin />,
    },
    {
        path: ROUTES.REGISTER,
        element: <UserRegister />,
    },
    {
        path: ROUTES.FORGOT_PASSWORD,
        element: <UserForgotPassword />,
    },
    {
        path: ROUTES.RESET_PASSWORD,
        element: <UserResetPassword />,
    },
    {
        path: ROUTES.VERIFY_EMAIL,
        element: <UserVerifyEmail />,
    },
    {
        path: ROUTES.SUBSCRIPTION,
        element: <Subscription />,
    },
    {
        path: "/zoom-portal",
        element: <ZoomPortal />,
    },
    // {
    //     path: "*",
    //     element: <Navigate to={ROUTES.HOME} replace />,
    // }
];
