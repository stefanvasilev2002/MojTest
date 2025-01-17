import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRoles }) => {
    const { user, role } = useAuth();
    const location = useLocation();

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Convert requiredRoles to array if it's a string
    const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = role?.toLowerCase();

    // If user is admin, allow access to everything
    if (userRole === 'admin') {
        return children;
    }

    // Check if user has required role
    const hasPermission = requiredRolesArray.includes(userRole);

    if (!hasPermission) {
        // Determine redirect path based on role
        const redirectPath = getRedirectPath(userRole);

        // Don't redirect if already on the target path to prevent loops
        if (location.pathname === redirectPath) {
            return children;
        }

        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

const getRedirectPath = (role) => {
    switch(role) {
        case 'teacher':
            return '/teacher-dashboard';
        case 'student':
            return '/student-dashboard';
        default:
            return '/login';
    }
};

export default PrivateRoute;