import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingNavBar from "../components/navbar/LandingNavBar.jsx";  // Assuming you have this
import PublicNavBarStudent from "../components/navbar/PublicNavBarStudent.jsx"; // Your public student nav
import PublicNavBarTeacher from "../components/navbar/PublicNavBarTeacher.jsx";  // Your public teacher nav

const PublicLayout = ({ children }) => {
    const location = useLocation();  // To get the current route

    // Determine which NavBar to use based on the current route
    const getNavBar = () => {
        if (location.pathname === '/about-student') {
            return <PublicNavBarStudent />;
        } else if (location.pathname === '/about-teacher') {
            return <PublicNavBarTeacher />;
        }
        return <LandingNavBar />;  // Default to LandingNavBar
    };

    return (
        <div>
            {getNavBar()}
            <div className="main-content">
                {children}  {/* This is where the main content of the page will go */}
            </div>
        </div>
    );
};

export default PublicLayout;
