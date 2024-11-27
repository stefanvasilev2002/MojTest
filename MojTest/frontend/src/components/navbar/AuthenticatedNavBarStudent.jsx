// src/components/AuthenticatedNavBarStudent.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth} from "../../context/AuthContext.jsx";
import NavBar from "./NavBar.jsx";
import {useTranslation} from "react-i18next";  // Reuse the generic NavBar component

const AuthenticatedNavBarStudent = () => {
    const { t } = useTranslation("common");
    const links = [
        { label: "nav.studentDashboard", path: "/student-dashboard" },
        { label: "nav.settings", path: "/settings" },
    ];

    return <NavBar links={links} />;
};

export default AuthenticatedNavBarStudent;
