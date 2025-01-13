import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedNavBarStudent from "../components/navbar/AuthenticatedNavBarStudent.jsx";
import PublicNavBarStudent from "../components/navbar/PublicNavBarStudent.jsx";
import { Outlet } from 'react-router-dom';
import Footer from "../components/navbar/Footer.jsx";

const StudentLayout = () => {
    const { user } = useAuth();

    return (
        <div>
            {/* Conditionally render NavBar based on user authentication */}
            {user ? <AuthenticatedNavBarStudent /> : <PublicNavBarStudent />}

            {/* Main content will be rendered here using Outlet */}
            <main id="main-content" className="p-4">
                <Outlet />  {/* This is where child routes will be rendered */}
            </main>
            <Footer />

        </div>
    );
};

export default StudentLayout;
