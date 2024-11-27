// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, role } = useAuth();

    // If the user is not logged in, redirect to the landing page
    if (!user) {
        return <Navigate to="/" />;
    }

    // If the user does not have the required role, redirect them to the home page or another route
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" />;
    }

    // If the user is authenticated and has the correct role, render the children (protected route)
    return children;
};

export default PrivateRoute;
