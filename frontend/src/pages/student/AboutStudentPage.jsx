import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaBook, FaChartLine, FaClock } from 'react-icons/fa';

// Reusable Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-6 rounded-lg shadow-lg"
    >
        <div className="flex items-center mb-4">
            <Icon className="text-blue-600 text-3xl mr-4" />
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

// Stats Component
const StatCard = ({ number, label }) => (
    <div className="bg-blue-600 p-6 rounded-lg text-white text-center">
        <div className="text-4xl font-bold mb-2">{number}</div>
        <div className="text-sm uppercase tracking-wide">{label}</div>
    </div>
);

const AboutStudentPage = () => {
    const { t } = useTranslation('common');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-8"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-6">{t('studentPage.hero.title', 'Transform Your Learning Journey')}</h1>
                    <p className="text-xl">{t('studentPage.hero.subtitle', 'Personalized learning experience designed for your success')}</p>
                </div>
            </motion.div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-8 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">{t('studentPage.features.title', 'What You Get as a Student')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={FaBook}
                        title={t('studentPage.features.practice.title', 'Practice Tests')}
                        description={t('studentPage.features.practice.description', 'Access a wide range of practice tests to enhance your knowledge')}
                    />
                    <FeatureCard
                        icon={FaChartLine}
                        title={t('studentPage.features.progress.title', 'Track Progress')}
                        description={t('studentPage.features.progress.description', 'Monitor your performance and see your improvement over time')}
                    />
                    <FeatureCard
                        icon={FaClock}
                        title={t('studentPage.features.flexible.title', 'Flexible Learning')}
                        description={t('studentPage.features.flexible.description', 'Study at your own pace with 24/7 access to materials')}
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard number="1000+" label={t('studentPage.stats.tests', 'Available Tests')} />
                        <StatCard number="50k+" label={t('studentPage.stats.students', 'Active Students')} />
                        <StatCard number="95%" label={t('studentPage.stats.satisfaction', 'Satisfaction Rate')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutStudentPage;