// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user, role } = useAuth();

    // If the user is logged in, redirect to the appropriate dashboard
    if (user) {
        // If role is teacher, redirect to teacher-dashboard, else student-dashboard
        return role === "teacher" ? <Navigate to="/teacher-dashboard" /> : <Navigate to="/student-dashboard" />;
    }

    // If not logged in, show the public page
    return children;
};

export default PublicRoute;
