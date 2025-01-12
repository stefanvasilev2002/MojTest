import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedNavBarTeacher from "../components/navbar/AuthenticatedNavBarTeacher.jsx";
import PublicNavBarTeacher from "../components/navbar/PublicNavBarTeacher.jsx";
import { Outlet } from 'react-router-dom';
import Footer from "../components/navbar/Footer.jsx";

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
            <Footer />

        </div>
    );
};

export default TeacherLayout;
