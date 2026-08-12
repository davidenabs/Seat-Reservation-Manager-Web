import SeatReservationPage from "@/pages/SeatReservation";
import BookingTicket from "@/pages/BookingTicket";
import VerifyEmail from "@/pages/VerifyEmail";
import BookingVerify from "@/pages/BookingVerify";
import PaymentVerify from "@/pages/PaymentVerify";
import CancelReservation from "@/pages/CancelReservation";
import PaymentOptions from "@/pages/PaymentOptions";
import Subscription from "@/pages/Subscription";
import MemberDashboard from "@/pages/MemberDashboard";
import WaitingRoom from "@/pages/WaitingRoom";
import Auth from "@/pages/Auth";
import UserForgotPassword from "@/pages/UserForgotPassword";
import UserResetPassword from "@/pages/UserResetPassword";
import Transactions from "@/pages/Transactions";
import Profile from "@/pages/Profile";
import Resources from "@/pages/Resources";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import ZoomPortal from "@/pages/ZoomPortal";
import type { CustomRouteObject } from "@/types/route.type";
import { ROUTES } from "@/config/route";
import RouteGuard from "@/components/RouteGuard";
import HomePage from "@/pages/HomePage";

export const reservationRoutes: CustomRouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <HomePage />,
    },
    {
        path: ROUTES.MEMBER,
        element: <RouteGuard><MemberDashboard /></RouteGuard>,
        layout: DashboardLayout,
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
        element: <BookingVerify />,
    },
    {
        path: "/payment/verify",
        element: <PaymentVerify />,
    },
    {
        path: ROUTES.PAYMENT_OPTIONS,
        element: <PaymentOptions />,
    },
    {
        path: ROUTES.CANCEL,
        element: <CancelReservation />,
    },
    {
        path: ROUTES.LOGIN,
        element: <Auth />,
    },
    {
        path: ROUTES.REGISTER,
        element: <Auth />,
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
        element: <VerifyEmail />,
    },
    {
        path: ROUTES.SUBSCRIPTION,
        element: <Subscription />,
    },
    {
        path: ROUTES.TRANSACTIONS,
        element: <RouteGuard><Transactions /></RouteGuard>,
        layout: DashboardLayout,
    },
    {
        path: ROUTES.PROFILE,
        element: <RouteGuard><Profile /></RouteGuard>,
        layout: DashboardLayout,
    },
    {
        path: ROUTES.RESOURCES,
        element: <RouteGuard><Resources /></RouteGuard>,
        layout: DashboardLayout,
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
