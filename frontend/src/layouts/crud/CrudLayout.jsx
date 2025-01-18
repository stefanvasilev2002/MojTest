import React from "react";
import AdminNavBar from "../../components/navbar/crud/CrudNavBar.jsx";
import Footer from "../../components/navbar/Footer.jsx";

const CrudLayout = ({ children }) => {
    return (
        <div>
            <AdminNavBar />
            <div className="main-content">
                {children}  {/* This is where the main content of the page will go */}
            </div>
            <Footer/>
        </div>
    );
};

export default CrudLayout;
