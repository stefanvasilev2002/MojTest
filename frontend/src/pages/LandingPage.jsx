import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import LandingNavBar from '../components/navbar/LandingNavBar';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const LandingPage = () => {
    const { t } = useTranslation('common');  // Use 'common' namespace for translations

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Add the custom LandingNavBar */}
            <div className="flex flex-col justify-center items-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-blue-600">{t('landingPageTitle')}</h1>
                    <p className="mt-4 text-lg text-gray-600">{t('landingPageDescription')}</p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8">
                    {/* Student Card */}
                    <motion.div
                        className="bg-white shadow-lg rounded-lg p-6 w-64 text-center hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/about-student">
                            <div className="mb-4 text-blue-600">
                                <FaUserGraduate size={50} />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-700">{t('studentCardTitle')}</h3>
                            <p className="text-gray-500 mt-2">{t('studentCardDescription')}</p>
                        </Link>
                    </motion.div>

                    {/* Teacher Card */}
                    <motion.div
                        className="bg-white shadow-lg rounded-lg p-6 w-64 text-center hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/about-teacher">
                            <div className="mb-4 text-blue-600">
                                <FaChalkboardTeacher size={50} />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-700">{t('teacherCardTitle')}</h3>
                            <p className="text-gray-500 mt-2">{t('teacherCardDescription')}</p>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
