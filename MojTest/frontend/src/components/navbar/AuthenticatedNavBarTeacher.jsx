// src/components/AuthenticatedNavBarTeacher.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth} from "../../context/AuthContext.jsx";
import NavBar from "./NavBar";
import {useTranslation} from "react-i18next";  // Reuse the generic NavBar component

const AuthenticatedNavBarTeacher = () => {
    const { t } = useTranslation("common");
    const links = [
        { label: "nav.teacherDashboard", path: "/teacher-dashboard" },
        { label: "nav.settings", path: "/settings" },
    ];

    return <NavBar links={links} />;
};

export default AuthenticatedNavBarTeacher;
