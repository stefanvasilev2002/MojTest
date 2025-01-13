import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedNavBarTeacher from "../components/navbar/AuthenticatedNavBarTeacher.jsx";
import AuthenticatedNavBarStudent from "../components/navbar/AuthenticatedNavBarStudent.jsx";
import { Outlet } from 'react-router-dom';
import Footer from "../components/navbar/Footer.jsx";

const UserLayout = () => {
    const { user, role } = useAuth();

    return (
        <div>
            {/* Conditionally render NavBar based on user role */}
            {user && role === 'teacher' ? (
                <AuthenticatedNavBarTeacher />
            ) : user && role === 'student' ? (
                <AuthenticatedNavBarStudent />
            ) : null}

            {/* Main content will be rendered here using Outlet */}
            <main id="main-content" className="p-4">
                <Outlet />  {/* This is where child routes will be rendered */}
            </main>
            <Footer />

        </div>
    );
};

export default UserLayout;
