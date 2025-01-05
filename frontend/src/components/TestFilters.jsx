import React from 'react';
import { predefinedKeyValues } from '../config/predefinedKeyValues.js';
import { useTranslation } from 'react-i18next';
import {getTranslatedMetadata} from "../config/translatedMetadata.js";

const TestFilters = ({ filters, onFilterChange }) => {
    const { t, i18n } = useTranslation("common");
    const keyMapping = {
        'subject': 'Subject',
        'difficulty': 'Difficulty',
        'partOfYear': 'Part of Year',
        'testType': 'Test Type'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('filters.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('metadata.Subject')}
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        value={filters['Subject'] || ''}  // Changed from filters.subject
                        onChange={(e) => onFilterChange('Subject', e.target.value)}
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
                        {t('metadata.Difficulty')}
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        value={filters['Difficulty'] || ''}  // Changed from filters.difficulty
                        onChange={(e) => onFilterChange('Difficulty', e.target.value)}
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
                        value={filters['Part of Year'] || ''}  // Changed from filters.partOfYear
                        onChange={(e) => onFilterChange('Part of Year', e.target.value)}
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
                        value={filters['Test Type'] || ''}  // Changed from filters.testType
                        onChange={(e) => onFilterChange('Test Type', e.target.value)}
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
    );
};

export default TestFilters;