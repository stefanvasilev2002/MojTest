import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaLaptop,
    FaChartLine,
    FaClock,
    FaUsers
} from 'react-icons/fa';
import Footer from "../components/navbar/Footer.jsx";

const LandingPage = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    const stats = [
        { number: "1000+", label: t("landingPage.stats.tests") },
        { number: "50k+", label: t("landingPage.stats.students") },
        { number: "95%", label: t("landingPage.stats.satisfaction") }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            <h1>Test for auto deploy</h1>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 pt-8 sm:pb-16 sm:pt-16 md:pb-20 md:pt-20 lg:pb-28 lg:pt-28">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20">
                            <div className="text-center">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl font-bold text-blue-600 tracking-tight"
                                >
                                    {t("landingPage.welcomeTitle")}
                                    <span> </span>
                                    <span className="text-blue-800 font-extrabold">
                                        {t("landingPage.platformName")}
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl md:mt-5 md:max-w-3xl"
                                >
                                    {t("landingPage.description")}
                                </motion.p>

                                <div className="mt-10 flex justify-center gap-x-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => navigate('/register')}
                                    >
                                        {t("landingPage.getStarted")}
                                    </motion.button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    {t("landingPage.exploreFeatures")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Student Card */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-xl shadow-xl overflow-hidden"
                    >
                        <Link to="/about-student" className="block p-6">
                            <div className="flex items-center mb-4">
                                <FaUserGraduate className="text-blue-600 text-4xl" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-800">
                                    {t("landingPage.studentCardTitle")}
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                {t("landingPage.studentCardDescription")}
                            </p>
                        </Link>
                    </motion.div>

                    {/* Teacher Card */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-xl shadow-xl overflow-hidden"
                    >
                        <Link to="/about-teacher" className="block p-6">
                            <div className="flex items-center mb-4">
                                <FaChalkboardTeacher className="text-blue-600 text-4xl" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-800">
                                    {t("landingPage.teacherCardTitle")}
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                {t("landingPage.teacherCardDescription")}
                            </p>
                        </Link>
                    </motion.div>

                    {/* Platform Features Card */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <FaLaptop className="text-blue-600 text-4xl" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-800">
                                    {t("landingPage.platformFeatures")}
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                {t("landingPage.platformDescription")}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Creators Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    {t("landingPage.creators.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stefan Vasilev */}
                    <motion.div
                        whileHover={{scale: 1.05}}
                        className="bg-blue-50 rounded-xl shadow-lg overflow-hidden p-6 text-center"
                    >
                        <div
                            className="w-24 h-24 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl text-white font-bold">SV</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landingPage.creators.stefan.name")}</h3>
                        <p className="text-gray-600">{t("landingPage.creators.stefan.role")}</p>
                    </motion.div>

                    {/* Andrej Gencovski */}
                    <motion.div
                        whileHover={{scale: 1.05}}
                        className="bg-blue-50 rounded-xl shadow-lg overflow-hidden p-6 text-center"
                    >
                        <div
                            className="w-24 h-24 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl text-white font-bold">AG</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landingPage.creators.andrej.name")}</h3>
                        <p className="text-gray-600">{t("landingPage.creators.andrej.role")}</p>
                    </motion.div>

                    {/* Aleksandar Sandev */}
                    <motion.div
                        whileHover={{scale: 1.05}}
                        className="bg-blue-50 rounded-xl shadow-lg overflow-hidden p-6 text-center"
                    >
                        <div
                            className="w-24 h-24 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl text-white font-bold">AS</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landingPage.creators.aleksandar.name")}</h3>
                        <p className="text-gray-600">{t("landingPage.creators.aleksandar.role")}</p>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        {t("landingPage.ctaTitle")}
                    </h2>
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-900 shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={() => navigate('/register')}
                    >
                        {t("landingPage.registerNow")}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;