import React from 'react';
import { predefinedKeyValues } from '../constants/metadata';

const TestFilters = ({ filters, onFilterChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Subject Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        value={filters.subject || ''}
                        onChange={(e) => onFilterChange('subject', e.target.value)}
                    >
                        <option value="">All Subjects</option>
                        {predefinedKeyValues.Subject?.map(subject => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        value={filters.difficulty || ''}
                        onChange={(e) => onFilterChange('difficulty', e.target.value)}
                    >
                        <option value="">All Difficulties</option>
                        {predefinedKeyValues.Difficulty?.map(level => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Part of Year Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Part of Year
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        value={filters.partOfYear || ''}
                        onChange={(e) => onFilterChange('partOfYear', e.target.value)}
                    >
                        <option value="">All Periods</option>
                        {predefinedKeyValues['Part of Year']?.map(period => (
                            <option key={period} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Test Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Type
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        value={filters.testType || ''}
                        onChange={(e) => onFilterChange('testType', e.target.value)}
                    >
                        <option value="">All Types</option>
                        {predefinedKeyValues['Test Type']?.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TestFilters;
