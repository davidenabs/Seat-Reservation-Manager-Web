import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/authService';

interface RouteGuardProps {
    children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
    const location = useLocation();

    if (!AuthService.isAuthenticated()) {
        // Redirect to login, save previous destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
