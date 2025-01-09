import React from "react";
import NavBar from "./NavBar.jsx";
import {useTranslation} from "react-i18next";

const AuthenticatedNavBarStudent = () => {
    const { t } = useTranslation("common");
    const links = [
        { label: "nav.studentDashboard", path: "/student-dashboard" },
        { label: "nav.settings", path: "/student-settings" },
    ];

    return <NavBar links={links} />;
};

export default AuthenticatedNavBarStudent;
