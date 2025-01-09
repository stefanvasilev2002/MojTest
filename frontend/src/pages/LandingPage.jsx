import React from 'react';
import LandingNavBar from "../components/navbar/LandingNavBar.jsx";
import testImage from '../assets/test-image.jpg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import for translations

const LandingPage = () => {
    const { t } = useTranslation('common'); // Get the translation using the common namespace
    const navigate = useNavigate();

    return (
        <div>
            <div className="w-100 mx-auto mt-10 text-center">
                {/* Welcome Title */}
                <h1 className="text-6xl font-bold text-blue-600 animate-fadeIn">
                    {t("landingPage.welcomeTitle")} <span className="font-extrabold">{t("landingPage.platformName")}</span>
                </h1>

                {/* Description */}
                <h2 className="mt-2 text-2xl text-gray-600 animate-fadeIn delay-1">
                    {t("landingPage.description")}
                </h2>

                <div className="flex flex-col sm:flex-row w-12/13 mx-auto mt-7 h-2/3">
                    <div className="w-full sm:w-2/4">
                        <img
                            src={testImage}
                            alt={t('landingPage.imageAlt')}
                            className="max-w-md mt-6 w-full sm:w-2/3 mx-auto transition-transform duration-500 hover:scale-105"
                        />
                        <div
                            className="mt-6 w-full sm:w-2/3 mx-auto bg-blue-600 h-24 rounded-[24px] hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                            onClick={() => navigate('/register')}
                        >
                            <h2 className="pt-2 text-4xl text-white">{t("landingPage.getStarted")}</h2>
                            <h2 className="pt-2 text-1xl text-white underline">{t("landingPage.registerNow")}</h2>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full sm:w-2/4 text-center">
                        <h1 className="mt-3 text-2xl font-semibold text-gray-600">
                            {t("landingPage.exploreFeatures")}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-8 mt-6">
                            {/* Student Card */}
                            <div
                                className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-2/3 text-center hover:shadow-2xl hover:scale-105 transition duration-300"
                            >
                                <Link to="/about-student">
                                    <div className="mb-4 text-blue-600 flex">
                                        <FaUserGraduate
                                            size={50}
                                            className="transition-transform duration-300 hover:scale-110"
                                        />
                                        <h3 className="ms-4 text-start text-2xl font-semibold text-gray-700">
                                            <span
                                                className="underline font-bold">{t("landingPage.studentCardTitle")}</span>
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 mt-2 text-start">
                                        {t("landingPage.studentCardDescription")}
                                    </p>
                                </Link>
                            </div>

                            {/* Teacher Card */}
                            <div
                                className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-2/3 text-center hover:shadow-2xl hover:scale-105 transition duration-300"
                            >
                                <Link to="/about-teacher">
                                    <div className="mb-4 text-blue-600 flex">
                                        <FaChalkboardTeacher
                                            size={50}
                                            className="transition-transform duration-300 hover:scale-110"
                                        />
                                        <h3 className="ms-4 text-start text-2xl font-semibold text-gray-700">
                                            <span
                                                className="underline font-bold">{t("landingPage.teacherCardTitle")}</span>
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 mt-2 text-start">
                                        {t("landingPage.teacherCardDescription")}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
