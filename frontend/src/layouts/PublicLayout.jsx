import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingNavBar from "../components/navbar/LandingNavBar.jsx";
import PublicNavBarStudent from "../components/navbar/PublicNavBarStudent.jsx";
import PublicNavBarTeacher from "../components/navbar/PublicNavBarTeacher.jsx";
import Footer from "../components/navbar/Footer.jsx";

const PublicLayout = ({ children }) => {
    const location = useLocation();

    const getNavBar = () => {
        if (location.pathname === '/about-student') {
            return <PublicNavBarStudent />;
        } else if (location.pathname === '/about-teacher') {
            return <PublicNavBarTeacher />;
        }
        else if (location.pathname === '/reset-password' || location.pathname === '/register') {
            return;
        }
        return <LandingNavBar />;
    };

    return (
        <div>
            {getNavBar()}
            <div className="main-content">
                {children}  {/* This is where the main content of the page will go */}
            </div>
            <Footer />
        </div>
    );
};

export default PublicLayout;
