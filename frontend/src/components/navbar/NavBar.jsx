import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth} from "../../context/AuthContext.jsx";

const NavBar = ({ links }) => {
    const { t } = useTranslation("common");
    const { user, logout } = useAuth();
    console.log('userfromnavabr:', user);
    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
            {/* Left: Logo/Application Name */}
            <div className="text-lg font-bold">{t("appName")}</div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex space-x-4 items-center">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.path}
                        className="hover:underline text-white"
                    >
                        {t(link.label)}
                    </Link>
                ))}
                {/* User Greeting and Login/Logout Button */}
                <div className="ml-4 flex items-center space-x-4">
                    {!user ? (
                        <div>
                            <Link to="/login" className="text-white hover:underline mr-2">
                                {t("nav.login")}
                            </Link>
                            <Link to="/register" className="text-white hover:underline">
                                {t("nav.register")}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <span className="text-white">
                                {t("nav.hello")} {user.fullName}
                            </span>
                            <button
                                onClick={logout}
                                className="text-white hover:underline"
                            >
                                {t("nav.logout")}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Right: Language Switcher */}
            <div className="relative">
                <LanguageSwitcher />
            </div>
        </nav>
    );
};

export default NavBar;