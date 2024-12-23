import React, { useState, useMemo } from 'react';
import useTest from '../hooks/crud/useTest';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TestFilters from '../components/TestFilters';

const StudentDashboard = () => {
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

    const handleStartTest = async (testId) => {
        try {
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
            navigate(`/take-test/${data.studentTestId}`, { state: data });
        } catch (err) {
            console.error('Error starting test:', err);
            alert('Failed to start test: ' + (err.message || 'Please try again'));
        }
    };

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

                                    <button
                                        onClick={() => handleStartTest(test.id)}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Start Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;