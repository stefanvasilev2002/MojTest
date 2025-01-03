import React from "react";
import CrudNavBar from "../../components/navbar/crud/CrudNavBar.jsx";

const CrudLayout = ({ children }) => {
    return (
        <div>
            <CrudNavBar />
            <div className="main-content">
                {children}  {/* This is where the main content of the page will go */}
            </div>
        </div>
    );
};

export default CrudLayout;
