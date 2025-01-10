import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaClipboardCheck, FaChartLine, FaUserFriends, FaLaptop, FaBrain } from 'react-icons/fa';

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

const AboutTeacherPage = () => {
    const { t } = useTranslation('common');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-8"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-6">{t('teacherPage.hero.title', 'Empower Your Teaching')}</h1>
                    <p className="text-xl">{t('teacherPage.hero.subtitle', 'Comprehensive tools to enhance your teaching experience')}</p>
                </div>
            </motion.div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-8 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">{t('teacherPage.features.title', 'Teacher Tools & Features')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={FaClipboardCheck}
                        title={t('teacherPage.features.create.title', 'Test Creation')}
                        description={t('teacherPage.features.create.description', 'Create and customize tests with our intuitive interface')}
                    />
                    <FeatureCard
                        icon={FaChartLine}
                        title={t('teacherPage.features.analytics.title', 'Advanced Analytics')}
                        description={t('teacherPage.features.analytics.description', 'Get detailed insights into student performance')}
                    />
                    <FeatureCard
                        icon={FaUserFriends}
                        title={t('teacherPage.features.collaboration.title', 'Collaboration')}
                        description={t('teacherPage.features.collaboration.description', 'Share resources and collaborate with other educators')}
                    />
                </div>
            </div>

            {/* Workflow Section */}
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">{t('teacherPage.workflow.title', 'Your Teaching Workflow')}</h2>
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center p-6 bg-gray-50 rounded-lg"
                        >
                            <FaLaptop className="text-4xl text-blue-600 mr-6" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{t('teacherPage.workflow.step1.title', 'Create Tests')}</h3>
                                <p className="text-gray-600">{t('teacherPage.workflow.step1.description', 'Design comprehensive assessments using our test creation tools')}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center p-6 bg-gray-50 rounded-lg"
                        >
                            <FaBrain className="text-4xl text-blue-600 mr-6" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{t('teacherPage.workflow.step2.title', 'Monitor Progress')}</h3>
                                <p className="text-gray-600">{t('teacherPage.workflow.step2.description', 'Track student performance and identify areas for improvement')}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutTeacherPage;