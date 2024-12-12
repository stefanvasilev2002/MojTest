import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTest from '../hooks/crud/useTest';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
    const { items: tests, loading: testsLoading, error: testsError, deleteItem: deleteTest } = useTest();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateTest = () => {
        navigate('/teacher-dashboard/create-test');
    };

    const handleEditTest = (testId) => {
        navigate(`/teacher-dashboard/edit-test/${testId}`);
    };

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test?')) {
            try {
                await deleteTest(testId);
            } catch (error) {
                console.error('Error deleting test:', error);
                alert('Failed to delete test');
            }
        }
    };

    const handleQuestionsClick = (testId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions`);
    };

    if (testsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (testsError) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {testsError}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">My Tests</h1>
                    <button
                        onClick={handleCreateTest}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Create New Test
                    </button>
                </div>

                <div className="grid gap-6">
                    {tests.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600">No tests available. Create your first test!</p>
                        </div>
                    ) : (
                        tests.map(test => (
                            <div
                                key={test.id}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
                                        <p className="text-gray-600 mb-4">{test.description}</p>
                                        <div className="text-sm text-gray-500">
                                            <span>{test.numQuestions} questions</span>
                                            {test.timeLimit && (
                                                <span className="ml-4">Time limit: {test.timeLimit} minutes</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleQuestionsClick(test.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Questions
                                        </button>
                                        <button
                                            onClick={() => handleEditTest(test.id)}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTest(test.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;