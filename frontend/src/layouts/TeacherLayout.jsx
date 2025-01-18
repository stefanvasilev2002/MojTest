import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedNavBarTeacher from "../components/navbar/AuthenticatedNavBarTeacher.jsx";
import PublicNavBarTeacher from "../components/navbar/PublicNavBarTeacher.jsx";
import { Outlet } from 'react-router-dom';
import Footer from "../components/navbar/Footer.jsx";
import AdminNavBar from "../components/navbar/crud/CrudNavBar.jsx";

const TeacherLayout = () => {
    const { user, role} = useAuth();

    return (
        <div>
            {/* Conditionally render NavBar based on user authentication */}
            {role === 'teacher' ? <AuthenticatedNavBarTeacher /> : (role === 'admin'
                ? <AdminNavBar /> : <PublicNavBarTeacher />)}


            {/* Main content will be rendered here using Outlet */}
            <main id="main-content" className="p-4">
                <Outlet />  {/* This is where child routes will be rendered */}
            </main>
            <Footer />

        </div>
    );
};

export default TeacherLayout;
