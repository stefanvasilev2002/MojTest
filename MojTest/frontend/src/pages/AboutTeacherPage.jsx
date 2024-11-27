import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import PublicNavBarTeacher from "../components/navbar/PublicNavBarTeacher.jsx";

const AboutTeacherPage = () => {
    const { t } = useTranslation('common');  // Use 'common' namespace for translations

    return (
        <div>
            <div className="min-h-screen bg-gray-50 p-8">


                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1}}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-blue-600">{t('teacherPageTitle')}</h2>
                    <p className="mt-4 text-lg text-gray-600">{t('teacherPageDescription')}</p>
                </motion.div>

                {/* Further content for teachers */}
                <div className="mt-8 text-center">
                    <p className="text-lg text-gray-600">{t('teacherPageContent')}</p>
                </div>
            </div>
        </div>


    );
};

export default AboutTeacherPage;
