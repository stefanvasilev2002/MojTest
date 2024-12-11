import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, role } = useAuth();
    const location = useLocation();
    console.log(user);
    console.log(role);

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If user is admin, allow access to everything
    if (role?.toLowerCase() === 'admin') {
        return children;
    }

    // For non-admin users, check role hierarchy
    const roleHierarchy = {
        teacher: ['teacher'],
        student: ['student']
    };

    // Check if user has required role
    const hasPermission = Array.isArray(requiredRole)
        ? requiredRole.some(role => roleHierarchy[role?.toLowerCase()]?.includes(role?.toLowerCase()))
        : roleHierarchy[role?.toLowerCase()]?.includes(requiredRole);

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