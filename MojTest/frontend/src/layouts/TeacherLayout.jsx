// src/layouts/TeacherLayout.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedNavBarTeacher from "../components/navbar/AuthenticatedNavBarTeacher.jsx";// Teacher Authenticated NavBar
import PublicNavBarTeacher from "../components/navbar/PublicNavBarTeacher.jsx"; // Teacher Public NavBar
import { Outlet } from 'react-router-dom';

const TeacherLayout = () => {
    const { user } = useAuth();  // Get the user state from AuthContext

    return (
        <div>
            {/* Conditionally render NavBar based on user authentication */}
            {user ? <AuthenticatedNavBarTeacher /> : <PublicNavBarTeacher />}

            {/* Main content will be rendered here using Outlet */}
            <main className="p-4">
                <Outlet />  {/* This is where child routes will be rendered */}
            </main>
        </div>
    );
};

export default TeacherLayout;
