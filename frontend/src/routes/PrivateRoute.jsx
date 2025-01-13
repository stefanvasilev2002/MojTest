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

    // If user is admin, allow access to everything
    if (role?.toLowerCase() === 'admin') {
        return children;
    }

    // Check if user has required role

    const userRoles = [role];
    let hasPermission = false;

    for(let i = 0; i < userRoles.length; i++) {
        if (requiredRoles.includes(userRoles[i])) {
            hasPermission = true;
        }
    }


    if (!hasPermission) {
        // Get appropriate redirect path based on role
        let redirectPath;
        switch(role?.toLowerCase()) {
            case 'teacher':
                redirectPath = '/teacher-dashboard';
                break;
            case 'student':
                redirectPath = '/student-dashboard';
                break;
            default:
                redirectPath = '/login';
        }

        // Don't redirect if already on the target path
        if (location.pathname === redirectPath) {
            return children;
        }

        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default PrivateRoute;