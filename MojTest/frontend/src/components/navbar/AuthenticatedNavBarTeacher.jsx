import React from "react";

import NavBar from "./NavBar";
import {useTranslation} from "react-i18next";

const AuthenticatedNavBarTeacher = () => {
    const { t } = useTranslation("common");
    const links = [
        { label: "nav.teacherDashboard", path: "/teacher-dashboard" },
        { label: "nav.settings", path: "/settings" },
    ];

    return <NavBar links={links} />;
};

export default AuthenticatedNavBarTeacher;
