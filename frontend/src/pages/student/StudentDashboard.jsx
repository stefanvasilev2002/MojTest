import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useTest from '../../hooks/crud/useTest.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import TestFilters from '../../components/TestFilters.jsx';
import TestAttempts from "../../components/student/TestAttempts.jsx";
import { getTranslatedMetadata } from "../../config/translatedMetadata.js";
import { endpoints } from "../../config/api.config.jsx";
import NoQuestionsErrorModal from '../../components/student/NoQuestionsErrorModal.jsx';
const StudentDashboard = () => {
    const { t, i18n } = useTranslation("common");
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
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
    useEffect(() => {
        const checkActiveTest = async () => {
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

            const response = await fetch(endpoints.tests.start(testId, user.id), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                setErrorModal({
                    isOpen: true,
                    message: t('studentDashboard.activeTest.errors.noQuestions')
                });
                return;

            }

            const data = await response.json();
            if (!data.questions || data.questions.length === 0) {
                setErrorModal({
                    isOpen: true,
                    message: t('studentDashboard.activeTest.errors.noQuestions')
                });
                return;
            }

            // Store test data
            localStorage.setItem('last_test_id', data.studentTestId);
            localStorage.setItem(`test_${data.studentTestId}_start_time`, Date.now().toString());
            localStorage.setItem(`test_${data.studentTestId}_time`, data.timeLimit.toString());
            localStorage.setItem(`test_${data.studentTestId}_data`, JSON.stringify(data));

            navigate(`/take-test/${data.studentTestId}`);

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
        if (!tests || !user?.grade) return [];

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
    }, [tests, filters, user?.grade]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg text-red-600">{t('studentDashboard.unauthorized')}</p>
            </div>
        );
    }

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
                    <h1 className="text-4xl font-bold text-blue-600">
                        {t('studentDashboard.title')}
                    </h1>
                    <div className="text-gray-600">
                        {t('studentDashboard.grade')}
                        <span> </span>
                        <span className="font-semibold">
                            {getTranslatedMetadata('Grade', user.grade, i18n.language)}
                        </span>
                    </div>
                </div>

                <TestFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <div className="mt-6">
                    {filteredTests.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <p>{t('studentDashboard.noTests')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTests.map(test => (
                                <div
                                    key={test.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{test.title}</h2>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>

                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="flex items-center text-gray-500">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">
                                                    {test.numQuestions} {t('studentDashboard.testCard.questions')}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">
                                                    {test.timeLimit} {t('studentDashboard.testCard.minutes')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {test.metadata?.map(meta => (
                                                <span
                                                    key={`${meta.key}-${meta.value}`}
                                                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                                >
                                                    {t(`metadata.${meta.key}`)}: {
                                                    getTranslatedMetadata(meta.key, meta.value, i18n.language)
                                                }
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <button
                                                onClick={() => handleStartTest(test.id)}
                                                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                            >
                                                {t('studentDashboard.testCard.buttons.startTest')}
                                            </button>
                                            <button
                                                onClick={() => setSelectedTestId(test.id)}
                                                className="bg-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
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
                    <NoQuestionsErrorModal
                        isOpen={errorModal.isOpen}
                        message={errorModal.message}
                        onClose={() => setErrorModal({ isOpen: false, message: '' })}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;