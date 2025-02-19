import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../../context/AuthContext.jsx";

const NavBar = ({ links }) => {
    const { t } = useTranslation("common");
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add padding to main content
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.paddingTop = '64px';
        }
    }, []);

    // Handle click outside menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-menu')) {
                setOpenDropdown(null);
            }
            if (userMenuOpen && !event.target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [userMenuOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleDropdownClick = (label, event) => {
        event.stopPropagation();
        setOpenDropdown(openDropdown === label ? null : label);
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    const DesktopNavLink = ({ link }) => {
        if (link.dropdown) {
            return (
                <div className="relative dropdown-menu">
                    <button
                        onClick={(e) => handleDropdownClick(link.label, e)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                                 text-blue-100 hover:bg-blue-700/50 hover:text-white
                                 flex items-center space-x-1`}
                    >
                        <span>{t(link.label)}</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform 
                            ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                        <div className="absolute left-0 mt-1 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                                {link.items.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        to={item.path}
                                        onClick={() => setOpenDropdown(null)}
                                        className={`block px-4 py-2 text-sm ${
                                            isActivePath(item.path)
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                    >
                                        {t(item.label)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActivePath(link.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}`}
            >
                {t(link.label)}
            </Link>
        );
    };

    const MobileNavLink = ({ link }) => {
        if (link.dropdown) {
            return (
                <div>
                    <button
                        onClick={(e) => handleDropdownClick(link.label, e)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium
                                 text-blue-100 hover:bg-blue-700/50 hover:text-white
                                 flex items-center justify-between"
                    >
                        <span>{t(link.label)}</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform 
                            ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                        <div className="pl-4 space-y-1">
                            {link.items.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setIsOpen(false);
                                    }}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                                        isActivePath(item.path)
                                            ? 'bg-blue-700 text-white'
                                            : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                                    }`}
                                >
                                    {t(item.label)}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                to={link.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActivePath(link.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
            >
                {t(link.label)}
            </Link>
        );
    };

    const AuthButtons = () => (
        !user ? (
            <div className="flex flex-col md:flex-row md:space-x-4">
                <Link
                    to="/login"
                    className="px-4 py-2 text-white hover:text-blue-100 rounded-lg transition-all duration-200
                             text-sm font-medium text-center"
                >
                    {t("nav.login")}
                </Link>
                <Link
                    to="/register"
                    className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200
                             shadow-sm hover:shadow-md text-sm font-medium text-center"
                >
                    {t("nav.register")}
                </Link>
            </div>
        ) : (
            <div className="user-menu-container relative">
                <button
                    className="flex items-center space-x-2 focus:outline-none relative z-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen(!userMenuOpen);
                    }}
                >
                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                            {user.fullName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-white text-sm hidden md:inline-block">
                        {user.fullName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white hidden md:block transform transition-transform
                        ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                    <div
                        className="fixed md:absolute top-16 md:top-full right-4 md:right-0 w-48
                                 bg-white rounded-lg shadow-lg py-2 md:mt-2 z-50"
                    >
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 md:hidden">
                            {user.fullName}
                        </div>

                        {/* Profile/Settings links could go here */}

                        <button
                            onClick={() => {
                                logout();
                                setUserMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            {t("nav.logout")}
                        </button>
                    </div>
                )}
            </div>
        )
    );

    return (
        <nav
            className={`fixed top-0 left-0 right-0 transition-all duration-200
                     ${isScrolled ? 'bg-blue-600/95 backdrop-blur-sm shadow-md' : 'bg-blue-600'}
                     ${isOpen ? 'bg-blue-600' : ''}`}
            style={{ zIndex: 40 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-clip-text text-transparent
                                         bg-gradient-to-r from-white to-blue-100">
                                {t("appName")}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center justify-between flex-1 ml-10">
                        <div className="flex space-x-1">
                            {links.map((link, index) => (
                                <DesktopNavLink key={index} link={link} />
                            ))}
                        </div>

                        <div className="flex items-center space-x-6">
                            <AuthButtons />
                            <div className="border-l border-blue-500 h-6 mx-4"></div>
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <LanguageSwitcher />
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-lg
                                     hover:bg-blue-700/50 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6 text-white" />
                            ) : (
                                <Menu className="h-6 w-6 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden
                         ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg">
                    {links.map((link, index) => (
                        <MobileNavLink key={index} link={link} />
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