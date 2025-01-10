import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../../context/AuthContext.jsx";

const NavBar = ({ links }) => {
    const { t } = useTranslation("common");
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const AuthButtons = () => (
        !user ? (
            <div className="flex flex-col md:flex-row md:space-x-4">
                <Link
                    to="/login"
                    className="px-4 py-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                    {t("nav.login")}
                </Link>
                <Link
                    to="/register"
                    className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mt-2 md:mt-0"
                >
                    {t("nav.register")}
                </Link>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-white">
                    {t("nav.hello")} {user.fullName}
                </span>
                <button
                    onClick={logout}
                    className="px-4 py-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                    {t("nav.logout")}
                </button>
            </div>
        )
    );

    return (
        <nav className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold">{t("appName")}</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center justify-between flex-1 ml-10">
                        <div className="flex space-x-4">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className="px-3 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                                >
                                    {t(link.label)}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-6">
                            <AuthButtons />
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <LanguageSwitcher />
                        <button
                            onClick={toggleMenu}
                            className="ml-4 inline-flex items-center justify-center p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            to={link.path}
                            className="block px-3 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {t(link.label)}
                        </Link>
                    ))}
                    <div className="mt-4 px-3">
                        <AuthButtons />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;