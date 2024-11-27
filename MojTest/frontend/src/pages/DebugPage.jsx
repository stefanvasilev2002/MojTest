// src/pages/DebugPage.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/navbar/LanguageSwitcher.jsx";

const DebugPage = () => {
    const { t, i18n } = useTranslation('common');

    return (
        <div>
            <h2>{t('debugPageTitle')}</h2>
            <p>{t('debugPageMessage')}</p>

            {/* Include the LanguageSwitcher component */}
            <LanguageSwitcher />

            <div>
                <h3>Current Language: {i18n.language}</h3>
                <p>{t('currentLanguageDescription')}</p>
            </div>
        </div>
    );
};

export default DebugPage;
