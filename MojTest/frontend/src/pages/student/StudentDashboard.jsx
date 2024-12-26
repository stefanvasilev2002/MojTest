import React, { useState, useMemo, useEffect } from 'react';
import useTest from '../../hooks/crud/useTest.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import TestFilters from '../../components/TestFilters.jsx';
import TestAttempts from "../../components/student/TestAttempts.jsx";
const StudentDashboard = () => {
    const [selectedTestId, setSelectedTestId] = useState(null);
    const { items: tests, loading, error } = useTest();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        subject: '',
        difficulty: '',
        partOfYear: '',
        topic: '',
        testType: '',
        duration: ''
    });

    useEffect(() => {
        const checkActiveTest = () => {
            const lastTestId = localStorage.getItem('last_test_id');
            if (!lastTestId) return;

            const testStartTime = localStorage.getItem(`test_${lastTestId}_start_time`);
            const timeLimit = localStorage.getItem(`test_${lastTestId}_time`); // Fixed variable name here

            if (testStartTime && timeLimit) {
                const startTime = parseInt(testStartTime);
                const limit = parseInt(timeLimit);
                const currentTime = Date.now();
                const timePassed = (currentTime - startTime) / (1000 * 60); // Convert to minutes

                if (timePassed < limit) {
                    // In this case, we want to just redirect them back to their test
                    // without showing a confirmation dialog since they're in the middle of a test
                    navigate(`/take-test/${lastTestId}`);
                } else {
                    // Test has expired, clean up storage
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
            // Check if there's an active test
            const lastTestId = localStorage.getItem('last_test_id');
            if (lastTestId) {
                const testStartTime = localStorage.getItem(`test_${lastTestId}_start_time`);
                const testTimeLimit = localStorage.getItem(`test_${lastTestId}_time`);

                if (testStartTime && testTimeLimit) {
                    const startTime = parseInt(testStartTime);
                    const timeLimit = parseInt(testTimeLimit);
                    const currentTime = Date.now();
                    const timePassed = (currentTime - startTime) / (1000 * 60); // Convert to minutes

                    if (timePassed < timeLimit) {
                        // There's an active test
                        const continueTest = window.confirm(
                            'You have an ongoing test. Would you like to continue that test? ' +
                            'Clicking Cancel will abandon the previous test and start a new one.'
                        );

                        if (continueTest) {
                            navigate(`/take-test/${lastTestId}`);
                            return;
                        } else {
                            // Clear previous test data if user wants to start a new one
                            clearTestStorage(lastTestId);
                        }
                    } else {
                        // Test has expired, clean up storage
                        clearTestStorage(lastTestId);
                    }
                }
            }

            // Start new test
            const response = await fetch(`http://localhost:8080/api/tests/start/${testId}?studentId=${user.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to start test');
            }

            const data = await response.json();

            if(data.questions.length === 0) {
                alert('This test has no questions. Please try another test.');
                return;
            }

            // Store the new test ID
            localStorage.setItem('last_test_id', data.studentTestId);
            console.log("data", data);
            navigate(`/take-test/${data.studentTestId}`, { state: data });

        } catch (err) {
            console.error('Error starting test:', err);
            alert('Failed to start test: ' + (err.message || 'Please try again'));
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filteredTests = useMemo(() => {
        return tests.filter(test => {
            // First, filter by student's grade (always applied)
            const isCorrectGrade = test.metadata?.some(meta =>
                meta.key === 'Grade' && meta.value === user.grade
            );
            console.log(test.metadata);
            console.log(isCorrectGrade);

            if (!isCorrectGrade) return false;

            // Then apply other filters
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true; // Skip empty filters

                return test.metadata?.some(meta =>
                    meta.key.toLowerCase() === key.toLowerCase() &&
                    meta.value === value
                );
            });
        });
    }, [tests, filters, user.grade]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading tests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading tests: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-blue-600">Available Tests</h1>
                    <div className="text-gray-600">
                        Grade: <span className="font-semibold">{user.grade}</span>
                    </div>
                </div>

                <TestFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <div className="m-3"></div>

                {filteredTests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6">
                        <p>No tests available matching your criteria.</p>
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

                                    {/* Metadata Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {test.metadata?.map(meta => (
                                            <span
                                                key={`${meta.key}-${meta.value}`}
                                                className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded"
                                            >
                                            {meta.key}: {meta.value}
                                        </span>
                                        ))}
                                    </div>

                                    <div className="text-gray-500">
                                        <span>{test.numQuestions} questions</span>
                                    </div>

                                    <div className="flex justify-between gap-2">
                                        <button
                                            onClick={() => handleStartTest(test.id)}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Start Test
                                        </button>
                                        <button
                                            onClick={() => setSelectedTestId(test.id)}
                                            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            View Attempts
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Test Attempts Modal */}
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