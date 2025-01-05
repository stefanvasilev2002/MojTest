import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useTest from '../../hooks/crud/useTest.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import TestFilters from '../../components/TestFilters.jsx';
import TestAttempts from "../../components/student/TestAttempts.jsx";
import {getTranslatedMetadata} from "../../config/translatedMetadata.js";
import {endpoints} from "../../config/api.config.jsx";

const StudentDashboard = () => {
    const { t , i18n} = useTranslation("common");
    const [selectedTestId, setSelectedTestId] = useState(null);
    const { items: tests, loading, error } = useTest();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        'Subject': '',
        'Difficulty': '',
        'Part of Year': '',
        'Test Type': ''
    });

    useEffect(() => {
        const checkActiveTest = () => {
            const lastTestId = localStorage.getItem('last_test_id');
            if (!lastTestId) return;

            const testStartTime = localStorage.getItem(`test_${lastTestId}_start_time`);
            const timeLimit = localStorage.getItem(`test_${lastTestId}_time`);

            if (testStartTime && timeLimit) {
                const startTime = parseInt(testStartTime);
                const limit = parseInt(timeLimit);
                const currentTime = Date.now();
                const timePassed = (currentTime - startTime) / (1000 * 60);

                if (timePassed < limit) {
                    navigate(`/take-test/${lastTestId}`);
                } else {
                    clearTestStorage(lastTestId);
                }
            }
        };

        checkActiveTest();
    }, [navigate]);

    const clearTestStorage = (testId) => {
        localStorage.removeItem(`test_${testId}_start_time`);
        localStorage.removeItem(`test_${testId}_time`);
        localStorage.removeItem(`test_${testId}_lastUpdate`);
        localStorage.removeItem(`test_${testId}_answers`);
        localStorage.removeItem(`test_${testId}_hints`);
        localStorage.removeItem(`test_${testId}_data`);
        localStorage.removeItem('last_test_id');
    };

    const handleStartTest = async (testId) => {
        try {
            const lastTestId = localStorage.getItem('last_test_id');
            if (lastTestId) {
                const testStartTime = localStorage.getItem(`test_${lastTestId}_start_time`);
                const testTimeLimit = localStorage.getItem(`test_${lastTestId}_time`);

                if (testStartTime && testTimeLimit) {
                    const startTime = parseInt(testStartTime);
                    const timeLimit = parseInt(testTimeLimit);
                    const currentTime = Date.now();
                    const timePassed = (currentTime - startTime) / (1000 * 60);

                    if (timePassed < timeLimit) {
                        const continueTest = window.confirm(
                            t('studentDashboard.activeTest.continuePrompt')
                        );

                        if (continueTest) {
                            navigate(`/take-test/${lastTestId}`);
                            return;
                        } else {
                            clearTestStorage(lastTestId);
                        }
                    } else {
                        clearTestStorage(lastTestId);
                    }
                }
            }

            const response = fetch(endpoints.tests.start(testId, user.id), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(t('studentDashboard.activeTest.errors.startFailed'));
            }

            const data = await response.json();

            if(data.questions.length === 0) {
                alert(t('studentDashboard.activeTest.errors.noQuestions'));
                return;
            }

            localStorage.setItem('last_test_id', data.studentTestId);
            navigate(`/take-test/${data.studentTestId}`, { state: data });

        } catch (err) {
            console.error('Error starting test:', err);
            alert(t('studentDashboard.activeTest.errors.genericError'));
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const filteredTests = useMemo(() => {
        return tests.filter(test => {
            const isCorrectGrade = test.metadata?.some(meta =>
                meta.key === 'Grade' && meta.value === user.grade
            );

            if (!isCorrectGrade) return false;

            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;

                return test.metadata?.some(meta => {
                    return meta.key === key && meta.value === value;
                });
            });
        });
    }, [tests, filters, user.grade]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">{t('studentDashboard.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {t('studentDashboard.error')} {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-blue-600">{t('studentDashboard.title')}</h1>
                    <div className="text-gray-600">
                        {t('studentDashboard.grade')} <span className="font-semibold">{getTranslatedMetadata('Grade', user.grade, i18n.language)}</span>
                    </div>
                </div>

                <TestFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <div className="m-3"></div>

                {filteredTests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6">
                        <p>{t('studentDashboard.noTests')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTests.map(test => (
                            <div
                                key={test.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                            >
                                <h2 className="text-xl font-semibold mb-4">{test.title}</h2>
                                <div className="space-y-4">
                                    <p className="text-gray-600">{test.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {test.metadata?.map(meta => (
                                            <span
                                                key={`${meta.key}-${meta.value}`}
                                                className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                                                {t(`metadata.${meta.key}`)}: {getTranslatedMetadata(meta.key, meta.value, i18n.language)}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="text-gray-500">
                                        <span>{test.numQuestions} {t('studentDashboard.testCard.questions')}</span>
                                    </div>

                                    <div className="flex justify-between gap-2">
                                        <button
                                            onClick={() => handleStartTest(test.id)}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            {t('studentDashboard.testCard.buttons.startTest')}
                                        </button>
                                        <button
                                            onClick={() => setSelectedTestId(test.id)}
                                            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            {t('studentDashboard.testCard.buttons.viewAttempts')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedTestId && (
                    <TestAttempts
                        testId={selectedTestId}
                        onClose={() => setSelectedTestId(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;