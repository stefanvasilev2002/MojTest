import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user, role } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // If user is not authenticated, render children
    if (!user) {
        return children;
    }

    // If user is authenticated, redirect based on role
    let redirectPath;
    switch(role?.toLowerCase()) {
        case 'admin':
            redirectPath = '/admin';
            break;
        case 'teacher':
            redirectPath = '/teacher-dashboard';
            break;
        case 'student':
            redirectPath = '/student-dashboard';
            break;
        default:
            redirectPath = '/';
    }

    // Don't redirect if already on the target path
    if (location.pathname === redirectPath) {
        return children;
    }

    return <Navigate to={redirectPath} replace />;
};

export default PublicRoute;