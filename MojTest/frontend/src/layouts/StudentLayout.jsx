// src/layouts/StudentLayout.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedNavBarStudent from "../components/navbar/AuthenticatedNavBarStudent.jsx";
import PublicNavBarStudent from "../components/navbar/PublicNavBarStudent.jsx";
import { Outlet } from 'react-router-dom';

const StudentLayout = () => {
    const { user } = useAuth();  // Get the user state from AuthContext

    console.log("Student layout loaded")

    return (
        <div>
            {/* Conditionally render NavBar based on user authentication */}
            {user ? <AuthenticatedNavBarStudent /> : <PublicNavBarStudent />}

            {/* Main content will be rendered here using Outlet */}
            <main className="p-4">
                <Outlet />  {/* This is where child routes will be rendered */}
            </main>
        </div>
    );
};

export default StudentLayout;
