import React from "react";
const Alert = ({ message, type = "error" }) => {
    const alertStyles = {
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
        success: "bg-green-500 text-white",
    };

    return (
        <div className={`p-4 rounded-lg mb-4 ${alertStyles[type]}`}>
            <strong>{type === "error" ? "Error" : type.charAt(0).toUpperCase() + type.slice(1)}:</strong> {message}
        </div>
    );
};

export default Alert;