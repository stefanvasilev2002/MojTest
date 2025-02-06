import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { predefinedKeyValues } from '../config/predefinedKeyValues.js';
import { getTranslatedMetadata } from "../config/translatedMetadata.js";

const MetadataFilter = ({ filterOptions, setFilterOptions }) => {
    const { t, i18n } = useTranslation("common");
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key, value) => {
        const newValue = value ? [{ value, label: getTranslatedMetadata(key, value, i18n.language) }] : [];
        setFilterOptions(prevState => ({
            ...prevState,
            [key]: newValue
        }));
    };

    return (
        <div>
            <button
                onClick={() => setShowFilters(prev => !prev)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 mb-4"
            >
                {showFilters
                    ? t('metadataFilter.buttons.hideFilters')
                    : t('metadataFilter.buttons.showFilters')}
            </button>

            {showFilters && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('filters.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('metadata.Subject')}
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                value={filterOptions['Subject']?.[0]?.value || ''}
                                onChange={(e) => handleFilterChange('Subject', e.target.value)}
                            >
                                <option value="">{t('filters.allSubjects')}</option>
                                {predefinedKeyValues.Subject?.map(subject => (
                                    <option key={subject} value={subject}>
                                        {getTranslatedMetadata('Subject', subject, i18n.language)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('metadata.Grade')}
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                value={filterOptions['Grade']?.[0]?.value || ''}
                                onChange={(e) => handleFilterChange('Grade', e.target.value)}
                            >
                                <option value="">{t('filters.allGrades')}</option>
                                {predefinedKeyValues.Grade?.map(grade => (
                                    <option key={grade} value={grade}>
                                        {getTranslatedMetadata('Grade', grade, i18n.language)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('metadata.Difficulty')}
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                value={filterOptions['Difficulty']?.[0]?.value || ''}
                                onChange={(e) => handleFilterChange('Difficulty', e.target.value)}
                            >
                                <option value="">{t('filters.allDifficulties')}</option>
                                {predefinedKeyValues.Difficulty?.map(level => (
                                    <option key={level} value={level}>
                                        {getTranslatedMetadata('Difficulty', level, i18n.language)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('metadata.Part of Year')}
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                value={filterOptions['Part of Year']?.[0]?.value || ''}
                                onChange={(e) => handleFilterChange('Part of Year', e.target.value)}
                            >
                                <option value="">{t('filters.allPeriods')}</option>
                                {predefinedKeyValues['Part of Year']?.map(period => (
                                    <option key={period} value={period}>
                                        {getTranslatedMetadata('Part of Year', period, i18n.language)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('metadata.Test Type')}
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                                value={filterOptions['Test Type']?.[0]?.value || ''}
                                onChange={(e) => handleFilterChange('Test Type', e.target.value)}
                            >
                                <option value="">{t('filters.allTypes')}</option>
                                {predefinedKeyValues['Test Type']?.map(type => (
                                    <option key={type} value={type}>
                                        {getTranslatedMetadata('Test Type', type, i18n.language)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetadataFilter;