import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const TestAttempts = ({ testId, onClose }) => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchAttempts = async (pageNum) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/api/student-tests/attempts/${testId}?studentId=${user.id}&page=${pageNum}&size=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch attempts');
            }

            const data = await response.json();
            setAttempts(data.content);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttempts(page);
    }, [testId, user.id, page]);

    const formatDateTime = (date, time) => {
        const dateObj = new Date(date + 'T' + time);
        return dateObj.toLocaleString();
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading && page === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <p className="text-center">Loading attempts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Test Attempts</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {attempts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No attempts found for this test.</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {attempts.map((attempt) => (
                                <div
                                    key={attempt.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Score:</span>
                                                <span className={`font-bold ${getScoreColor(attempt.scorePercentage)}`}>
                                                    {attempt.score}/{attempt.totalPoints} ({attempt.scorePercentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Taken on: {formatDateTime(attempt.dateTaken, attempt.timeTaken)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/test-results', { state: { studentTestId: attempt.id }})}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className={`px-3 py-1 rounded ${
                                    page === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                            >
                                Previous
                            </button>
                            <span className="text-gray-600">
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className={`px-3 py-1 rounded ${
                                    page >= totalPages - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TestAttempts;