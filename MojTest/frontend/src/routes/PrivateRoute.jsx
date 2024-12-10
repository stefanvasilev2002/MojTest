import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, role } = useAuth();
    const location = useLocation();

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Define role hierarchies
    const roleHierarchy = {
        admin: ['admin', 'teacher', 'student'],
        teacher: ['teacher'],
        student: ['student']
    };

    // Check if user has required role
    const hasPermission = role && roleHierarchy[role?.toLowerCase()]?.includes(requiredRole);

    if (!hasPermission) {
        // Get appropriate redirect path
        let redirectPath;
        switch(role?.toLowerCase()) {
            case 'admin':
                redirectPath = '/crud/hub';
                break;
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