import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Footer from "../components/navbar/Footer.jsx";
import { FaGraduationCap, FaUsers, FaChalkboardTeacher, FaCode } from 'react-icons/fa';

const AboutUs = () => {
    const { t } = useTranslation('common');

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-white sm:text-5xl md:text-6xl"
                        >
                            {t('aboutUs.title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 max-w-2xl mx-auto text-xl text-blue-100"
                        >
                            {t('aboutUs.subtitle')}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t('aboutUs.mission.title')}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            {t('aboutUs.mission.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative p-6 bg-white rounded-xl shadow-lg"
                        >
                            <div className="text-blue-600 mb-4">
                                <FaGraduationCap size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('aboutUs.values.education.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('aboutUs.values.education.description')}
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative p-6 bg-white rounded-xl shadow-lg"
                        >
                            <div className="text-blue-600 mb-4">
                                <FaUsers size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('aboutUs.values.community.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('aboutUs.values.community.description')}
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative p-6 bg-white rounded-xl shadow-lg"
                        >
                            <div className="text-blue-600 mb-4">
                                <FaChalkboardTeacher size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('aboutUs.values.innovation.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('aboutUs.values.innovation.description')}
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative p-6 bg-white rounded-xl shadow-lg"
                        >
                            <div className="text-blue-600 mb-4">
                                <FaCode size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {t('aboutUs.values.technology.title')}
                            </h3>
                            <p className="text-gray-600">
                                {t('aboutUs.values.technology.description')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t('aboutUs.team.title')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {/* Stefan */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6">
                                    <span className="text-4xl text-white font-bold">SV</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                                    Stefan Vasilev
                                </h3>
                                <p className="text-blue-600 text-center mb-4">Lead Developer</p>
                                <p className="text-gray-600 text-center">
                                    {t('aboutUs.team.stefan')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Andrej */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6">
                                    <span className="text-4xl text-white font-bold">AG</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                                    Andrej Gencovski
                                </h3>
                                <p className="text-blue-600 text-center mb-4">Frontend Architect</p>
                                <p className="text-gray-600 text-center">
                                    {t('aboutUs.team.andrej')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Aleksandar */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6">
                                    <span className="text-4xl text-white font-bold">AS</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                                    Aleksandar Sandev
                                </h3>
                                <p className="text-blue-600 text-center mb-4">Backend Specialist</p>
                                <p className="text-gray-600 text-center">
                                    {t('aboutUs.team.aleksandar')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;